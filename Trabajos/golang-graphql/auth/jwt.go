package auth

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Clave secreta para firmar los tokens JWT
const SecretKey = "clave_secreta_muy_segura_para_jwt" // En producción, usa variables de entorno

// Claims personalizado para el token JWT
type Claims struct {
	UserID string `json:"user_id"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// GenerateToken genera un nuevo token JWT para un usuario
func GenerateToken(userID, role string) (string, error) {
	// Crear los claims con la información del usuario
	claims := &Claims{
		UserID: userID,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)), // Token válido por 24 horas
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	// Crear el token con los claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Firmar el token con la clave secreta
	tokenString, err := token.SignedString([]byte(SecretKey))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// ValidateToken valida un token JWT y devuelve los claims si es válido
func ValidateToken(tokenString string) (*Claims, error) {
	// Parsear el token
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		// Verificar que el método de firma sea el correcto
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("método de firma inválido")
		}
		return []byte(SecretKey), nil
	})

	if err != nil {
		return nil, err
	}

	// Verificar que el token sea válido
	if !token.Valid {
		return nil, errors.New("token inválido")
	}

	// Extraer los claims
	claims, ok := token.Claims.(*Claims)
	if !ok {
		return nil, errors.New("no se pudieron extraer los claims")
	}

	return claims, nil
}

// IsAdmin verifica si el usuario tiene el rol de administrador
func IsAdmin(claims *Claims) bool {
	return claims != nil && claims.Role == "admin"
}
