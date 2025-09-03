import React, { useState } from "react";
import {
  Lock,
  Shield,
  Eye,
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const Privacy = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", name: "Resumen", icon: Eye },
    { id: "data-collection", name: "Recopilación de Datos", icon: Shield },
    { id: "data-usage", name: "Uso de Datos", icon: CheckCircle },
    { id: "data-protection", name: "Protección de Datos", icon: Lock },
    { id: "user-rights", name: "Derechos del Usuario", icon: Download },
    { id: "cookies", name: "Cookies y Tecnologías", icon: AlertTriangle },
    { id: "contact", name: "Contacto", icon: Lock },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Resumen de Privacidad
              </h3>
              <p className="text-blue-800">
                El Detector de Contenido IA está comprometido con la protección
                de tu privacidad. Esta política explica cómo recopilamos, usamos
                y protegemos tu información personal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">
                  Datos Seguros
                </h4>
                <p className="text-gray-600 text-sm">
                  Encriptamos todos los datos y no los compartimos con terceros
                </p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <Eye className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">
                  Transparencia
                </h4>
                <p className="text-gray-600 text-sm">
                  Te informamos exactamente qué datos recopilamos y por qué
                </p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <Trash2 className="w-12 h-12 text-red-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">
                  Control Total
                </h4>
                <p className="text-gray-600 text-sm">
                  Puedes eliminar tus datos en cualquier momento
                </p>
              </div>
            </div>
          </div>
        );

      case "data-collection":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              ¿Qué Datos Recopilamos?
            </h3>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Contenido para Análisis
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Textos que envías para análisis</li>
                  <li>Imágenes que subes para verificación</li>
                  <li>Videos que analizas</li>
                  <li>Documentos que procesas</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Importante:</strong> Este contenido se procesa
                  temporalmente y no se almacena permanentemente.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Datos de Uso
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Fecha y hora de los análisis</li>
                  <li>Tipo de contenido analizado</li>
                  <li>Resultados de los análisis</li>
                  <li>Configuración de preferencias</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Datos Técnicos
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Dirección IP (anonimizada)</li>
                  <li>Tipo de navegador y dispositivo</li>
                  <li>Sistema operativo</li>
                  <li>Información de rendimiento</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "data-usage":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              ¿Cómo Usamos tus Datos?
            </h3>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Proporcionar el Servicio
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Analizar contenido para detectar IA</li>
                  <li>Generar reportes de análisis</li>
                  <li>Mejorar la precisión del sistema</li>
                  <li>Proporcionar soporte técnico</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Mejora del Sistema
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Optimizar algoritmos de detección</li>
                  <li>Identificar patrones de uso</li>
                  <li>Desarrollar nuevas funcionalidades</li>
                  <li>Resolver problemas técnicos</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Comunicación
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Notificaciones sobre el servicio</li>
                  <li>Actualizaciones de seguridad</li>
                  <li>Respuestas a consultas de soporte</li>
                  <li>Información sobre nuevas funciones</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "data-protection":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              ¿Cómo Protegemos tus Datos?
            </h3>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Encriptación
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Datos en tránsito: TLS 1.3</li>
                  <li>Datos en reposo: AES-256</li>
                  <li>Comunicaciones API: HTTPS</li>
                  <li>Almacenamiento seguro en la nube</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Acceso Controlado
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Autenticación de dos factores</li>
                  <li>Acceso basado en roles</li>
                  <li>Auditoría de accesos</li>
                  <li>Monitoreo de seguridad 24/7</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Cumplimiento Legal
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>GDPR (Reglamento General de Protección de Datos)</li>
                  <li>CCPA (Ley de Privacidad del Consumidor de California)</li>
                  <li>Leyes de protección de datos locales</li>
                  <li>Auditorías de seguridad regulares</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "user-rights":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              Tus Derechos como Usuario
            </h3>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Derecho de Acceso
                </h4>
                <p className="text-gray-700 mb-2">
                  Puedes solicitar una copia de todos los datos personales que
                  tenemos sobre ti.
                </p>
                <button className="btn-secondary text-sm">
                  <Download className="w-4 h-4 mr-2" />
                  Solicitar Datos
                </button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Derecho de Rectificación
                </h4>
                <p className="text-gray-700 mb-2">
                  Puedes corregir o actualizar cualquier información personal
                  incorrecta.
                </p>
                <button className="btn-secondary text-sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver y Editar Datos
                </button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Derecho de Eliminación
                </h4>
                <p className="text-gray-700 mb-2">
                  Puedes solicitar la eliminación completa de todos tus datos
                  personales.
                </p>
                <button className="btn-secondary text-sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar Datos
                </button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Derecho de Portabilidad
                </h4>
                <p className="text-gray-700 mb-2">
                  Puedes recibir tus datos en un formato estructurado y legible
                  por máquina.
                </p>
                <button className="btn-secondary text-sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Datos
                </button>
              </div>
            </div>
          </div>
        );

      case "cookies":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              Cookies y Tecnologías de Seguimiento
            </h3>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Cookies Esenciales
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Autenticación de sesión</li>
                  <li>Preferencias de usuario</li>
                  <li>Seguridad del sistema</li>
                  <li>Funcionalidad básica</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  Estas cookies son necesarias para el funcionamiento del
                  servicio.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Cookies Analíticas
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Estadísticas de uso</li>
                  <li>Rendimiento del sistema</li>
                  <li>Mejoras de funcionalidad</li>
                  <li>Experiencia del usuario</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  Puedes desactivar estas cookies en cualquier momento.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Tecnologías de Seguimiento
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>No utilizamos seguimiento de terceros</li>
                  <li>No compartimos datos con redes publicitarias</li>
                  <li>No rastreamos comportamiento entre sitios</li>
                  <li>Respetamos la configuración "Do Not Track"</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              Contacto y Soporte
            </h3>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Oficial de Protección de Datos
                </h4>
                <p className="text-gray-700 mb-2">
                  Para cualquier consulta relacionada con la privacidad y
                  protección de datos:
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Email:</strong> privacidad@detectoria.com
                  </p>
                  <p>
                    <strong>Teléfono:</strong> +57 1 234 5678
                  </p>
                  <p>
                    <strong>Dirección:</strong> Calle 123 #45-67, Bogotá,
                    Colombia
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Soporte Técnico
                </h4>
                <p className="text-gray-700 mb-2">
                  Para problemas técnicos o consultas sobre el servicio:
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Email:</strong> soporte@detectoria.com
                  </p>
                  <p>
                    <strong>Chat en vivo:</strong> Disponible 24/7
                  </p>
                  <p>
                    <strong>Base de conocimientos:</strong> ayuda.detectoria.com
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Reportar Violaciones
                </h4>
                <p className="text-gray-700 mb-2">
                  Si sospechas una violación de privacidad o seguridad:
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Email de emergencia:</strong>{" "}
                    seguridad@detectoria.com
                  </p>
                  <p>
                    <strong>Línea directa:</strong> +57 1 234 5679
                  </p>
                  <p>
                    <strong>Respuesta:</strong> En menos de 24 horas
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Lock className="w-12 h-12 text-primary-600 mr-4" />
          <h1 className="text-4xl font-bold text-gray-900">
            Política de Privacidad
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Tu privacidad es importante para nosotros. Conoce cómo protegemos y
          manejamos tu información personal.
        </p>
      </div>

      {/* Navigation */}
      <div className="card">
        <nav className="flex flex-wrap gap-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeSection === section.id
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {section.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="card">{renderContent()}</div>

      {/* Footer */}
      <div className="card bg-gray-50 border-gray-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ¿Tienes Preguntas sobre Privacidad?
          </h3>
          <p className="text-gray-600 mb-4">
            Nuestro equipo está aquí para ayudarte con cualquier consulta sobre
            privacidad y protección de datos.
          </p>
          <button className="btn-primary">Contactar Soporte</button>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
