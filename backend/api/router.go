package api

import (
	"log"
	"net"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/redis"
	"github.com/gin-gonic/gin"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	"github.com/doublegrey/laggy/mining/backend/api/handlers"
	"github.com/doublegrey/laggy/mining/backend/datastore"
	"github.com/doublegrey/laggy/mining/backend/middlewares"
	pb "github.com/doublegrey/laggy/mining/backend/pb/worker"
)

func NewRouter(r *gin.Engine) {
	sessionsStore, err := redis.NewStore(10, "tcp", "localhost:6379", "", []byte("secret"))
	if err != nil {
		log.Fatalf("Failed to create sessions store: %v\n", err)
	}
	sessionsStore.Options(sessions.Options{})
	r.Use(sessions.Sessions("session", sessionsStore))

	authHandler := handlers.NewAuthHandler(datastore.Connections)
	walletHandler := handlers.NewWalletHandler(datastore.Connections)
	profileHandler := handlers.NewProfileHandler(datastore.Connections)
	workerHandler := handlers.NewWorkerHandler(datastore.Connections)
	userHandler := handlers.NewUserHandler(datastore.Connections)
	statsHandler := handlers.NewStatsHandler(datastore.Connections)
	notificationsHandler := handlers.NewNotificationsHandler(datastore.Connections)

	apiGroup := r.Group("api")
	statsGroup := apiGroup.Group("stats")
	walletsGroup := apiGroup.Group("wallets")
	profilesGroup := apiGroup.Group("profiles")
	workersGroup := apiGroup.Group("workers")
	usersGroup := apiGroup.Group("users")
	notificationsGroup := apiGroup.Group("notifications")
	walletsGroup.Use(middlewares.Authentication())
	profilesGroup.Use(middlewares.Authentication())
	workersGroup.Use(middlewares.Authentication())
	usersGroup.Use(middlewares.Authentication())
	notificationsGroup.Use(middlewares.Authentication())

	statsGroup.GET("/", statsHandler.FetchStats)
	statsGroup.GET("/health", statsHandler.Health)
	statsGroup.GET("/price", statsHandler.Price)
	statsGroup.GET("/pool", statsHandler.Pool)

	apiGroup.POST("/register", authHandler.Register)
	apiGroup.POST("/login", authHandler.Login)
	apiGroup.GET("/logout", authHandler.Logout)

	walletsGroup.GET("/", walletHandler.Fetch)
	walletsGroup.GET("/:id", walletHandler.FetchByID)
	walletsGroup.POST("/", walletHandler.Create)
	walletsGroup.PUT("/:id", walletHandler.Update)
	walletsGroup.DELETE("/:id", walletHandler.Delete)

	profilesGroup.GET("/", profileHandler.Fetch)
	profilesGroup.GET("/:id", profileHandler.FetchByID)
	profilesGroup.POST("/", profileHandler.Create)
	profilesGroup.PUT("/:id", profileHandler.Update)
	profilesGroup.DELETE("/:id", profileHandler.Delete)

	workersGroup.GET("/", workerHandler.Fetch)
	workersGroup.GET("/:id", workerHandler.FetchByID)
	workersGroup.POST("/", workerHandler.Create)
	r.POST("/api/workers/stats/:id", workerHandler.RestStats)
	workersGroup.PUT("/:id", workerHandler.Update)
	workersGroup.DELETE("/:id", workerHandler.Delete)

	usersGroup.GET("/me", userHandler.Me)
	usersGroup.PUT("/:id", userHandler.Update)

	notificationsGroup.GET("/subscribe", notificationsHandler.Subscribe)

	// Nginx will proxy :50051 to /api/workers/stats/grpc
	go func() {
		listener, err := net.Listen("tcp", ":50051")
		if err != nil {
			log.Fatalf("failed to start gRPC server: %v", err)
		}
		s := grpc.NewServer()
		reflection.Register(s)
		pb.RegisterWorkerServer(s, &handlers.GRPCServer{})
		if err := s.Serve(listener); err != nil {
			log.Fatalf("failed to serve gRPC listener: %v", err)
		}
	}()
}
