package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/example/crud-app/controllers"
	"github.com/example/crud-app/database"
	"github.com/example/crud-app/middleware"
	"github.com/example/crud-app/routes"
)

func main() {

	err := godotenv.Load()

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Connect to the database

	db, err := database.Connect()

	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	defer db.Close()

	//

	router := gin.Default()

	router.SetTrustedProxies(nil)

	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},
	}))

	// Reegister routes here

	// Public endpoint: users must be able to log in.
	router.POST("/login", controllers.Login(db))

	// Protected endpoints: JWT required.
	protected := router.Group("/")
	protected.Use(middleware.RequireAuth())

	// Register your existing patient routes on this protected group.
	routes.PatientRoutes(protected, db)

	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "API is running well!",
			"status":  "success",
		})
	})

	router.Static("/uploads", "./uploads")

	//

	// Start the server on port 3000

	router.Run(":3000")
}
