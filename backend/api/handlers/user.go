package handlers

import (
	"net/http"

	"github.com/doublegrey/laggy/mining/backend/datastore"
	"github.com/doublegrey/laggy/mining/backend/models"
	"github.com/doublegrey/laggy/mining/backend/repositories"
	"github.com/doublegrey/laggy/mining/backend/repositories/user"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func NewUserHandler(datastore *datastore.Datastore) *UserHandler {
	return &UserHandler{
		repo: user.NewRepo(datastore),
	}
}

type UserHandler struct {
	repo repositories.UserRepo
}

func (h *UserHandler) Me(c *gin.Context) {
	session := sessions.Default(c)
	userID, err := primitive.ObjectIDFromHex(session.Get("id").(string))
	if err != nil {
		c.Status(http.StatusForbidden)
		return
	}
	user, err := h.repo.FetchByID(c.Request.Context(), userID)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}
	user.Password = ""
	c.JSON(http.StatusOK, user)
}

func (h *UserHandler) Update(c *gin.Context) {
	session := sessions.Default(c)
	currentUserID, err := primitive.ObjectIDFromHex(session.Get("id").(string))
	if err != nil {
		c.Status(http.StatusForbidden)
		return
	}
	updatedUser := c.Param("id")
	if session.Get("id").(string) != updatedUser {
		c.Status(http.StatusForbidden)
		return
	}
	var user models.User
	err = c.ShouldBindJSON(&user)
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	user.ID = currentUserID
	h.repo.Update(c.Request.Context(), user, false)

}

func (h *UserHandler) FetchByID(c *gin.Context) {

}

func (h *UserHandler) Create(c *gin.Context) {

}

func (h *UserHandler) Delete(c *gin.Context) {

}
