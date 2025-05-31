package schema

import (
	"golang-graphql/graph/resolvers"
	"golang-graphql/models"
	"log"

	"github.com/graphql-go/graphql"
)

var HabitacionType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Habitacion",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.ID,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				if habitacion, ok := p.Source.(*models.Habitacion); ok {
					return habitacion.GetID(), nil
				}
				if habitacion, ok := p.Source.(models.Habitacion); ok {
					return habitacion.GetID(), nil
				}
				return nil, nil
			},
		},
		"numero_habitacion": &graphql.Field{
			Type: graphql.Int,
		},
		"tipo_habitacion": &graphql.Field{
			Type: graphql.String,
		},
		"precio_por_noche": &graphql.Field{
			Type: graphql.Float,
		},
		"estado": &graphql.Field{
			Type: graphql.String,
		},
		"descripcion": &graphql.Field{
			Type: graphql.String,
		},
	},
})

var HabitacionInputType = graphql.NewInputObject(graphql.InputObjectConfig{
	Name: "HabitacionInput",
	Fields: graphql.InputObjectConfigFieldMap{
		"numero_habitacion": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.Int),
		},
		"tipo_habitacion": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"precio_por_noche": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.Float),
		},
		"estado": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"descripcion": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
	},
})

var DeleteHabitacionResponseType = graphql.NewObject(graphql.ObjectConfig{
	Name: "DeleteHabitacionResponse",
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
		"Habitacions": &graphql.Field{
			Type:    graphql.NewList(HabitacionType),
			Resolve: resolvers.GetAllHabitaciones(),
		},
		"Habitacion": &graphql.Field{
			Type: HabitacionType,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: resolvers.GetHabitacion(),
		},
	},
})

var RootMutation = graphql.NewObject(graphql.ObjectConfig{
	Name: "Mutation",
	Fields: graphql.Fields{
		"createHabitacion": &graphql.Field{
			Type: HabitacionType,
			Args: graphql.FieldConfigArgument{
				"input": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(HabitacionInputType),
				},
			},
			Resolve: resolvers.CreateHabitacion(),
		},
		"updateHabitacion": &graphql.Field{
			Type: HabitacionType,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
				"input": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(HabitacionInputType),
				},
			},
			Resolve: resolvers.UpdateHabitacion(),
		},
		"deleteHabitacion": &graphql.Field{
			Type: DeleteHabitacionResponseType,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: resolvers.DeleteHabitacion(),
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
