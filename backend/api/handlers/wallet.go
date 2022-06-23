package handlers

import (
	"net/http"
	"time"

	"github.com/doublegrey/laggy/mining/backend/datastore"
	"github.com/doublegrey/laggy/mining/backend/models"
	"github.com/doublegrey/laggy/mining/backend/repositories"
	"github.com/doublegrey/laggy/mining/backend/repositories/wallet"
	"github.com/doublegrey/laggy/mining/backend/utils"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func NewWalletHandler(datastore *datastore.Datastore) *WalletHandler {
	return &WalletHandler{
		repo: wallet.NewRepo(datastore),
	}
}

type WalletHandler struct {
	repo repositories.WalletRepo
}

func (h *WalletHandler) Fetch(c *gin.Context) {
	session := sessions.Default(c)
	userID, err := primitive.ObjectIDFromHex(session.Get("id").(string))
	if err != nil {
		c.Status(http.StatusForbidden)
		return
	}
	payload, err := h.repo.Fetch(c.Request.Context(), bson.M{"user": userID})
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}
	for index, wallet := range payload {
		payload[index].Balance, payload[index].UnpaidBalance = utils.GetBalance(wallet.Address)
	}
	c.JSON(http.StatusOK, payload)
}

func (h *WalletHandler) FetchByID(c *gin.Context) {
	session := sessions.Default(c)
	userID, err := primitive.ObjectIDFromHex(session.Get("id").(string))
	if err != nil {
		c.Status(http.StatusForbidden)
		return
	}
	walletID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	wallet, err := h.repo.FetchByID(c.Request.Context(), walletID)

	if wallet.User != userID || err != nil {
		c.Status(http.StatusForbidden)
		return
	}
	wallet.Balance, wallet.UnpaidBalance = utils.GetBalance(wallet.Address)
	c.JSON(http.StatusOK, wallet)
}

func (h *WalletHandler) Create(c *gin.Context) {
	var wallet models.Wallet
	err := c.ShouldBindJSON(&wallet)
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
	wallet.User = userID
	wallet.ID = primitive.NewObjectID()
	wallet.Created = time.Now()
	_, err = h.repo.Create(c.Request.Context(), wallet)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	} else {
		c.Status(http.StatusCreated)
	}
}

func (h *WalletHandler) Update(c *gin.Context) {
	var wallet models.Wallet
	err := c.ShouldBindJSON(&wallet)
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
	walletID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	sourceWallet, err := h.repo.FetchByID(c.Request.Context(), walletID)
	if sourceWallet.User != userID || err != nil {
		c.Status(http.StatusForbidden)
		return
	}
	wallet.User = userID
	wallet.Created = time.Now()
	wallet.Balance = sourceWallet.Balance
	err = h.repo.Update(c.Request.Context(), wallet)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	} else {
		c.Status(http.StatusOK)
	}
}

func (h *WalletHandler) Delete(c *gin.Context) {
	session := sessions.Default(c)
	userID, err := primitive.ObjectIDFromHex(session.Get("id").(string))
	if err != nil {
		c.Status(http.StatusForbidden)
		return
	}
	walletID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	wallet, err := h.repo.FetchByID(c.Request.Context(), walletID)
	if wallet.User != userID || err != nil {
		c.Status(http.StatusForbidden)
		return
	}
	err = h.repo.Delete(c.Request.Context(), walletID)
	if err != nil {
		c.Status(http.StatusInternalServerError)
	} else {
		c.Status(http.StatusOK)
	}
}
