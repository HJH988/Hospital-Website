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

	connectionString := os.Getenv("DATABASE_URL")

	pool, err := pgxpool.New(context.Background(), connectionString)

	if err != nil {
		return nil, err
	}

	err = pool.Ping(context.Background())

	if err != nil {
		return nil, err
	}

	return pool, nil
}
