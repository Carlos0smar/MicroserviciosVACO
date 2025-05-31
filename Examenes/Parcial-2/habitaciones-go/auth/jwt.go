package auth

import (
	"errors"
	"log"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const SecretKey = "microservicios_parcial_2_secret"

type Claims struct {
	UserID string `json:"user_id"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

func GenerateToken(userID, role string) (string, error) {

	claims := &Claims{
		UserID: userID,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}


	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)


	tokenString, err := token.SignedString([]byte(SecretKey))
	if err != nil {
		log.Printf("Error signing token: %v", err)
		return "", err
	}

	log.Printf("Generated token with UserID: %s, Role: %s", userID, role)
	return tokenString, nil
}

func ValidateToken(tokenString string) (*Claims, error) {
	log.Printf("Attempting to validate token with SecretKey: %s", SecretKey)


	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
	
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			log.Printf("Unexpected signing method: %v", token.Header["alg"])
			return nil, errors.New("método de firma inválido")
		}
		return []byte(SecretKey), nil
	})

	if err != nil {
		log.Printf("Error parsing token: %v", err)
		return nil, err
	}


	if !token.Valid {
		log.Println("Token is invalid")
		return nil, errors.New("token inválido")
	}


	claims, ok := token.Claims.(*Claims)
	if !ok {
		log.Println("Could not extract claims")
		return nil, errors.New("no se pudieron extraer los claims")
	}

	log.Printf("Token validated successfully. UserID: %s, Role: %s", claims.UserID, claims.Role)
	return claims, nil
}

func IsAdmin(claims *Claims) bool {
	return claims != nil && claims.Role == "admin"
}
