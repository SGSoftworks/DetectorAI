/**
 * Componente para mostrar resultados de análisis de manera atractiva
 * Sistema de Detección de Contenido Generado por IA
 * Versión: 2.0.0
 */

import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Brain, Search, FileText } from 'lucide-react';

const AnalysisResultCard = ({ title, result, confidence, explanation, indicators, type, status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'Completado':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'Procesando':
        return <AlertCircle className="w-5 h-5 text-yellow-500 animate-pulse" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'gemini':
        return <Brain className="w-5 h-5 text-blue-500" />;
      case 'huggingface':
        return <FileText className="w-5 h-5 text-purple-500" />;
      case 'webSearch':
        return <Search className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getResultColor = () => {
    if (!result) return 'text-gray-500';
    
    const resultStr = typeof result === 'object' ? result.result : result;
    if (resultStr === 'IA' || resultStr === 'AI') return 'text-red-600';
    if (resultStr === 'HUMANO' || resultStr === 'HUMAN') return 'text-green-600';
    return 'text-gray-600';
  };

  const getConfidenceColor = () => {
    if (!confidence) return 'bg-gray-100 text-gray-600';
    
    const conf = typeof confidence === 'number' ? confidence : parseFloat(confidence);
    if (conf >= 0.8) return 'bg-green-100 text-green-800';
    if (conf >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatResult = (result) => {
    if (typeof result === 'object') {
      if (result.result) {
        return result.result === 'IA' ? 'Generado por IA' : 'Escrito por Humano';
      }
      return 'Análisis completado';
    }
    
    if (result === 'IA' || result === 'AI') return 'Generado por IA';
    if (result === 'HUMANO' || result === 'HUMAN') return 'Escrito por Humano';
    return result;
  };

  const formatConfidence = (confidence) => {
    if (!confidence) return '0%';
    
    const conf = typeof confidence === 'number' ? confidence : parseFloat(confidence);
    return `${Math.round(conf * 100)}%`;
  };

  const formatExplanation = (explanation) => {
    if (!explanation) return 'Sin explicación disponible';
    
    // Si es un objeto, extraer la explicación
    if (typeof explanation === 'object') {
      // Si es un objeto con reasoning anidado
      if (explanation.reasoning && typeof explanation.reasoning === 'object') {
        return explanation.reasoning.reasoning || explanation.reasoning.explanation || 'Análisis completado';
      }
      return explanation.explanation || explanation.reasoning || 'Análisis completado';
    }
    
    return explanation;
  };

  const formatIndicators = (indicators) => {
    if (!indicators) return [];
    
    // Si es un objeto, extraer los indicadores
    if (typeof indicators === 'object') {
      // Si es un objeto con reasoning anidado
      if (indicators.reasoning && typeof indicators.reasoning === 'object') {
        return indicators.reasoning.indicators || indicators.indicators || [];
      }
      return indicators.indicators || indicators.patterns || [];
    }
    
    // Si es un array, devolverlo
    if (Array.isArray(indicators)) {
      return indicators;
    }
    
    return [];
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {getTypeIcon()}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            status === 'Completado' ? 'bg-green-100 text-green-800' :
            status === 'Error' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {status}
          </span>
        </div>
      </div>

      {/* Resultado Principal */}
      {result && (
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Resultado:</span>
              <p className={`text-lg font-semibold ${getResultColor()}`}>
                {formatResult(result)}
              </p>
            </div>
            {confidence && (
              <div className="text-right">
                <span className="text-sm font-medium text-gray-700">Confianza:</span>
                <p className={`px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceColor()}`}>
                  {formatConfidence(confidence)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Explicación */}
      {explanation && (
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-700">Explicación:</span>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
            {formatExplanation(explanation)}
          </p>
        </div>
      )}

      {/* Indicadores */}
      {indicators && formatIndicators(indicators).length > 0 && (
        <div>
          <span className="text-sm font-medium text-gray-700">Indicadores detectados:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {formatIndicators(indicators).map((indicator, idx) => (
              <span 
                key={idx} 
                className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
              >
                {indicator}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sugerencias si están disponibles */}
      {result && typeof result === 'object' && result.suggestions && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm font-medium text-gray-700">Sugerencias:</span>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
            {result.suggestions}
          </p>
        </div>
      )}

      {/* Información adicional si es un objeto */}
      {typeof result === 'object' && result && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {result.textLength && (
              <div>
                <span className="font-medium text-gray-700">Longitud:</span>
                <p className="text-gray-600">{result.textLength} caracteres</p>
              </div>
            )}
            {result.wordCount && (
              <div>
                <span className="font-medium text-gray-700">Palabras:</span>
                <p className="text-gray-600">{result.wordCount}</p>
              </div>
            )}
            {result.sentenceCount && (
              <div>
                <span className="font-medium text-gray-700">Oraciones:</span>
                <p className="text-gray-600">{result.sentenceCount}</p>
              </div>
            )}
            {result.complexity && (
              <div>
                <span className="font-medium text-gray-700">Complejidad:</span>
                <p className="text-gray-600">
                  {typeof result.complexity === 'object' ? result.complexity.level : result.complexity}
                </p>
              </div>
            )}
            {result.readability && (
              <div>
                <span className="font-medium text-gray-700">Legibilidad:</span>
                <p className="text-gray-600">{result.readability}</p>
              </div>
            )}
            {result.languagePatterns && (
              <div className="col-span-2">
                <span className="font-medium text-gray-700">Patrones lingüísticos:</span>
                <p className="text-gray-600">{result.languagePatterns}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResultCard;
