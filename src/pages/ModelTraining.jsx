import React, { useState, useEffect } from "react";
import {
  Brain,
  Play,
  Pause,
  RotateCcw,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  Image as ImageIcon,
  Video,
  Database,
  Settings,
  Download,
  Upload,
  Eye,
  EyeOff
} from "lucide-react";
import modelTrainingService from "../services/modelTrainingService";
import toast from "react-hot-toast";

const ModelTraining = () => {
  const [modelStatus, setModelStatus] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(null);
  const [trainingHistory, setTrainingHistory] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [trainingData, setTrainingData] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [showPerformance, setShowPerformance] = useState(false);

  useEffect(() => {
    loadModelStatus();
    loadTrainingHistory();
    loadPerformanceMetrics();
  }, []);

  const loadModelStatus = async () => {
    try {
      const status = modelTrainingService.getModelStatus();
      setModelStatus(status);
    } catch (error) {
      console.error("Error cargando estado del modelo:", error);
    }
  };

  const loadTrainingHistory = async () => {
    // Simulación de historial de entrenamiento
    const history = [
      {
        id: 1,
        date: "2024-01-15",
        type: "Completo",
        accuracy: 0.94,
        duration: "15 minutos",
        status: "Completado"
      },
      {
        id: 2,
        date: "2024-01-10",
        type: "Incremental",
        accuracy: 0.92,
        duration: "2 minutos",
        status: "Completado"
      },
      {
        id: 3,
        date: "2024-01-05",
        type: "Completo",
        accuracy: 0.89,
        duration: "18 minutos",
        status: "Completado"
      }
    ];
    setTrainingHistory(history);
  };

  const loadPerformanceMetrics = async () => {
    try {
      const metrics = await modelTrainingService.evaluatePerformance([]);
      setPerformanceMetrics(metrics);
    } catch (error) {
      console.error("Error cargando métricas:", error);
    }
  };

  const startTraining = async () => {
    if (isTraining) {
      toast.error("El entrenamiento ya está en curso");
      return;
    }

    setIsTraining(true);
    setTrainingProgress({
      currentStep: 0,
      totalSteps: 6,
      currentStepName: "Iniciando...",
      progress: 0
    });

    try {
      // Simular datos de entrenamiento
      const mockTrainingData = [
        { type: 'text', content: 'Texto de ejemplo 1', label: 'human' },
        { type: 'text', content: 'Texto de ejemplo 2', label: 'ai' },
        { type: 'image', content: 'imagen1.jpg', label: 'human' },
        { type: 'video', content: 'video1.mp4', label: 'ai' },
        { type: 'document', content: 'doc1.pdf', label: 'human' }
      ];

      const results = await modelTrainingService.startTraining(mockTrainingData);
      
      // Simular progreso en tiempo real
      for (let i = 0; i < results.pipeline.length; i++) {
        const step = results.pipeline[i];
        setTrainingProgress({
          currentStep: i + 1,
          totalSteps: results.pipeline.length,
          currentStepName: step.name,
          progress: ((i + 1) / results.pipeline.length) * 100,
          currentStepStatus: step.status,
          currentStepResult: step.result
        });
        
        // Simular tiempo de procesamiento
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      setTrainingProgress(null);
      toast.success("Entrenamiento completado exitosamente");
      
      // Recargar estado
      loadModelStatus();
      loadTrainingHistory();
      
    } catch (error) {
      console.error("Error en entrenamiento:", error);
      toast.error("Error durante el entrenamiento");
    } finally {
      setIsTraining(false);
    }
  };

  const startIncrementalTraining = async () => {
    try {
      const newData = [
        { type: 'text', content: 'Nuevo texto 1', label: 'human' },
        { type: 'image', content: 'nueva_imagen.jpg', label: 'ai' }
      ];

      const results = await modelTrainingService.incrementalTraining(newData);
      toast.success("Entrenamiento incremental completado");
      
      // Recargar estado
      loadModelStatus();
      loadTrainingHistory();
      
    } catch (error) {
      console.error("Error en entrenamiento incremental:", error);
      toast.error("Error en entrenamiento incremental");
    }
  };

  const resetModel = async () => {
    if (window.confirm("¿Estás seguro de que quieres resetear el modelo? Esta acción no se puede deshacer.")) {
      try {
        // Simular reset del modelo
        setModelStatus({
          ...modelStatus,
          accuracy: 0,
          version: "1.0.0",
          status: "idle",
          lastTraining: null
        });
        
        toast.success("Modelo reseteado exitosamente");
      } catch (error) {
        console.error("Error reseteando modelo:", error);
        toast.error("Error reseteando modelo");
      }
    }
  };

  const exportModel = () => {
    // Simulación de exportación
    toast.success("Modelo exportado exitosamente");
  };

  const importModel = () => {
    // Simulación de importación
    toast.success("Modelo importado exitosamente");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'trained': return 'text-green-600';
      case 'training': return 'text-blue-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'trained': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'training': return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Entrenamiento del Modelo
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Gestiona el entrenamiento y actualización del modelo de detección de IA
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Estado del Modelo */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Estado del Modelo
              </h2>
              
              {modelStatus && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {modelStatus.accuracy ? `${(modelStatus.accuracy * 100).toFixed(1)}%` : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Precisión</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {modelStatus.version}
                    </div>
                    <div className="text-sm text-gray-600">Versión</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {modelStatus.uptime || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Tiempo Activo</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      {getStatusIcon(modelStatus.status)}
                    </div>
                    <div className={`text-sm font-medium ${getStatusColor(modelStatus.status)}`}>
                      {modelStatus.status === 'trained' ? 'Entrenado' : 
                       modelStatus.status === 'training' ? 'Entrenando' :
                       modelStatus.status === 'error' ? 'Error' : 'Inactivo'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Controles de Entrenamiento */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Play className="w-5 h-5 mr-2" />
                Controles de Entrenamiento
              </h2>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={startTraining}
                  disabled={isTraining}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isTraining ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-5 h-5 mr-2" />
                  )}
                  {isTraining ? 'Entrenando...' : 'Entrenamiento Completo'}
                </button>
                
                <button
                  onClick={startIncrementalTraining}
                  disabled={isTraining}
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Entrenamiento Incremental
                </button>
                
                <button
                  onClick={resetModel}
                  disabled={isTraining}
                  className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Resetear Modelo
                </button>
              </div>
            </div>

            {/* Progreso del Entrenamiento */}
            {trainingProgress && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Progreso del Entrenamiento
                </h2>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Paso {trainingProgress.currentStep} de {trainingProgress.totalSteps}</span>
                    <span>{trainingProgress.progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${trainingProgress.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-medium text-gray-900 mb-2">
                    {trainingProgress.currentStepName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {trainingProgress.currentStepStatus}
                  </div>
                </div>
              </div>
            )}

            {/* Historial de Entrenamiento */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Historial de Entrenamiento
              </h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precisión
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duración
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {trainingHistory.map((training) => (
                      <tr key={training.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {training.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {training.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(training.accuracy * 100).toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {training.duration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {training.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Panel Lateral */}
          <div className="space-y-6">
            {/* Métricas de Rendimiento */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Rendimiento
                </h2>
                <button
                  onClick={() => setShowPerformance(!showPerformance)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {showPerformance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {showPerformance && performanceMetrics && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Precisión:</span>
                    <span className="text-sm font-medium">{(performanceMetrics.accuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">F1-Score:</span>
                    <span className="text-sm font-medium">{(performanceMetrics.f1Score * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Latencia:</span>
                    <span className="text-sm font-medium">{performanceMetrics.performanceMetrics?.latency || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Throughput:</span>
                    <span className="text-sm font-medium">{performanceMetrics.performanceMetrics?.throughput || 'N/A'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Configuración Avanzada */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Configuración
                </h2>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {showAdvanced && (
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Tamaño del Batch
                    </label>
                    <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                      <option>16</option>
                      <option selected>32</option>
                      <option>64</option>
                      <option>128</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Learning Rate
                    </label>
                    <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                      <option>0.0001</option>
                      <option selected>0.001</option>
                      <option>0.01</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Épocas
                    </label>
                    <input 
                      type="number" 
                      defaultValue="50"
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Acciones del Modelo */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Acciones del Modelo
              </h2>
              
              <div className="space-y-3">
                <button
                  onClick={exportModel}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Modelo
                </button>
                
                <button
                  onClick={importModel}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Importar Modelo
                </button>
              </div>
            </div>

            {/* Estadísticas de Datos */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Estadísticas de Datos
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Textos
                  </span>
                  <span className="text-sm font-medium">1,250</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Imágenes
                  </span>
                  <span className="text-sm font-medium">850</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Video className="w-4 h-4 mr-2" />
                    Videos
                  </span>
                  <span className="text-sm font-medium">320</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Database className="w-4 h-4 mr-2" />
                    Documentos
                  </span>
                  <span className="text-sm font-medium">180</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelTraining;
