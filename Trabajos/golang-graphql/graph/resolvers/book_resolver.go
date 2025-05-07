package resolvers

import (
	"context"
	"errors"
	"golang-graphql/database"
	"golang-graphql/models"
	"log"

	"github.com/graphql-go/graphql"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetAllBooks() graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		ctx := context.Background()

		cursor, err := database.BookCollection.Find(ctx, bson.M{})
		if err != nil {
			log.Printf("Error finding books: %v", err)
			return nil, err
		}
		defer cursor.Close(ctx)

		var books []models.Book
		if err = cursor.All(ctx, &books); err != nil {
			log.Printf("Error decoding books: %v", err)
			return nil, err
		}

		return books, nil
	}
}

func GetBook() graphql.FieldResolveFn {
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

		var book models.Book
		err = database.BookCollection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&book)
		if err != nil {
			log.Printf("Error finding book: %v", err)
			return nil, err
		}

		return book, nil
	}
}
func CreateBook() graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		ctx := context.Background()

		input, ok := p.Args["input"].(map[string]interface{})
		if !ok {
			return nil, errors.New("invalid input")
		}

		book := models.Book{
			ID:           primitive.NewObjectID(),
			Titulo:       input["titulo"].(string),
			Autor:        input["autor"].(string),
			Editorial:    input["editorial"].(string),
			Anio:         input["anio"].(int),
			Descripcion:  input["descripcion"].(string),
			NumeroPagina: input["numero_pagina"].(int),
		}

		_, err := database.BookCollection.InsertOne(ctx, book)
		if err != nil {
			log.Printf("Error creating book: %v", err)
			return nil, err
		}

		return book, nil
	}
}

func UpdateBook() graphql.FieldResolveFn {
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

		input, ok := p.Args["input"].(map[string]interface{})
		if !ok {
			return nil, errors.New("invalid input")
		}

		update := bson.M{
			"$set": bson.M{
				"titulo":        input["titulo"].(string),
				"autor":         input["autor"].(string),
				"editorial":     input["editorial"].(string),
				"anio":          input["anio"].(int),
				"descripcion":   input["descripcion"].(string),
				"numero_pagina": input["numero_pagina"].(int),
			},
		}

		opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
		var book models.Book
		err = database.BookCollection.FindOneAndUpdate(
			ctx,
			bson.M{"_id": objectID},
			update,
			opts,
		).Decode(&book)
		if err != nil {
			log.Printf("Error updating book: %v", err)
			return nil, err
		}

		return book, nil
	}
}

func DeleteBook() graphql.FieldResolveFn {
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

		result, err := database.BookCollection.DeleteOne(ctx, bson.M{"_id": objectID})
		if err != nil {
			log.Printf("Error deleting book: %v", err)
			return nil, err
		}

		if result.DeletedCount == 0 {
			return map[string]interface{}{
				"success": false,
				"message": "Book not found",
			}, nil
		}

		return map[string]interface{}{
			"success": true,
			"message": "Book deleted successfully",
		}, nil
	}
}
