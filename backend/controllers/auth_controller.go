package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Login(db *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {

		var loginData struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}

		// Get username and password from React
		if err := c.ShouldBindJSON(&loginData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid request",
			})
			return
		}

		var userID int
		var username string
		var password string

		// Find user in database
		err := db.QueryRow(
			c,
			"SELECT id, username, password FROM users WHERE username = $1",
			loginData.Username,
		).Scan(&userID, &username, &password)

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid username or password",
			})
			return
		}

		// Check password
		if loginData.Password != password {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid username or password",
			})
			return
		}

		// Login successful
		c.JSON(http.StatusOK, gin.H{
			"message":  "Login successful",
			"user_id":  userID,
			"username": username,
		})
	}
}
