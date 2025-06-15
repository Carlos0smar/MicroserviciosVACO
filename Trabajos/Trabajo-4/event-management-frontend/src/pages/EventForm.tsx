import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventService } from '../services/api';
import { EventFormData, Event } from '../types';

const EventForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<EventFormData>({
    nombre: '',
    // descripcion: '',
    fecha: '',
    lugar: '',
    precio: 0,
    capacidad: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing && id) {
      loadEvent(parseInt(id));
    }
  }, [id, isEditing]);

  const loadEvent = async (eventId: number) => {
    try {
      const event: Event = await eventService.getById(eventId);
      setFormData({
        nombre: event.nombre,
        // descripcion: event.descripcion,
        fecha: new Date(event.fecha).toISOString().slice(0, 16), // Format for datetime-local input
        lugar: event.lugar,
        precio: event.precio,
        capacidad: event.capacidad,
      });
    } catch (err) {
      setError('Error al cargar el evento');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'precio' || name === 'capacidad' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Formatear la fecha como YYYY-MM-DD
      const formattedDate = new Date(formData.fecha).toISOString().slice(0, 10);
      const updatedFormData = { ...formData, fecha: formattedDate };

      if (isEditing && id) {
        await eventService.update(parseInt(id), updatedFormData);
      } else {
        await eventService.create(updatedFormData);
      }

      navigate('/admin/events');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el evento');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/events');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {isEditing ? 'Editar Evento' : 'Crear Nuevo Evento'}
            </h1>

            {error && (
              <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                  Nombre del Evento *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nombre del evento"
                />
              </div>

              {/* <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                  Descripción *
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  required
                  rows={4}
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Descripción del evento"
                />
              </div> */}

              <div>
                <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
                  Fecha y Hora *
                </label>
                <input
                  type="datetime-local"
                  id="fecha"
                  name="fecha"
                  required
                  value={formData.fecha}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="lugar" className="block text-sm font-medium text-gray-700">
                  Lugar *
                </label>
                <input
                  type="text"
                  id="lugar"
                  name="lugar"
                  required
                  value={formData.lugar}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Lugar del evento"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
                    Precio (€) *
                  </label>
                  <input
                    type="number"
                    id="precio"
                    name="precio"
                    required
                    min="0"
                    step="0.01"
                    value={formData.precio}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="capacidad" className="block text-sm font-medium text-gray-700">
                    Capacidad *
                  </label>
                  <input
                    type="number"
                    id="capacidad"
                    name="capacidad"
                    required
                    min="1"
                    value={formData.capacidad}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Número máximo de asistentes"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading 
                    ? (isEditing ? 'Actualizando...' : 'Creando...') 
                    : (isEditing ? 'Actualizar Evento' : 'Crear Evento')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventForm;