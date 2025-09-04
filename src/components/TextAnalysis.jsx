/**
 * Componente de Análisis de Texto
 * Interfaz para análisis de contenido textual
 * Versión: 2.0.0
 */

import React, { useState } from 'react';
import { FileText, Brain, Search, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import mainAnalysisService from '../services/mainAnalysisService.js';
import AnalysisResultCard from './AnalysisResultCard';

const TextAnalysis = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Por favor, ingresa un texto para analizar');
      return;
    }

    if (text.length < 50) {
      setError('El texto debe tener al menos 50 caracteres');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const analysisResults = await mainAnalysisService.analyzeContent(text, 'text');
      setResults(analysisResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getResultColor = (result) => {
    if (result === 'IA') return 'text-red-600 bg-red-50 border-red-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getResultIcon = (result) => {
    if (result === 'IA') return <AlertCircle className="w-5 h-5" />;
    return <CheckCircle className="w-5 h-5" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Análisis de Texto</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Analiza cualquier texto para determinar si fue generado por inteligencia artificial o escrito por un ser humano.
        </p>
      </div>

      {/* Input Area */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
              Texto a analizar
            </label>
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ingresa el texto que deseas analizar aquí..."
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isAnalyzing}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {text.length} caracteres
              </span>
              <span className="text-sm text-gray-500">
                Mínimo: 50 caracteres
              </span>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || text.length < 50}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                Analizar Texto
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">Error</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Result Summary */}
          <div className={`rounded-lg border-2 p-6 ${getResultColor(results.finalResult)}`}>
            <div className="flex items-center gap-3 mb-4">
              {getResultIcon(results.finalResult)}
              <h2 className="text-2xl font-bold">
                Resultado: {results.finalResult === 'IA' ? 'Generado por IA' : 'Escrito por Humano'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {Math.round(results.confidence * 100)}%
                </div>
                <div className="text-sm opacity-75">Confianza</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {results.aiProbability}%
                </div>
                <div className="text-sm opacity-75">Probabilidad IA</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {results.humanProbability}%
                </div>
                <div className="text-sm opacity-75">Probabilidad Humano</div>
              </div>
            </div>

            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <p className="text-sm leading-relaxed">
                {results.explanation}
              </p>
            </div>
          </div>

          {/* Analysis Pipeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Proceso de Análisis
            </h3>
            
            <div className="space-y-4">
              {results.pipeline.map((step, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg border border-gray-100">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.status === 'Completado' ? 'bg-green-100 text-green-600' :
                      step.status === 'Error' ? 'bg-red-100 text-red-600' :
                      step.status === 'Iniciando' ? 'bg-blue-100 text-blue-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {step.step}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{step.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        step.status === 'Completado' ? 'bg-green-100 text-green-700' :
                        step.status === 'Error' ? 'bg-red-100 text-red-700' :
                        step.status === 'Iniciando' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {step.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                    
                    {step.error && (
                      <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        Error: {step.error}
                      </div>
                    )}
                    
                    {step.result && step.status === 'Completado' && (
                      <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        {typeof step.result === 'object' ? 
                          JSON.stringify(step.result, null, 2) : 
                          step.result
                        }
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Results */}
          <div className="space-y-6">
            {results.gemini && (
              <AnalysisResultCard
                title="Análisis de IA Avanzado"
                result={results.gemini}
                confidence={results.gemini.confidence}
                explanation={results.gemini.reasoning}
                indicators={results.gemini.indicators}
                type="gemini"
                status="Completado"
              />
            )}

            {results.huggingface && (
              <AnalysisResultCard
                title="Análisis de Patrones Lingüísticos"
                result={results.huggingface}
                confidence={results.huggingface.confidence}
                explanation={results.huggingface.explanation}
                indicators={results.huggingface.indicators}
                type="huggingface"
                status="Completado"
              />
            )}
          </div>

          {/* Web Search Results */}
          {results.webSearch && results.webSearch.searchResults && results.webSearch.searchResults.length > 0 && (
            <AnalysisResultCard
              title="Verificación de Contenido"
              result={{
                result: 'VERIFICADO',
                totalResults: results.webSearch.totalResults,
                similarity: results.webSearch.similarity,
                searchResults: results.webSearch.searchResults
              }}
              confidence={results.webSearch.similarity}
              explanation={`Se encontraron ${results.webSearch.totalResults} resultados relacionados con el contenido analizado.`}
              indicators={results.webSearch.searchResults.slice(0, 3).map(r => r.title)}
              type="webSearch"
              status="Completado"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TextAnalysis;
