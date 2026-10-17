package database

import (
	"context"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Connect establishes a connection to the PostgreSQL database
// using the connection string from the environment variable DATABASE_URL.
// It returns a connection pool and any error encountered during the connection process.

func Connect() (*pgxpool.Pool, error) {

	// main.go loaded environment variables from .env file, so we can directly use os.Getenv here.
	connectionString := os.Getenv("DATABASE_URL")

	// Create a new connection pool using the connection string
	pool, err := pgxpool.New(context.Background(), connectionString)

	// Check if there was an error creating the connection pool
	if err != nil {
		return nil, err
	}

	// Ping the database to ensure the connection is established
	err = pool.Ping(context.Background())

	if err != nil {
		return nil, err
	}

	return pool, nil
}
