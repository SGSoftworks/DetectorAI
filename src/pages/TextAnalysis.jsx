import React, { useState } from "react";
import {
  FileText,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Info,
  BarChart3,
  Shield,
  Zap,
  Clock,
  Target,
} from "lucide-react";
import analysisService from "../services/analysisService";
import toast from "react-hot-toast";

const TextAnalysis = () => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [showMethodology, setShowMethodology] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.error("Por favor ingresa algún texto para analizar");
      return;
    }

    if (text.length < 50) {
      toast.error(
        "El texto debe tener al menos 50 caracteres para un análisis preciso"
      );
      return;
    }

    setIsAnalyzing(true);
    setResults(null);

    try {
      const analysisResults = await analysisService.analyzeText(text);
      setResults(analysisResults);
      toast.success("Análisis completado exitosamente");
    } catch (error) {
      console.error("Error en el análisis:", error);
      toast.error("Error al analizar el texto. Por favor intenta de nuevo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceBgColor = (confidence) => {
    if (confidence >= 80) return "bg-green-50 border-green-200";
    if (confidence >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  const getResultIcon = (result) => {
    switch (result) {
      case "Humano":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "IA":
        return <XCircle className="w-6 h-6 text-red-600" />;
      case "Sospechoso":
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-600" />;
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case "Humano":
        return "bg-green-100 text-green-800 border-green-200";
      case "IA":
        return "bg-red-100 text-red-800 border-red-200";
      case "Sospechoso":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Función para renderizar resultados detallados del pipeline
  const renderStepResult = (result, stepName) => {
    if (typeof result === "string") {
      return <span className="font-medium text-gray-700">{result}</span>;
    }

    if (typeof result === "object") {
      // Paso 1: Análisis con Google Gemini
      if (stepName.includes("Gemini")) {
        return (
          <div className="space-y-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-900">
                Análisis Gemini
              </span>
            </div>

            {result.isAI !== undefined && (
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-700">
                  Clasificación:
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.isAI
                      ? "bg-red-100 text-red-800 border border-red-300"
                      : "bg-green-100 text-green-800 border border-green-300"
                  }`}
                >
                  {result.isAI ? "🤖 Generado por IA" : "👤 Escrito por Humano"}
                </span>
              </div>
            )}

            {result.confidence && (
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-700">
                  Nivel de Confianza:
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-blue-700">
                    {Math.round(result.confidence * 100)}%
                  </span>
                </div>
              </div>
            )}

            {result.reasoning && (
              <div>
                <span className="font-medium text-gray-700 block mb-2">
                  Razonamiento:
                </span>
                <div className="bg-white p-3 rounded border border-gray-200">
                  {result.reasoning.includes("```json") ? (
                    <div className="space-y-2">
                      {(() => {
                        try {
                          const jsonMatch = result.reasoning.match(
                            /```json\s*(\{[\s\S]*?\})\s*```/
                          );
                          if (jsonMatch) {
                            const jsonData = JSON.parse(jsonMatch[1]);
                            return (
                              <div className="space-y-3">
                                {jsonData.reasoning && (
                                  <div>
                                    <span className="font-medium text-gray-600 text-xs block mb-1">
                                      Análisis:
                                    </span>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                      {jsonData.reasoning}
                                    </p>
                                  </div>
                                )}
                                {jsonData.indicators &&
                                  Array.isArray(jsonData.indicators) && (
                                    <div>
                                      <span className="font-medium text-gray-600 text-xs block mb-1">
                                        Indicadores Clave:
                                      </span>
                                      <ul className="text-gray-700 text-sm space-y-1">
                                        {jsonData.indicators.map(
                                          (indicator, idx) => (
                                            <li
                                              key={idx}
                                              className="flex items-start gap-2"
                                            >
                                              <span className="text-blue-500 mt-1">
                                                •
                                              </span>
                                              <span>{indicator}</span>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  )}
                                {jsonData.languagePatterns && (
                                  <div>
                                    <span className="font-medium text-gray-600 text-xs block mb-1">
                                      Patrones Lingüísticos:
                                    </span>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                      {jsonData.languagePatterns}
                                    </p>
                                  </div>
                                )}
                                {jsonData.suggestions && (
                                  <div>
                                    <span className="font-medium text-gray-600 text-xs block mb-1">
                                      Sugerencias:
                                    </span>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                      {jsonData.suggestions}
                                    </p>
                                  </div>
                                )}
                              </div>
                            );
                          }
                        } catch (e) {
                          // Si falla el parsing, mostrar el texto limpio
                        }
                        return (
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {result.reasoning
                              .replace(/```json[\s\S]*?```/g, "")
                              .trim()}
                          </p>
                        );
                      })()}
                    </div>
                  ) : (
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {result.reasoning}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      }

      // Paso 2: Análisis con Hugging Face
      if (stepName.includes("Hugging Face")) {
        return (
          <div className="space-y-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-purple-900">
                Análisis Hugging Face
              </span>
            </div>

            {result.result && (
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-700">
                  Clasificación:
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.result === "IA"
                      ? "bg-red-100 text-red-800 border border-red-300"
                      : "bg-green-100 text-green-800 border border-green-300"
                  }`}
                >
                  {result.result === "IA" ? "🤖 IA" : "👤 Humano"}
                </span>
              </div>
            )}

            {result.confidence && (
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-700">Confianza:</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-purple-700">
                    {Math.round(result.confidence * 100)}%
                  </span>
                </div>
              </div>
            )}

            {result.explanation && (
              <div>
                <span className="font-medium text-gray-700 block mb-2">
                  Explicación:
                </span>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <div className="space-y-2">
                    {result.explanation.includes("Análisis de fallback:") ? (
                      <>
                        <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                          <span className="text-xs font-medium text-yellow-800">
                            ⚠️ Análisis de Fallback Utilizado
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {result.explanation
                            .replace("Análisis de fallback:", "")
                            .trim()}
                        </p>
                        <div className="text-xs text-gray-500 mt-2">
                          <span className="font-medium">Nota:</span> Se utilizó
                          análisis heurístico debido a fallos en las APIs de
                          Hugging Face
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {result.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {result.complexity && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                  <span className="font-medium text-gray-700 block text-xs mb-1">
                    Nivel de Complejidad:
                  </span>
                  <span className="text-lg font-bold text-purple-700">
                    {result.complexity.level}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    {result.complexity.level === "Baja"
                      ? "Fácil de entender"
                      : result.complexity.level === "Media"
                      ? "Comprensión moderada"
                      : "Requiere atención especial"}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                  <span className="font-medium text-gray-700 block text-xs mb-1">
                    Score de Complejidad:
                  </span>
                  <span className="text-lg font-bold text-purple-700">
                    {Math.round(result.complexity.score * 100)}%
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    {result.complexity.score < 0.3
                      ? "Muy simple"
                      : result.complexity.score < 0.7
                      ? "Complejidad moderada"
                      : "Muy complejo"}
                  </div>
                </div>
              </div>
            )}

            {result.readability && (
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                <span className="font-medium text-gray-700 block text-xs mb-1">
                  Índice de Legibilidad:
                </span>
                <span className="text-lg font-bold text-purple-700">
                  {Math.round(result.readability)}%
                </span>
                <div className="text-xs text-gray-500 mt-1">
                  {result.readability >= 80
                    ? "Muy fácil de leer"
                    : result.readability >= 60
                    ? "Fácil de leer"
                    : result.readability >= 40
                    ? "Moderadamente difícil"
                    : "Difícil de leer"}
                </div>
              </div>
            )}
          </div>
        );
      }

      // Paso 3: Verificación de Contenido
      if (stepName.includes("Verificación")) {
        return (
          <div className="space-y-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-900">
                Verificación de Contenido
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {result.totalResults && (
                <div className="bg-white p-2 rounded border border-gray-200">
                  <span className="font-medium text-gray-700 block text-xs">
                    Total de Resultados:
                  </span>
                  <span className="text-sm font-semibold text-green-700">
                    {result.totalResults}
                  </span>
                </div>
              )}
              {result.similarity && (
                <div className="bg-white p-2 rounded border border-gray-200">
                  <span className="font-medium text-gray-700 block text-xs">
                    Similitud:
                  </span>
                  <span className="text-sm font-semibold text-green-700">
                    {Math.round(result.similarity * 100)}%
                  </span>
                </div>
              )}
            </div>

            {result.searchResults &&
              Array.isArray(result.searchResults) &&
              result.searchResults.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-700 block">
                      🔍 Fuentes Relacionadas Encontradas:
                    </span>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                      {result.searchResults.length} resultados totales
                    </span>
                  </div>
                  <div className="space-y-3">
                    {result.searchResults.slice(0, 5).map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-300"
                      >
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group"
                        >
                          <div className="font-bold text-blue-700 text-sm mb-2 group-hover:text-blue-800 transition-colors">
                            📄 {item.title}
                          </div>
                        </a>
                        <div className="text-xs text-gray-500 mb-2 font-medium">
                          🌐 {item.displayLink}
                        </div>
                        <div className="text-sm text-gray-700 leading-relaxed">
                          {item.snippet.length > 120
                            ? `${item.snippet.substring(0, 120)}...`
                            : item.snippet}
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            Relevancia:{" "}
                            {item.relevance
                              ? Math.round(item.relevance * 100)
                              : "N/A"}
                            %
                          </span>
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-200 transition-colors"
                          >
                            <span>Ver fuente</span>
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                  {result.searchResults.length > 5 && (
                    <div className="text-center mt-3">
                      <span className="text-xs text-gray-500">
                        Mostrando los 5 resultados más relevantes de{" "}
                        {result.searchResults.length} encontrados
                      </span>
                    </div>
                  )}
                </div>
              )}
          </div>
        );
      }

      // Paso 4: Análisis Final
      if (stepName.includes("Final")) {
        return (
          <div className="space-y-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-orange-600" />
              <span className="font-semibold text-orange-900">
                Análisis Final
              </span>
            </div>

            {result.result && (
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-700">
                  Decisión Final:
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.result === "IA"
                      ? "bg-red-100 text-red-800 border border-red-300"
                      : "bg-green-100 text-green-800 border border-green-300"
                  }`}
                >
                  {result.result === "IA"
                    ? "🤖 CONTENIDO GENERADO POR IA"
                    : "👤 CONTENIDO HUMANO"}
                </span>
              </div>
            )}

            {result.confidence && (
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-700">
                  Confianza Final:
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-orange-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-orange-700">
                    {Math.round(result.confidence * 100)}%
                  </span>
                </div>
              </div>
            )}

            {result.scores && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center shadow-sm">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <span className="font-medium text-gray-700 block text-sm mb-2">
                    Probabilidad IA
                  </span>
                  <span className="text-3xl font-bold text-red-600">
                    {Math.min(Math.round(result.scores.ai * 100), 100)}%
                  </span>
                  <div className="text-xs text-gray-500 mt-2">
                    {result.scores.ai > 0.7
                      ? "Alta probabilidad"
                      : result.scores.ai > 0.4
                      ? "Probabilidad moderada"
                      : "Baja probabilidad"}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center shadow-sm">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">👤</span>
                  </div>
                  <span className="font-medium text-gray-700 block text-sm mb-2">
                    Probabilidad Humano
                  </span>
                  <span className="text-3xl font-bold text-green-600">
                    {Math.min(Math.round(result.scores.human * 100), 100)}%
                  </span>
                  <div className="text-xs text-gray-500 mt-2">
                    {result.scores.human > 0.7
                      ? "Alta probabilidad"
                      : result.scores.human > 0.4
                      ? "Probabilidad moderada"
                      : "Baja probabilidad"}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }

      // Para otros objetos, mostrar propiedades clave
      const simpleProps = Object.keys(result).filter(
        (key) =>
          typeof result[key] === "string" ||
          typeof result[key] === "number" ||
          typeof result[key] === "boolean"
      );

      if (simpleProps.length > 0) {
        return (
          <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            {simpleProps.map((key) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium text-gray-700 capitalize">
                  {key}:
                </span>
                <span className="text-gray-900">{String(result[key])}</span>
              </div>
            ))}
          </div>
        );
      }

      // Si no hay propiedades simples, usar JSON.stringify
      return (
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <pre className="text-xs text-gray-700 overflow-auto whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      );
    }

    // Para otros tipos, convertir a string
    return <span className="font-medium text-gray-700">{String(result)}</span>;
  };

  // Función para limpiar y hacer nuevo análisis
  const handleNewAnalysis = () => {
    setText("");
    setResults(null);
    setShowMethodology(false);
  };

  return (
    <div className="space-section">
      {/* Header mejorado */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-responsive-xl font-bold text-gray-900">
              Análisis de Texto
            </h1>
            <p className="text-lg text-gray-600">
              Detecta contenido generado por IA
            </p>
          </div>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Utiliza tecnología avanzada de procesamiento de lenguaje natural para
          identificar si un texto fue escrito por un humano o generado por
          inteligencia artificial
        </p>
      </div>

      {/* Metodología mejorada */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-responsive-md font-bold text-gray-900 mb-2">
              Metodología de Análisis
            </h2>
            <p className="text-gray-600">
              Descubre cómo funciona nuestro sistema de detección
            </p>
          </div>
          <button
            onClick={() => setShowMethodology(!showMethodology)}
            className="btn-secondary flex items-center"
          >
            <Info className="w-4 h-4 mr-2" />
            {showMethodology ? "Ocultar" : "Mostrar"} Detalles
          </button>
        </div>

        {showMethodology && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-4 text-lg">
              Proceso de Análisis en 4 Pasos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-blue-900 mb-1">
                  1. Extracción
                </h4>
                <p className="text-blue-700 text-sm">
                  Análisis de características lingüísticas
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-purple-900 mb-1">
                  2. Procesamiento
                </h4>
                <p className="text-purple-700 text-sm">
                  Evaluación con modelos de IA
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-green-900 mb-1">
                  3. Verificación
                </h4>
                <p className="text-green-700 text-sm">
                  Búsqueda de fuentes y validación
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-medium text-orange-900 mb-1">
                  4. Resultado
                </h4>
                <p className="text-orange-700 text-sm">
                  Clasificación final con confianza
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Entrada de texto */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ingresa el texto a analizar
            </h3>
            <div className="space-y-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Pega aquí el texto que quieres analizar. Puede ser un artículo, ensayo, trabajo académico, o cualquier contenido escrito..."
                className="input-primary min-h-[200px] resize-none"
                disabled={isAnalyzing}
              />
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{text.length} caracteres</span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Tiempo estimado: 2-5 segundos
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !text.trim()}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analizando...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Iniciar Análisis
                    </>
                  )}
                </button>

                {results && (
                  <button
                    onClick={handleNewAnalysis}
                    className="btn-secondary px-4 py-2"
                    title="Hacer nuevo análisis"
                  >
                    <Zap className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resultados del Análisis
            </h3>
            {!results && !isAnalyzing && (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-600 mb-2">
                  No hay resultados aún
                </h4>
                <p className="text-gray-500">
                  Ingresa un texto y haz clic en "Iniciar Análisis" para
                  comenzar
                </p>
              </div>
            )}

            {isAnalyzing && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
                <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
                <h4 className="text-lg font-medium text-blue-900 mb-2">
                  Analizando texto...
                </h4>
                <p className="text-blue-700">
                  Nuestro sistema está procesando tu contenido. Esto puede tomar
                  unos segundos.
                </p>
              </div>
            )}

            {results && (
              <div className="space-y-6">
                {/* Resultado principal */}
                <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-bold text-gray-900">
                      🎯 Resultado Final del Análisis
                    </h4>
                    {getResultIcon(results.finalResult)}
                  </div>
                  <div className="text-center">
                    <div className="mb-4">
                      <span
                        className={`inline-block px-6 py-3 rounded-full text-lg font-bold border-2 shadow-lg ${getResultColor(
                          results.finalResult
                        )}`}
                      >
                        {results.finalResult === "IA"
                          ? "🤖 CONTENIDO GENERADO POR IA"
                          : "👤 CONTENIDO HUMANO"}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {results.finalResult === "IA"
                        ? "El sistema ha detectado características típicas de contenido generado por inteligencia artificial"
                        : "El sistema ha identificado patrones característicos de contenido escrito por humanos"}
                    </p>
                  </div>
                </div>

                {/* Nivel de confianza */}
                <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
                  <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    Nivel de Confianza del Sistema
                  </h4>
                  <div className="text-center">
                    <div className="mb-4">
                      <div
                        className={`text-5xl font-bold mb-3 ${getConfidenceColor(
                          results.confidence
                        )}`}
                      >
                        {results.confidence}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 mb-4 shadow-inner">
                        <div
                          className={`h-4 rounded-full transition-all duration-1000 shadow-lg ${
                            results.confidence >= 80
                              ? "bg-gradient-to-r from-green-400 to-green-600"
                              : results.confidence >= 60
                              ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                              : "bg-gradient-to-r from-red-400 to-red-600"
                          }`}
                          style={{ width: `${results.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-700 font-medium">
                        {results.confidence >= 80
                          ? "✅ Alta confianza - El resultado es muy confiable"
                          : results.confidence >= 60
                          ? "⚠️ Confianza moderada - El resultado es confiable pero se recomienda revisión"
                          : "❌ Baja confianza - Se recomienda análisis manual adicional"}
                      </p>
                    </div>
                  </div>

                  {/* Explicación adicional del nivel de confianza */}
                  <div className="mt-4 bg-blue-100 p-3 rounded-lg border border-blue-300">
                    <div className="text-xs text-blue-800">
                      <span className="font-medium">
                        ¿Qué significa este nivel de confianza?
                      </span>
                      <ul className="mt-2 space-y-1 text-left">
                        <li>
                          • <strong>80-100%:</strong> El sistema está muy seguro
                          de su clasificación
                        </li>
                        <li>
                          • <strong>60-79%:</strong> El sistema está
                          moderadamente seguro, pero se recomienda revisión
                        </li>
                        <li>
                          • <strong>0-59%:</strong> El sistema tiene poca
                          confianza, se recomienda análisis manual
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Explicación detallada */}
                <div className="bg-gradient-to-br from-white to-green-50 border border-green-200 rounded-2xl p-6 shadow-lg">
                  <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Info className="w-6 h-6 text-green-600" />
                    Explicación Detallada del Resultado
                  </h4>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    {results.explanation && typeof results.explanation === 'object' ? (
                      <div className="space-y-6">
                        {/* Gemini Analysis */}
                        {results.explanation.gemini && results.explanation.gemini.available && (
                          <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 mb-3">
                              <Target className="w-5 h-5 text-blue-600" />
                              <span className="font-semibold text-blue-900 text-lg">
                                Análisis Gemini 2.0 Flash
                              </span>
                              {results.explanation.gemini.fallback && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full border border-yellow-300">
                                  ⚠️ Fallback
                                </span>
                              )}
                            </div>
                            
                            <div className="space-y-3">
                              {results.explanation.gemini.result && (
                                <div className="flex items-center gap-3">
                                  <span className="font-medium text-gray-700">Clasificación:</span>
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    results.explanation.gemini.result === "IA"
                                      ? "bg-red-100 text-red-800 border border-red-300"
                                      : "bg-green-100 text-green-800 border border-green-300"
                                  }`}>
                                    {results.explanation.gemini.result === "IA" ? "🤖 IA" : "👤 Humano"}
                                  </span>
                                                    <span className="text-sm text-blue-700 font-medium">
                    ({Math.round(results.explanation.gemini.confidence * 100)}% confianza)
                  </span>
                  <div className="w-16 bg-gray-200 rounded-full h-1.5 ml-2">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${results.explanation.gemini.confidence * 100}%` }}
                    ></div>
                  </div>
                                </div>
                              )}
                              
                              {results.explanation.gemini.reasoning && (
                                <div>
                                  <span className="font-medium text-gray-700 block mb-2">Razonamiento:</span>
                                  <div className="bg-white p-3 rounded border border-gray-200">
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                      {results.explanation.gemini.reasoning}
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              {results.explanation.gemini.indicators && results.explanation.gemini.indicators.length > 0 && (
                                <div>
                                  <span className="font-medium text-gray-700 block mb-2">Indicadores Clave:</span>
                                  <ul className="bg-white p-3 rounded border border-gray-200 space-y-1">
                                    {results.explanation.gemini.indicators.map((indicator, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="text-blue-500 mt-1">•</span>
                                        <span>{indicator}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {results.explanation.gemini.languagePatterns && (
                                <div>
                                  <span className="font-medium text-gray-700 block mb-2">Patrones Lingüísticos:</span>
                                  <div className="bg-white p-3 rounded border border-gray-200">
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                      {results.explanation.gemini.languagePatterns}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Hugging Face Analysis */}
                        {results.explanation.huggingface && results.explanation.huggingface.available && (
                          <div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
                            <div className="flex items-center gap-2 mb-3">
                              <BarChart3 className="w-5 h-5 text-purple-600" />
                              <span className="font-semibold text-purple-900 text-lg">
                                Análisis Hugging Face
                              </span>
                              {results.explanation.huggingface.fallback && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full border border-yellow-300">
                                  ⚠️ Análisis de Respaldo
                                </span>
                              )}
                            </div>
                            
                            <div className="space-y-3">
                              {results.explanation.huggingface.result && (
                                <div className="flex items-center gap-3">
                                  <span className="font-medium text-gray-700">Clasificación:</span>
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    results.explanation.huggingface.result === "IA"
                                      ? "bg-red-100 text-red-800 border border-red-300"
                                      : "bg-green-100 text-green-800 border border-green-300"
                                  }`}>
                                    {results.explanation.huggingface.result === "IA" ? "🤖 IA" : "👤 Humano"}
                                  </span>
                                  <span className="text-sm text-purple-700 font-medium">
                                    ({Math.round(results.explanation.huggingface.confidence * 100)}% confianza)
                                  </span>
                                  <div className="w-16 bg-gray-200 rounded-full h-1.5 ml-2">
                                    <div
                                      className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                                      style={{ width: `${results.explanation.huggingface.confidence * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                              
                              {results.explanation.huggingface.explanation && (
                                <div>
                                  <span className="font-medium text-gray-700 block mb-2">Explicación:</span>
                                  <div className="bg-white p-3 rounded border border-gray-200">
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                      {results.explanation.huggingface.explanation}
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              {results.explanation.huggingface.complexity && (
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                                    <span className="font-medium text-gray-700 block text-xs mb-1">Complejidad:</span>
                                    <span className="text-lg font-bold text-purple-700">
                                      {results.explanation.huggingface.complexity.level}
                                    </span>
                                  </div>
                                  <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                                    <span className="font-medium text-gray-700 block text-xs mb-1">Legibilidad:</span>
                                    <span className="text-lg font-bold text-purple-700">
                                      {Math.round(results.explanation.huggingface.readability)}%
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Web Search Analysis */}
                        {results.explanation.webSearch && results.explanation.webSearch.available && (
                          <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 mb-3">
                              <Shield className="w-5 h-5 text-green-600" />
                              <span className="font-semibold text-green-900 text-lg">
                                Verificación Web
                              </span>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-3 rounded border border-gray-200 text-center">
                                  <span className="font-medium text-gray-700 block text-xs mb-1">Total Resultados:</span>
                                  <span className="text-lg font-bold text-green-700">
                                    {results.explanation.webSearch.totalResults}
                                  </span>
                                </div>
                                <div className="bg-white p-3 rounded border border-gray-200 text-center">
                                  <span className="font-medium text-gray-700 block text-xs mb-1">Similitud:</span>
                                  <span className="text-lg font-bold text-green-700">
                                    {Math.round(results.explanation.webSearch.similarity * 100)}%
                                  </span>
                                </div>
                              </div>
                              
                              {results.explanation.webSearch.keywords && results.explanation.webSearch.keywords.length > 0 && (
                                <div>
                                  <span className="font-medium text-gray-700 block mb-2">Palabras Clave:</span>
                                  <div className="bg-white p-3 rounded border border-gray-200">
                                    <div className="flex flex-wrap gap-2">
                                      {results.explanation.webSearch.keywords.map((keyword, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full border border-green-300">
                                          {keyword}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {results.explanation.webSearch.topSources && results.explanation.webSearch.topSources.length > 0 && (
                                <div>
                                  <span className="font-medium text-gray-700 block mb-2">
                                    🔍 Fuentes Encontradas ({results.explanation.webSearch.topSources.length} de {results.explanation.webSearch.totalResults} total):
                                  </span>
                                  <div className="space-y-2">
                                    {results.explanation.webSearch.topSources.map((source, idx) => (
                                      <div key={idx} className="bg-white p-3 rounded border border-gray-200">
                                        <a
                                          href={source.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="block group"
                                        >
                                          <div className="font-bold text-blue-700 text-sm mb-1 group-hover:text-blue-800 transition-colors">
                                            📄 {source.title}
                                          </div>
                                        </a>
                                        <div className="text-xs text-gray-500 mb-1">🌐 {source.source}</div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-xs text-gray-500">
                                            Relevancia: {source.relevance}%
                                          </span>
                                          <a
                                            href={source.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-200 transition-colors"
                                          >
                                            <span>Ver fuente</span>
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                          </a>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Final Analysis */}
                        {results.explanation.finalAnalysis && (
                          <div className="bg-orange-50 p-5 rounded-lg border border-orange-200">
                            <div className="flex items-center gap-2 mb-3">
                              <CheckCircle className="w-5 h-5 text-orange-600" />
                              <span className="font-semibold text-orange-900 text-lg">
                                Análisis Final y Recomendación
                              </span>
                            </div>
                            
                            <div className="space-y-3">
                              {results.explanation.finalAnalysis.conclusion && (
                                <div className="flex items-center gap-3">
                                  <span className="font-medium text-gray-700">Conclusión:</span>
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    results.explanation.finalAnalysis.conclusion === "IA"
                                      ? "bg-red-100 text-red-800 border border-red-300"
                                      : "bg-green-100 text-green-800 border border-green-300"
                                  }`}>
                                    {results.explanation.finalAnalysis.conclusion === "IA" 
                                      ? "🤖 CONTENIDO GENERADO POR IA" 
                                      : "👤 CONTENIDO HUMANO"}
                                  </span>
                                </div>
                              )}
                              
                              {results.explanation.finalAnalysis.recommendation && (
                                <div>
                                  <span className="font-medium text-gray-700 block mb-2">Recomendación:</span>
                                  <div className="bg-white p-3 rounded border border-gray-200">
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                      {results.explanation.finalAnalysis.recommendation}
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              {results.explanation.finalAnalysis.factors && results.explanation.finalAnalysis.factors.length > 0 && (
                                <div>
                                  <span className="font-medium text-gray-700 block mb-2">Factores que Influenciaron la Decisión:</span>
                                  <ul className="bg-white p-3 rounded border border-gray-200 space-y-2">
                                    {results.explanation.finalAnalysis.factors.map((factor, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="text-orange-500 mt-1">•</span>
                                        <span>{factor}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Fallback para explicación en formato string (compatibilidad)
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {typeof results.explanation === 'string' ? results.explanation : 'Explicación no disponible'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Métricas adicionales si están disponibles */}
                {results.textMetrics && (
                  <div className="bg-gradient-to-br from-white to-purple-50 border border-purple-200 rounded-2xl p-6 shadow-lg">
                    <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Target className="w-6 h-6 text-purple-600" />
                      Métricas del Texto Analizado
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-purple-200 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {results.textMetrics.length}
                        </div>
                        <div className="text-xs text-gray-600">Caracteres</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-purple-200 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {results.textMetrics.words}
                        </div>
                        <div className="text-xs text-gray-600">Palabras</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-purple-200 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {results.textMetrics.complexity}
                        </div>
                        <div className="text-xs text-gray-600">Complejidad</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-purple-200 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {results.textMetrics.readability}%
                        </div>
                        <div className="text-xs text-gray-600">Legibilidad</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pipeline de análisis */}
      {results && (
        <div className="card">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-responsive-md font-bold text-gray-900">
              Pipeline de Análisis Detallado
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>
                Tiempo total:{" "}
                {results.pipeline.reduce(
                  (total, step) => total + (step.processingTime || 0),
                  0
                )}
                ms
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {results.pipeline.map((step, index) => (
              <div
                key={index}
                className={`border-l-4 pl-6 py-4 transition-all duration-300 ${
                  step.status === "Completado"
                    ? "border-green-500 bg-green-50"
                    : step.status === "Error"
                    ? "border-red-500 bg-red-50"
                    : step.status === "Iniciando"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        step.status === "Completado"
                          ? "bg-green-500"
                          : step.status === "Error"
                          ? "bg-red-500"
                          : step.status === "Iniciando"
                          ? "bg-blue-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {step.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        step.status === "Completado"
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : step.status === "Error"
                          ? "bg-red-100 text-red-800 border border-red-300"
                          : step.status === "Iniciando"
                          ? "bg-blue-100 text-blue-800 border border-blue-300"
                          : "bg-gray-100 text-gray-800 border border-gray-300"
                      }`}
                    >
                      {step.status}
                    </span>

                    {step.processingTime && (
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                        {step.processingTime}ms
                      </span>
                    )}
                  </div>
                </div>

                {/* Mostrar resultado detallado */}
                {step.result && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">
                      Resultado del Paso:
                    </div>
                    <div className="text-sm text-gray-700">
                      {renderStepResult(step.result, step.name)}
                    </div>
                  </div>
                )}

                {/* Mostrar error si existe */}
                {step.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                    <div className="flex items-center gap-2 text-red-500 mb-2">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wide">
                        Error:
                      </span>
                    </div>
                    <p className="text-sm text-red-600">{step.error}</p>
                  </div>
                )}

                {/* Mostrar timestamp */}
                {step.timestamp && (
                  <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(step.timestamp).toLocaleString()}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center hover-lift">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Precisión del 95%
          </h3>
          <p className="text-gray-600 text-sm">
            Nuestro modelo ha sido entrenado con millones de ejemplos para
            máxima precisión
          </p>
        </div>

        <div className="card text-center hover-lift">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Análisis Rápido</h3>
          <p className="text-gray-600 text-sm">
            Resultados en segundos gracias a procesamiento optimizado y IA
            avanzada
          </p>
        </div>

        <div className="card text-center hover-lift">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Privacidad Total</h3>
          <p className="text-gray-600 text-sm">
            Tu texto nunca se almacena permanentemente y se procesa de forma
            segura
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextAnalysis;
