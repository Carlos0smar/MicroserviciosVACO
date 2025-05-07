package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Book struct {
	ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Titulo       string             `json:"titulo" bson:"titulo"`
	Autor        string             `json:"autor" bson:"autor"`
	Editorial    string             `json:"editorial" bson:"editorial"`
	Anio         int                `json:"anio" bson:"anio"`
	Descripcion  string             `json:"descripcion" bson:"descripcion"`
	NumeroPagina int                `json:"numero_pagina" bson:"numero_pagina"`
}

func (b *Book) GetID() string {
	return b.ID.Hex()
}
