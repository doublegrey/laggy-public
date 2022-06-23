package models

type StatsCache struct {
	Mining map[string]MiningStats        `json:"mining"`
	Prices map[string]map[string]float64 `json:"prices"`
}

type MiningStats struct {
	BlockReward float64 `json:"blockReward"`
	Hashrate    int64   `json:"hashrate"`
	BlockTime   float64 `json:"blockTime"`
	GasPrice    float64 `json:"gasPrice"`
}
