import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Target, 
  Users, 
  Shield, 
  Zap, 
  Award,
  CheckCircle,
  ArrowRight,
  Mail
} from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'Tecnología Avanzada',
      description: 'Utilizamos los modelos de IA más avanzados para detectar contenido generado artificialmente'
    },
    {
      icon: Target,
      title: 'Alta Precisión',
      description: 'Nuestros algoritmos alcanzan más del 85% de precisión en la detección de contenido IA'
    },
    {
      icon: Shield,
      title: 'Privacidad Garantizada',
      description: 'Protegemos tus datos con encriptación de grado militar y políticas de privacidad estrictas'
    },
    {
      icon: Zap,
      title: 'Análisis Rápido',
      description: 'Obtén resultados en segundos con nuestra infraestructura optimizada'
    }
  ];

  const team = [
    {
      name: 'Iván Jair Mendoza Solano',
      role: 'Desarrollador Principal',
      email: 'imendozaso@uninpahu.edu.co',
      description: 'Especialista en inteligencia artificial y procesamiento de lenguaje natural'
    },
    {
      name: 'Juan David Gómez Ruidiaz',
      role: 'Desarrollador Principal',
      email: 'Jgomezru@uninpahu.edu.co',
      description: 'Experto en desarrollo web y arquitectura de sistemas'
    }
  ];

  const technologies = [
    { name: 'React', description: 'Frontend moderno y reactivo' },
    { name: 'TypeScript', description: 'Tipado estático para mayor confiabilidad' },
    { name: 'TailwindCSS', description: 'Diseño responsivo y moderno' },
    { name: 'Firebase', description: 'Backend como servicio escalable' },
    { name: 'Google Gemini', description: 'Modelo de IA para análisis de texto' },
    { name: 'Hugging Face', description: 'Modelos de IA especializados' },
    { name: 'Vercel', description: 'Despliegue y hosting optimizado' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center">
                  <Brain className="w-10 h-10" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Acerca de DetectorAI
              </h1>
              <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-4xl mx-auto">
                Un sistema innovador desarrollado para combatir la desinformación 
                mediante la detección de contenido generado por inteligencia artificial
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nuestra Misión
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                En un mundo donde la desinformación se propaga rápidamente, 
                DetectorAI se compromete a proporcionar herramientas confiables 
                para identificar contenido generado por IA y proteger la integridad 
                de la información digital.
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

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Nuestra Historia
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  DetectorAI nació como un proyecto de investigación en la 
                  <strong> Fundación Universitaria para el Desarrollo Humano UNINPAHU</strong>, 
                  específicamente en el programa de Ingeniería de Software.
                </p>
                <p>
                  Ante el creciente problema de la desinformación y las noticias falsas, 
                  especialmente en el contexto colombiano, decidimos desarrollar una 
                  solución tecnológica que pudiera ayudar a identificar contenido 
                  generado por inteligencia artificial.
                </p>
                <p>
                  Nuestro proyecto se basa en el anteproyecto "Sistema Basado en 
                  Inteligencia Artificial para la Detección de Noticias Falsas", 
                  pero lo hemos expandido para ser una herramienta generalista que 
                  puede analizar cualquier tipo de contenido.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Información del Proyecto
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">Institución</p>
                    <p className="text-gray-600">UNINPAHU - Facultad de Ingeniería</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">Programa</p>
                    <p className="text-gray-600">Ingeniería de Software</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">Asignatura</p>
                    <p className="text-gray-600">Anteproyecto NT 1256</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">Docente</p>
                    <p className="text-gray-600">Martha Cecilia Vidal Arizabaleta</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nuestro Equipo
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Desarrolladores apasionados por la tecnología y comprometidos 
                con la lucha contra la desinformación
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-8 text-center"
              >
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 mb-4">
                  {member.description}
                </p>
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contactar</span>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Tecnologías Utilizadas
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Construido con las mejores tecnologías disponibles para 
                garantizar rendimiento, seguridad y escalabilidad
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-success-500" />
                  <h3 className="font-semibold text-gray-900">{tech.name}</h3>
                </div>
                <p className="text-gray-600 text-sm">{tech.description}</p>
              </motion.div>
            ))}
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
              Únete a la lucha contra la desinformación y ayuda a crear 
              un ecosistema digital más confiable
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/text"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Probar DetectorAI</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/privacy"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Shield className="w-5 h-5" />
                <span>Política de Privacidad</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
