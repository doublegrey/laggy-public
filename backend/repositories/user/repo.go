package user

import (
	"context"

	"github.com/doublegrey/laggy/mining/backend/datastore"
	"github.com/doublegrey/laggy/mining/backend/models"
	"github.com/doublegrey/laggy/mining/backend/repositories"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func NewRepo(datastore *datastore.Datastore) repositories.UserRepo {
	return &repo{
		Datastore: datastore,
	}
}

type repo struct {
	Datastore *datastore.Datastore
}

func (r *repo) Fetch(ctx context.Context, filter interface{}) ([]models.User, error) {
	users := make([]models.User, 0)
	cursor, err := r.Datastore.Mongo.Collection("users").Find(ctx, filter)
	if err != nil {
		return users, err
	}
	err = cursor.All(ctx, &users)
	return users, err
}

func (r *repo) FetchByID(ctx context.Context, id primitive.ObjectID) (models.User, error) {
	var user models.User
	result := r.Datastore.Mongo.Collection("users").FindOne(ctx, bson.M{"_id": id})
	err := result.Decode(&user)
	return user, err
}

func (r *repo) Create(ctx context.Context, user models.User) (models.User, error) {
	result, err := r.Datastore.Mongo.Collection("users").InsertOne(ctx, user)
	if err == nil {
		user.ID = result.InsertedID.(primitive.ObjectID)
	}
	return user, err
}

func (r *repo) Update(ctx context.Context, user models.User, updatePassword bool) error {
	if !updatePassword {
		user.Password = ""
	}
	_, err := r.Datastore.Mongo.Collection("users").UpdateByID(ctx, user.ID, bson.D{
		{Key: "$set", Value: user},
	})
	return err
}

func (r *repo) Delete(ctx context.Context, id primitive.ObjectID) error {
	_, err := r.Datastore.Mongo.Collection("users").DeleteOne(ctx, bson.M{"_id": id})
	return err
}
