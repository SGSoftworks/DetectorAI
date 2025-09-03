import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Shield,
  FileText,
  Image,
  Video,
  File,
  BarChart3,
  Info,
  Lock,
  Search,
  Brain,
} from "lucide-react";

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Inicio", href: "/", icon: BarChart3 },
    { name: "Análisis de Texto", href: "/texto", icon: FileText },
    { name: "Análisis de Imagen", href: "/imagen", icon: Image },
    { name: "Análisis de Video", href: "/video", icon: Video },
    { name: "Análisis de Documento", href: "/documento", icon: File },
    { name: "Verificación", href: "/content-verification", icon: Search },
    { name: "Entrenamiento", href: "/model-training", icon: Brain },
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  ];

  const isActive = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header minimalista con menú desplegable */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo minimalista */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">
                Detector IA
              </span>
            </div>

            {/* Navegación simplificada */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === "/"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Inicio
              </Link>

              {/* Menú desplegable de Servicios */}
              <div className="relative group">
                <button className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  <span>Servicios</span>
                  <svg
                    className="w-4 h-4 transition-transform group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown de servicios */}
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      Análisis de Contenido
                    </div>
                    <Link
                      to="/texto"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span>Análisis de Texto</span>
                    </Link>
                    <Link
                      to="/imagen"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Image className="w-4 h-4 text-gray-400" />
                      <span>Análisis de Imagen</span>
                    </Link>
                    <Link
                      to="/video"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Video className="w-4 h-4 text-gray-400" />
                      <span>Análisis de Video</span>
                    </Link>
                    <Link
                      to="/documento"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <File className="w-4 h-4 text-gray-400" />
                      <span>Análisis de Documento</span>
                    </Link>

                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 mt-2">
                      Herramientas Avanzadas
                    </div>
                    <Link
                      to="/content-verification"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Search className="w-4 h-4 text-gray-400" />
                      <span>Verificación</span>
                    </Link>
                    <Link
                      to="/model-training"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Brain className="w-4 h-4 text-gray-400" />
                      <span>Entrenamiento</span>
                    </Link>
                  </div>
                </div>
              </div>

              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === "/dashboard"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Dashboard
              </Link>
            </nav>

            {/* Acciones del lado derecho */}
            <div className="flex items-center space-x-4">
              {/* Botón de menú móvil */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil simplificado */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-sm">
            <div className="px-6 py-4 space-y-2">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Inicio</span>
              </Link>

              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Servicios
              </div>

              <Link
                to="/texto"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/texto"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Análisis de Texto</span>
              </Link>

              <Link
                to="/imagen"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/imagen"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Image className="w-5 h-5" />
                <span>Análisis de Imagen</span>
              </Link>

              <Link
                to="/video"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/video"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Video className="w-5 h-5" />
                <span>Análisis de Video</span>
              </Link>

              <Link
                to="/documento"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/documento"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <File className="w-5 h-5" />
                <span>Análisis de Documento</span>
              </Link>

              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Herramientas
              </div>

              <Link
                to="/content-verification"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/content-verification"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Search className="w-5 h-5" />
                <span>Verificación</span>
              </Link>

              <Link
                to="/model-training"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/model-training"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Brain className="w-5 h-5" />
                <span>Entrenamiento</span>
              </Link>

              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/dashboard"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <Outlet />
      </main>

      {/* Footer mejorado */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Información del proyecto */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Detector IA
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Sistema avanzado de detección de contenido generado por
                inteligencia artificial. Proporcionamos herramientas confiables
                para identificar y verificar la autenticidad de textos,
                imágenes, videos y documentos.
              </p>
            </div>

            {/* Enlaces rápidos */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Servicios
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/texto"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Análisis de Texto
                  </Link>
                </li>
                <li>
                  <Link
                    to="/imagen"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Análisis de Imagen
                  </Link>
                </li>
                <li>
                  <Link
                    to="/video"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Análisis de Video
                  </Link>
                </li>
                <li>
                  <Link
                    to="/documento"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Análisis de Documento
                  </Link>
                </li>
              </ul>
            </div>

            {/* Información legal */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Legal
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/privacidad"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Política de Privacidad
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Acerca de
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Línea divisoria y copyright */}
          <div className="border-t border-gray-200 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500 text-center md:text-left">
                © 2025 Detector IA. Todos los derechos reservados.
              </p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className="text-xs text-gray-400">
                  Desarrollado con ❤️ para combatir la desinformación
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
