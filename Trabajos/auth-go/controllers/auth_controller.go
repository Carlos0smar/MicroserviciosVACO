package controllers

import (
	"auth/config"
	"auth/db"
	"auth/middleware"
	"auth/models"
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// AuthController maneja las solicitudes relacionadas con la autenticación
type AuthController struct {
	Config config.Config
}

// NewAuthController crea una nueva instancia del controlador de autenticación
func NewAuthController(config config.Config) *AuthController {
	return &AuthController{Config: config}
}

// Register registra un nuevo usuario
func (ac *AuthController) Register(c *gin.Context) {
	var req models.RegisterRequest

	// Validar que el cuerpo de la solicitud es correcto
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ResponseError{Error: "Datos de registro inválidos"})
		return
	}

	// Verificar si el usuario ya existe
	var exists int
	err := db.Database.QueryRow("SELECT COUNT(*) FROM users WHERE username = ? OR email = ?", req.Username, req.Email).Scan(&exists)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ResponseError{Error: "Error al verificar el usuario"})
		return
	}

	if exists > 0 {
		c.JSON(http.StatusConflict, models.ResponseError{Error: "El nombre de usuario o correo electrónico ya está en uso"})
		return
	}

	// Encriptar la contraseña
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ResponseError{Error: "Error al procesar la contraseña"})
		return
	}
	// Determinar el rol del usuario
	role := "user" // Rol por defecto
	if req.Role == "admin" || req.Role == "user" {
		role = req.Role
	}

	// Insertar el nuevo usuario en la base de datos
	result, err := db.Database.Exec(
		"INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
		req.Username,
		req.Email,
		hashedPassword,
		role,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ResponseError{Error: "Error al crear el usuario"})
		return
	}

	// Obtener el ID del usuario insertado
	userID, err := result.LastInsertId()
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ResponseError{Error: "Error al obtener el ID del usuario"})
		return
	}	// Generar un token JWT para el nuevo usuario
	token, expiresAt, err := middleware.GenerateToken(int(userID), req.Username, req.Email, role, ac.Config.JWTSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ResponseError{Error: "Error al generar el token"})
		return
	}
	// Devolver la respuesta con el token
	c.JSON(http.StatusCreated, models.TokenResponse{
		Token:     token,
		ExpiresAt: expiresAt.Format(time.RFC3339),
		User: models.UserResponse{
			ID:       int(userID),
			Username: req.Username,
			Email:    req.Email,
			Role:     role,
		},
	})
}

// Login inicia sesión con un usuario existente
func (ac *AuthController) Login(c *gin.Context) {
	var req models.LoginRequest

	// Validar que el cuerpo de la solicitud es correcto
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ResponseError{Error: "Datos de inicio de sesión inválidos"})
		return
	}

	// Buscar el usuario en la base de datos
	var user models.User
	err := db.Database.QueryRow(
		"SELECT id, username, email, password, role FROM users WHERE username = ?",
		req.Username,
	).Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.Role)

	// Manejar error si el usuario no existe
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusUnauthorized, models.ResponseError{Error: "Usuario o contraseña incorrectos"})
		} else {
			c.JSON(http.StatusInternalServerError, models.ResponseError{Error: "Error al buscar el usuario"})
		}
		return
	}

	// Verificar la contraseña
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, models.ResponseError{Error: "Usuario o contraseña incorrectos"})
		return
	}
	// Generar un token JWT para el usuario autenticado
	token, expiresAt, err := middleware.GenerateToken(user.ID, user.Username, user.Email, user.Role, ac.Config.JWTSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ResponseError{Error: "Error al generar el token"})
		return
	}

	// Devolver la respuesta con el token
	c.JSON(http.StatusOK, models.TokenResponse{
		Token:     token,
		ExpiresAt: expiresAt.Format(time.RFC3339),
		User: models.UserResponse{
			ID:       user.ID,
			Username: user.Username,
			Email:    user.Email,
			Role:     user.Role,
		},
	})
}

// GetProfile obtiene el perfil del usuario autenticado
func (ac *AuthController) GetProfile(c *gin.Context) {
	// Obtener los datos del usuario del contexto (establecidos por el middleware)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ResponseError{Error: "Usuario no autenticado"})
		return
	}

	// Buscar el usuario en la base de datos
	var user models.User
	err := db.Database.QueryRow(
		"SELECT id, username, email, role FROM users WHERE id = ?",
		userID,
	).Scan(&user.ID, &user.Username, &user.Email, &user.Role)

	// Manejar error si el usuario no existe
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, models.ResponseError{Error: "Usuario no encontrado"})
		} else {
			c.JSON(http.StatusInternalServerError, models.ResponseError{Error: "Error al buscar el usuario"})
		}
		return
	}

	// Devolver los datos del usuario
	c.JSON(http.StatusOK, models.UserResponse{
		ID:       user.ID,
		Username: user.Username,
		Email:    user.Email,
		Role:     user.Role,
	})
}
