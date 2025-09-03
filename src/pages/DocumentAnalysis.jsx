import React, { useState, useCallback } from "react";
import {
  File,
  Upload,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  FileText,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import documentAnalysisService from "../services/documentAnalysisService";
import toast from "react-hot-toast";

const DocumentAnalysis = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [showMethodology, setShowMethodology] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validar tipo de archivo
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "text/markdown",
        "application/rtf",
      ];

      if (!validTypes.includes(file.type)) {
        toast.error(
          "Por favor selecciona un documento válido (PDF, Word, TXT, MD, RTF)"
        );
        return;
      }

      // Validar tamaño (máximo 25MB)
      if (file.size > 25 * 1024 * 1024) {
        toast.error("El documento debe ser menor a 25MB");
        return;
      }

      setSelectedDocument(file);
      setResults(null);
      toast.success("Documento cargado exitosamente");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
      "text/markdown": [".md"],
      "application/rtf": [".rtf"],
    },
    multiple: false,
  });

  const handleAnalyze = async () => {
    if (!selectedDocument) {
      toast.error("Por favor selecciona un documento para analizar");
      return;
    }

    setIsAnalyzing(true);
    setResults(null);

    try {
      const analysisResults = await documentAnalysisService.analyzeDocument(selectedDocument);
      setResults(analysisResults);
      toast.success("Análisis de documento completado exitosamente");
    } catch (error) {
      console.error("Error en el análisis:", error);
      toast.error(
        "Error al analizar el documento. Por favor intenta de nuevo."
      );
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

  const getFileIcon = (fileType) => {
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("word") || fileType.includes("doc")) return "📝";
    if (fileType.includes("text") || fileType.includes("markdown")) return "📄";
    if (fileType.includes("rtf")) return "📄";
    return "📄";
  };

  const getFileTypeName = (fileType) => {
    if (fileType.includes("pdf")) return "PDF";
    if (fileType.includes("word") || fileType.includes("doc")) return "Word";
    if (fileType.includes("text")) return "Texto";
    if (fileType.includes("markdown")) return "Markdown";
    if (fileType.includes("rtf")) return "RTF";
    return "Documento";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <File className="w-12 h-12 text-primary-600 mr-4" />
          <h1 className="text-4xl font-bold text-gray-900">
            Análisis de Documentos
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Detecta si un documento fue generado por inteligencia artificial o
          escrito por un humano utilizando análisis avanzado de texto,
          estructura y patrones lingüísticos.
        </p>
      </div>

      {/* Document Upload Section */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Sube el documento a analizar
          </h2>
          <p className="text-gray-600">
            Arrastra y suelta un documento o haz clic para seleccionarlo.
            Formatos soportados: PDF, Word (DOC/DOCX), TXT, Markdown, RTF
            (máximo 25MB).
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

            {selectedDocument ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">
                      {getFileIcon(selectedDocument.type)}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <FileText className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {selectedDocument.name} (
                    {formatFileSize(selectedDocument.size)})
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Tipo: {getFileTypeName(selectedDocument.type)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Haz clic para cambiar el documento
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {isDragActive
                      ? "Suelta el documento aquí"
                      : "Arrastra y suelta el documento"}
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
              disabled={!selectedDocument || isAnalyzing}
              className={`flex items-center px-8 py-3 rounded-lg font-medium transition-colors mx-auto ${
                !selectedDocument || isAnalyzing
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700 text-white"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analizando Documento...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Analizar Documento
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
            Metodología de Análisis de Documentos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                1. Extracción de Texto
              </h3>
              <p className="text-gray-600">
                Extraemos y limpiamos el contenido textual del documento,
                preservando la estructura y formato original.
              </p>

              <h3 className="text-lg font-semibold text-gray-800">
                2. Análisis de Estructura
              </h3>
              <p className="text-gray-600">
                Examinamos la organización del documento, párrafos, encabezados
                y elementos de formato para detectar patrones.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                3. Análisis Lingüístico
              </h3>
              <p className="text-gray-600">
                Analizamos patrones de escritura, vocabulario, complejidad y
                estilo para identificar generación artificial.
              </p>

              <h3 className="text-lg font-semibold text-gray-800">
                4. Verificación de Contenido
              </h3>
              <p className="text-gray-600">
                Buscamos similitudes con fuentes existentes y verificamos la
                originalidad del contenido del documento.
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
                  : "Escrito por Humano"}
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
                <div className="text-gray-600">Probabilidad Humano</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Explicación:</h3>
              <p className="text-gray-700">{results.explanation}</p>
            </div>

            {/* AI Indicators */}
            {results.aiIndicators && results.aiIndicators.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Indicadores de IA Detectados:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-red-700">
                  {results.aiIndicators.map((indicator, index) => (
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

      {/* Supported Formats */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Formatos Soportados
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-3xl mb-2">📄</div>
            <h3 className="font-semibold text-gray-800 mb-2">PDF</h3>
            <p className="text-gray-600 text-sm">
              Documentos PDF con texto extraíble
            </p>
          </div>

          <div className="text-center p-4 border rounded-lg">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-semibold text-gray-800 mb-2">Microsoft Word</h3>
            <p className="text-gray-600 text-sm">Archivos DOC y DOCX</p>
          </div>

          <div className="text-center p-4 border rounded-lg">
            <div className="text-3xl mb-2">📄</div>
            <h3 className="font-semibold text-gray-800 mb-2">Texto Plano</h3>
            <p className="text-gray-600 text-sm">Archivos TXT, MD y RTF</p>
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
              Documentos más precisos:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Usa documentos con texto extraíble</li>
              <li>Incluye contenido sustancial (mínimo 500 palabras)</li>
              <li>Evita documentos escaneados como imagen</li>
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

export default DocumentAnalysis;
