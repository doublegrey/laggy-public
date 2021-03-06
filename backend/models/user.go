package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	ID          primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	FirstName   string             `bson:"firstName" json:"firstName"`
	Username    string             `bson:"username" json:"username"`
	Email       string             `bson:"email" json:"email"`
	ContactInfo string             `bson:"contactInfo" json:"contactInfo"`
	Currency    string             `bson:"currency" json:"currency"`
	Password    string             `bson:"password,omitempty" json:"password,omitempty"`
}
