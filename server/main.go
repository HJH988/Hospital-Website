package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func main() {
	port := getEnv("PORT", "8080")
	databaseURL := getEnv("DATABASE_URL", "postgres://hospital:secret@localhost:5432/hospital?sslmode=disable")

	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		log.Fatalf("failed to open database: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("cannot ping database: %v", err)
	}

	if err := migrate(db); err != nil {
		log.Fatalf("migration failed: %v", err)
	}

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
	}))

	api := router.Group("/api/v1")
	{
		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "ok"})
		})

		api.GET("/patients", func(c *gin.Context) {
			patients, err := listPatients(db)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, patients)
		})
	}

	addr := fmt.Sprintf(":%s", port)
	log.Printf("starting server on %s", addr)
	if err := router.Run(addr); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func migrate(db *sql.DB) error {
	_, err := db.Exec(`
	CREATE TABLE IF NOT EXISTS patients (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL,
		age INT NOT NULL,
		ailment TEXT NOT NULL,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	)`)
	return err
}

func listPatients(db *sql.DB) ([]map[string]interface{}, error) {
	rows, err := db.Query("SELECT id, name, age, ailment, created_at FROM patients ORDER BY id")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	patients := make([]map[string]interface{}, 0)
	for rows.Next() {
		var id int
		var name string
		var age int
		var ailment string
		var createdAt time.Time
		if err := rows.Scan(&id, &name, &age, &ailment, &createdAt); err != nil {
			return nil, err
		}
		patients = append(patients, map[string]interface{}{
			"id":         id,
			"name":       name,
			"age":        age,
			"ailment":    ailment,
			"created_at": createdAt,
		})
	}
	return patients, rows.Err()
}
