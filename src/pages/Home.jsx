import React from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Image,
  Video,
  File,
  BarChart3,
  Shield,
  Zap,
  Users,
  Globe,
  Search,
  Brain,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: FileText,
      title: "Análisis de Texto",
      description:
        "Detecta contenido generado por IA en textos, artículos y trabajos académicos con precisión superior al 95%",
      href: "/texto",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      hoverColor: "hover:border-blue-300",
    },
    {
      icon: Image,
      title: "Análisis de Imagen",
      description:
        "Identifica imágenes generadas o manipuladas por inteligencia artificial usando análisis avanzado de píxeles",
      href: "/imagen",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      hoverColor: "hover:border-green-300",
    },
    {
      icon: Video,
      title: "Análisis de Video",
      description:
        "Detecta videos deepfake y contenido audiovisual generado por IA mediante análisis de frames y audio",
      href: "/video",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      hoverColor: "hover:border-purple-300",
    },
    {
      icon: File,
      title: "Análisis de Documentos",
      description:
        "Analiza archivos PDF, Word y otros formatos para detectar contenido IA con tecnología OCR avanzada",
      href: "/documento",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      hoverColor: "hover:border-orange-300",
    },
    {
      icon: Search,
      title: "Verificación de Contenido",
      description:
        "Verifica la autenticidad y originalidad del contenido mediante búsquedas web y análisis de fuentes",
      href: "/content-verification",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      hoverColor: "hover:border-indigo-300",
    },
    {
      icon: Brain,
      title: "Entrenamiento del Modelo",
      description:
        "Gestiona y mejora el modelo de detección de IA con aprendizaje continuo y actualizaciones automáticas",
      href: "/model-training",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      hoverColor: "hover:border-pink-300",
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Seguridad Garantizada",
      description:
        "Protección completa de datos con encriptación AES-256 y cumplimiento GDPR/CCPA",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Zap,
      title: "Análisis Rápido",
      description:
        "Resultados en segundos con tecnología de última generación y procesamiento paralelo",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Users,
      title: "Fácil de Usar",
      description:
        "Interfaz intuitiva diseñada para usuarios de todos los niveles con guías paso a paso",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Globe,
      title: "Acceso Global",
      description:
        "Disponible en cualquier dispositivo con conexión a internet y sincronización en la nube",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  const stats = [
    {
      value: "99.2%",
      label: "Precisión en Detección",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      value: "<2s",
      label: "Tiempo de Respuesta",
      icon: Zap,
      color: "text-blue-600",
    },
    {
      value: "50+",
      label: "Formatos Soportados",
      icon: File,
      color: "text-purple-600",
    },
    {
      value: "24/7",
      label: "Disponibilidad",
      icon: Globe,
      color: "text-indigo-600",
    },
  ];

  return (
    <div className="space-section">
      {/* Hero Section mejorado */}
      <div className="text-center py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-6 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-responsive-xl font-bold text-gray-900 mb-6 leading-tight">
              Detecta Contenido Generado por
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Inteligencia Artificial
              </span>
            </h1>
            <p className="text-responsive-md text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Sistema avanzado que utiliza las últimas tecnologías de IA para
              identificar contenido generado artificialmente en textos,
              imágenes, videos y documentos con precisión sin precedentes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/texto" className="btn-primary group">
              Comenzar Análisis
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/about" className="btn-outline">
              Conoce Más
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid mejorado */}
      <div className="container-responsive">
        <div className="text-center mb-16">
          <h2 className="text-responsive-lg font-bold text-gray-900 mb-4">
            Funcionalidades Principales
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Herramientas avanzadas para detectar y verificar la autenticidad de
            cualquier tipo de contenido
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                to={feature.href}
                className="group block"
              >
                <div
                  className={`p-8 rounded-2xl border-2 border-transparent transition-all duration-300 ${feature.bgColor} group-hover:border-gray-200 group-hover:bg-white group-hover:shadow-lg hover-lift`}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="mt-6 flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                    <span>Explorar</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Benefits Section mejorado */}
      <div className="container-responsive">
        <div className="bg-white rounded-3xl shadow-soft border border-gray-200 p-12">
          <div className="text-center mb-16">
            <h2 className="text-responsive-lg font-bold text-gray-900 mb-4">
              ¿Por qué elegir nuestro detector?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tecnología de vanguardia combinada con facilidad de uso para
              resultados confiables
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="text-center group">
                  <div
                    className={`w-20 h-20 ${benefit.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-10 h-10 ${benefit.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section mejorado */}
      <div className="container-responsive">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <div className="text-center mb-12">
            <h2 className="text-responsive-lg font-bold mb-4">
              Estadísticas del Sistema
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Números que respaldan nuestra tecnología y confiabilidad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold mb-2 flex items-center justify-center">
                    <Icon className={`w-8 h-8 ${stat.color} mr-2`} />
                    {stat.value}
                  </div>
                  <div className="text-blue-100 text-lg">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section mejorado */}
      <section className="py-16 lg:py-20">
        <div className="container-responsive">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 lg:p-16 text-center text-white shadow-2xl">
            <h2 className="text-responsive-lg font-bold mb-6">
              ¿Listo para comenzar?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Únete a miles de usuarios que ya confían en nuestro sistema para
              detectar contenido generado por inteligencia artificial
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/texto"
                className="btn-primary bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Comenzar Ahora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/dashboard"
                className="btn-outline border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
              >
                Ver Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
