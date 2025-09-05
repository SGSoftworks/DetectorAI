import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Image, 
  Upload, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Info, 
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import ExpandableText from '@/components/ExpandableText';
import RelatedContentCarousel from '@/components/RelatedContentCarousel';

const ImageAnalysis: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('El archivo es demasiado grande. Máximo 10MB.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecciona un archivo de imagen válido.');
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
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error('Por favor, selecciona una imagen para analizar');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      // Simular análisis (en producción, aquí se llamaría al servicio real)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Resultado simulado
      const mockResult = {
        id: `img_${Date.now()}`,
        type: 'image',
        isAI: Math.random() > 0.5,
        confidence: Math.floor(Math.random() * 40) + 60, // 60-100%
        explanation: 'El análisis de la imagen sugiere que fue generada por IA basándose en patrones de textura, iluminación y composición típicos de modelos generativos.',
        methodology: 'Análisis de patrones de píxeles, detección de artefactos de compresión y evaluación de consistencia visual',
        factors: [
          { name: 'Patrones de textura', value: 75, impact: 'negative', description: 'Se detectaron patrones de textura artificiales típicos de modelos generativos de IA, con repeticiones y simetrías poco naturales.' },
          { name: 'Consistencia de iluminación', value: 60, impact: 'positive', description: 'La iluminación muestra cierta consistencia, aunque presenta algunas anomalías menores que podrían indicar manipulación.' },
          { name: 'Artefactos de compresión', value: 85, impact: 'negative', description: 'Se encontraron artefactos de compresión y distorsiones que son característicos de imágenes generadas por IA.' },
          { name: 'Resolución y calidad', value: 70, impact: 'positive', description: 'La resolución y calidad general de la imagen son aceptables, con algunos detalles que sugieren procesamiento artificial.' }
        ],
        metadata: {
          timestamp: new Date(),
          processingTime: 3000,
          model: 'image-detection-v1',
          version: '1.0.0'
        },
        relatedContent: [
          {
            title: 'Herramientas de detección de imágenes generadas por IA',
            snippet: 'Descubre las mejores herramientas para detectar imágenes generadas por inteligencia artificial y deepfakes.',
            url: 'https://example.com/ai-image-detection-tools',
            source: 'techcrunch.com',
            relevance: 0.95
          },
          {
            title: 'Cómo identificar imágenes falsas generadas por IA',
            snippet: 'Guía completa para identificar señales de que una imagen fue generada por inteligencia artificial.',
            url: 'https://example.com/identify-ai-images',
            source: 'wired.com',
            relevance: 0.88
          },
          {
            title: 'Verificador de imágenes AI - Herramienta gratuita',
            snippet: 'Utiliza esta herramienta gratuita para verificar si una imagen fue generada por IA o es real.',
            url: 'https://example.com/ai-image-verifier',
            source: 'verification-tools.com',
            relevance: 0.92
          }
        ]
      };

      setResult(mockResult);
      toast.success('Análisis completado exitosamente');
    } catch (err) {
      const errorMessage = 'Error al analizar la imagen. Por favor, intenta de nuevo.';
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
              <Image className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Análisis de Imagen
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Analiza imágenes para detectar si fueron generadas por inteligencia artificial o son fotografías reales
          </p>
        </motion.div>

        {/* Upload Section - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Sube una imagen
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
              <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-primary-600 font-medium">Suelta la imagen aquí...</p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">
                    Arrastra una imagen aquí o haz clic para seleccionar
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF hasta 10MB
                  </p>
                </div>
              )}
            </div>

            {selectedFile && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Image className="w-8 h-8 text-primary-600" />
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
                  <span>Analizar Imagen</span>
                </>
              )}
            </button>

            {/* Info Box - Grid Layout */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-3">¿Qué analizamos?</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Patrones de píxeles y texturas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Consistencia de iluminación</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Artefactos de compresión</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Metadatos de la imagen</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Anomalías visuales típicas de IA</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Calidad y resolución</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Section - Grid Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
            {isAnalyzing && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Analizando imagen...
                  </h3>
                  <p className="text-gray-600">
                    Nuestros algoritmos están procesando la imagen. Esto puede tomar unos segundos.
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
                {/* Main Result - Full Width */}
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
                      {result.isAI ? 'Generada por IA' : 'Imagen Real'}
                    </h4>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {result.confidence}%
                    </div>
                    <p className="text-gray-600">Confianza en el resultado</p>
                  </div>

                  {/* Explanation and Methodology - Side by Side */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Explicación</h5>
                      <ExpandableText 
                        text={result.explanation} 
                        maxLength={200}
                        className="text-gray-700"
                      />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Metodología</h5>
                      <ExpandableText 
                        text={result.methodology} 
                        maxLength={200}
                        className="text-gray-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Analysis Factors - Grid Layout */}
                {result.factors && result.factors.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Factores de Análisis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {result.factors.map((factor: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">{factor.name}</h4>
                            <span className={`status-indicator text-xs ${
                              factor.impact === 'positive' ? 'status-online' :
                              factor.impact === 'negative' ? 'status-offline' : 'status-limited'
                            }`}>
                              {factor.impact === 'positive' ? 'Positivo' :
                               factor.impact === 'negative' ? 'Negativo' : 'Neutral'}
                            </span>
                          </div>
                          {factor.description && (
                            <ExpandableText 
                              text={factor.description} 
                              maxLength={80}
                              className="text-xs text-gray-600 mb-3"
                            />
                          )}
                          <div className="flex justify-between text-xs mb-1">
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

                {/* Related Images - Carousel */}
                <RelatedContentCarousel 
                  items={result.relatedContent || []}
                  title="Herramientas de Verificación"
                  type="image"
                />
              </div>
            )}
          </motion.div>
      </div>
    </div>
  );
};

export default ImageAnalysis;
