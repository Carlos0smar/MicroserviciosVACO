package routes

import (
	"auth/config"
	"auth/controllers"
	"auth/middleware"

	"github.com/gin-gonic/gin"
)

// SetupRoutes configura todas las rutas del API
func SetupRoutes(router *gin.Engine, config config.Config) {
	// Crear instancia del controlador de autenticación
	authController := controllers.NewAuthController(config)

	// Grupo de rutas públicas (sin autenticación)
	public := router.Group("/api")
	{
		public.POST("/register", authController.Register)
		public.POST("/login", authController.Login)
	}

	// Grupo de rutas protegidas (requieren autenticación)
	protected := router.Group("/api")
	protected.Use(middleware.AuthMiddleware(config))
	{
		protected.GET("/profile", authController.GetProfile)

		// Rutas que requieren rol específico (ejemplo)
		admin := protected.Group("/admin")
		admin.Use(middleware.RoleMiddleware("admin"))
		{
			// Aquí irían rutas solo para administradores
		}
	}
}
