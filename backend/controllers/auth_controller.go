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

		// Define a struct to hold the login data from the request body
		var loginData struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}
		// bind the JSON request body to the loginData struct
		if err := c.ShouldBindJSON(&loginData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid request",
			})
			return
		}
		// Query the database for the user with the provided username
		var userID int
		var username string
		var hashedPassword string
		// Use QueryRow to fetch the user data from the database
		err := db.QueryRow(
			c.Request.Context(),
			`SELECT id, username, password
			 FROM users
			 WHERE username = $1`,
			loginData.Username,
		).Scan(&userID, &username, &hashedPassword)
		// handle errors that may occur during the database query
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
		// verify password with bcrypt
		err = bcrypt.CompareHashAndPassword(
			[]byte(hashedPassword),
			[]byte(loginData.Password),
		)
		// handle errors that may occur during password verification
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid username or password",
			})
			return
		}
		// Generate a JWT token for the authenticated user
		token, err := auth.GenerateToken(userID, username)
		// handle errors that may occur during token generation
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Unable to generate authentication token",
			})
			return
		}
		// Return the token and user information in the response
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
