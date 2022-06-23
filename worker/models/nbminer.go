package models

type NBMinerStats struct {
	Miner struct {
		Devices []struct {
			AcceptedShares  int     `json:"accepted_shares"`
			CoreClock       int     `json:"core_clock"`
			CoreUtilization int     `json:"core_utilization"`
			Fan             int     `json:"fan"`
			Hashrate        string  `json:"hashrate"`
			Hashrate2       string  `json:"hashrate2"`
			Hashrate2Raw    int     `json:"hashrate2_raw"`
			HashrateRaw     float64 `json:"hashrate_raw"`
			ID              int     `json:"id"`
			Info            string  `json:"info"`
			InvalidShares   int     `json:"invalid_shares"`
			Lhr             int     `json:"lhr"`
			MemTemperature  int     `json:"memTemperature"`
			MemClock        int     `json:"mem_clock"`
			MemUtilization  int     `json:"mem_utilization"`
			PciBusID        int     `json:"pci_bus_id"`
			Power           int     `json:"power"`
			RejectedShares  int     `json:"rejected_shares"`
			Temperature     int     `json:"temperature"`
		} `json:"devices"`
		TotalHashrate     string  `json:"total_hashrate"`
		TotalHashrate2    string  `json:"total_hashrate2"`
		TotalHashrate2Raw int     `json:"total_hashrate2_raw"`
		TotalHashrateRaw  float64 `json:"total_hashrate_raw"`
		TotalPowerConsume int     `json:"total_power_consume"`
	} `json:"miner"`
	RebootTimes int `json:"reboot_times"`
	StartTime   int `json:"start_time"`
	Stratum     struct {
		AcceptedShares  int    `json:"accepted_shares"`
		Algorithm       string `json:"algorithm"`
		Difficulty      string `json:"difficulty"`
		DualMine        bool   `json:"dual_mine"`
		InvalidShares   int    `json:"invalid_shares"`
		Latency         int    `json:"latency"`
		PoolHashrate10M string `json:"pool_hashrate_10m"`
		PoolHashrate24H string `json:"pool_hashrate_24h"`
		PoolHashrate4H  string `json:"pool_hashrate_4h"`
		RejectedShares  int    `json:"rejected_shares"`
		URL             string `json:"url"`
		UseSsl          bool   `json:"use_ssl"`
		User            string `json:"user"`
	} `json:"stratum"`
	Version string `json:"version"`
}
