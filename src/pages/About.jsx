import React from "react";
import {
  Info,
  Users,
  Code,
  Shield,
  Globe,
  Award,
  BookOpen,
  Github,
} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Shield,
      title: "Detección Avanzada",
      description:
        "Utilizamos múltiples modelos de IA para detectar contenido generado artificialmente con alta precisión",
    },
    {
      icon: Code,
      title: "Tecnología de Vanguardia",
      description:
        "Implementamos las últimas tecnologías en procesamiento de lenguaje natural y visión computacional",
    },
    {
      icon: Globe,
      title: "Accesibilidad Global",
      description:
        "Sistema disponible en múltiples idiomas y accesible desde cualquier dispositivo con conexión a internet",
    },
    {
      icon: Users,
      title: "Comunidad Abierta",
      description:
        "Proyecto de código abierto que fomenta la colaboración y mejora continua",
    },
  ];

  const team = [
    {
      name: "Iván Jair Mendoza Solano",
      role: "Desarrollador Full Stack",
      email: "imendozaso@uninpahu.edu.co",
      expertise: ["React", "Node.js", "Machine Learning", "APIs"],
    },
    {
      name: "Juan David Gómez Ruidiaz",
      role: "Desarrollador Backend",
      email: "Jgomezru@uninpahu.edu.co",
      expertise: ["Python", "AI/ML", "Database Design", "System Architecture"],
    },
  ];

  const technologies = [
    {
      category: "Frontend",
      items: ["React 18", "Vite", "Tailwind CSS", "JavaScript ES6+"],
    },
    {
      category: "Backend & APIs",
      items: [
        "Google Gemini API",
        "Hugging Face",
        "Google Custom Search",
        "Axios",
      ],
    },
    {
      category: "Herramientas",
      items: ["Git", "ESLint", "PostCSS", "Lucide React Icons"],
    },
    {
      category: "Despliegue",
      items: ["Vercel", "Netlify", "Environment Variables", "CI/CD"],
    },
  ];

  const roadmap = [
    {
      phase: "Fase 1 - MVP",
      status: "Completado",
      items: [
        "Análisis de texto",
        "Interfaz básica",
        "Integración con Gemini API",
      ],
    },
    {
      phase: "Fase 2 - Expansión",
      status: "En Desarrollo",
      items: [
        "Análisis de imágenes",
        "Análisis de documentos",
        "Dashboard avanzado",
      ],
    },
    {
      phase: "Fase 3 - Avanzado",
      status: "Planificado",
      items: ["Análisis de video", "API pública", "Integraciones de terceros"],
    },
    {
      phase: "Fase 4 - Escalabilidad",
      status: "Planificado",
      items: [
        "Machine Learning personalizado",
        "Análisis en tiempo real",
        "Aplicación móvil",
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Info className="w-12 h-12 text-primary-600 mr-4" />
          <h1 className="text-4xl font-bold text-gray-900">
            Acerca del Proyecto
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Conoce más sobre el Detector de Contenido IA, nuestro equipo y la
          tecnología que hace posible la detección avanzada de contenido
          generado por inteligencia artificial.
        </p>
      </div>

      {/* Project Overview */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Visión del Proyecto
        </h2>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">
            El Detector de Contenido IA nace de la necesidad creciente de
            identificar y distinguir entre contenido generado por inteligencia
            artificial y contenido creado por humanos. En un mundo donde la IA
            se vuelve cada vez más sofisticada, es fundamental mantener la
            transparencia y la confianza en la información digital.
          </p>

          <p className="text-gray-700 mb-4">
            Nuestro objetivo es proporcionar una herramienta confiable,
            accesible y transparente que permita a usuarios, organizaciones y
            plataformas digitales identificar contenido generado por IA,
            contribuyendo así a la lucha contra la desinformación y promoviendo
            un ecosistema digital más confiable.
          </p>

          <p className="text-gray-700">
            Este proyecto es parte de la investigación académica en la Fundación
            Universitaria para el Desarrollo Humano UNINPAHU, contribuyendo al
            desarrollo de tecnologías éticas y responsables en el campo de la
            inteligencia artificial.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Características Principales
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Nuestro Equipo
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {team.map((member, index) => (
            <div key={index} className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {member.name}
              </h3>
              <p className="text-primary-600 font-medium mb-3">{member.role}</p>
              <p className="text-gray-600 mb-4">{member.email}</p>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Especialidades:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {member.expertise.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technologies */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Tecnologías Utilizadas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {technologies.map((tech, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                {tech.category}
              </h3>
              <ul className="space-y-2">
                {tech.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="text-sm text-gray-600 flex items-center"
                  >
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-2"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Hoja de Ruta del Proyecto
        </h2>

        <div className="space-y-6">
          {roadmap.map((phase, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {phase.phase}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    phase.status === "Completado"
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : phase.status === "En Desarrollo"
                      ? "bg-blue-100 text-blue-800 border border-blue-200"
                      : "bg-gray-100 text-gray-800 border border-gray-200"
                  }`}
                >
                  {phase.status}
                </span>
              </div>

              <ul className="space-y-2">
                {phase.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="text-gray-700 flex items-center"
                  >
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Context */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Contexto Académico
        </h2>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Institución</h3>
            <p className="text-gray-700">
              Fundación Universitaria para el Desarrollo Humano UNINPAHU
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Programa</h3>
            <p className="text-gray-700">
              Ingeniería de Software - Facultad de Ingeniería y Tecnología
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Asignatura</h3>
            <p className="text-gray-700">Anteproyecto NT 1256 Grupo 001</p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Docente</h3>
            <p className="text-gray-700">Martha Cecilia Vidal Arizabaleta</p>
          </div>
        </div>
      </div>

      {/* Open Source */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="text-center">
          <Github className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">
            Proyecto de Código Abierto
          </h2>
          <p className="text-blue-800 mb-6">
            Creemos en la transparencia y la colaboración. Este proyecto es de
            código abierto y estamos comprometidos con compartir nuestro
            conocimiento con la comunidad.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary flex items-center">
              <Github className="w-4 h-4 mr-2" />
              Ver en GitHub
            </button>
            <button className="btn-secondary">Contribuir al Proyecto</button>
          </div>
        </div>
      </div>

      {/* Contact & Support */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Contacto y Soporte
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Información Académica
            </h3>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Institución:</strong> UNINPAHU
              </p>
              <p>
                <strong>Facultad:</strong> Ingeniería y Tecnología
              </p>
              <p>
                <strong>Programa:</strong> Ingeniería de Software
              </p>
              <p>
                <strong>Email:</strong> proyectos@uninpahu.edu.co
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Soporte Técnico
            </h3>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Email:</strong> soporte@detectoria.com
              </p>
              <p>
                <strong>Documentación:</strong> docs.detectoria.com
              </p>
              <p>
                <strong>Issues:</strong> GitHub Issues
              </p>
              <p>
                <strong>Discord:</strong> Comunidad de desarrolladores
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="card bg-gray-50 border-gray-200">
        <div className="text-center">
          <Award className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ¿Te gusta nuestro proyecto?
          </h3>
          <p className="text-gray-600 mb-4">
            Únete a nuestra comunidad, contribuye al desarrollo o simplemente
            comparte tu experiencia con nosotros.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">Comenzar a Usar</button>
            <button className="btn-secondary">Contactar Equipo</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
