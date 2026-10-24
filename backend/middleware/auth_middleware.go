package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/example/crud-app/auth"
)

func RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		// read the authorization header
		authHeader := c.GetHeader("Authorization")
		// seperate the bearer from the token
		parts := strings.SplitN(authHeader, " ", 2)
		// Check if the auth header is in the correct format
		if len(parts) != 2 ||
			!strings.EqualFold(parts[0], "Bearer") ||
			strings.TrimSpace(parts[1]) == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "Missing or invalid authorization header",
			})
			return
		}
		// Validate the token and extract claims
		claims, err := auth.ValidateToken(strings.TrimSpace(parts[1]))
		// reject the request if validation fails
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid or expired token",
			})
			return
		}
		// store the validated users
		c.Set("userID", claims.UserID)
		c.Set("username", claims.Username)
		// continue to the next handler
		c.Next()
	}
}
