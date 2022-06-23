package utils

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/big"
	"net/http"
	"reflect"
	"regexp"
	"strconv"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/patrickmn/go-cache"
	"github.com/shopspring/decimal"

	"github.com/doublegrey/laggy/mining/backend/datastore"
	"github.com/doublegrey/laggy/mining/backend/models"
)

func GetUnpaidBalance(address string) float64 {
	var response models.EthermineDashboard
	resp, err := http.Get(fmt.Sprintf("https://api.ethermine.org/miner/%s/dashboard", address))
	if err != nil {
		return 0.0
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return 0.0
	}
	err = json.Unmarshal(body, &response)
	if err != nil {
		return 0.0
	}
	return float64(response.Data.CurrentStatistics.Unpaid) * 1e-18
}

func GetBalance(address string) (float64, float64) {
	if value, exists := datastore.Connections.BalancesCache.Get(address); exists {
		cache := value.(models.CachedBalance)
		return cache.Balance, cache.UnpaidBalance
	} else {
		rawBalance, err := datastore.Connections.EthClient.PendingBalanceAt(context.TODO(), common.HexToAddress(address))
		if err != nil {
			return 0.0, 0.0
		}
		balance, _ := ToDecimal(rawBalance, 18).Float64()
		unpaidBalance := GetUnpaidBalance(address)
		datastore.Connections.BalancesCache.Set(address, models.CachedBalance{Balance: balance, UnpaidBalance: unpaidBalance}, cache.DefaultExpiration)
		return balance, unpaidBalance
	}
}

func CalculateProfit(symbol string, hashrate int64, duration string) float64 {
	cache := datastore.Connections.StatsCache
	dailyProfit := (float64(hashrate/cache.Mining[symbol].Hashrate) * cache.Mining[symbol].BlockReward) * (86400.0 / cache.Mining[symbol].BlockTime)
	switch duration {
	case "m":
		return dailyProfit * 30.4
	default:
		return dailyProfit
	}
}

// IsValidAddress validate hex address
func IsValidAddress(iaddress interface{}) bool {
	re := regexp.MustCompile("^0x[0-9a-fA-F]{40}$")
	switch v := iaddress.(type) {
	case string:
		return re.MatchString(v)
	case common.Address:
		return re.MatchString(v.Hex())
	default:
		return false
	}
}

// IsZeroAddress validate if it's a 0 address
func IsZeroAddress(iaddress interface{}) bool {
	var address common.Address
	switch v := iaddress.(type) {
	case string:
		address = common.HexToAddress(v)
	case common.Address:
		address = v
	default:
		return false
	}

	zeroAddressBytes := common.FromHex("0x0000000000000000000000000000000000000000")
	addressBytes := address.Bytes()
	return reflect.DeepEqual(addressBytes, zeroAddressBytes)
}

// ToDecimal wei to decimals
func ToDecimal(ivalue interface{}, decimals int) decimal.Decimal {
	value := new(big.Int)
	switch v := ivalue.(type) {
	case string:
		value.SetString(v, 10)
	case *big.Int:
		value = v
	}

	mul := decimal.NewFromFloat(float64(10)).Pow(decimal.NewFromFloat(float64(decimals)))
	num, _ := decimal.NewFromString(value.String())
	result := num.Div(mul)

	return result
}

// ToWei decimals to wei
func ToWei(iamount interface{}, decimals int) *big.Int {
	amount := decimal.NewFromFloat(0)
	switch v := iamount.(type) {
	case string:
		amount, _ = decimal.NewFromString(v)
	case float64:
		amount = decimal.NewFromFloat(v)
	case int64:
		amount = decimal.NewFromFloat(float64(v))
	case decimal.Decimal:
		amount = v
	case *decimal.Decimal:
		amount = *v
	}

	mul := decimal.NewFromFloat(float64(10)).Pow(decimal.NewFromFloat(float64(decimals)))
	result := amount.Mul(mul)

	wei := new(big.Int)
	wei.SetString(result.String(), 10)

	return wei
}

// CalcGasCost calculate gas cost given gas limit (units) and gas price (wei)
func CalcGasCost(gasLimit uint64, gasPrice *big.Int) *big.Int {
	gasLimitBig := big.NewInt(int64(gasLimit))
	return gasLimitBig.Mul(gasLimitBig, gasPrice)
}

// SigRSV signatures R S V returned as arrays
func SigRSV(isig interface{}) ([32]byte, [32]byte, uint8) {
	var sig []byte
	switch v := isig.(type) {
	case []byte:
		sig = v
	case string:
		sig, _ = hexutil.Decode(v)
	}

	sigstr := common.Bytes2Hex(sig)
	rS := sigstr[0:64]
	sS := sigstr[64:128]
	R := [32]byte{}
	S := [32]byte{}
	copy(R[:], common.FromHex(rS))
	copy(S[:], common.FromHex(sS))
	vStr := sigstr[128:130]
	vI, _ := strconv.Atoi(vStr)
	V := uint8(vI + 27)

	return R, S, V
}
