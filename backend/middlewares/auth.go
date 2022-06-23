package middlewares

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/doublegrey/laggy/mining/backend/models"
)

func Authentication() gin.HandlerFunc {
	return func(c *gin.Context) {
		session := sessions.Default(c)
		id := session.Get("id")
		if id == nil {
			// TODO: log event
			c.JSON(http.StatusUnauthorized, models.HttpError{Code: http.StatusUnauthorized, Error: "unauthorized", Event: uuid.NewString()})
			c.Abort()
		}
	}
}
