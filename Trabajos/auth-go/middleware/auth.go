package middleware

import (
	"auth/config"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// Claims representa los datos del token JWT
type Claims struct {
	UserID int    `json:"user_id"`
	Role   string `json:"role"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

// GenerateToken genera un token JWT con los datos del usuario
func GenerateToken(userID int, username string, email string, role string, jwtSecret string) (string, time.Time, error) {
	// Establecer tiempo de expiración (1 hora)
	expirationTime := time.Now().Add(time.Hour * 24) //! cambiar a 1 hora

	// Crear claims con la información del usuario
	claims := &Claims{
		UserID: userID,
		Role:   role,
		Email:  email,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   username,
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "auth-service",
		},
	}

	// Crear token con el algoritmo de firma
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Firmar el token con la clave secreta
	tokenString, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		return "", time.Time{}, err
	}

	return tokenString, expirationTime, nil
}

// AuthMiddleware verifica que el token JWT sea válido
func AuthMiddleware(cfg config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Obtener el token del encabezado Authorization
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "token de autorización no proporcionado"})
			c.Abort()
			return
		}

		// El token debe tener el formato "Bearer <token>"
		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "formato de token inválido"})
			c.Abort()
			return
		}

		// Extraer el token
		tokenString := tokenParts[1]

		// Validar el token
		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			// Verificar que el algoritmo de firma es el esperado
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("método de firma inesperado: %v", token.Header["alg"])
			}
			return []byte(cfg.JWTSecret), nil
		})
		// Manejar errores de validación
		if err != nil {
			// En jwt v5, la validación de errores es diferente
			if errors.Is(err, jwt.ErrTokenExpired) || errors.Is(err, jwt.ErrTokenNotValidYet) {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "token expirado"})
			} else {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "token inválido"})
			}
			c.Abort()
			return
		}

		// Verificar que el token es válido
		if !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "token inválido"})
			c.Abort()
			return
		}
		// Establecer los datos del usuario en el contexto
		c.Set("user_id", claims.UserID)
		c.Set("role", claims.Role)
		c.Set("username", claims.Subject)
		c.Set("email", claims.Email)

		c.Next()
	}
}

// RoleMiddleware verifica que el usuario tenga el rol requerido
func RoleMiddleware(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "rol de usuario no encontrado"})
			c.Abort()
			return
		}

		// Verificar si el rol del usuario está entre los permitidos
		roleStr := userRole.(string)
		allowed := false
		for _, role := range roles {
			if roleStr == role {
				allowed = true
				break
			}
		}

		if !allowed {
			c.JSON(http.StatusForbidden, gin.H{"error": "no tienes permisos para acceder a este recurso"})
			c.Abort()
			return
		}

		c.Next()
	}
}
