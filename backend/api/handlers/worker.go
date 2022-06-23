package handlers

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/doublegrey/laggy/mining/backend/datastore"
	"github.com/doublegrey/laggy/mining/backend/models"
	pb "github.com/doublegrey/laggy/mining/backend/pb/worker"
)

func NewWorkerHandler(datastore *datastore.Datastore) *WorkerHandler {
	return &WorkerHandler{
		repo: datastore,
	}
}

type WorkerHandler struct {
	repo *datastore.Datastore
}

type GRPCServer struct {
	pb.UnimplementedWorkerServer
}

// gRPC handler
func (s *GRPCServer) Stats(ctx context.Context, req *pb.ReportStatsRequest) (*pb.ReportStatsResponse, error) {
	var response pb.ReportStatsResponse
	worker := models.RedisWorker{
		Hashrate:     int(req.Stats.Hashrate),
		RunningSince: req.Stats.RunningSince.AsTime(),
		CPU:          float64(req.Stats.Cpu),
		RAM:          float64(req.Stats.Ram),
		Storage:      float64(req.Stats.Storage),
		Power:        int(req.Stats.Power),
		GPUs:         []models.GPU{},
	}
	for _, gpu := range req.Stats.Gpus {
		worker.GPUs = append(worker.GPUs, models.GPU{
			PCI:            int(gpu.Pci),
			Name:           gpu.Name,
			Load:           float64(gpu.Load),
			Chip:           int(gpu.Chip),
			Mem:            int(gpu.Memory),
			Fan:            int(gpu.Fan),
			CoreClock:      int(gpu.CoreClock),
			MemClock:       int(gpu.MemClock),
			Power:          int(gpu.Power),
			Hashrate:       int(gpu.Hashrate),
			AcceptedShares: int(gpu.AcceptedShares),
			RejectedShares: int(gpu.RejectedShares),
		})
	}
	enc, err := json.Marshal(worker)
	if err != nil {
		return &response, err
	}
	datastore.Connections.Redis.Set(ctx, req.Worker, enc, time.Minute)
	return &response, nil
}

// REST handler
func (h *WorkerHandler) RestStats(c *gin.Context) {
	b, _ := ioutil.ReadAll(c.Request.Body)
	h.repo.Redis.Set(c.Request.Context(), c.Param("id"), b, time.Minute)
}

func (h *WorkerHandler) Fetch(c *gin.Context) {
	session := sessions.Default(c)
	userID, err := primitive.ObjectIDFromHex(session.Get("id").(string))
	if err != nil {
		c.Status(http.StatusForbidden)
		return
	}
	workers := make([]models.WorkerResponse, 0)
	var mongoWorkers []models.MongoWorker
	cursor, _ := h.repo.Mongo.Collection("workers").Find(c.Request.Context(), bson.M{"user": userID})
	if err = cursor.All(c.Request.Context(), &mongoWorkers); err != nil {
		c.JSON(http.StatusOK, workers)
		return
	}

	for _, mongoWorker := range mongoWorkers {
		var redisWorker models.RedisWorker
		redisWorker.GPUs = make([]models.GPU, 0)
		redisResult, err := h.repo.Redis.Get(c.Request.Context(), mongoWorker.ID.Hex()).Bytes()
		mongoWorker.Status = "offline"
		if err == nil {
			json.Unmarshal(redisResult, &redisWorker)
			if redisWorker.Hashrate > 0 {
				mongoWorker.Status = "running"
			}
		}

		workers = append(workers, models.WorkerResponse{MongoWorker: mongoWorker, RedisWorker: redisWorker})
	}
	c.JSON(http.StatusOK, workers)
}

func (h *WorkerHandler) FetchByID(c *gin.Context) {
	session := sessions.Default(c)
	userID, err := primitive.ObjectIDFromHex(session.Get("id").(string))
	if err != nil {
		c.Status(http.StatusForbidden)
		return
	}
	workerID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	var mongoWorker models.MongoWorker
	mongoResult := h.repo.Mongo.Collection("workers").FindOne(c.Request.Context(), bson.M{"_id": workerID})
	err = mongoResult.Decode(&mongoWorker)
	if mongoWorker.User != userID || err != nil {
		c.Status(http.StatusForbidden)
		return
	}

	mongoWorker.Status = "offline"
	redisResult, err := h.repo.Redis.Get(c.Request.Context(), mongoWorker.ID.Hex()).Bytes()
	// TODO: handle redis.Nil
	if err != nil && err != redis.Nil {
		c.Status(http.StatusInternalServerError)
		return
	}
	var redisWorker models.RedisWorker
	json.Unmarshal(redisResult, &redisWorker)

	if redisWorker.Hashrate > 0 {
		mongoWorker.Status = "running"
	}

	c.JSON(http.StatusOK, models.WorkerResponse{MongoWorker: mongoWorker, RedisWorker: redisWorker})
}

func (h *WorkerHandler) Create(c *gin.Context) {
	var worker models.MongoWorker
	err := c.ShouldBindJSON(&worker)
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	session := sessions.Default(c)
	userID, err := primitive.ObjectIDFromHex(session.Get("id").(string))
	if err != nil {
		c.Status(http.StatusForbidden)
		return
	}
	worker.ID = primitive.NewObjectID()
	worker.Status = "unknown"
	worker.User = userID
	_, err = h.repo.Mongo.Collection("workers").InsertOne(c.Request.Context(), worker)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	} else {
		c.Status(http.StatusCreated)
	}
}

func (h *WorkerHandler) Update(c *gin.Context) {
	var worker models.MongoWorker
	err := c.ShouldBindJSON(&worker)
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	workerID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	session := sessions.Default(c)
	userID, err := primitive.ObjectIDFromHex(session.Get("id").(string))
	if err != nil {
		c.Status(http.StatusForbidden)
		return
	}
	var mongoWorker models.MongoWorker
	mongoResult := h.repo.Mongo.Collection("workers").FindOne(c.Request.Context(), bson.M{"_id": workerID})
	err = mongoResult.Decode(&mongoWorker)
	if mongoWorker.User != userID || err != nil {
		c.Status(http.StatusForbidden)
		return
	}
	worker.ID = workerID
	_, err = h.repo.Mongo.Collection("workers").UpdateByID(c.Request.Context(), workerID, bson.D{
		{Key: "$set", Value: worker},
	})
	if err != nil {
		c.Status(http.StatusInternalServerError)
	} else {
		c.Status(http.StatusCreated)
	}
}

func (h *WorkerHandler) Delete(c *gin.Context) {}
