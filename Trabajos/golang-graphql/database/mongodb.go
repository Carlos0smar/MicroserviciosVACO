package database

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	DATABASE_URI  = "mongodb://localhost:27017"
	DATABASE_NAME = "bookstore"
)

var (
	MongoClient *mongo.Client
	BookCollection *mongo.Collection
	UserCollection *mongo.Collection
)

func Connect() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI(DATABASE_URI)
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal(err)
		return err
	}


	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal(err)
		return err
	}

	log.Println("Connected to MongoDB!")

	MongoClient = client
	BookCollection = client.Database(DATABASE_NAME).Collection("books")
	UserCollection = client.Database(DATABASE_NAME).Collection("users")

	return nil
}


func Disconnect() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if MongoClient != nil {
		err := MongoClient.Disconnect(ctx)
		if err != nil {
			log.Printf("Error disconnecting from MongoDB: %v", err)
			return
		}
		log.Println("Disconnected from MongoDB")
	}
}
