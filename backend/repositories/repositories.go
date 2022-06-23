package repositories

import (
	"context"

	"github.com/doublegrey/laggy/mining/backend/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type WalletRepo interface {
	Fetch(ctx context.Context, filter interface{}) ([]models.Wallet, error)
	FetchByID(ctx context.Context, id primitive.ObjectID) (models.Wallet, error)
	Create(ctx context.Context, wallet models.Wallet) (models.Wallet, error)
	Update(ctx context.Context, wallet models.Wallet) error
	Delete(ctx context.Context, id primitive.ObjectID) error
}

type ProfileRepo interface {
	Fetch(ctx context.Context, filter interface{}) ([]models.Profile, error)
	FetchByID(ctx context.Context, id primitive.ObjectID) (models.Profile, error)
	Create(ctx context.Context, profile models.Profile) (models.Profile, error)
	Update(ctx context.Context, profile models.Profile) error
	Delete(ctx context.Context, id primitive.ObjectID) error
}

type UserRepo interface {
	Fetch(ctx context.Context, filter interface{}) ([]models.User, error)
	FetchByID(ctx context.Context, id primitive.ObjectID) (models.User, error)
	Create(ctx context.Context, user models.User) (models.User, error)
	Update(ctx context.Context, user models.User, updatePassword bool) error
	Delete(ctx context.Context, id primitive.ObjectID) error
}
