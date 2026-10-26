package auth

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)
// Claims represents the JWT claims structure.
type Claims struct {
	UserID   int    `json:"user_id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

// GenerateToken generates a JWT token for the given user ID and username.

func GenerateToken(userID int, username string) (string, error) {
	// Get the JWT secret from environment variables
	secret := os.Getenv("JWT_SECRET")
	// check if the secret exists
	if secret == "" {
		return "", errors.New("JWT_SECRET is not configured")
	}

	// Create the claims for the token

	claims := Claims{
		UserID:   userID,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			// Set the expiration time for the token (e.g., 30 minutes from now)
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(30 * time.Minute)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Subject:   username,
		},
	}
	// Create the token with the claims and sign it using the secret
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	// Sign the token and return it
	return token.SignedString([]byte(secret))
}

// ValidateToken validates the given JWT token string and returns the claims if valid.

func ValidateToken(tokenString string) (*Claims, error) {
	// Get the JWT secret from environment variables
	secret := os.Getenv("JWT_SECRET")
	// check if the secret exists
	if secret == "" {
		return nil, errors.New("JWT_SECRET is not configured")
	}

	// Parse the token with the claims and validate it
	token, err := jwt.ParseWithClaims(
		tokenString,
		&Claims{},
		// Provide the secret key for validation
		func(token *jwt.Token) (interface{}, error) {
			// Check if the signing method is HMAC (HS256)
			if token.Method != jwt.SigningMethodHS256 {
				// Return an error if the signing method is unexpected
				return nil, errors.New("unexpected signing method")
			}
			// Return the secret key for validation
			return []byte(secret), nil
		},
	)
	// Check for errors during token parsing
	if err != nil {
		return nil, err
	}
	// Extract the claims from the token and assert their type
	claims, ok := token.Claims.(*Claims)
	// Check if the token is valid and the claims are of the expected type
	if !ok || !token.Valid {
		return nil, errors.New("invalid token")
	}
	// Return the claims if the token is valid
	return claims, nil
}
