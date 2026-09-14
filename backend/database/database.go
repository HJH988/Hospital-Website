package database

import (
	"context"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

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
