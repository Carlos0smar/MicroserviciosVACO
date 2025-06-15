import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            EventManager
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/events" 
                  className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Eventos
                </Link>
                
                <Link 
                  to="/purchases" 
                  className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Mis Compras
                </Link>

                {isAdmin && (
                  <Link 
                    to="/admin/events" 
                    className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Administrar Eventos
                  </Link>
                )}

                <div className="flex items-center space-x-2">
                  <span className="text-sm">
                    Hola, {user?.username} ({user?.role})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="bg-green-500 hover:bg-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;