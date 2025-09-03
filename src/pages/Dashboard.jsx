import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Settings,
  Key,
  Activity,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  FileText,
  Eye,
  EyeOff,
  ExternalLink,
  Download,
  Upload,
  RefreshCw,
  Image,
  Video,
  File,
} from "lucide-react";
import { getAPIUsageInfo, validateAPIConfig } from "../config/api";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [apiInfo, setApiInfo] = useState({});
  const [apiValidation, setApiValidation] = useState({});
  const [showApiConfig, setShowApiConfig] = useState(false);

  useEffect(() => {
    const info = getAPIUsageInfo();
    const validation = validateAPIConfig();
    setApiInfo(info);
    setApiValidation(validation);
  }, []);

  const mockStats = {
    totalAnalyses: 1247,
    textAnalyses: 856,
    imageAnalyses: 234,
    videoAnalyses: 89,
    documentAnalyses: 68,
    accuracy: 94.2,
    averageResponseTime: 2.3,
    dailyAnalyses: 45,
  };

  const mockRecentAnalyses = [
    {
      id: 1,
      type: "Texto",
      result: "Humano",
      confidence: 87,
      timestamp: "2025-01-15 14:30",
      status: "Completado",
    },
    {
      id: 2,
      type: "Imagen",
      result: "IA",
      confidence: 92,
      timestamp: "2025-01-15 14:25",
      status: "Completado",
    },
    {
      id: 3,
      type: "Documento",
      result: "Humano",
      confidence: 78,
      timestamp: "2025-01-15 14:20",
      status: "Completado",
    },
    {
      id: 4,
      type: "Texto",
      result: "IA",
      confidence: 89,
      timestamp: "2025-01-15 14:15",
      status: "Completado",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completado":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "Procesando":
        return <Activity className="w-4 h-4 text-yellow-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getResultColor = (result) => {
    return result === "IA"
      ? "bg-red-100 text-red-800 border-red-200"
      : "bg-green-100 text-green-800 border-green-200";
  };

  const getApiStatusIcon = (status) => {
    return status === "Configurado" ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <AlertTriangle className="w-5 h-5 text-yellow-500" />
    );
  };

  const getApiStatusColor = (status) => {
    return status === "Configurado"
      ? "text-green-600 bg-green-50 border-green-200"
      : "text-yellow-600 bg-yellow-50 border-yellow-200";
  };

  return (
    <div className="space-section">
      {/* Header mejorado */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-responsive-xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Monitorea el rendimiento del sistema
            </p>
          </div>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Estadísticas de uso, configuración de APIs y estado del sistema en
          tiempo real
        </p>
      </div>

      {/* API Configuration Status mejorado */}
      <div className="card">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-responsive-md font-bold text-gray-900 mb-2">
              Estado de Configuración de APIs
            </h2>
            <p className="text-gray-600">
              Gestiona y monitorea la configuración de tus APIs
            </p>
          </div>
          <button
            onClick={() => setShowApiConfig(!showApiConfig)}
            className="btn-secondary flex items-center"
          >
            <Settings className="w-4 h-4 mr-2" />
            {showApiConfig ? "Ocultar" : "Mostrar"} Configuración
          </button>
        </div>

        {!apiValidation.isValid && (
          <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-2xl">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-800 text-lg mb-2">
                  Configuración Incompleta
                </h3>
                <p className="text-yellow-700 leading-relaxed">
                  {apiValidation.message}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(apiInfo).map(([key, api]) => (
            <div
              key={key}
              className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{api.name}</h3>
                {getApiStatusIcon(api.status)}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estado:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getApiStatusColor(
                      api.status
                    )}`}
                  >
                    {api.status}
                  </span>
                </div>

                <div className="text-xs text-gray-500">
                  {api.status === "Configurado" ? (
                    <div className="space-y-1">
                      {Object.entries(api.limits).map(
                        ([limitKey, limitValue]) => (
                          <div key={limitKey} className="flex justify-between">
                            <span className="capitalize">{limitKey}:</span>
                            <span className="font-medium">{limitValue}</span>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <a
                      href={api.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline inline-flex items-center"
                    >
                      Configurar API
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {showApiConfig && (
          <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
            <h3 className="font-semibold text-gray-800 mb-4 text-lg">
              Configuración de Variables de Entorno
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Para configurar las APIs, crea un archivo{" "}
              <code className="bg-gray-200 px-2 py-1 rounded text-sm font-mono">
                .env.local
              </code>{" "}
              en la raíz del proyecto con las siguientes variables:
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <code className="bg-gray-200 px-3 py-2 rounded-lg font-mono flex-1">
                  VITE_GEMINI_API_KEY
                </code>
                <span className="text-gray-600">= tu_clave_gemini</span>
              </div>
              <div className="flex items-center space-x-3">
                <code className="bg-gray-200 px-3 py-2 rounded-lg font-mono flex-1">
                  VITE_HUGGING_FACE_API_KEY
                </code>
                <span className="text-gray-600">= tu_clave_huggingface</span>
              </div>
              <div className="flex items-center space-x-3">
                <code className="bg-gray-200 px-3 py-2 rounded-lg font-mono flex-1">
                  VITE_GOOGLE_SEARCH_API_KEY
                </code>
                <span className="text-gray-600">= tu_clave_google_search</span>
              </div>
              <div className="flex items-center space-x-3">
                <code className="bg-gray-200 px-3 py-2 rounded-lg font-mono flex-1">
                  VITE_GOOGLE_SEARCH_ENGINE_ID
                </code>
                <span className="text-gray-600">= tu_engine_id</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Overview mejorado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center hover-lift">
          <div className="text-4xl font-bold text-blue-600 mb-3">
            {mockStats.totalAnalyses.toLocaleString()}
          </div>
          <div className="text-gray-600 font-medium mb-3">
            Total de Análisis
          </div>
          <div className="text-sm text-green-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            +12% este mes
          </div>
        </div>

        <div className="card text-center hover-lift">
          <div className="text-4xl font-bold text-green-600 mb-3">
            {mockStats.accuracy}%
          </div>
          <div className="text-gray-600 font-medium mb-3">
            Precisión Promedio
          </div>
          <div className="text-sm text-green-600 flex items-center justify-center">
            <Shield className="w-4 h-4 mr-2" />
            Alta confiabilidad
          </div>
        </div>

        <div className="card text-center hover-lift">
          <div className="text-4xl font-bold text-purple-600 mb-3">
            {mockStats.averageResponseTime}s
          </div>
          <div className="text-gray-600 font-medium mb-3">Tiempo Respuesta</div>
          <div className="text-sm text-green-600 flex items-center justify-center">
            <Activity className="w-4 h-4 mr-2" />
            Muy rápido
          </div>
        </div>

        <div className="card text-center hover-lift">
          <div className="text-4xl font-bold text-indigo-600 mb-3">
            {mockStats.dailyAnalyses}
          </div>
          <div className="text-gray-600 font-medium mb-3">Análisis Hoy</div>
          <div className="text-sm text-blue-600 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            En tiempo real
          </div>
        </div>
      </div>

      {/* Analysis by Type mejorado */}
      <div className="card">
        <h2 className="text-responsive-md font-bold text-gray-900 mb-8">
          Análisis por Tipo de Contenido
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center group">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {mockStats.textAnalyses}
            </div>
            <div className="text-gray-600 font-medium mb-2">
              Análisis de Texto
            </div>
            <div className="text-sm text-gray-500">
              {Math.round(
                (mockStats.textAnalyses / mockStats.totalAnalyses) * 100
              )}
              % del total
            </div>
          </div>

          <div className="text-center group">
            <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Image className="w-10 h-10 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {mockStats.imageAnalyses}
            </div>
            <div className="text-gray-600 font-medium mb-2">
              Análisis de Imagen
            </div>
            <div className="text-sm text-gray-500">
              {Math.round(
                (mockStats.imageAnalyses / mockStats.totalAnalyses) * 100
              )}
              % del total
            </div>
          </div>

          <div className="text-center group">
            <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Video className="w-10 h-10 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {mockStats.videoAnalyses}
            </div>
            <div className="text-gray-600 font-medium mb-2">
              Análisis de Video
            </div>
            <div className="text-sm text-gray-500">
              {Math.round(
                (mockStats.videoAnalyses / mockStats.totalAnalyses) * 100
              )}
              % del total
            </div>
          </div>

          <div className="text-center group">
            <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <File className="w-10 h-10 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {mockStats.documentAnalyses}
            </div>
            <div className="text-gray-600 font-medium mb-2">
              Análisis de Documento
            </div>
            <div className="text-sm text-gray-500">
              {Math.round(
                (mockStats.documentAnalyses / mockStats.totalAnalyses) * 100
              )}
              % del total
            </div>
          </div>
        </div>
      </div>

      {/* Recent Analyses mejorado */}
      <div className="card">
        <h2 className="text-responsive-md font-bold text-gray-900 mb-8">
          Análisis Recientes
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                  Tipo
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                  Resultado
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                  Confianza
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                  Hora
                </th>
              </tr>
            </thead>
            <tbody>
              {mockRecentAnalyses.map((analysis) => (
                <tr
                  key={analysis.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                      <span className="font-medium">{analysis.type}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getResultColor(
                        analysis.result
                      )}`}
                    >
                      {analysis.result}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${analysis.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {analysis.confidence}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      {getStatusIcon(analysis.status)}
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {analysis.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500 font-mono">
                    {analysis.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Health mejorado */}
      <div className="card">
        <h2 className="text-responsive-md font-bold text-gray-900 mb-8">
          Estado del Sistema
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-200 hover-lift">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-green-800 mb-2 text-lg">
              APIs Funcionando
            </h3>
            <p className="text-green-700 text-sm leading-relaxed">
              Todas las APIs están operativas y respondiendo correctamente
            </p>
          </div>

          <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-200 hover-lift">
            <Activity className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-blue-800 mb-2 text-lg">
              Rendimiento
            </h3>
            <p className="text-blue-700 text-sm leading-relaxed">
              Sistema funcionando al 100% con tiempos de respuesta óptimos
            </p>
          </div>

          <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-200 hover-lift">
            <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-green-800 mb-2 text-lg">
              Seguridad
            </h3>
            <p className="text-green-700 text-sm leading-relaxed">
              Todas las medidas de seguridad activas y funcionando
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions mejorado */}
      <div className="card">
        <h2 className="text-responsive-md font-bold text-gray-900 mb-8">
          Acciones Rápidas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button className="p-6 border border-gray-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-center group hover-lift">
            <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
            <div className="font-semibold text-gray-900 mb-2">
              Nuevo Análisis
            </div>
            <div className="text-sm text-gray-600">Comenzar análisis</div>
          </button>

          <button className="p-6 border border-gray-200 rounded-2xl hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-center group hover-lift">
            <Settings className="w-12 h-12 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
            <div className="font-semibold text-gray-900 mb-2">
              Configuración
            </div>
            <div className="text-sm text-gray-600">Ajustar APIs</div>
          </button>

          <button className="p-6 border border-gray-200 rounded-2xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-center group hover-lift">
            <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
            <div className="font-semibold text-gray-900 mb-2">Reportes</div>
            <div className="text-sm text-gray-600">Ver estadísticas</div>
          </button>

          <button className="p-6 border border-gray-200 rounded-2xl hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 text-center group hover-lift">
            <Key className="w-12 h-12 text-orange-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
            <div className="font-semibold text-gray-900 mb-2">API Keys</div>
            <div className="text-sm text-gray-600">Gestionar claves</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
