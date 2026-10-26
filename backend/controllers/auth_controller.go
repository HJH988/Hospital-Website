package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"

	"github.com/example/crud-app/auth"
)

// Login handles user login requests, authenticates the user, and returns a JWT token if successful.
func Login(db *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		var loginData struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}

		if err := c.ShouldBindJSON(&loginData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid request",
			})
			return
		}

		var userID int
		var username string
		var hashedPassword string

		err := db.QueryRow(
			c.Request.Context(),
			`SELECT id, username, password
			 FROM users
			 WHERE username = $1`,
			loginData.Username,
		).Scan(&userID, &username, &hashedPassword)

		if err != nil {
			if err == pgx.ErrNoRows {
				c.JSON(http.StatusUnauthorized, gin.H{
					"error": "Invalid username or password",
				})
				return
			}

			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Unable to authenticate user",
			})
			return
		}

		err = bcrypt.CompareHashAndPassword(
			[]byte(hashedPassword),
			[]byte(loginData.Password),
		)

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid username or password",
			})
			return
		}

		token, err := auth.GenerateToken(userID, username)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Unable to generate authentication token",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Login successful",
			"token":   token,
			"user": gin.H{
				"id":       userID,
				"username": username,
			},
		})
	}
}
