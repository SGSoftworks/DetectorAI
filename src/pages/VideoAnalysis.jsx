import React, { useState, useCallback } from "react";
import {
  Video,
  Upload,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  FileVideo,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import videoAnalysisService from "../services/videoAnalysisService";
import toast from "react-hot-toast";

const VideoAnalysis = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [showMethodology, setShowMethodology] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith("video/")) {
        toast.error("Por favor selecciona un archivo de video válido");
        return;
      }

      // Validar tamaño (máximo 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast.error("El video debe ser menor a 100MB");
        return;
      }

      setSelectedVideo(file);
      setResults(null);
      toast.success("Video cargado exitosamente");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm", ".mkv"],
    },
    multiple: false,
  });

  const handleAnalyze = async () => {
    if (!selectedVideo) {
      toast.error("Por favor selecciona un video para analizar");
      return;
    }

    setIsAnalyzing(true);
    setResults(null);

    try {
      const analysisResults = await videoAnalysisService.analyzeVideo(selectedVideo);
      setResults(analysisResults);
      toast.success("Análisis de video completado exitosamente");
    } catch (error) {
      console.error("Error en el análisis:", error);
      toast.error("Error al analizar el video. Por favor intenta de nuevo.");
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

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Video className="w-12 h-12 text-primary-600 mr-4" />
          <h1 className="text-4xl font-bold text-gray-900">
            Análisis de Video
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Detecta si un video fue generado por inteligencia artificial o es
          contenido real utilizando análisis avanzado de frames, audio y
          patrones de movimiento.
        </p>
      </div>

      {/* Video Upload Section */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Sube el video a analizar
          </h2>
          <p className="text-gray-600">
            Arrastra y suelta un video o haz clic para seleccionarlo. Formatos
            soportados: MP4, AVI, MOV, WMV, FLV, WebM, MKV (máximo 100MB).
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

            {selectedVideo ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <video
                    src={URL.createObjectURL(selectedVideo)}
                    controls
                    className="max-h-64 max-w-full rounded-lg shadow-sm"
                  />
                </div>

                <div className="text-center">
                  <FileVideo className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {selectedVideo.name} ({formatFileSize(selectedVideo.size)})
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Haz clic para cambiar el video
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {isDragActive
                      ? "Suelta el video aquí"
                      : "Arrastra y suelta el video"}
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
              disabled={!selectedVideo || isAnalyzing}
              className={`flex items-center px-8 py-3 rounded-lg font-medium transition-colors mx-auto ${
                !selectedVideo || isAnalyzing
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700 text-white"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analizando Video...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Analizar Video
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
            Metodología de Análisis de Videos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                1. Análisis de Frames
              </h3>
              <p className="text-gray-600">
                Extraemos y analizamos frames clave del video para detectar
                inconsistencias visuales y patrones artificiales.
              </p>

              <h3 className="text-lg font-semibold text-gray-800">
                2. Análisis de Audio
              </h3>
              <p className="text-gray-600">
                Examinamos la calidad del audio, patrones de voz y sonidos para
                identificar generación artificial o manipulación.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                3. Análisis de Movimiento
              </h3>
              <p className="text-gray-600">
                Analizamos la consistencia del movimiento, transiciones y
                estabilidad para detectar deepfakes o contenido generado.
              </p>

              <h3 className="text-lg font-semibold text-gray-800">
                4. Análisis Final
              </h3>
              <p className="text-gray-600">
                Combinamos todos los resultados para determinar la probabilidad
                de que el video sea generado por inteligencia artificial.
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
                  ? "Generado por IA"
                  : "Contenido Real"}
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
                  {results.finalResult === "IA" ? Math.round(results.confidence * 100) : Math.round((1 - results.confidence) * 100)}%
                </div>
                <div className="text-gray-600">Probabilidad IA</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {results.finalResult === "Humano" ? Math.round(results.confidence * 100) : Math.round((1 - results.confidence) * 100)}%
                </div>
                <div className="text-gray-600">Probabilidad Real</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Explicación:</h3>
              <p className="text-gray-700">{results.explanation}</p>
            </div>

            {/* Deepfake Indicators */}
            {results.deepfakeIndicators && results.deepfakeIndicators.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Indicadores de Deepfake Detectados:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-red-700">
                  {results.deepfakeIndicators.map((indicator, index) => (
                    <li key={index}>{indicator}</li>
                  ))}
                </ul>
              </div>
            )}
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Features Implemented Section */}
      <div className="card bg-green-50 border-green-200">
        <div className="text-center">
          <Video className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-green-900 mb-4">
            Funcionalidades Implementadas
          </h2>
          <p className="text-green-800 mb-6">
            El análisis de video ya está completamente funcional e incluye:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <h3 className="font-semibold text-green-900 mb-2">
                Análisis de Frames
              </h3>
              <p className="text-green-700 text-sm">
                Detección de inconsistencias visuales y patrones artificiales
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <h3 className="font-semibold text-green-900 mb-2">
                Análisis de Audio
              </h3>
              <p className="text-green-700 text-sm">
                Detección de manipulación de voz y sonidos artificiales
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <h3 className="font-semibold text-green-900 mb-2">
                Detección de Deepfakes
              </h3>
              <p className="text-green-700 text-sm">
                Identificación de videos generados por IA con alta precisión
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="card bg-blue-50 border-blue-200">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">
          Consejos para Mejorar la Detección
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">
              Videos más precisos:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Usa videos de alta calidad</li>
              <li>Evita archivos muy comprimidos</li>
              <li>Incluye audio claro y sincronizado</li>
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

export default VideoAnalysis;
