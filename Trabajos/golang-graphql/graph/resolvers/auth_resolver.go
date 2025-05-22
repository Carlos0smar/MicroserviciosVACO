package resolvers

import (
	"context"
	"errors"
	"golang-graphql/auth"
	"golang-graphql/database"
	"golang-graphql/models"
	"log"

	"github.com/graphql-go/graphql"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

// RegisterUser registra un nuevo usuario
func RegisterUser() graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		ctx := context.Background()

		input, ok := p.Args["input"].(map[string]interface{})
		if !ok {
			return nil, errors.New("invalid input")
		}

		// Verificar si el usuario ya existe
		username := input["username"].(string)
		var existingUser models.User
		err := database.UserCollection.FindOne(ctx, bson.M{"username": username}).Decode(&existingUser)
		if err == nil {
			return nil, errors.New("el usuario ya existe")
		}

		// Hashear la contraseña
		password := input["password"].(string)
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			log.Printf("Error al hashear la contraseña: %v", err)
			return nil, err
		}

		// Crear el usuario
		user := models.User{
			ID:       primitive.NewObjectID(),
			Username: username,
			Password: string(hashedPassword),
			Role:     input["role"].(string),
		}

		_, err = database.UserCollection.InsertOne(ctx, user)
		if err != nil {
			log.Printf("Error al crear el usuario: %v", err)
			return nil, err
		}

		// No devolver la contraseña en la respuesta
		user.Password = ""

		return user, nil
	}
}

// LoginUser autentica a un usuario y devuelve un token JWT
func LoginUser() graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		ctx := context.Background()

		username, ok := p.Args["username"].(string)
		if !ok {
			return nil, errors.New("username inválido")
		}

		password, ok := p.Args["password"].(string)
		if !ok {
			return nil, errors.New("password inválido")
		}

		// Buscar el usuario en la base de datos
		var user models.User
		err := database.UserCollection.FindOne(ctx, bson.M{"username": username}).Decode(&user)
		if err != nil {
			return nil, errors.New("usuario o contraseña incorrectos")
		}

		// Verificar la contraseña
		err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
		if err != nil {
			return nil, errors.New("usuario o contraseña incorrectos")
		}

		// Generar token JWT
		token, err := auth.GenerateToken(user.GetID(), user.Role)
		if err != nil {
			log.Printf("Error al generar el token: %v", err)
			return nil, err
		}

		// No devolver la contraseña en la respuesta
		user.Password = ""

		return map[string]interface{}{
			"token": token,
			"user":  user,
		}, nil
	}
}
