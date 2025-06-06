package schema

import (
	"golang-graphql/graph/resolvers"
	"golang-graphql/models"
	"log"

	"github.com/graphql-go/graphql"
)

var BookType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Book",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.ID,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				if book, ok := p.Source.(*models.Book); ok {
					return book.GetID(), nil
				}
				if book, ok := p.Source.(models.Book); ok {
					return book.GetID(), nil
				}
				return nil, nil
			},
		},
		"titulo": &graphql.Field{
			Type: graphql.String,
		},
		"autor": &graphql.Field{
			Type: graphql.String,
		},
		"editorial": &graphql.Field{
			Type: graphql.String,
		},
		"anio": &graphql.Field{
			Type: graphql.Int,
		},
		"descripcion": &graphql.Field{
			Type: graphql.String,
		},
		"numero_pagina": &graphql.Field{
			Type: graphql.Int,
		},
	},
})

var BookInputType = graphql.NewInputObject(graphql.InputObjectConfig{
	Name: "BookInput",
	Fields: graphql.InputObjectConfigFieldMap{
		"titulo": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"autor": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"editorial": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"anio": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.Int),
		},
		"descripcion": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"numero_pagina": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.Int),
		},
	},
})

var DeleteBookResponseType = graphql.NewObject(graphql.ObjectConfig{
	Name: "DeleteBookResponse",
	Fields: graphql.Fields{
		"success": &graphql.Field{
			Type: graphql.Boolean,
		},
		"message": &graphql.Field{
			Type: graphql.String,
		},
	},
})

var UserType = graphql.NewObject(graphql.ObjectConfig{
	Name: "User",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.ID,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				if user, ok := p.Source.(*models.User); ok {
					return user.GetID(), nil
				}
				if user, ok := p.Source.(models.User); ok {
					return user.GetID(), nil
				}
				return nil, nil
			},
		},
		"username": &graphql.Field{
			Type: graphql.String,
		},
		"role": &graphql.Field{
			Type: graphql.String,
		},
	},
})

var UserInputType = graphql.NewInputObject(graphql.InputObjectConfig{
	Name: "UserInput",
	Fields: graphql.InputObjectConfigFieldMap{
		"username": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"password": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"role": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
	},
})

var AuthResponseType = graphql.NewObject(graphql.ObjectConfig{
	Name: "AuthResponse",
	Fields: graphql.Fields{
		"token": &graphql.Field{
			Type: graphql.String,
		},
		"user": &graphql.Field{
			Type: UserType,
		},
	},
})

var RootQuery = graphql.NewObject(graphql.ObjectConfig{
	Name: "Query",
	Fields: graphql.Fields{
		"books": &graphql.Field{
			Type:    graphql.NewList(BookType),
			Resolve: resolvers.GetAllBooks(),
		},
		"book": &graphql.Field{
			Type: BookType,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: resolvers.GetBook(),
		},
	},
})

var RootMutation = graphql.NewObject(graphql.ObjectConfig{
	Name: "Mutation",
	Fields: graphql.Fields{
		"createBook": &graphql.Field{
			Type: BookType,
			Args: graphql.FieldConfigArgument{
				"input": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(BookInputType),
				},
			},
			Resolve: resolvers.CreateBook(),
		},
		"updateBook": &graphql.Field{
			Type: BookType,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
				"input": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(BookInputType),
				},
			},
			Resolve: resolvers.UpdateBook(),
		},
		"deleteBook": &graphql.Field{
			Type: DeleteBookResponseType,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: resolvers.DeleteBook(),
		},
		"register": &graphql.Field{
			Type: UserType,
			Args: graphql.FieldConfigArgument{
				"input": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(UserInputType),
				},
			},
			Resolve: resolvers.RegisterUser(),
		},
		"login": &graphql.Field{
			Type: AuthResponseType,
			Args: graphql.FieldConfigArgument{
				"username": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
				"password": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
			},
			Resolve: resolvers.LoginUser(),
		},
	},
})

var Schema, _ = graphql.NewSchema(graphql.SchemaConfig{
	Query:    RootQuery,
	Mutation: RootMutation,
})

func InitSchema() graphql.Schema {
	schema, err := graphql.NewSchema(graphql.SchemaConfig{
		Query:    RootQuery,
		Mutation: RootMutation,
	})
	if err != nil {
		log.Fatalf("Failed to create new schema: %v", err)
	}
	return schema
}
