package handlers

import (
	"context"
	"net/http"

	"github.com/doublegrey/laggy/mining/backend/datastore"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func NewNotificationsHandler(datastore *datastore.Datastore) *NotificationHandler {
	return &NotificationHandler{
		repo: datastore,
	}
}

type NotificationHandler struct {
	repo *datastore.Datastore
}

func (h *NotificationHandler) Subscribe(c *gin.Context) {
	session := sessions.Default(c)
	userID, err := primitive.ObjectIDFromHex(session.Get("id").(string))
	if err != nil {
		c.Status(http.StatusForbidden)
		return
	}
	if len(c.Query("token")) > 0 {
		h.repo.Mongo.Collection("fcms").UpdateOne(context.TODO(), bson.M{"token": c.Query("token")}, bson.D{{Key: "$set", Value: bson.M{"token": c.Query("token"), "device": c.Query("device"), "user": userID}}}, options.Update().SetUpsert(true))
	}
	c.Status(http.StatusOK)
}
