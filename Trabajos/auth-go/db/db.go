package db

import (
	"auth/config"
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

// Database representa la conexión a la base de datos
var Database *sql.DB

// InitializeDB inicializa la conexión a la base de datos
func InitializeDB(config config.Config) error {
	// Formato de conexión: username:password@tcp(host:port)/dbname
	connectionString := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		config.DBUser,
		config.DBPass,
		config.DBHost,
		config.DBPort,
		config.DBName,
	)

	var err error
	Database, err = sql.Open("mysql", connectionString)
	if err != nil {
		return fmt.Errorf("error conectando a la base de datos: %w", err)
	}

	// Verificar la conexión
	err = Database.Ping()
	if err != nil {
		return fmt.Errorf("error al hacer ping a la base de datos: %w", err)
	}

	// Crear la tabla de usuarios si no existe
	err = createTables()
	if err != nil {
		return fmt.Errorf("error al crear tablas: %w", err)
	}

	return nil
}

// createTables crea las tablas necesarias si no existen
func createTables() error {
	// Definir sentencia SQL para crear la tabla de usuarios
	createTableSQL := `
	CREATE TABLE IF NOT EXISTS users (
		id INT AUTO_INCREMENT PRIMARY KEY,
		username VARCHAR(50) NOT NULL UNIQUE,
		email VARCHAR(100) NOT NULL UNIQUE,
		password VARCHAR(255) NOT NULL,
		role VARCHAR(20) NOT NULL DEFAULT 'user',
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	)
	`

	// Ejecutar la sentencia SQL
	_, err := Database.Exec(createTableSQL)
	if err != nil {
		return fmt.Errorf("error al crear tabla de usuarios: %w", err)
	}

	return nil
}
