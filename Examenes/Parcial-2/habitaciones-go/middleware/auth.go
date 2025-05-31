package middleware

import (
	"context"
	"golang-graphql/auth"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type contextKey string

const (
	ClaimsKey contextKey = "claims"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
	
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			log.Println("No Authorization header found")
		
			c.Next()
			return
		}

	
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			log.Printf("Invalid auth header format: %s", authHeader)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Formato de autorización inválido"})
			c.Abort()
			return
		}

		tokenString := parts[1]
		log.Printf("Validating token: %s", tokenString)

	
		claims, err := auth.ValidateToken(tokenString)
		if err != nil {
			log.Printf("Token validation error: %v", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token inválido"})
			c.Abort()
			return
		}

		log.Printf("Token validated successfully for user: %s with role: %s", claims.UserID, claims.Role)

	
		ctx := context.WithValue(c.Request.Context(), ClaimsKey, claims)
		c.Request = c.Request.WithContext(ctx)

		c.Next()
	}
}

func GetClaims(ctx context.Context) *auth.Claims {
	claims, ok := ctx.Value(ClaimsKey).(*auth.Claims)
	if !ok {
		return nil
	}
	return claims
}

func RequireAdmin(ctx context.Context) bool {
	claims := GetClaims(ctx)
	return auth.IsAdmin(claims)
}
