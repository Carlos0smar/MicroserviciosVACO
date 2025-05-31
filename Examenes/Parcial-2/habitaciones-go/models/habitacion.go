package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Habitacion struct {
	ID              primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	NumeroHabitacion int               `json:"numero_habitacion" bson:"numero_habitacion"`
	TipoHabitacion   string           `json:"tipo_habitacion" bson:"tipo_habitacion"`
	PrecioPorNoche   float64          `json:"precio_por_noche" bson:"precio_por_noche"`
	Estado           string           `json:"estado" bson:"estado"`
	Descripcion      string           `json:"descripcion" bson:"descripcion"`
}

func (h *Habitacion) GetID() string {
	return h.ID.Hex()
}
