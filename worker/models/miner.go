package models

import "time"

type Worker struct {
	Hashrate     int       `json:"hashrate"`
	RunningSince time.Time `json:"runningSince"`
	CPU          float64   `json:"cpu"`
	RAM          float64   `json:"ram"`
	Storage      float64   `json:"storage"`
	Power        int       `json:"power"`
	GPUs         []GPU     `json:"gpus"`
}

type GPU struct {
	PCI            int     `json:"pci"`
	Name           string  `json:"name"`
	Load           float64 `json:"load"`
	Chip           int     `json:"chip"`
	Mem            int     `json:"mem"`
	Fan            int     `json:"fan"`
	CoreClock      int     `json:"coreClock"`
	MemClock       int     `json:"memClock"`
	Power          int     `json:"power"`
	Hashrate       int     `json:"hashrate"`
	AcceptedShares int     `json:"acceptedShares"`
	RejectedShares int     `json:"rejectedShares"`
}
