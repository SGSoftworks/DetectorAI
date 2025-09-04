/**
 * Componente Principal de la Aplicación
 * Sistema de Detección de Contenido Generado por IA
 * Versión: 2.0.0
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Image, 
  Video, 
  File, 
  Shield, 
  Settings, 
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import TextAnalysis from './components/TextAnalysis.jsx';
import { validateAPIConfig } from './config/api.js';
import securityService from './services/securityService.js';

const App = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);
  const [securityStatus, setSecurityStatus] = useState(null);

  useEffect(() => {
    // Validar configuración de APIs
    const configValidation = validateAPIConfig();
    setApiStatus(configValidation);

    // Obtener estado de seguridad
    const security = securityService.getSecurityStatus();
    setSecurityStatus(security);
  }, []);

  const tabs = [
    {
      id: 'text',
      name: 'Análisis de Texto',
      icon: FileText,
      description: 'Analiza textos, artículos y documentos escritos'
    },
    {
      id: 'image',
      name: 'Análisis de Imagen',
      icon: Image,
      description: 'Detecta si una imagen fue generada por IA',
      disabled: true
    },
    {
      id: 'video',
      name: 'Análisis de Video',
      icon: Video,
      description: 'Analiza videos para detectar contenido generado por IA',
      disabled: true
    },
    {
      id: 'document',
      name: 'Análisis de Documento',
      icon: File,
      description: 'Analiza documentos PDF, Word y otros formatos',
      disabled: true
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'text':
        return <TextAnalysis />;
      case 'image':
        return (
          <div className="text-center py-12">
            <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Análisis de Imagen
            </h3>
            <p className="text-gray-600">
              Esta funcionalidad estará disponible próximamente.
            </p>
          </div>
        );
      case 'video':
        return (
          <div className="text-center py-12">
            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Análisis de Video
            </h3>
            <p className="text-gray-600">
              Esta funcionalidad estará disponible próximamente.
            </p>
          </div>
        );
      case 'document':
        return (
          <div className="text-center py-12">
            <File className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Análisis de Documento
            </h3>
            <p className="text-gray-600">
              Esta funcionalidad estará disponible próximamente.
            </p>
          </div>
        );
      default:
        return <TextAnalysis />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Detector de IA
                </h1>
                <p className="text-sm text-gray-600">
                  Sistema de Análisis de Contenido
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    disabled={tab.disabled}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : tab.disabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMenuOpen(false);
                    }}
                    disabled={tab.disabled}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : tab.disabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <div className="text-left">
                      <div>{tab.name}</div>
                      <div className="text-xs opacity-75">{tab.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* API Status Banner */}
      {apiStatus && !apiStatus.isValid && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                Configuración de API incompleta
              </span>
            </div>
            <div className="mt-1 text-sm text-yellow-700">
              {apiStatus.errors.map((error, idx) => (
                <div key={idx}>• {error}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Sistema de Detección de IA
              </h3>
              <p className="text-sm text-gray-600">
                Herramienta avanzada para detectar contenido generado por inteligencia artificial
                utilizando múltiples técnicas de análisis y verificación.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Privacidad y Seguridad
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Datos anonimizados</div>
                <div>• Cumplimiento GDPR</div>
                <div>• Retención limitada</div>
                <div>• Encriptación segura</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Estado del Sistema
              </h3>
              <div className="space-y-2 text-sm">
                {securityStatus && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Consentimiento:</span>
                      <span className={securityStatus.consentGiven ? 'text-green-600' : 'text-red-600'}>
                        {securityStatus.consentGiven ? 'Otorgado' : 'Pendiente'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Retención:</span>
                      <span className="text-gray-600">{securityStatus.dataRetentionDays} días</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-600">
                © 2024 Sistema de Detección de IA. Todos los derechos reservados.
              </p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <a href="/privacy-policy" className="text-sm text-blue-600 hover:underline">
                  Política de Privacidad
                </a>
                <a href="/terms-of-service" className="text-sm text-blue-600 hover:underline">
                  Términos de Servicio
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;