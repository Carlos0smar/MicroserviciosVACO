package resolvers

import (
	"context"
	"errors"
	"golang-graphql/database"
	"golang-graphql/middleware"
	"golang-graphql/models"
	"log"

	"github.com/graphql-go/graphql"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetAllHabitaciones() graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		ctx := context.Background()

		cursor, err := database.HabitacionCollection.Find(ctx, bson.M{})
		if err != nil {
			log.Printf("Error finding rooms: %v", err)
			return nil, err
		}
		defer cursor.Close(ctx)

		var habitaciones []models.Habitacion
		if err = cursor.All(ctx, &habitaciones); err != nil {
			log.Printf("Error decoding rooms: %v", err)
			return nil, err
		}

		return habitaciones, nil
	}
}

func GetHabitacion() graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		ctx := context.Background()

		id, ok := p.Args["id"].(string)
		if !ok {
			return nil, errors.New("invalid id")
		}

		objectID, err := primitive.ObjectIDFromHex(id)
		if err != nil {
			return nil, err
		}

		var habitacion models.Habitacion
		err = database.HabitacionCollection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&habitacion)
		if err != nil {
			log.Printf("Error finding room: %v", err)
			return nil, err
		}

		return habitacion, nil
	}
}

func CreateHabitacion() graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		// Verificar si hay un usuario autenticado
		if middleware.GetClaims(p.Context) == nil {
			return nil, errors.New("debes estar autenticado para crear habitaciones")
		}

		ctx := context.Background()

		input, ok := p.Args["input"].(map[string]interface{})
		if !ok {
			return nil, errors.New("invalid input")
		}

		habitacion := models.Habitacion{
			ID:               primitive.NewObjectID(),
			NumeroHabitacion: input["numero_habitacion"].(int),
			TipoHabitacion:   input["tipo_habitacion"].(string),
			PrecioPorNoche:   input["precio_por_noche"].(float64),
			Estado:           input["estado"].(string),
			Descripcion:      input["descripcion"].(string),
		}

		_, err := database.HabitacionCollection.InsertOne(ctx, habitacion)
		if err != nil {
			log.Printf("Error creating room: %v", err)
			return nil, err
		}

		return habitacion, nil
	}
}

func UpdateHabitacion() graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		// Verificar si hay un usuario autenticado
		if middleware.GetClaims(p.Context) == nil {
			return nil, errors.New("debes estar autenticado para actualizar habitaciones")
		}

		ctx := context.Background()

		id, ok := p.Args["id"].(string)
		if !ok {
			return nil, errors.New("invalid id")
		}

		objectID, err := primitive.ObjectIDFromHex(id)
		if err != nil {
			return nil, err
		}

		input, ok := p.Args["input"].(map[string]interface{})
		if !ok {
			return nil, errors.New("invalid input")
		}

		update := bson.M{
			"$set": bson.M{
				"numero_habitacion": input["numero_habitacion"].(int),
				"tipo_habitacion":   input["tipo_habitacion"].(string),
				"precio_por_noche":  input["precio_por_noche"].(float64),
				"estado":            input["estado"].(string),
				"descripcion":       input["descripcion"].(string),
			},
		}

		opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
		var room models.Habitacion
		err = database.HabitacionCollection.FindOneAndUpdate(
			ctx,
			bson.M{"_id": objectID},
			update,
			opts,
		).Decode(&room)
		if err != nil {
			log.Printf("Error updating room: %v", err)
			return nil, err
		}

		return room, nil
	}
}

func DeleteHabitacion() graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		// Verificar si hay un usuario autenticado
		if middleware.GetClaims(p.Context) == nil {
			return nil, errors.New("debes estar autenticado para eliminar habitaciones")
		}

		ctx := context.Background()

		id, ok := p.Args["id"].(string)
		if !ok {
			return nil, errors.New("invalid id")
		}

		objectID, err := primitive.ObjectIDFromHex(id)
		if err != nil {
			return nil, err
		}

		result, err := database.HabitacionCollection.DeleteOne(ctx, bson.M{"_id": objectID})
		if err != nil {
			log.Printf("Error deleting room: %v", err)
			return nil, err
		}

		if result.DeletedCount == 0 {
			return map[string]interface{}{
				"success": false,
				"message": "Room not found",
			}, nil
		}

		return map[string]interface{}{
			"success": true,
			"message": "Room deleted successfully",
		}, nil
	}
}
