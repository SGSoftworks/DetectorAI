import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Image, 
  Video, 
  File, 
  BarChart3, 
  Shield, 
  Zap, 
  Target, 
  Users,
  CheckCircle,
  ArrowRight,
  Brain,
  Search,
  Lock
} from 'lucide-react';

const Home: React.FC = () => {
  const services = [
    {
      icon: FileText,
      title: 'Análisis de Texto',
      description: 'Detecta si textos, artículos o documentos fueron generados por IA',
      href: '/text',
      features: ['Análisis de patrones lingüísticos', 'Detección de repeticiones', 'Evaluación de coherencia']
    },
    {
      icon: Image,
      title: 'Análisis de Imagen',
      description: 'Identifica imágenes generadas por IA o manipuladas digitalmente',
      href: '/image',
      features: ['Detección de deepfakes', 'Análisis de metadatos', 'Evaluación de consistencia']
    },
    {
      icon: Video,
      title: 'Análisis de Video',
      description: 'Analiza videos para detectar contenido generado o manipulado',
      href: '/video',
      features: ['Detección de deepfakes', 'Análisis de frames', 'Evaluación temporal']
    },
    {
      icon: File,
      title: 'Análisis de Documento',
      description: 'Analiza documentos completos con texto e imágenes integradas',
      href: '/document',
      features: ['Análisis multimodal', 'Extracción de texto', 'Evaluación integral']
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Análisis Rápido',
      description: 'Resultados en segundos con tecnología de vanguardia'
    },
    {
      icon: Target,
      title: 'Alta Precisión',
      description: 'Algoritmos avanzados con más del 85% de precisión'
    },
    {
      icon: Shield,
      title: 'Privacidad Garantizada',
      description: 'Tus datos están protegidos y no se almacenan permanentemente'
    },
    {
      icon: Users,
      title: 'Fácil de Usar',
      description: 'Interfaz intuitiva para usuarios de todos los niveles'
    }
  ];

  const stats = [
    { label: 'Análisis Realizados', value: '10,000+' },
    { label: 'Precisión Promedio', value: '87%' },
    { label: 'Tipos de Contenido', value: '4' },
    { label: 'Usuarios Activos', value: '2,500+' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                  <Brain className="w-8 h-8" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                DetectorAI
              </h1>
              <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
                Sistema avanzado de detección de contenido generado por inteligencia artificial
              </p>
              <p className="text-lg text-primary-200 mb-12 max-w-2xl mx-auto">
                Analiza textos, imágenes y videos para determinar si fueron creados por humanos o IA. 
                Combate la desinformación con tecnología de vanguardia.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/text"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Analizar Contenido</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/dashboard"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors flex items-center justify-center space-x-2"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Ver Estadísticas</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nuestros Servicios
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Analiza diferentes tipos de contenido con nuestras herramientas especializadas
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 text-success-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={service.href}
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Analizar</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                ¿Por qué elegir DetectorAI?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Tecnología avanzada, privacidad garantizada y resultados confiables
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Listo para empezar?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Únete a miles de usuarios que ya están usando DetectorAI para combatir la desinformación
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/text"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Analizar Ahora</span>
              </Link>
              <Link
                to="/privacy"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Lock className="w-5 h-5" />
                <span>Política de Privacidad</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
