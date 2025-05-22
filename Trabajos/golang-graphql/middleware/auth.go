package middleware

import (
	"context"
	"golang-graphql/auth"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// Clave para almacenar los claims en el contexto
type contextKey string

const (
	ClaimsKey contextKey = "claims"
)

// AuthMiddleware verifica el token JWT y añade los claims al contexto
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Obtener el token del header Authorization
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			// No hay token, continuar sin autenticación
			c.Next()
			return
		}

		// El formato del header debe ser "Bearer {token}"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Formato de autorización inválido"})
			c.Abort()
			return
		}

		tokenString := parts[1]

		// Validar el token
		claims, err := auth.ValidateToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token inválido"})
			c.Abort()
			return
		}

		// Añadir los claims al contexto
		ctx := context.WithValue(c.Request.Context(), ClaimsKey, claims)
		c.Request = c.Request.WithContext(ctx)

		c.Next()
	}
}

// GetClaims obtiene los claims del contexto
func GetClaims(ctx context.Context) *auth.Claims {
	claims, ok := ctx.Value(ClaimsKey).(*auth.Claims)
	if !ok {
		return nil
	}
	return claims
}

// RequireAdmin verifica si el usuario tiene permisos de administrador
func RequireAdmin(ctx context.Context) bool {
	claims := GetClaims(ctx)
	return auth.IsAdmin(claims)
}
