package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// Config almacena toda la configuración de la aplicación
type Config struct {
	DBUser    string
	DBPass    string
	DBHost    string
	DBPort    string
	DBName    string
	APIPort   string
	JWTSecret string
}

// LoadConfig carga la configuración desde variables de entorno
func LoadConfig() (config Config, err error) {
	// Cargar variables desde el archivo .env
	err = godotenv.Load()
	if err != nil {
		return config, fmt.Errorf("error cargando archivo .env: %w", err)
	}

	config.DBUser = os.Getenv("DB_USER")
	config.DBPass = os.Getenv("DB_PASS")
	config.DBHost = os.Getenv("DB_HOST")
	config.DBPort = os.Getenv("DB_PORT")
	config.DBName = os.Getenv("DB_NAME")
	config.APIPort = os.Getenv("API_PORT")
	config.JWTSecret = os.Getenv("JWT_SECRET")

	// Validar configuración mínima
	if config.DBUser == "" || config.DBHost == "" || config.DBName == "" || config.JWTSecret == "" {
		return config, fmt.Errorf("faltan variables de entorno obligatorias")
	}

	return config, nil
}
