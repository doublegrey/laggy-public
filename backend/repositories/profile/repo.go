package profile

import (
	"context"

	"github.com/doublegrey/laggy/mining/backend/datastore"
	"github.com/doublegrey/laggy/mining/backend/models"
	"github.com/doublegrey/laggy/mining/backend/repositories"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func NewRepo(datastore *datastore.Datastore) repositories.ProfileRepo {
	return &repo{
		Datastore: datastore,
	}
}

type repo struct {
	Datastore *datastore.Datastore
}

func (r *repo) Fetch(ctx context.Context, filter interface{}) ([]models.Profile, error) {
	profiles := make([]models.Profile, 0)
	cursor, err := r.Datastore.Mongo.Collection("profiles").Find(ctx, filter)
	if err != nil {
		return profiles, err
	}
	err = cursor.All(ctx, &profiles)
	return profiles, err
}

func (r *repo) FetchByID(ctx context.Context, id primitive.ObjectID) (models.Profile, error) {
	var profile models.Profile
	result := r.Datastore.Mongo.Collection("profiles").FindOne(ctx, bson.M{"_id": id})
	err := result.Decode(&profile)
	return profile, err
}

func (r *repo) Create(ctx context.Context, profile models.Profile) (models.Profile, error) {
	result, err := r.Datastore.Mongo.Collection("profiles").InsertOne(ctx, profile)
	if err == nil {
		profile.ID = result.InsertedID.(primitive.ObjectID)
	}
	return profile, err
}

func (r *repo) Update(ctx context.Context, profile models.Profile) error {
	_, err := r.Datastore.Mongo.Collection("profiles").ReplaceOne(ctx, bson.M{"_id": profile.ID}, profile)
	return err
}

func (r *repo) Delete(ctx context.Context, id primitive.ObjectID) error {
	_, err := r.Datastore.Mongo.Collection("profiles").DeleteOne(ctx, bson.M{"_id": id})
	return err
}
