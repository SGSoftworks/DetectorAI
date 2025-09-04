/**
 * Servicio Principal de Análisis
 * Coordina todos los servicios de análisis
 * Versión: 2.0.0
 */

import textAnalysisService from './textAnalysisService.js';
import webSearchService from './webSearchService.js';
import securityService from './securityService.js';
import { ANALYSIS_CONFIG } from '../config/api.js';

class MainAnalysisService {
  constructor() {
    this.analysisCache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutos
  }

  /**
   * Análisis principal - determina el tipo de contenido y ejecuta el análisis apropiado
   */
  async analyzeContent(content, type = 'auto') {
    try {
      // Verificar consentimiento
      const consent = await securityService.requestUserConsent();
      if (!consent) {
        throw new Error('Consentimiento del usuario requerido');
      }

      // Verificar rate limiting
      if (!securityService.checkRateLimit()) {
        throw new Error('Límite de solicitudes excedido. Intenta más tarde.');
      }

      // Determinar tipo de contenido si es automático
      if (type === 'auto') {
        type = this.detectContentType(content);
      }

      // Validar contenido
      this.validateContent(content, type);

      // Verificar cache
      const cacheKey = this.generateCacheKey(content, type);
      if (this.isCacheValid(cacheKey)) {
        return this.analysisCache.get(cacheKey);
      }

      // Ejecutar análisis según el tipo
      let results;
      switch (type) {
        case 'text':
          results = await this.analyzeText(content);
          break;
        case 'image':
          results = await this.analyzeImage(content);
          break;
        case 'video':
          results = await this.analyzeVideo(content);
          break;
        case 'document':
          results = await this.analyzeDocument(content);
          break;
        default:
          throw new Error(`Tipo de contenido no soportado: ${type}`);
      }

      // Anonimizar resultados
      results = securityService.anonymizeData(results);

      // Guardar en cache
      this.saveToCache(cacheKey, results);

      // Registrar análisis
      securityService.logSecurityEvent('analysis_completed', {
        type,
        contentLength: this.getContentLength(content),
        result: results.finalResult,
        confidence: results.confidence
      });

      return results;

    } catch (error) {
      securityService.logSecurityEvent('analysis_error', {
        type,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  /**
   * Análisis de texto
   */
  async analyzeText(text) {
    const startTime = Date.now();
    
    const results = {
      type: 'text',
      content: text.substring(0, 1000), // Solo primeros 1000 caracteres para privacidad
      pipeline: [],
      gemini: null,
      huggingface: null,
      webSearch: null,
      finalResult: null,
      confidence: 0,
      explanation: '',
      timestamp: new Date().toISOString()
    };

    // Paso 1: Análisis con Gemini
    results.pipeline.push({
      step: 1,
      name: 'Análisis de IA Avanzado',
      status: 'Iniciando',
      description: 'Analizando patrones de generación de texto con Gemini 2.0'
    });

    try {
      const geminiResult = await textAnalysisService.analyzeWithGemini(text);
      results.gemini = geminiResult;
      results.pipeline[0].status = 'Completado';
      results.pipeline[0].result = geminiResult;
      results.pipeline[0].timestamp = new Date().toISOString();
    } catch (error) {
      results.pipeline[0].status = 'Error';
      results.pipeline[0].error = error.message;
      results.pipeline[0].timestamp = new Date().toISOString();
    }

    // Paso 2: Análisis de patrones lingüísticos
    results.pipeline.push({
      step: 2,
      name: 'Análisis de Patrones Lingüísticos',
      status: 'Iniciando',
      description: 'Detectando patrones específicos de escritura humana vs IA'
    });

    try {
      const patternResult = await textAnalysisService.analyzeWithHuggingFace(text);
      results.huggingface = patternResult;
      results.pipeline[1].status = 'Completado';
      results.pipeline[1].result = patternResult;
      results.pipeline[1].timestamp = new Date().toISOString();
    } catch (error) {
      results.pipeline[1].status = 'Error';
      results.pipeline[1].error = error.message;
      results.pipeline[1].timestamp = new Date().toISOString();
    }

    // Paso 3: Verificación de contenido web
    results.pipeline.push({
      step: 3,
      name: 'Verificación de Contenido',
      status: 'Iniciando',
      description: 'Buscando similitudes y verificando fuentes en la web'
    });

    try {
      const searchResult = await webSearchService.searchWebContent(text);
      results.webSearch = searchResult;
      results.pipeline[2].status = 'Completado';
      results.pipeline[2].result = searchResult;
      results.pipeline[2].timestamp = new Date().toISOString();
    } catch (error) {
      results.pipeline[2].status = 'Error';
      results.pipeline[2].error = error.message;
      results.pipeline[2].timestamp = new Date().toISOString();
    }

    // Paso 4: Análisis final
    results.pipeline.push({
      step: 4,
      name: 'Análisis Final',
      status: 'Procesando',
      description: 'Combinando resultados y determinando conclusión final'
    });

    const finalAnalysis = this.combineResults(results);
    results.finalResult = finalAnalysis.result;
    results.confidence = finalAnalysis.confidence;
    results.explanation = finalAnalysis.explanation;
    results.pipeline[3].status = 'Completado';
    results.pipeline[3].result = finalAnalysis;
    results.pipeline[3].timestamp = new Date().toISOString();
    results.pipeline[3].processingTime = Date.now() - startTime;

    return results;
  }

  /**
   * Combinar resultados de análisis
   */
  combineResults(results) {
    let finalDecision = 'HUMANO';
    let finalConfidence = 0.5;
    let aiProbability = 0;
    let humanProbability = 0;

    const evidence = {
      gemini: { available: false, result: null, confidence: 0, reasoning: '' },
      huggingface: { available: false, result: null, confidence: 0, explanation: '' },
      webSearch: { available: false, similarity: 0, totalResults: 0, supportsAI: false, supportsHuman: false }
    };

    // Analizar evidencia de Gemini
    if (results.gemini && results.gemini.isAI !== undefined) {
      evidence.gemini.available = true;
      evidence.gemini.result = results.gemini.isAI ? 'IA' : 'HUMANO';
      evidence.gemini.confidence = results.gemini.confidence || 0.5;
      evidence.gemini.reasoning = results.gemini.reasoning || 'Análisis completado con Gemini 2.0';
    }

    // Analizar evidencia de Hugging Face
    if (results.huggingface && results.huggingface.result) {
      evidence.huggingface.available = true;
      evidence.huggingface.result = results.huggingface.result;
      evidence.huggingface.confidence = results.huggingface.confidence || 0.5;
      evidence.huggingface.explanation = results.huggingface.explanation || 'Análisis completado con patrones lingüísticos';
    }

    // Analizar evidencia de búsqueda web
    if (results.webSearch) {
      evidence.webSearch.available = true;
      evidence.webSearch.similarity = results.webSearch.similarity || 0;
      evidence.webSearch.totalResults = results.webSearch.totalResults || 0;

      if (evidence.webSearch.similarity > 0.7 && evidence.webSearch.totalResults > 100) {
        evidence.webSearch.supportsHuman = true;
      } else if (evidence.webSearch.similarity < 0.3 && evidence.webSearch.totalResults < 50) {
        evidence.webSearch.supportsAI = true;
      }
    }

    // Determinar decisión final
    if (evidence.gemini.available && evidence.huggingface.available) {
      if (evidence.gemini.result === evidence.huggingface.result) {
        finalDecision = evidence.gemini.result;
        finalConfidence = Math.min(evidence.gemini.confidence, evidence.huggingface.confidence) + 0.1;
      } else {
        if (evidence.gemini.confidence > evidence.huggingface.confidence) {
          finalDecision = evidence.gemini.result;
          finalConfidence = evidence.gemini.confidence - 0.2;
        } else {
          finalDecision = evidence.huggingface.result;
          finalConfidence = evidence.huggingface.confidence - 0.2;
        }
      }
    } else if (evidence.gemini.available) {
      finalDecision = evidence.gemini.result;
      finalConfidence = evidence.gemini.confidence;
    } else if (evidence.huggingface.available) {
      finalDecision = evidence.huggingface.result;
      finalConfidence = evidence.huggingface.confidence;
    }

    // Ajustar confianza basada en evidencia web
    if (evidence.webSearch.available) {
      if (this.webSearchSupportsDecision(evidence.webSearch, finalDecision)) {
        finalConfidence = Math.min(finalConfidence + 0.1, 0.95);
      } else if (this.webSearchContradictsDecision(evidence.webSearch, finalDecision)) {
        finalConfidence = Math.max(finalConfidence - 0.15, 0.2);
      }
    }

    // Calcular probabilidades
    if (finalDecision === 'IA') {
      aiProbability = finalConfidence;
      humanProbability = 1 - finalConfidence;
    } else {
      humanProbability = finalConfidence;
      aiProbability = 1 - finalConfidence;
    }

    const explanation = this.generateExplanation(evidence, finalDecision, finalConfidence);

    return {
      result: finalDecision,
      confidence: Math.round(finalConfidence * 100) / 100,
      explanation: explanation,
      aiProbability: Math.round(aiProbability * 100),
      humanProbability: Math.round(humanProbability * 100),
      evidence: evidence,
      isAI: finalDecision === 'IA'
    };
  }

  // Métodos auxiliares
  detectContentType(content) {
    if (typeof content === 'string') {
      return 'text';
    } else if (content instanceof File) {
      const type = content.type;
      if (type.startsWith('image/')) return 'image';
      if (type.startsWith('video/')) return 'video';
      if (type.includes('pdf') || type.includes('document')) return 'document';
    }
    return 'text';
  }

  validateContent(content, type) {
    const config = ANALYSIS_CONFIG[type.toUpperCase()];
    if (!config) {
      throw new Error(`Tipo de contenido no soportado: ${type}`);
    }

    if (type === 'text') {
      if (content.length < config.MIN_LENGTH) {
        throw new Error(`El texto debe tener al menos ${config.MIN_LENGTH} caracteres`);
      }
      if (content.length > config.MAX_LENGTH) {
        throw new Error(`El texto no puede exceder ${config.MAX_LENGTH} caracteres`);
      }
    }
  }

  generateCacheKey(content, type) {
    const contentHash = this.hashContent(content);
    return `${type}_${contentHash}`;
  }

  hashContent(content) {
    if (typeof content === 'string') {
      return btoa(content.substring(0, 100));
    }
    return btoa(content.name + content.size);
  }

  isCacheValid(key) {
    const cached = this.analysisCache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.cacheExpiry;
  }

  saveToCache(key, data) {
    this.analysisCache.set(key, {
      ...data,
      timestamp: Date.now()
    });
  }

  getContentLength(content) {
    if (typeof content === 'string') return content.length;
    if (content instanceof File) return content.size;
    return 0;
  }

  webSearchSupportsDecision(webSearch, decision) {
    if (decision === 'HUMANO') {
      return webSearch.supportsHuman;
    } else if (decision === 'IA') {
      return webSearch.supportsAI;
    }
    return false;
  }

  webSearchContradictsDecision(webSearch, decision) {
    if (decision === 'HUMANO') {
      return webSearch.supportsAI;
    } else if (decision === 'IA') {
      return webSearch.supportsHuman;
    }
    return false;
  }

  generateExplanation(evidence, finalDecision, finalConfidence) {
    let explanation = `El análisis ha determinado que el contenido es ${
      finalDecision === 'IA' ? 'generado por Inteligencia Artificial' : 'escrito por un ser humano'
    }. `;

    const sources = [];
    if (evidence.gemini.available) {
      sources.push(`Gemini 2.0 (${Math.round(evidence.gemini.confidence * 100)}% confianza)`);
    }
    if (evidence.huggingface.available) {
      sources.push(`Análisis de patrones (${Math.round(evidence.huggingface.confidence * 100)}% confianza)`);
    }
    if (evidence.webSearch.available) {
      sources.push(`Verificación web (${evidence.webSearch.totalResults} resultados)`);
    }

    if (sources.length > 0) {
      explanation += `Esta conclusión se basa en el análisis de ${sources.join(', ')}. `;
    }

    if (finalConfidence > 0.7) {
      explanation += 'La alta confianza en este resultado indica una evaluación sólida y confiable.';
    } else if (finalConfidence > 0.5) {
      explanation += 'La confianza moderada sugiere que el resultado es probable pero podría beneficiarse de verificación adicional.';
    } else {
      explanation += 'La baja confianza indica que se requiere análisis manual adicional para una evaluación definitiva.';
    }

    return explanation;
  }

  // Métodos para otros tipos de contenido (implementaciones básicas)
  async analyzeImage(imageFile) {
    return {
      type: 'image',
      content: imageFile.name,
      pipeline: [],
      finalResult: 'HUMANO',
      confidence: 0.5,
      explanation: 'Análisis de imagen no implementado completamente',
      timestamp: new Date().toISOString()
    };
  }

  async analyzeVideo(videoFile) {
    return {
      type: 'video',
      content: videoFile.name,
      pipeline: [],
      finalResult: 'HUMANO',
      confidence: 0.5,
      explanation: 'Análisis de video no implementado completamente',
      timestamp: new Date().toISOString()
    };
  }

  async analyzeDocument(documentFile) {
    return {
      type: 'document',
      content: documentFile.name,
      pipeline: [],
      finalResult: 'HUMANO',
      confidence: 0.5,
      explanation: 'Análisis de documento no implementado completamente',
      timestamp: new Date().toISOString()
    };
  }
}

export default new MainAnalysisService();
