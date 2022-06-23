package handlers

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/doublegrey/laggy/mining/backend/datastore"
	"github.com/doublegrey/laggy/mining/backend/models"
	"github.com/gin-gonic/gin"
)

func NewStatsHandler(datastore *datastore.Datastore) *StatsHandler {
	return &StatsHandler{
		repo: datastore,
	}
}

type StatsHandler struct {
	repo *datastore.Datastore
}

func (h *StatsHandler) FetchStats(c *gin.Context) {
	c.JSON(http.StatusOK, h.repo.StatsCache)
}

func (h *StatsHandler) UpdatePoolStats(ctx context.Context) error {
	var ethermineStats models.EtherminePoolStats
	resp, err := http.Get("https://api.ethermine.org/poolStats")
	if err != nil {
		return err
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}
	err = json.Unmarshal(body, &ethermineStats)
	if err != nil {
		return err
	}

	var cache models.StatsCache

	cache.Mining = make(map[string]models.MiningStats)
	cache.Mining["ETH"] = models.MiningStats{
		BlockReward: ethermineStats.Data.Estimates.BlockReward,
		Hashrate:    ethermineStats.Data.Estimates.Hashrate,
		BlockTime:   ethermineStats.Data.Estimates.BlockTime,
		GasPrice:    ethermineStats.Data.Estimates.GasPrice,
	}
	cache.Prices = make(map[string]map[string]float64)
	cache.Prices["ETH"] = map[string]float64{
		"ETH": 1.0,
		"USD": ethermineStats.Data.Price.Usd,
		"BTC": ethermineStats.Data.Price.Btc,
		"EUR": ethermineStats.Data.Price.Eur,
		"CNY": ethermineStats.Data.Price.Cny,
		"RUB": float64(ethermineStats.Data.Price.Rub),
	}
	h.repo.StatsCache = cache
	return nil
}

func (h *StatsHandler) Health(c *gin.Context) {
	c.Status(http.StatusNotImplemented)
}

func (h *StatsHandler) Price(c *gin.Context) {
	c.Status(http.StatusNotImplemented)
}
func (h *StatsHandler) Pool(c *gin.Context) {
	c.Status(http.StatusNotImplemented)
}
