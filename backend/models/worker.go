package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MongoWorker struct {
	ID              primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	User            primitive.ObjectID `bson:"user" json:"user,omitempty"`
	Name            string             `bson:"name" json:"name"`
	Profile         primitive.ObjectID `bson:"profile" json:"profile"`
	TargetHashrate  int                `json:"targetHashrate"`
	AdditionalPower int                `json:"additionalPower"`
	Status          string             `bson:"status" json:"status"`
	Created         time.Time          `bson:"created" json:"created"`
}

type RedisWorker struct {
	Hashrate     int       `json:"hashrate"`
	RunningSince time.Time `json:"runningSince"`
	CPU          float64   `json:"cpu"`
	RAM          float64   `json:"ram"`
	Storage      float64   `json:"storage"`
	Power        int       `json:"power"`
	GPUs         []GPU     `json:"gpus"`
}

type WorkerResponse struct {
	MongoWorker
	RedisWorker
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
