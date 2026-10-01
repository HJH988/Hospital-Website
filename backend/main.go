package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/example/crud-app/database"
	"github.com/example/crud-app/routes"
)

func main() {

	err := godotenv.Load()

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	db, err := database.Connect()

	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	defer db.Close()

	router := gin.Default()

	router.SetTrustedProxies(nil)

	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},
	}))

	routes.PatientRoutes(router, db)

	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "API is running well!",
			"status":  "success",
		})
	})

	router.Run(":3000")
}
