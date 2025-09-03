import React, { useState, useCallback } from "react";
import {
  Image,
  Upload,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  FileImage,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import analysisService from "../services/analysisService";
import toast from "react-hot-toast";

const ImageAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [showMethodology, setShowMethodology] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor selecciona un archivo de imagen válido");
        return;
      }

      // Validar tamaño (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("La imagen debe ser menor a 10MB");
        return;
      }

      setSelectedImage(file);
      setResults(null);
      toast.success("Imagen cargada exitosamente");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".webp"],
    },
    multiple: false,
  });

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast.error("Por favor selecciona una imagen para analizar");
      return;
    }

    setIsAnalyzing(true);
    setResults(null);

    try {
      const analysisResults = await analysisService.analyzeImage(selectedImage);
      setResults(analysisResults);
      toast.success("Análisis de imagen completado exitosamente");
    } catch (error) {
      console.error("Error en el análisis:", error);
      toast.error("Error al analizar la imagen. Por favor intenta de nuevo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completado":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "Iniciando":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case "Procesando":
        return <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completado":
        return "text-green-600 bg-green-50 border-green-200";
      case "Error":
        return "text-red-600 bg-red-50 border-red-200";
      case "Iniciando":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "Procesando":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Image className="w-12 h-12 text-primary-600 mr-4" />
          <h1 className="text-4xl font-bold text-gray-900">
            Análisis de Imagen
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Detecta si una imagen fue generada por inteligencia artificial o es
          una imagen real utilizando análisis visual avanzado y metadatos.
        </p>
      </div>

      {/* Image Upload Section */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Sube la imagen a analizar
          </h2>
          <p className="text-gray-600">
            Arrastra y suelta una imagen o haz clic para seleccionarla. Formatos
            soportados: JPEG, PNG, GIF, BMP, WebP (máximo 10MB).
          </p>
        </div>

        <div className="space-y-6">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary-400 bg-primary-50"
                : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />

            {selectedImage ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Preview"
                    className="max-h-64 max-w-full rounded-lg shadow-sm"
                  />
                </div>

                <div className="text-center">
                  <FileImage className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {selectedImage.name} ({formatFileSize(selectedImage.size)})
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Haz clic para cambiar la imagen
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {isDragActive
                      ? "Suelta la imagen aquí"
                      : "Arrastra y suelta la imagen"}
                  </p>
                  <p className="text-gray-500 mt-2">
                    o haz clic para seleccionar
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Analyze Button */}
          <div className="text-center">
            <button
              onClick={handleAnalyze}
              disabled={!selectedImage || isAnalyzing}
              className={`flex items-center px-8 py-3 rounded-lg font-medium transition-colors mx-auto ${
                !selectedImage || isAnalyzing
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700 text-white"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analizando Imagen...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Analizar Imagen
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Methodology Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowMethodology(!showMethodology)}
          className="text-primary-600 hover:text-primary-700 font-medium flex items-center mx-auto"
        >
          {showMethodology ? "Ocultar" : "Mostrar"} metodología de análisis
        </button>
      </div>

      {/* Methodology Section */}
      {showMethodology && (
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Metodología de Análisis de Imágenes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                1. Análisis Visual con Gemini Vision
              </h3>
              <p className="text-gray-600">
                Utilizamos el modelo Gemini Pro Vision para analizar el
                contenido visual de la imagen y detectar patrones
                característicos de imágenes generadas por IA.
              </p>

              <h3 className="text-lg font-semibold text-gray-800">
                2. Análisis de Metadatos
              </h3>
              <p className="text-gray-600">
                Examinamos los metadatos del archivo, incluyendo tamaño,
                formato, dimensiones y fecha de modificación para identificar
                anomalías.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                3. Detección de Patrones
              </h3>
              <p className="text-gray-600">
                Analizamos patrones visuales como texturas, sombras, iluminación
                y consistencia para identificar signos de generación artificial.
              </p>

              <h3 className="text-lg font-semibold text-gray-800">
                4. Análisis Final
              </h3>
              <p className="text-gray-600">
                Combinamos todos los resultados para determinar la probabilidad
                de que la imagen sea generada por inteligencia artificial.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {results && (
        <div className="space-y-6">
          {/* Final Result */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Resultado del Análisis
              </h2>
              <div
                className={`px-4 py-2 rounded-full font-medium ${
                  results.finalResult === "IA"
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : "bg-green-100 text-green-800 border border-green-200"
                }`}
              >
                {results.finalResult === "IA"
                  ? "Generada por IA"
                  : "Imagen Real"}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {Math.round(results.confidence * 100)}%
                </div>
                <div className="text-gray-600">Confianza</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {Math.round(results.scores?.ai * 100)}%
                </div>
                <div className="text-gray-600">Probabilidad IA</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {Math.round(results.scores?.human * 100)}%
                </div>
                <div className="text-gray-600">Probabilidad Real</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Explicación:</h3>
              <p className="text-gray-700">{results.explanation}</p>
            </div>
          </div>

          {/* Pipeline Steps */}
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Proceso de Análisis
            </h2>

            <div className="space-y-4">
              {results.pipeline.map((step) => (
                <div key={step.step} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(step.status)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {step.name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                            step.status
                          )}`}
                        >
                          {step.status}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-3">{step.description}</p>

                      {step.result && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <h4 className="font-medium text-gray-800 mb-2">
                            Resultado:
                          </h4>
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                            {JSON.stringify(step.result, null, 2)}
                          </pre>
                        </div>
                      )}

                      {step.error && (
                        <div className="bg-red-50 rounded-lg p-3">
                          <h4 className="font-medium text-red-800 mb-2">
                            Error:
                          </h4>
                          <p className="text-sm text-red-700">{step.error}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Results */}
          {results.gemini && (
            <div className="card">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Análisis Visual - Google Gemini Vision
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Indicadores Visuales:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {results.gemini.visualIndicators?.map(
                      (indicator, index) => (
                        <li key={index}>{indicator}</li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Calidad de la Imagen:
                  </h3>
                  <p className="text-gray-700">{results.gemini.quality}</p>
                </div>
              </div>

              {results.gemini.suggestions && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    Sugerencias:
                  </h3>
                  <p className="text-blue-700">{results.gemini.suggestions}</p>
                </div>
              )}
            </div>
          )}

          {/* Metadata Results */}
          {results.huggingface && (
            <div className="card">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Análisis de Metadatos
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 mb-2">
                    {formatFileSize(results.huggingface.metadata.fileSize)}
                  </div>
                  <div className="text-gray-600">Tamaño del Archivo</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 mb-2">
                    {results.huggingface.metadata.fileType
                      .split("/")[1]
                      .toUpperCase()}
                  </div>
                  <div className="text-gray-600">Formato</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 mb-2">
                    {results.huggingface.metadata.dimensions?.width || "N/A"}
                  </div>
                  <div className="text-gray-600">Ancho (px)</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 mb-2">
                    {results.huggingface.metadata.dimensions?.height || "N/A"}
                  </div>
                  <div className="text-gray-600">Alto (px)</div>
                </div>
              </div>

              {results.huggingface.indicators.length > 0 && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">
                    Indicadores Detectados:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-yellow-700">
                    {results.huggingface.indicators.map((indicator, index) => (
                      <li key={index}>{indicator}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tips Section */}
      <div className="card bg-blue-50 border-blue-200">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">
          Consejos para Mejorar la Detección
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">
              Imágenes más precisas:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Usa imágenes de alta resolución</li>
              <li>Evita imágenes muy comprimidas</li>
              <li>Incluye detalles y texturas</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-blue-800 mb-2">
              Interpretación de resultados:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Confianza alta (&gt;80%): Resultado muy confiable</li>
              <li>
                Confianza media (60-80%): Resultado moderadamente confiable
              </li>
              <li>Confianza baja (&lt;60%): Se recomienda análisis manual</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageAnalysis;
