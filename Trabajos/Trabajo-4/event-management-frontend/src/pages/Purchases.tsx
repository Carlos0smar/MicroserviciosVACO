import React, { useState, useEffect } from 'react';
import { purchaseService } from '../services/api';
import { Purchase } from '../types';

const Purchases: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      const data = await purchaseService.getAll();
      setPurchases(data);
    } catch (err) {
      setError('Error al cargar las compras');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (eventoId: number) => {
    setPaymentLoading(eventoId);
    setMessage('');
    setError('');

    try {
      await purchaseService.pay(eventoId);
      setMessage('¡Pago procesado exitosamente!');
      loadPurchases(); // Recargar para actualizar el estado
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al procesar el pago');
    } finally {
      setPaymentLoading(null);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'pagado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'Pendiente';
      case 'pagado':
        return 'Pagado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
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
            Mis Compras
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Historial de todas tus compras de entradas
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

        <div className="mt-8">
          {purchases.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {purchases.map((purchase) => (
                  <li key={purchase.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-medium text-blue-600 truncate">
                              {purchase.evento?.nombre || `Evento #${purchase.id_evento}`}
                            </p>
                            <div className="ml-2 flex-shrink-0">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(purchase.estado)}`}>
                                {getStatusText(purchase.estado)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                Cantidad: {purchase.cantidad} entrada(s)
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                Fecha de compra: {formatDate(purchase.fecha_compra)}
                              </p>
                            </div>
                            
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <p className="text-lg font-bold text-green-600">
                                {formatPrice(purchase.precio_total)}
                              </p>
                            </div>
                          </div>

                          {purchase.evento && (
                            <div className="mt-2 text-sm text-gray-600">
                              <p><strong>Descripción:</strong> {purchase.evento.descripcion}</p>
                              <p><strong>Fecha del evento:</strong> {formatDate(purchase.evento.fecha)}</p>
                              <p><strong>Lugar:</strong> {purchase.evento.lugar}</p>
                            </div>
                          )}

                          {purchase.estado === 'pendiente' && (
                            <div className="mt-4">
                              <button
                                onClick={() => handlePayment(purchase.id_evento)}
                                disabled={paymentLoading === purchase.id_evento}
                                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {paymentLoading === purchase.id_evento ? 'Procesando...' : 'Pagar Ahora'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay compras</h3>
              <p className="mt-1 text-sm text-gray-500">
                Todavía no has realizado ninguna compra de entradas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Purchases;