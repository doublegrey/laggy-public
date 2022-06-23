package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Wallet struct {
	ID            primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	User          primitive.ObjectID `bson:"user" json:"user,omitempty"`
	Name          string             `bson:"name" json:"name"`
	Asset         string             `bson:"asset" json:"asset"`
	Address       string             `bson:"address" json:"address"`
	Source        string             `bson:"source" json:"source"`
	Created       time.Time          `bson:"created" json:"created"`
	Balance       float64            `bson:"-" json:"balance"`
	UnpaidBalance float64            `bson:"-" json:"unpaidBalance"`
}

type CachedBalance struct {
	Balance       float64
	UnpaidBalance float64
}
