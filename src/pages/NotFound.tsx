import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  ArrowLeft, 
  Search,
  FileText,
  Image,
  Video,
  File
} from 'lucide-react';

const NotFound: React.FC = () => {
  const quickLinks = [
    { name: 'Análisis de Texto', href: '/text', icon: FileText },
    { name: 'Análisis de Imagen', href: '/image', icon: Image },
    { name: 'Análisis de Video', href: '/video', icon: Video },
    { name: 'Análisis de Documento', href: '/document', icon: File },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-primary-600 mb-4">404</div>
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-primary-600" />
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Página no encontrada
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
            <p className="text-gray-500">
              Pero no te preocupes, aquí tienes algunas opciones para continuar:
            </p>
          </div>

          {/* Quick Links */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Servicios Disponibles
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-primary-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/"
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Ir al Inicio</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver Atrás</span>
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              Si crees que esto es un error, por favor{' '}
              <a 
                href="mailto:support@detectorai.com" 
                className="font-medium text-blue-900 hover:text-blue-700 underline"
              >
                contáctanos
              </a>
              {' '}y te ayudaremos a encontrar lo que buscas.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
