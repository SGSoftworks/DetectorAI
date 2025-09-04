/**
 * Servicio de Búsqueda Web
 * Maneja búsquedas y verificación de contenido en la web
 * Versión: 2.0.0
 */

import axios from 'axios';
import { API_CONFIG, buildAPIUrl } from '../config/api.js';

class WebSearchService {
  constructor() {
    this.axios = axios.create({
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Búsqueda de contenido web
   */
  async searchWebContent(text) {
    if (!API_CONFIG.GOOGLE_SEARCH.API_KEY || !API_CONFIG.GOOGLE_SEARCH.ENGINE_ID) {
      return {
        searchResults: [],
        totalResults: 0,
        similarity: 0,
        analysis: {
          summary: 'Búsqueda web no disponible',
          conclusion: 'No se pudo verificar contenido en la web',
          recommendation: 'Verificar manualmente la información',
          confidence: 0.2,
          evidenceStrength: 'Muy baja'
        }
      };
    }

    try {
      const keywords = this.extractKeywords(text);
      const searchQueries = this.createSearchQueries(keywords, text);

      let allResults = [];
      let totalResults = 0;

      for (const query of searchQueries.slice(0, 3)) {
        try {
          const params = {
            q: query,
            num: 5,
            lr: `lang_${API_CONFIG.GOOGLE_SEARCH.LANGUAGE}`,
            cr: `country${API_CONFIG.GOOGLE_SEARCH.REGION}`,
            dateRestrict: 'y1'
          };

          const url = buildAPIUrl('google_search', '', params);
          const response = await this.axios.get(url, {
            timeout: API_CONFIG.GOOGLE_SEARCH.TIMEOUT
          });

          const searchResults = response.data.items || [];
          const searchInfo = response.data.searchInformation || {};
          const currentTotalResults = parseInt(searchInfo.totalResults) || 0;

          if (currentTotalResults > 0) {
            totalResults = Math.max(totalResults, currentTotalResults);
            searchResults.forEach(item => {
              if (!allResults.find(r => r.link === item.link) && this.isValidSearchResult(item, text)) {
                allResults.push(item);
              }
            });
          }
        } catch (queryError) {
          console.warn(`Error en consulta "${query}":`, queryError.message);
        }
      }

      const formattedResults = allResults
        .map((item, index) => ({
          id: index + 1,
          title: item.title,
          link: item.link,
          snippet: item.snippet,
          displayLink: item.displayLink,
          relevance: this.calculateRelevance(text, item)
        }))
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 5);

      const similarity = formattedResults.length > 0 ? this.calculateSimilarity(text, formattedResults) : 0;
      const analysis = this.analyzeSearchResults(formattedResults, text);

      return {
        searchResults: formattedResults,
        totalResults: totalResults,
        keywords: keywords,
        similarity: similarity,
        analysis: analysis,
        detailedResults: formattedResults.map(result => ({
          title: result.title,
          link: result.link,
          snippet: result.snippet,
          source: result.displayLink,
          relevance: result.relevance,
          relevanceScore: Math.round(result.relevance * 100)
        })),
        searchQuery: searchQueries.join(' | '),
        searchTimestamp: new Date().toISOString(),
        searchEngine: 'Google Custom Search'
      };

    } catch (error) {
      throw new Error(`Error en Google Search API: ${error.message}`);
    }
  }

  /**
   * Extraer palabras clave del texto
   */
  extractKeywords(text) {
    const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(word => word.length > 3);
    const stopWords = new Set([
      'para', 'con', 'los', 'las', 'del', 'una', 'este', 'esta', 'como',
      'que', 'por', 'para', 'con', 'sin', 'sobre', 'bajo', 'entre',
      'desde', 'hasta', 'durante', 'antes', 'después', 'mientras',
      'aunque', 'porque', 'pues', 'entonces', 'así', 'también',
      'tampoco', 'nunca', 'siempre', 'mucho', 'poco', 'más', 'menos',
      'muy', 'demasiado', 'bastante', 'casi', 'apenas', 'solo',
      'solamente', 'incluso', 'además', 'ni', 'o', 'u', 'pero',
      'mas', 'sin embargo', 'no obstante', 'por el contrario'
    ]);
    
    const filteredWords = words.filter(word => !stopWords.has(word));

    const wordCount = {};
    filteredWords.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * Crear consultas de búsqueda
   */
  createSearchQueries(keywords, text) {
    const queries = [];
    
    // Consulta 1: Palabras clave principales
    if (keywords.length > 0) {
      queries.push(keywords.slice(0, 5).join(' '));
    }
    
    // Consulta 2: Frases específicas del texto
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    if (sentences.length > 0) {
      queries.push(`"${sentences[0].trim().substring(0, 100)}"`);
    }
    
    // Consulta 3: Combinación de palabras clave más relevantes
    if (keywords.length > 2) {
      const relevantKeywords = keywords.filter(
        word => word.length > 4 && 
        !['gobierno', 'ministerio', 'presidente', 'partido'].includes(word)
      );
      if (relevantKeywords.length > 0) {
        queries.push(relevantKeywords.slice(0, 3).join(' '));
      }
    }
    
    return queries;
  }

  /**
   * Validar resultado de búsqueda
   */
  isValidSearchResult(item, originalText) {
    if (!item || !item.title || !item.snippet) return false;
    
    // Verificar que no sea spam o contenido irrelevante
    const spamIndicators = ['spam', 'scam', 'fake', 'clickbait', 'advertisement'];
    const titleLower = item.title.toLowerCase();
    const snippetLower = item.snippet.toLowerCase();

    if (spamIndicators.some(indicator => 
      titleLower.includes(indicator) || snippetLower.includes(indicator)
    )) {
      return false;
    }

    // Verificar que tenga contenido sustancial
    if (item.snippet.length < 50) return false;

    // Verificar que sea de una fuente confiable
    const trustedDomains = [
      'wikipedia.org', 'bbc.com', 'cnn.com', 'elpais.com', 'elmundo.es',
      'semana.com', 'eltiempo.com', 'elespectador.com', 'noticias.caracoltv.com',
      'publimetro.co', 'colombia.com', 'rcnradio.com', 'reuters.com',
      'ap.org', 'afp.com', 'efeverde.com', 'marca.com', 'as.com',
      'sport.es', 'mundodeportivo.com'
    ];

    const domain = item.displayLink || item.link;
    const isTrustedSource = trustedDomains.some(trusted => domain.includes(trusted));

    // Si no es fuente confiable, verificar relevancia mínima
    if (!isTrustedSource) {
      const relevance = this.calculateRelevance(originalText, item);
      return relevance > 0.3;
    }

    return true;
  }

  /**
   * Calcular relevancia de un resultado
   */
  calculateRelevance(text, searchResult) {
    const textWords = text.toLowerCase().split(/\s+/).filter(word => word.length > 3);
    const titleText = searchResult.title.toLowerCase();
    const snippetText = searchResult.snippet.toLowerCase();
    const fullResultText = titleText + ' ' + snippetText;

    // Filtrar palabras importantes
    const stopWords = [
      'el', 'la', 'de', 'en', 'un', 'una', 'es', 'se', 'que', 'con', 'por', 'para',
      'del', 'las', 'los', 'su', 'sus', 'le', 'les', 'lo', 'al', 'a', 'o', 'y',
      'pero', 'sin', 'sobre', 'entre', 'hasta', 'desde'
    ];
    
    const importantWords = textWords.filter(word => !stopWords.includes(word));
    
    if (importantWords.length === 0) return 0;

    // Calcular coincidencias
    let titleMatches = 0;
    let snippetMatches = 0;
    let fullTextMatches = 0;

    importantWords.forEach(word => {
      if (titleText.includes(word)) titleMatches++;
      if (snippetText.includes(word)) snippetMatches++;
      if (fullResultText.includes(word)) fullTextMatches++;
    });

    // Calcular relevancia ponderada
    const titleRelevance = titleMatches / importantWords.length;
    const snippetRelevance = snippetMatches / importantWords.length;
    const fullTextRelevance = fullTextMatches / importantWords.length;

    // Ponderar más el título que el snippet
    const baseRelevance = titleRelevance * 0.6 + snippetRelevance * 0.4;

    // Bonificación por coherencia general
    const coherenceBonus = fullTextRelevance > 0.3 ? 0.1 : 0;

    // Penalización si hay muy pocas coincidencias
    const penalty = fullTextMatches < 2 ? -0.2 : 0;

    const finalRelevance = Math.max(0, Math.min(1, baseRelevance + coherenceBonus + penalty));

    return Math.round(finalRelevance * 100) / 100;
  }

  /**
   * Calcular similitud general
   */
  calculateSimilarity(text, searchResults) {
    if (!searchResults.length) return 0;
    
    let totalSimilarity = 0;
    searchResults.forEach(result => {
      totalSimilarity += result.relevance;
    });
    
    return totalSimilarity / searchResults.length;
  }

  /**
   * Analizar resultados de búsqueda
   */
  analyzeSearchResults(searchResults, originalText) {
    if (!searchResults.length) {
      return {
        summary: 'No se encontraron resultados relevantes',
        conclusion: 'La falta de fuentes verificadas sugiere contenido original o poco común',
        recommendation: 'Verificar manualmente la información',
        confidence: 0.2,
        evidenceStrength: 'Muy baja'
      };
    }

    const highRelevanceResults = searchResults.filter(r => r.relevance > 0.6);
    const mediumRelevanceResults = searchResults.filter(r => r.relevance > 0.3 && r.relevance <= 0.6);
    const lowRelevanceResults = searchResults.filter(r => r.relevance <= 0.3);

    // Calcular calidad de las fuentes
    const trustedSources = searchResults.filter(r => this.isTrustedSource(r.displayLink || r.link));
    const averageRelevance = searchResults.reduce((sum, r) => sum + r.relevance, 0) / searchResults.length;

    let conclusion = '';
    let recommendation = '';
    let confidence = 0.5;
    let evidenceStrength = 'Moderada';

    if (highRelevanceResults.length > 0 && trustedSources.length > 0) {
      conclusion = `Se encontraron ${highRelevanceResults.length} fuentes altamente relevantes de fuentes confiables que respaldan el contenido.`;
      recommendation = 'El contenido parece estar basado en información verificable y confiable.';
      confidence = 0.8;
      evidenceStrength = 'Alta';
    } else if (highRelevanceResults.length > 0) {
      conclusion = `Se encontraron ${highRelevanceResults.length} fuentes altamente relevantes, pero algunas fuentes requieren verificación adicional.`;
      recommendation = 'El contenido tiene referencias verificables pero se recomienda verificar las fuentes.';
      confidence = 0.6;
      evidenceStrength = 'Moderada';
    } else if (mediumRelevanceResults.length > 0) {
      conclusion = `Se encontraron ${mediumRelevanceResults.length} fuentes con relevancia moderada.`;
      recommendation = 'El contenido tiene algunas referencias verificables pero requiere verificación adicional.';
      confidence = 0.4;
      evidenceStrength = 'Baja';
    } else if (lowRelevanceResults.length > 0) {
      conclusion = 'Los resultados de búsqueda tienen baja relevancia con el contenido analizado.';
      recommendation = 'El contenido puede ser original, poco común o requerir verificación manual.';
      confidence = 0.3;
      evidenceStrength = 'Muy baja';
    } else {
      conclusion = 'No se encontraron fuentes relevantes para el contenido analizado.';
      recommendation = 'El contenido parece ser completamente original o muy específico.';
      confidence = 0.2;
      evidenceStrength = 'Muy baja';
    }

    return {
      summary: `Análisis de ${searchResults.length} fuentes encontradas`,
      conclusion: conclusion,
      recommendation: recommendation,
      confidence: confidence,
      evidenceStrength: evidenceStrength,
      relevanceBreakdown: {
        high: highRelevanceResults.length,
        medium: mediumRelevanceResults.length,
        low: lowRelevanceResults.length
      },
      sourceQuality: {
        trustedSources: trustedSources.length,
        totalSources: searchResults.length,
        averageRelevance: Math.round(averageRelevance * 100) / 100
      }
    };
  }

  /**
   * Verificar si una fuente es confiable
   */
  isTrustedSource(domain) {
    if (!domain) return false;

    const trustedDomains = [
      'wikipedia.org', 'bbc.com', 'cnn.com', 'elpais.com', 'elmundo.es',
      'semana.com', 'eltiempo.com', 'elespectador.com', 'noticias.caracoltv.com',
      'publimetro.co', 'colombia.com', 'rcnradio.com', 'reuters.com',
      'ap.org', 'afp.com', 'efeverde.com', 'marca.com', 'as.com',
      'sport.es', 'mundodeportivo.com'
    ];

    return trustedDomains.some(trusted => domain.includes(trusted));
  }
}

export default new WebSearchService();
