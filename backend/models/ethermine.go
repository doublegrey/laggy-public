package models

import "time"

// https://api.ethermine.org/poolStats
type EtherminePoolStats struct {
	Status string `json:"status"`
	Data   struct {
		PoolStats struct {
			HashRate      int64   `json:"hashRate"`
			Miners        int     `json:"miners"`
			Workers       int     `json:"workers"`
			BlocksPerHour float64 `json:"blocksPerHour"`
		} `json:"poolStats"`
		Price struct {
			Time time.Time `json:"time"`
			Usd  float64   `json:"usd"`
			Btc  float64   `json:"btc"`
			Eur  float64   `json:"eur"`
			Cny  float64   `json:"cny"`
			Rub  float64   `json:"rub"`
		} `json:"price"`
		Estimates struct {
			Time        time.Time `json:"time"`
			BlockReward float64   `json:"blockReward"`
			Hashrate    int64     `json:"hashrate"`
			BlockTime   float64   `json:"blockTime"`
			GasPrice    float64   `json:"gasPrice"`
		} `json:"estimates"`
	} `json:"data"`
}

type EthermineDashboard struct {
	Status string `json:"status"`
	Data   struct {
		Workers []struct {
			Worker           string `json:"worker"`
			Time             int    `json:"time"`
			LastSeen         int    `json:"lastSeen"`
			ReportedHashrate int    `json:"reportedHashrate"`
			CurrentHashrate  int    `json:"currentHashrate"`
			ValidShares      int    `json:"validShares"`
			InvalidShares    int    `json:"invalidShares"`
			StaleShares      int    `json:"staleShares"`
		} `json:"workers"`
		CurrentStatistics struct {
			Time             int   `json:"time"`
			LastSeen         int   `json:"lastSeen"`
			ReportedHashrate int   `json:"reportedHashrate"`
			CurrentHashrate  int   `json:"currentHashrate"`
			ValidShares      int   `json:"validShares"`
			InvalidShares    int   `json:"invalidShares"`
			StaleShares      int   `json:"staleShares"`
			ActiveWorkers    int   `json:"activeWorkers"`
			Unpaid           int64 `json:"unpaid"`
		} `json:"currentStatistics"`
		Settings struct {
			Email     string `json:"email"`
			Monitor   int    `json:"monitor"`
			MinPayout int64  `json:"minPayout"`
			Suspended int    `json:"suspended"`
		} `json:"settings"`
	} `json:"data"`
}
