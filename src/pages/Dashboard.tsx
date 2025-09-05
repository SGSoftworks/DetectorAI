import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Image, 
  Video, 
  File,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { analysisService } from '@/services/analysisService';
import type { DashboardStats, SystemStatus } from '@/types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Cargar estadísticas de Firebase (incluye todos los tipos de análisis)
      const firebaseStats = await analysisService.getFirebaseStats();
      setStats(firebaseStats);
      
      // Obtener estado del sistema
      const systemHealth = await analysisService.getSystemStatus();
      setSystemStatus(systemHealth);
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      // En caso de error, mostrar datos por defecto
      setStats({
        totalAnalyses: 0,
        accuracyRate: 0,
        averageConfidence: 0,
        popularTypes: [],
        recentAnalyses: [],
        systemHealth: {
          apis: {
            gemini: 'offline',
            huggingFace: 'offline',
            googleSearch: 'limited',
            firebase: 'online'
          },
          performance: {
            averageResponseTime: 0,
            successRate: 0,
            errorRate: 0
          },
          lastUpdated: new Date()
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-success-600';
      case 'offline': return 'text-danger-600';
      case 'limited': return 'text-warning-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4" />;
      case 'offline': return <XCircle className="w-4 h-4" />;
      case 'limited': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const chartColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">Cargando dashboard...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Estadísticas y estado del sistema DetectorAI
              </p>
            </div>
            <button
              onClick={loadDashboardData}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Actualizar</span>
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Análisis</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalAnalyses.toLocaleString() || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Precisión Promedio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.accuracyRate.toFixed(1) || 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confianza Promedio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.averageConfidence.toFixed(1) || 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Análisis de IA Detectados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.recentAnalyses?.filter(a => a.result.isAI).length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-danger-600" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Content Types Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tipos de Contenido Analizados
            </h3>
            {stats?.popularTypes && stats.popularTypes.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.popularTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percentage }) => `${type}: ${percentage.toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {stats.popularTypes.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay datos disponibles</p>
              </div>
            )}
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Estado del Sistema
            </h3>
            <div className="space-y-4">
              {systemStatus?.apis && Object.entries(systemStatus.apis).map(([service, status]) => (
                <div key={service} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'online' ? 'bg-success-500' :
                      status === 'offline' ? 'bg-danger-500' : 'bg-warning-500'
                    }`}></div>
                    <div>
                      <span className="font-medium text-gray-900 capitalize">
                        {service === 'huggingFace' ? 'Hugging Face' : 
                         service === 'googleSearch' ? 'Google Search' : 
                         service === 'gemini' ? 'Google Gemini' : service}
                      </span>
                      <p className="text-xs text-gray-500">
                        {status === 'online' ? 'Funcionando correctamente' :
                         status === 'offline' ? 'Servicio no disponible' :
                         'Límite de uso alcanzado'}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                    <span className="text-sm capitalize">{status}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Última actualización</span>
                <span>{lastUpdated.toLocaleTimeString('es-ES')}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Analyses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Análisis Recientes
          </h3>
          {stats?.recentAnalyses && stats.recentAnalyses.length > 0 ? (
            <div className="space-y-4">
              {stats.recentAnalyses.map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      {analysis.type === 'text' && <FileText className="w-5 h-5 text-primary-600" />}
                      {analysis.type === 'image' && <Image className="w-5 h-5 text-primary-600" />}
                      {analysis.type === 'video' && <Video className="w-5 h-5 text-primary-600" />}
                      {analysis.type === 'document' && <File className="w-5 h-5 text-primary-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Análisis de {analysis.type}
                      </p>
                      <p className="text-sm text-gray-500">
                        {analysis.metadata?.timestamp ? 
                          new Date(analysis.metadata.timestamp).toLocaleString('es-ES') :
                          'Fecha no disponible'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${
                      analysis.result.isAI ? 'text-danger-600' : 'text-success-600'
                    }`}>
                      {analysis.result.isAI ? 'IA' : 'Humano'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {analysis.result.confidence}% confianza
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No hay análisis recientes</p>
              <p className="text-sm text-gray-400">
                Los análisis aparecerán aquí una vez que se realicen
              </p>
            </div>
          )}
        </motion.div>

        {/* Información del sistema */}
        {stats?.totalAnalyses === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-6"
          >
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Sistema en funcionamiento
                </h3>
                <p className="text-blue-700 mb-4">
                  DetectorAI está listo para analizar contenido. Una vez que se realicen análisis, 
                  las estadísticas aparecerán en este dashboard.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Análisis de texto
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Análisis de imágenes
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Análisis de videos
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Análisis de documentos
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
