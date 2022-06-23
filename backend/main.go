package main

import (
	"context"
	"path"
	"path/filepath"
	"time"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"

	"github.com/doublegrey/laggy/mining/backend/api"
	"github.com/doublegrey/laggy/mining/backend/api/handlers"
	"github.com/doublegrey/laggy/mining/backend/datastore"
	"github.com/doublegrey/laggy/mining/backend/middlewares"
)

func main() {
	datastore.New()

	statsTicker := time.NewTicker(time.Hour)
	go func() {
		statsHandler := handlers.NewStatsHandler(datastore.Connections)
		statsHandler.UpdatePoolStats(context.TODO())
		for range statsTicker.C {
			ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
			defer cancel()
			statsHandler.UpdatePoolStats(ctx)
		}
	}()
	r := gin.Default()
	r.Use(middlewares.CorsAllowAll())
	api.NewRouter(r)

	r.Use(static.Serve("/", static.LocalFile("../frontend/build", true)))
	r.NoRoute(func(c *gin.Context) {
		dir, file := path.Split(c.Request.RequestURI)
		ext := filepath.Ext(file)
		if file == "" || ext == "" {
			c.File("../frontend/build")
		} else {
			c.File("../frontend/build" + path.Join(dir, file))
		}

	})
	r.Run(":9000")
}
