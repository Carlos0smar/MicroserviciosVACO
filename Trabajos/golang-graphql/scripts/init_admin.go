package main

import (
	"context"
	"log"
	"time"

	"golang-graphql/database"
	"golang-graphql/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	// Conectar a la base de datos
	if err := database.Connect(); err != nil {
		log.Fatal("Error al conectar a MongoDB:", err)
	}
	defer database.Disconnect()

	// Verificar si ya existe un usuario administrador
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var existingAdmin models.User
	err := database.UserCollection.FindOne(ctx, bson.M{"role": "admin"}).Decode(&existingAdmin)
	if err == nil {
		log.Println("Ya existe un usuario administrador:", existingAdmin.Username)
		return
	}

	// Crear un usuario administrador
	password := "admin123" // En producción, usar una contraseña más segura
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("Error al hashear la contraseña:", err)
	}

	admin := models.User{
		ID:       primitive.NewObjectID(),
		Username: "admin",
		Password: string(hashedPassword),
		Role:     "admin",
	}

	_, err = database.UserCollection.InsertOne(ctx, admin)
	if err != nil {
		log.Fatal("Error al crear el usuario administrador:", err)
	}

	log.Println("Usuario administrador creado exitosamente")
	log.Println("Usuario: admin")
	log.Println("Contraseña: admin123")
}
