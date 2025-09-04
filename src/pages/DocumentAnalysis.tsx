import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  File, 
  Upload, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Info, 
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

const DocumentAnalysis: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error('El archivo es demasiado grande. Máximo 50MB.');
        return;
      }
      setSelectedFile(file);
      setResult(null);
      setError(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'application/rtf': ['.rtf']
    },
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error('Por favor, selecciona un documento para analizar');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      // Simular análisis (en producción, aquí se llamaría al servicio real)
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Resultado simulado
      const mockResult = {
        id: `doc_${Date.now()}`,
        type: 'document',
        isAI: Math.random() > 0.5,
        confidence: Math.floor(Math.random() * 40) + 60, // 60-100%
        explanation: 'El análisis del documento sugiere que fue generado por IA basándose en patrones de escritura, estructura y coherencia del contenido.',
        methodology: 'Análisis de texto extraído, evaluación de estructura, detección de patrones de IA y análisis de imágenes incluidas',
        factors: [
          { name: 'Patrones de escritura', value: 75, impact: 'negative' },
          { name: 'Estructura del documento', value: 60, impact: 'positive' },
          { name: 'Coherencia del contenido', value: 70, impact: 'positive' },
          { name: 'Uso de conectores', value: 80, impact: 'negative' }
        ],
        metadata: {
          timestamp: new Date(),
          processingTime: 4000,
          model: 'document-detection-v1',
          version: '1.0.0'
        }
      };

      setResult(mockResult);
      toast.success('Análisis completado exitosamente');
    } catch (err) {
      const errorMessage = 'Error al analizar el documento. Por favor, intenta de nuevo.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsAnalyzing(false);
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
              <File className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Análisis de Documento
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Analiza documentos completos para detectar si fueron generados por inteligencia artificial
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Sube un documento
            </h2>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-primary-600 font-medium">Suelta el documento aquí...</p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">
                    Arrastra un documento aquí o haz clic para seleccionar
                  </p>
                  <p className="text-sm text-gray-500">
                    PDF, DOC, DOCX, TXT hasta 50MB
                  </p>
                </div>
              )}
            </div>

            {selectedFile && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <File className="w-8 h-8 text-primary-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !selectedFile}
              className="w-full mt-6 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analizando...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Analizar Documento</span>
                </>
              )}
            </button>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">¿Qué analizamos?</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Extracción y análisis de texto</li>
                    <li>• Estructura y formato del documento</li>
                    <li>• Patrones de escritura y coherencia</li>
                    <li>• Imágenes y elementos gráficos</li>
                    <li>• Metadatos del archivo</li>
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
                    Analizando documento...
                  </h3>
                  <p className="text-gray-600">
                    Extrayendo texto y analizando contenido. Esto puede tomar unos minutos.
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
                  <div className="text-center mb-6">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      result.isAI ? 'bg-danger-100' : 'bg-success-100'
                    }`}>
                      {result.isAI ? (
                        <XCircle className="w-10 h-10 text-danger-600" />
                      ) : (
                        <CheckCircle className="w-10 h-10 text-success-600" />
                      )}
                    </div>
                    <h4 className={`text-2xl font-bold mb-2 ${
                      result.isAI ? 'text-danger-600' : 'text-success-600'
                    }`}>
                      {result.isAI ? 'Generado por IA' : 'Documento Humano'}
                    </h4>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {result.confidence}%
                    </div>
                    <p className="text-gray-600">Confianza en el resultado</p>
                  </div>

                  {/* Explanation */}
                  <div className="mb-6">
                    <h5 className="font-semibold text-gray-900 mb-2">Explicación</h5>
                    <p className="text-gray-700">{result.explanation}</p>
                  </div>

                  {/* Methodology */}
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Metodología</h5>
                    <p className="text-gray-700">{result.methodology}</p>
                  </div>
                </div>

                {/* Analysis Factors */}
                {result.factors && result.factors.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Factores de Análisis
                    </h3>
                    <div className="space-y-4">
                      {result.factors.map((factor: any, index: number) => (
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
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalysis;
