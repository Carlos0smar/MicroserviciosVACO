import React, { useState, useEffect } from 'react';
import { eventService, purchaseService } from '../services/api';
import { Event } from '../types';

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await eventService.getAll();
      console.log('Respuesta del backend para eventos:', data);

      if (Array.isArray(data)) {
        setEvents(data);
        // Inicializar cantidades en 1 para cada evento
        const initialQuantities: { [key: number]: number } = {};
        data.forEach(event => {
          initialQuantities[event.id] = 1;
        });
        setQuantities(initialQuantities);
      } else {
        setError('La respuesta del servidor no es válida.');
      }
    } catch (err) {
      setError('Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (eventId: number, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [eventId]: Math.max(1, Math.min(quantity, events.find(e => e.id === eventId)?.disponibles || 1))
    }));
  };

  const handlePurchase = async (eventId: number) => {
    setPurchaseLoading(eventId);
    setMessage('');
    setError('');

    try {
      await purchaseService.create({
        id_evento: eventId,
        cantidad: quantities[eventId] || 1,
      });
      setMessage('¡Compra realizada exitosamente!');
      // Recargar eventos para actualizar disponibilidad
      loadEvents();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al realizar la compra');
    } finally {
      setPurchaseLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Eventos Disponibles
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Descubre y compra entradas para los mejores eventos
          </p>
        </div>

        {message && (
          <div className="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded max-w-2xl mx-auto">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl mx-auto">
            {error}
          </div>
        )}

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                  {event.nombre}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {event.descripcion}
                </p>
                
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <span className="font-medium">Fecha:</span>
                    <span className="ml-2">{formatDate(event.fecha)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Lugar:</span>
                    <span className="ml-2">{event.lugar}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Precio:</span>
                    <span className="ml-2 text-lg font-bold text-green-600">
                      {formatPrice(event.precio)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Disponibles:</span>
                    <span className="ml-2">
                      {event.disponibles} / {event.capacidad}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <label htmlFor={`quantity-${event.id}`} className="text-sm font-medium text-gray-700">
                      Cantidad:
                    </label>
                    <input
                      id={`quantity-${event.id}`}
                      type="number"
                      min="1"
                      max={event.disponibles}
                      value={quantities[event.id] || 1}
                      onChange={(e) => handleQuantityChange(event.id, parseInt(e.target.value))}
                      className="block w-20 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Total: {formatPrice(event.precio * (quantities[event.id] || 1))}
                  </div>

                  <button
                    onClick={() => handlePurchase(event.id)}
                    disabled={purchaseLoading === event.id}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {purchaseLoading === event.id ? 'Comprando...' : 'Comprar Entradas'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-xl text-gray-500">No hay eventos disponibles en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;