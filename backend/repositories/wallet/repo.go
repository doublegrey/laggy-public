package wallet

import (
	"context"

	"github.com/doublegrey/laggy/mining/backend/datastore"
	"github.com/doublegrey/laggy/mining/backend/models"
	"github.com/doublegrey/laggy/mining/backend/repositories"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func NewRepo(datastore *datastore.Datastore) repositories.WalletRepo {
	return &repo{
		Datastore: datastore,
	}
}

type repo struct {
	Datastore *datastore.Datastore
}

func (r *repo) Fetch(ctx context.Context, filter interface{}) ([]models.Wallet, error) {
	wallets := make([]models.Wallet, 0)
	cursor, err := r.Datastore.Mongo.Collection("wallets").Find(ctx, filter)
	if err != nil {
		return wallets, err
	}
	err = cursor.All(ctx, &wallets)
	return wallets, err
}

func (r *repo) FetchByID(ctx context.Context, id primitive.ObjectID) (models.Wallet, error) {
	var wallet models.Wallet
	result := r.Datastore.Mongo.Collection("wallets").FindOne(ctx, bson.M{"_id": id})
	err := result.Decode(&wallet)
	return wallet, err
}

func (r *repo) Create(ctx context.Context, wallet models.Wallet) (models.Wallet, error) {
	result, err := r.Datastore.Mongo.Collection("wallets").InsertOne(ctx, wallet)
	if err == nil {
		wallet.ID = result.InsertedID.(primitive.ObjectID)
	}
	return wallet, err
}

func (r *repo) Update(ctx context.Context, wallet models.Wallet) error {
	_, err := r.Datastore.Mongo.Collection("wallets").ReplaceOne(ctx, bson.M{"_id": wallet.ID}, wallet)
	return err
}

func (r *repo) Delete(ctx context.Context, id primitive.ObjectID) error {
	_, err := r.Datastore.Mongo.Collection("wallets").DeleteOne(ctx, bson.M{"_id": id})
	return err
}
