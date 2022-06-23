package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Profile struct {
	ID      primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	User    primitive.ObjectID `bson:"user" json:"user,omitempty"`
	Wallet  primitive.ObjectID `bson:"wallet" json:"wallet"`
	Name    string             `bson:"name" json:"name"`
	Pool    string             `bson:"pool" json:"pool"`
	Miner   string             `bson:"miner" json:"miner"`
	Created time.Time          `bson:"created" json:"created"`
}
