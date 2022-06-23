package datastore

import (
	"context"
	"log"
	"time"

	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/go-redis/redis/v8"
	"github.com/patrickmn/go-cache"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"

	"github.com/doublegrey/laggy/mining/backend/models"
)

type Datastore struct {
	Mongo         *mongo.Database
	StatsCache    models.StatsCache
	BalancesCache *cache.Cache
	EthClient     *ethclient.Client
	Kafka         interface{}
	ElasticSearch interface{}
	Redis         *redis.Client
}

var Connections = &Datastore{}

func New() {
	clientOptions := options.Client().ApplyURI("mongodb://127.0.0.1:27017/?readPreference=primary&ssl=false&directConnection=true")
	client, err := mongo.NewClient(clientOptions)
	if err != nil {
		log.Fatalf("Failed to create mongo client: %v\n", err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	if err = client.Connect(ctx); err != nil {
		log.Fatalf("Failed to initialize mongo client: %v\n", err)
	}
	if err = client.Ping(context.Background(), readpref.Primary()); err != nil {
		log.Fatalf("Failed to ping mongo database: %v\n", err)
	}
	Connections.Mongo = client.Database("laggy_mining")

	rdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       1,
	})
	Connections.Redis = rdb

	ec, err := ethclient.Dial("https://mainnet.infura.io/v3/3b3f58712e2b44fd86336c4d28867ed2")
	if err != nil {
		log.Fatalf("Failed to initialize infura client: %v\n", err)
	}
	Connections.EthClient = ec
	Connections.BalancesCache = cache.New(10*time.Minute, time.Hour)
}
