import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Send, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Info, 
  BarChart3,
  Clock,
  Brain,
  AlertTriangle,
  Copy,
  Download
} from 'lucide-react';
import { analysisService } from '@/services/analysisService';
import { firebaseService } from '@/services/firebaseService';
import type { AnalysisResult } from '@/types';
import toast from 'react-hot-toast';

const TextAnalysis: React.FC = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.error('Por favor, ingresa un texto para analizar');
      return;
    }

    if (text.length > 50000) {
      toast.error('El texto es demasiado largo. Máximo 50,000 caracteres.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await analysisService.analyzeText({ text: text.trim() });
      
      if (response.success && response.data) {
        setResult(response.data);
        
        // Guardar análisis en Firebase
        try {
          await firebaseService.saveAnonymousAnalysis(response.data);
        } catch (firebaseError) {
          console.warn('No se pudo guardar en Firebase:', firebaseError);
        }
        
        toast.success('Análisis completado exitosamente');
      } else {
        setError(response.error || 'Error desconocido');
        toast.error(response.error || 'Error al analizar el texto');
      }
    } catch (err) {
      const errorMessage = 'Error interno del servidor. Por favor, intenta de nuevo.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      const textToCopy = `Análisis de DetectorAI:
Resultado: ${result.result.isAI ? 'Generado por IA' : 'Escrito por humano'}
Confianza: ${result.result.confidence}%
Explicación: ${result.result.explanation}`;
      
      navigator.clipboard.writeText(textToCopy);
      toast.success('Resultado copiado al portapapeles');
    }
  };

  const downloadResult = () => {
    if (result) {
      const data = {
        timestamp: result.metadata.timestamp,
        text: result.content,
        result: result.result,
        metadata: result.metadata
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analisis-detectorai-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Resultado descargado');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Análisis de Texto
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Analiza cualquier texto para determinar si fue generado por inteligencia artificial o escrito por un humano
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Ingresa el texto a analizar
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
                  Contenido del texto
                </label>
                <textarea
                  id="text-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Pega aquí el texto que quieres analizar..."
                  className="textarea-field h-64"
                  disabled={isAnalyzing}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">
                    {text.length.toLocaleString()} / 50,000 caracteres
                  </span>
                  {text.length > 50000 && (
                    <span className="text-sm text-danger-600 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Texto demasiado largo
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !text.trim() || text.length > 50000}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analizando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Analizar Texto</span>
                  </>
                )}
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">¿Qué analizamos?</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Patrones lingüísticos y estructura del texto</li>
                    <li>• Consistencia en el estilo y coherencia</li>
                    <li>• Uso de conectores y transiciones</li>
                    <li>• Originalidad y creatividad</li>
                    <li>• Errores típicos de IA</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {isAnalyzing && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Analizando texto...
                  </h3>
                  <p className="text-gray-600">
                    Nuestros algoritmos están procesando el contenido. Esto puede tomar unos segundos.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-white rounded-xl shadow-sm border border-danger-200 p-6">
                <div className="flex items-start space-x-3">
                  <XCircle className="w-6 h-6 text-danger-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-danger-900 mb-2">
                      Error en el análisis
                    </h3>
                    <p className="text-danger-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {/* Main Result */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Resultado del Análisis
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={copyToClipboard}
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                        title="Copiar resultado"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={downloadResult}
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                        title="Descargar resultado"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      result.result.isAI ? 'bg-danger-100' : 'bg-success-100'
                    }`}>
                      {result.result.isAI ? (
                        <XCircle className="w-10 h-10 text-danger-600" />
                      ) : (
                        <CheckCircle className="w-10 h-10 text-success-600" />
                      )}
                    </div>
                    <h4 className={`text-2xl font-bold mb-2 ${
                      result.result.isAI ? 'text-danger-600' : 'text-success-600'
                    }`}>
                      {result.result.isAI ? 'Generado por IA' : 'Escrito por humano'}
                    </h4>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {result.result.confidence}%
                    </div>
                    <p className="text-gray-600">Confianza en el resultado</p>
                  </div>

                  {/* Probability Bars */}
                  <div className="space-y-3 mb-6">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Probabilidad IA</span>
                        <span className="font-medium">{result.result.probability.ai}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill bg-danger-600" 
                          style={{ width: `${result.result.probability.ai}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Probabilidad Humano</span>
                        <span className="font-medium">{result.result.probability.human}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill bg-success-600" 
                          style={{ width: `${result.result.probability.human}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="mb-6">
                    <h5 className="font-semibold text-gray-900 mb-2">Explicación</h5>
                    <p className="text-gray-700">{result.result.explanation}</p>
                  </div>

                  {/* Methodology */}
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Metodología</h5>
                    <p className="text-gray-700">{result.result.methodology}</p>
                  </div>
                </div>

                {/* Analysis Factors */}
                {result.result.factors && result.result.factors.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Factores de Análisis
                    </h3>
                    <div className="space-y-4">
                      {result.result.factors.map((factor, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{factor.name}</h4>
                            <span className={`status-indicator ${
                              factor.impact === 'positive' ? 'status-online' :
                              factor.impact === 'negative' ? 'status-offline' : 'status-limited'
                            }`}>
                              {factor.impact === 'positive' ? 'Positivo' :
                               factor.impact === 'negative' ? 'Negativo' : 'Neutral'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{factor.description}</p>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Valor</span>
                            <span className="font-medium">{factor.value}%</span>
                          </div>
                          <div className="progress-bar">
                            <div 
                              className={`progress-fill ${
                                factor.impact === 'positive' ? 'bg-success-600' :
                                factor.impact === 'negative' ? 'bg-danger-600' : 'bg-warning-600'
                              }`}
                              style={{ width: `${factor.value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Información del Análisis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Tiempo de procesamiento</p>
                        <p className="font-medium">{result.metadata.processingTime}ms</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Brain className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Modelo utilizado</p>
                        <p className="font-medium">{result.metadata.model}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Versión</p>
                        <p className="font-medium">{result.metadata.version}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Fecha de análisis</p>
                        <p className="font-medium">
                          {new Date(result.metadata.timestamp).toLocaleString('es-ES')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TextAnalysis;
