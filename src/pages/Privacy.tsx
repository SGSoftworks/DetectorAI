import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Eye, 
  Trash2, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Info,
  FileText,
  Database,
  Globe,
  User
} from 'lucide-react';

const Privacy: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Resumen', icon: Info },
    { id: 'data-collection', title: 'Recopilación de Datos', icon: Database },
    { id: 'data-usage', title: 'Uso de Datos', icon: FileText },
    { id: 'data-sharing', title: 'Compartir Datos', icon: Globe },
    { id: 'data-retention', title: 'Retención de Datos', icon: Lock },
    { id: 'user-rights', title: 'Derechos del Usuario', icon: User },
    { id: 'security', title: 'Seguridad', icon: Shield },
    { id: 'contact', title: 'Contacto', icon: Info }
  ];

  const privacyData = {
    overview: {
      title: 'Política de Privacidad',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Info className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Compromiso con tu Privacidad
                </h3>
                <p className="text-blue-800">
                  En DetectorAI, valoramos profundamente tu privacidad y nos comprometemos a proteger 
                  tus datos personales. Esta política explica cómo recopilamos, usamos y protegemos 
                  tu información cuando utilizas nuestro servicio.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
              <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Datos Protegidos</h3>
              <p className="text-gray-600 text-sm">
                Encriptamos todos los datos y no los compartimos con terceros
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
              <Trash2 className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Eliminación Fácil</h3>
              <p className="text-gray-600 text-sm">
                Puedes solicitar la eliminación de tus datos en cualquier momento
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
              <Eye className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Transparencia Total</h3>
              <p className="text-gray-600 text-sm">
                Te informamos exactamente qué datos recopilamos y por qué
              </p>
            </div>
          </div>
        </div>
      )
    },
    'data-collection': {
      title: 'Recopilación de Datos',
      content: (
        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  Datos que Recopilamos
                </h3>
                <p className="text-yellow-800">
                  Solo recopilamos los datos mínimos necesarios para proporcionar nuestro servicio.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FileText className="w-5 h-5 text-primary-600 mr-2" />
                Contenido Analizado
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Textos, imágenes y videos que subes para análisis</li>
                <li>• Metadatos básicos (tamaño, tipo de archivo, fecha)</li>
                <li>• Resultados del análisis (clasificación, confianza, factores)</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <User className="w-5 h-5 text-primary-600 mr-2" />
                Información de Uso
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Dirección IP (anonimizada)</li>
                <li>• Navegador y sistema operativo</li>
                <li>• Tiempo de uso y páginas visitadas</li>
                <li>• Errores y logs del sistema</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Database className="w-5 h-5 text-primary-600 mr-2" />
                Datos Opcionales
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Email (solo si te registras)</li>
                <li>• Preferencias de configuración</li>
                <li>• Feedback y comentarios</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    'data-usage': {
      title: 'Uso de Datos',
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Uso Legítimo
                </h3>
                <p className="text-green-800">
                  Utilizamos tus datos únicamente para los propósitos especificados y 
                  nunca para actividades no relacionadas con nuestro servicio.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Propósitos Principales</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Proporcionar análisis de contenido usando algoritmos de IA</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Mejorar la precisión y eficiencia de nuestros modelos</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Mantener y mejorar la seguridad del sistema</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Proporcionar soporte técnico y atención al cliente</span>
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Propósitos Secundarios</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Generar estadísticas anónimas de uso</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Investigar y desarrollar nuevas funcionalidades</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Cumplir con obligaciones legales y regulatorias</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    'data-sharing': {
      title: 'Compartir Datos',
      content: (
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Lock className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  No Vendemos tus Datos
                </h3>
                <p className="text-red-800">
                  Nunca vendemos, alquilamos o comercializamos tus datos personales a terceros.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Compartir Limitado</h4>
              <p className="text-gray-700 mb-4">
                Solo compartimos datos en las siguientes circunstancias específicas:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Con proveedores de servicios que nos ayudan a operar (Google, Hugging Face)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Cuando sea requerido por ley o autoridades competentes</span>
                </li>
                <li className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Para proteger nuestros derechos legales o la seguridad de nuestros usuarios</span>
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Proveedores de Servicios</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Google Gemini API</span>
                  <span className="text-sm text-gray-600">Análisis de texto</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Hugging Face</span>
                  <span className="text-sm text-gray-600">Modelos de IA</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Firebase</span>
                  <span className="text-sm text-gray-600">Base de datos</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Vercel</span>
                  <span className="text-sm text-gray-600">Hosting</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    'data-retention': {
      title: 'Retención de Datos',
      content: (
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Lock className="w-6 h-6 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  Política de Retención
                </h3>
                <p className="text-purple-800">
                  Mantenemos tus datos solo durante el tiempo necesario para cumplir 
                  con los propósitos especificados.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Períodos de Retención</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h5 className="font-medium text-gray-900">Contenido Analizado</h5>
                    <p className="text-sm text-gray-600">Textos, imágenes y videos</p>
                  </div>
                  <span className="font-semibold text-primary-600">30 días</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h5 className="font-medium text-gray-900">Resultados de Análisis</h5>
                    <p className="text-sm text-gray-600">Clasificaciones y métricas</p>
                  </div>
                  <span className="font-semibold text-primary-600">90 días</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h5 className="font-medium text-gray-900">Datos de Uso</h5>
                    <p className="text-sm text-gray-600">Logs y estadísticas</p>
                  </div>
                  <span className="font-semibold text-primary-600">1 año</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h5 className="font-medium text-gray-900">Datos de Usuario</h5>
                    <p className="text-sm text-gray-600">Perfil y preferencias</p>
                  </div>
                  <span className="font-semibold text-primary-600">Hasta eliminación</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Eliminación Automática</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Los datos se eliminan automáticamente después del período de retención</li>
                <li>• Puedes solicitar eliminación inmediata en cualquier momento</li>
                <li>• Los backups se eliminan en un plazo máximo de 30 días adicionales</li>
                <li>• Los datos anonimizados pueden conservarse para investigación</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    'user-rights': {
      title: 'Derechos del Usuario',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <User className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Tus Derechos
                </h3>
                <p className="text-blue-800">
                  Tienes control total sobre tus datos personales. Aquí están tus derechos 
                  según las leyes de protección de datos.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Eye className="w-5 h-5 text-primary-600 mr-2" />
                Derecho de Acceso
              </h4>
              <p className="text-gray-700 text-sm">
                Puedes solicitar una copia de todos los datos personales que tenemos sobre ti.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Download className="w-5 h-5 text-primary-600 mr-2" />
                Derecho de Portabilidad
              </h4>
              <p className="text-gray-700 text-sm">
                Puedes descargar tus datos en un formato estructurado y legible.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Trash2 className="w-5 h-5 text-primary-600 mr-2" />
                Derecho de Eliminación
              </h4>
              <p className="text-gray-700 text-sm">
                Puedes solicitar la eliminación completa de tus datos personales.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FileText className="w-5 h-5 text-primary-600 mr-2" />
                Derecho de Rectificación
              </h4>
              <p className="text-gray-700 text-sm">
                Puedes corregir o actualizar cualquier dato personal inexacto.
              </p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Cómo Ejercer tus Derechos</h4>
            <div className="space-y-3 text-gray-700">
              <p>Para ejercer cualquiera de estos derechos, puedes:</p>
              <ul className="space-y-2 ml-4">
                <li>• Enviar un email a: privacy@detectorai.com</li>
                <li>• Usar el formulario de contacto en nuestro sitio web</li>
                <li>• Contactarnos a través de nuestras redes sociales</li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                Responderemos a tu solicitud dentro de 30 días hábiles.
              </p>
            </div>
          </div>
        </div>
      )
    },
    'security': {
      title: 'Seguridad',
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Protección de Datos
                </h3>
                <p className="text-green-800">
                  Implementamos múltiples capas de seguridad para proteger tus datos 
                  contra accesos no autorizados, alteraciones o pérdidas.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Medidas de Seguridad</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Encriptación SSL/TLS</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Encriptación de datos en reposo</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Autenticación de dos factores</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Monitoreo de seguridad 24/7</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Copias de seguridad regulares</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Control de acceso basado en roles</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Auditorías de seguridad regulares</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Protección contra ataques DDoS</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Cumplimiento Legal</h4>
              <div className="space-y-3 text-gray-700">
                <p>Cumplimos con las siguientes regulaciones:</p>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>GDPR</strong> (Reglamento General de Protección de Datos de la UE)</li>
                  <li>• <strong>CCPA</strong> (Ley de Privacidad del Consumidor de California)</li>
                  <li>• <strong>Ley 1581 de 2012</strong> (Ley de Protección de Datos de Colombia)</li>
                  <li>• <strong>ISO 27001</strong> (Estándar de Seguridad de la Información)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    'contact': {
      title: 'Contacto',
      content: (
        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Información de Contacto
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Oficial de Protección de Datos</h4>
                <p className="text-gray-700">Email: privacy@detectorai.com</p>
                <p className="text-gray-700">Teléfono: +57 (1) 234-5678</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Soporte Técnico</h4>
                <p className="text-gray-700">Email: support@detectorai.com</p>
                <p className="text-gray-700">Horario: Lunes a Viernes, 9:00 AM - 6:00 PM (COT)</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Dirección</h4>
                <p className="text-gray-700">
                  DetectorAI S.A.S.<br />
                  Carrera 15 #93-47, Oficina 301<br />
                  Bogotá, Colombia
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Actualizaciones de la Política</h4>
            <p className="text-gray-700 mb-4">
              Esta política de privacidad puede actualizarse ocasionalmente. Te notificaremos 
              sobre cambios significativos a través de:
            </p>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li>• Email a la dirección registrada</li>
              <li>• Aviso prominente en nuestro sitio web</li>
              <li>• Notificación en la aplicación</li>
            </ul>
            <p className="text-sm text-gray-600 mt-4">
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </p>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Política de Privacidad
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tu privacidad es importante para nosotros. Conoce cómo protegemos y manejamos tus datos personales.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">Contenido</h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary-50 text-primary-700 border border-primary-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{section.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {privacyData[activeSection as keyof typeof privacyData]?.title}
              </h2>
              <div className="prose prose-gray max-w-none">
                {privacyData[activeSection as keyof typeof privacyData]?.content}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
