package handlers

import (
	"net/http"
	"time"

	"github.com/doublegrey/laggy/mining/backend/datastore"
	"github.com/doublegrey/laggy/mining/backend/models"
	"github.com/doublegrey/laggy/mining/backend/repositories"
	"github.com/doublegrey/laggy/mining/backend/repositories/profile"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func NewProfileHandler(datastore *datastore.Datastore) *ProfileHandler {
	return &ProfileHandler{
		repo: profile.NewRepo(datastore),
	}
}

type ProfileHandler struct {
	repo repositories.ProfileRepo
}

func (h *ProfileHandler) Fetch(c *gin.Context) {
	session := sessions.Default(c)
	userID, err := primitive.ObjectIDFromHex(session.Get("id").(string))
	if err != nil {
		c.Status(http.StatusForbidden)
		return
	}
	pyaload, err := h.repo.Fetch(c.Request.Context(), bson.M{"user": userID})
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}
	c.JSON(http.StatusOK, pyaload)
}

func (h *ProfileHandler) FetchByID(c *gin.Context) {
	session := sessions.Default(c)
	userID, err := primitive.ObjectIDFromHex(session.Get("id").(string))
	if err != nil {
		c.Status(http.StatusForbidden)
		return
	}
	profileID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	profile, err := h.repo.FetchByID(c.Request.Context(), profileID)

	if profile.User != userID || err != nil {
		c.Status(http.StatusForbidden)
		return
	}
	c.JSON(http.StatusOK, profile)
}

func (h *ProfileHandler) Create(c *gin.Context) {
	var profile models.Profile
	err := c.ShouldBindJSON(&profile)
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
	profile.User = userID
	profile.ID = primitive.NewObjectID()
	profile.Created = time.Now()
	_, err = h.repo.Create(c.Request.Context(), profile)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	} else {
		c.Status(http.StatusCreated)
	}
}

func (h *ProfileHandler) Update(c *gin.Context) {
	var profile models.Profile
	err := c.ShouldBindJSON(&profile)
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
	profileID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	sourceProfile, err := h.repo.FetchByID(c.Request.Context(), profileID)
	if sourceProfile.User != userID || err != nil {
		c.Status(http.StatusForbidden)
		return
	}
	profile.User = userID
	profile.Created = time.Now()
	err = h.repo.Update(c.Request.Context(), profile)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	} else {
		c.Status(http.StatusOK)
	}
}

func (h *ProfileHandler) Delete(c *gin.Context) {
	session := sessions.Default(c)
	userID, err := primitive.ObjectIDFromHex(session.Get("id").(string))
	if err != nil {
		c.Status(http.StatusForbidden)
		return
	}
	profileID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	profile, err := h.repo.FetchByID(c.Request.Context(), profileID)
	if profile.User != userID || err != nil {
		c.Status(http.StatusForbidden)
		return
	}
	err = h.repo.Delete(c.Request.Context(), profileID)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	} else {
		c.Status(http.StatusOK)
	}
}
