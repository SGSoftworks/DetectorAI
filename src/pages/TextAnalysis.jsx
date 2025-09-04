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
      return <span className="font-medium">{result}</span>;
    }

    if (typeof result === "object") {
      // Paso 1: Análisis con Google Gemini
      if (stepName.includes("Gemini")) {
        return (
          <div className="space-y-2">
            {result.isAI !== undefined && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Resultado:</span>
                <span className={`px-2 py-1 rounded text-xs ${result.isAI ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {result.isAI ? 'IA' : 'HUMANO'}
                </span>
              </div>
            )}
            {result.confidence && (
              <div>
                <span className="font-medium">Confianza:</span> {Math.round(result.confidence * 100)}%
              </div>
            )}
            {result.reasoning && (
              <div>
                <span className="font-medium">Razonamiento:</span>
                <p className="mt-1 text-gray-600 text-xs leading-relaxed">{result.reasoning}</p>
              </div>
            )}
          </div>
        );
      }

      // Paso 2: Análisis con Hugging Face
      if (stepName.includes("Hugging Face")) {
        return (
          <div className="space-y-2">
            {result.result && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Clasificación:</span>
                <span className={`px-2 py-1 rounded text-xs ${result.result === 'IA' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {result.result}
                </span>
              </div>
            )}
            {result.confidence && (
              <div>
                <span className="font-medium">Confianza:</span> {Math.round(result.confidence * 100)}%
              </div>
            )}
            {result.explanation && (
              <div>
                <span className="font-medium">Explicación:</span>
                <p className="mt-1 text-gray-800 text-xs leading-relaxed">{result.explanation}</p>
              </div>
            )}
            {result.complexity && (
              <div>
                <span className="font-medium">Complejidad:</span> {result.complexity.level} (Score: {result.complexity.score})
              </div>
            )}
            {result.readability && (
              <div>
                <span className="font-medium">Legibilidad:</span> {Math.round(result.readability)}%
              </div>
            )}
          </div>
        );
      }

      // Paso 3: Verificación de Contenido
      if (stepName.includes("Verificación")) {
        return (
          <div className="space-y-2">
            {result.totalResults && (
              <div>
                <span className="font-medium">Total de resultados:</span> {result.totalResults}
              </div>
            )}
            {result.similarity && (
              <div>
                <span className="font-medium">Similitud:</span> {Math.round(result.similarity * 100)}%
              </div>
            )}
            {result.searchResults && Array.isArray(result.searchResults) && (
              <div>
                <span className="font-medium">Resultados encontrados:</span> {result.searchResults.length}
                {result.searchResults.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {result.searchResults.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-gray-600">{item.displayLink}</div>
                        <div className="text-gray-500">{item.snippet.substring(0, 100)}...</div>
                      </div>
                    ))}
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
          <div className="space-y-2">
            {result.result && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Decisión final:</span>
                <span className={`px-2 py-1 rounded text-xs ${result.result === 'IA' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {result.result}
                </span>
              </div>
            )}
            {result.confidence && (
              <div>
                <span className="font-medium">Confianza final:</span> {Math.round(result.confidence * 100)}%
              </div>
            )}
            {result.scores && (
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-medium">Score IA:</span> {Math.round(result.scores.ai * 100)}%
                </div>
                <div>
                  <span className="font-medium">Score Humano:</span> {Math.round(result.scores.human * 100)}%
                </div>
              </div>
            )}
          </div>
        );
      }

      // Para otros objetos, mostrar propiedades clave
      const simpleProps = Object.keys(result).filter(
        key => typeof result[key] === "string" || typeof result[key] === "number" || typeof result[key] === "boolean"
      );

      if (simpleProps.length > 0) {
        return (
          <div className="space-y-1">
            {simpleProps.map(key => (
              <div key={key}>
                <span className="font-medium">{key}:</span> {String(result[key])}
              </div>
            ))}
          </div>
        );
      }

      // Si no hay propiedades simples, usar JSON.stringify
      return (
        <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      );
    }

    // Para otros tipos, convertir a string
    return <span className="font-medium">{String(result)}</span>;
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !text.trim()}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Resultado Final
                    </h4>
                    {getResultIcon(results.finalResult)}
                  </div>
                  <div className="text-center">
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getResultColor(
                        results.finalResult
                      )}`}
                    >
                      {results.finalResult}
                    </span>
                  </div>
                </div>

                {/* Nivel de confianza */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Nivel de Confianza
                  </h4>
                  <div className="text-center">
                    <div
                      className={`text-4xl font-bold mb-2 ${getConfidenceColor(
                        results.confidence
                      )}`}
                    >
                      {results.confidence}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          results.confidence >= 80
                            ? "bg-green-500"
                            : results.confidence >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${results.confidence}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {results.confidence >= 80
                        ? "Alta confianza en el resultado"
                        : results.confidence >= 60
                        ? "Confianza moderada"
                        : "Baja confianza - se recomienda revisión manual"}
                    </p>
                  </div>
                </div>

                {/* Explicación */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Explicación del Resultado
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {results.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pipeline de análisis */}
      {results && (
        <div className="card">
          <h2 className="text-responsive-md font-bold text-gray-900 mb-8">
            Pipeline de Análisis Detallado
          </h2>
          <div className="space-y-6">
            {results.pipeline.map((step, index) => (
              <div
                key={index}
                className={`border-l-4 pl-6 py-4 ${
                  step.status === "completed"
                    ? "border-green-500 bg-green-50"
                    : step.status === "error"
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {index + 1}. {step.name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      step.status === "Completado"
                        ? "bg-green-100 text-green-800"
                        : step.status === "Error"
                        ? "bg-red-100 text-red-800"
                        : step.status === "Iniciando"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {step.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                
                {/* Mostrar resultado detallado */}
                {step.result && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-2 font-medium">Resultado:</div>
                    <div className="text-sm text-gray-700">
                      {renderStepResult(step.result, step.name)}
                    </div>
                  </div>
                )}

                {/* Mostrar error si existe */}
                {step.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                    <div className="text-xs text-red-500 mb-1 font-medium">Error:</div>
                    <p className="text-sm text-red-600">{step.error}</p>
                  </div>
                )}

                {/* Mostrar timestamp y tiempo de procesamiento */}
                {step.timestamp && (
                  <div className="mt-3 text-xs text-gray-500">
                    Timestamp: {new Date(step.timestamp).toLocaleString()}
                  </div>
                )}
                {step.processingTime && (
                  <div className="mt-1 text-xs text-gray-500">
                    Tiempo: {step.processingTime}ms
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
