import axios from "axios";
import { API_CONFIG, getHeaders, HUGGING_FACE_MODELS } from "../config/api";
import systemMonitoringService from "./systemMonitoringService";
import { DatabaseService } from "../config/firebase.js";

class AnalysisService {
  constructor() {
    this.axios = axios.create({
      timeout: 30000, // 30 segundos
    });
  }

  // Análisis de texto usando Gemini y Hugging Face
  async analyzeText(text) {
    const startTime = Date.now();
    try {
      const results = {
        gemini: null,
        huggingface: null,
        googleSearch: null,
        finalResult: null,
        confidence: 0,
        explanation: "",
        pipeline: [],
      };

      // Paso 1: Análisis con Gemini
      results.pipeline.push({
        step: 1,
        name: "Análisis con Google Gemini",
        status: "Iniciando",
        description: "Analizando el texto con el modelo Gemini Pro",
      });

      try {
        if (!API_CONFIG.GEMINI_API_KEY) {
          throw new Error("API key de Gemini no configurada");
        }
        const geminiResult = await this.analyzeWithGemini(text);
        results.gemini = geminiResult;
        results.pipeline[0].status = "Completado";
        results.pipeline[0].result = geminiResult;
      } catch (error) {
        console.warn("Error en análisis Gemini:", error);
        results.pipeline[0].status = "Error";
        results.pipeline[0].error = error.message;
        results.pipeline[0].result = {
          error: error.message,
          fallback:
            "Análisis no disponible - API no configurada o error de conexión",
        };
      }

      // Paso 2: Análisis con Hugging Face
      results.pipeline.push({
        step: 2,
        name: "Análisis con Hugging Face",
        status: "Iniciando",
        description: "Analizando patrones lingüísticos y sentimientos",
      });

      try {
        if (!API_CONFIG.HUGGING_FACE_API_KEY) {
          throw new Error("API key de Hugging Face no configurada");
        }
        const huggingfaceResult = await this.analyzeWithHuggingFace(text);
        results.huggingface = huggingfaceResult;
        results.pipeline[1].status = "Completado";
        results.pipeline[1].result = huggingfaceResult;
      } catch (error) {
        console.warn("Error en análisis Hugging Face:", error);
        results.pipeline[1].status = "Error";
        results.pipeline[1].error = error.message;
        results.pipeline[1].result = {
          error: error.message,
          fallback:
            "Análisis no disponible - API no configurada o error de conexión",
        };
      }

      // Paso 3: Búsqueda en Google para verificar contenido
      results.pipeline.push({
        step: 3,
        name: "Verificación de Contenido",
        status: "Iniciando",
        description: "Buscando similitudes y verificando fuentes",
      });

      try {
        if (
          !API_CONFIG.GOOGLE_SEARCH_API_KEY ||
          !API_CONFIG.GOOGLE_SEARCH_ENGINE_ID
        ) {
          throw new Error("API de Google Search no configurada");
        }
        const searchResult = await this.searchGoogleContent(text);
        results.googleSearch = searchResult;
        results.pipeline[2].status = "Completado";
        results.pipeline[2].result = searchResult;
      } catch (error) {
        console.warn("Error en búsqueda Google:", error);
        results.pipeline[2].status = "Error";
        results.pipeline[2].error = error.message;
        results.pipeline[2].result = {
          error: error.message,
          fallback:
            "Verificación no disponible - API no configurada o error de conexión",
        };
      }

      // Paso 4: Análisis final y decisión
      results.pipeline.push({
        step: 4,
        name: "Análisis Final",
        status: "Procesando",
        description: "Combinando resultados y tomando decisión final",
      });

      const finalAnalysis = this.combineResults(results);
      results.finalResult = finalAnalysis.result;
      results.confidence = finalAnalysis.confidence;
      results.explanation = finalAnalysis.explanation;
      results.pipeline[3].status = "Completado";
      results.pipeline[3].result = finalAnalysis;

      // Registrar el análisis en el sistema de monitoreo
      const processingTime = Date.now() - startTime;
      await systemMonitoringService.recordAnalysis({
        type: "texto",
        result: results.finalResult,
        confidence: results.confidence,
        processingTime: processingTime,
      });

      // Guardar en Firestore
      try {
        await DatabaseService.saveAnalysis({
          type: "texto",
          content: text.substring(0, 500), // Solo primeros 500 caracteres por privacidad
          result: results.finalResult,
          confidence: results.confidence,
          explanation: results.explanation,
          processingTime: processingTime,
          pipeline: results.pipeline,
          geminiResult: results.gemini,
          huggingfaceResult: results.huggingface,
          googleSearchResult: results.googleSearch
        });
      } catch (error) {
        console.warn("Error guardando en Firestore:", error);
      }

      return results;
    } catch (error) {
      throw new Error(`Error en el análisis de texto: ${error.message}`);
    }
  }

  // Análisis con Google Gemini
  async analyzeWithGemini(text) {
    try {
      const prompt = `
        Analiza el siguiente texto y determina si fue generado por inteligencia artificial o escrito por un humano.
        
        Texto: "${text}"
        
        Proporciona tu análisis en el siguiente formato JSON:
        {
          "isAI": true/false,
          "confidence": 0.85,
          "reasoning": "Explicación detallada de tu decisión",
          "indicators": ["indicador1", "indicador2"],
          "languagePatterns": "Análisis de patrones lingüísticos",
          "suggestions": "Sugerencias para mejorar la detección"
        }
        
        Sé objetivo y proporciona evidencia específica para tu conclusión.
      `;

      const response = await this.axios.post(
        `${API_CONFIG.GEMINI_API_URL}?key=${API_CONFIG.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        },
        {
          headers: getHeaders("gemini"),
        }
      );

      const result = response.data.candidates[0].content.parts[0].text;

      // Intentar parsear el JSON de la respuesta
      try {
        return JSON.parse(result);
      } catch {
        // Si no es JSON válido, extraer información del texto
        return {
          isAI:
            result.toLowerCase().includes("ia") ||
            result.toLowerCase().includes("artificial"),
          confidence: 0.7,
          reasoning: result,
          indicators: ["Respuesta no estructurada"],
          languagePatterns: "Análisis basado en texto libre",
          suggestions:
            "Mejorar el prompt para obtener respuestas estructuradas",
        };
      }
    } catch (error) {
      throw new Error(`Error en Gemini API: ${error.message}`);
    }
  }

  // Análisis con Hugging Face
  async analyzeWithHuggingFace(text) {
    try {
      // Análisis de sentimientos
      const sentimentResponse = await this.axios.post(
        `${API_CONFIG.HUGGING_FACE_API_URL}/${HUGGING_FACE_MODELS.SENTIMENT_ANALYSIS}`,
        { inputs: text },
        { headers: getHeaders("huggingface") }
      );

      // Clasificación de texto
      const classificationResponse = await this.axios.post(
        `${API_CONFIG.HUGGING_FACE_API_URL}/${HUGGING_FACE_MODELS.TEXT_CLASSIFICATION}`,
        { inputs: text },
        { headers: getHeaders("huggingface") }
      );

      return {
        sentiment: sentimentResponse.data[0],
        classification: classificationResponse.data[0],
        textLength: text.length,
        wordCount: text.split(" ").length,
        complexity: this.calculateTextComplexity(text),
      };
    } catch (error) {
      throw new Error(`Error en Hugging Face API: ${error.message}`);
    }
  }

  // Búsqueda en Google para verificar contenido
  async searchGoogleContent(text) {
    try {
      // Extraer palabras clave del texto
      const keywords = this.extractKeywords(text);

      const response = await this.axios.get(API_CONFIG.GOOGLE_SEARCH_API_URL, {
        params: {
          key: API_CONFIG.GOOGLE_SEARCH_API_KEY,
          cx: API_CONFIG.GOOGLE_SEARCH_ENGINE_ID,
          q: keywords.join(" "),
          num: 5,
        },
      });

      const searchResults = response.data.items || [];
      const totalResults = response.data.searchInformation?.totalResults || 0;

      // Procesar y formatear los resultados para mostrar
      const formattedResults = searchResults.map((item, index) => ({
        id: index + 1,
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        displayLink: item.displayLink,
        relevance: this.calculateRelevance(text, item),
      }));

      return {
        searchResults: formattedResults,
        totalResults: totalResults,
        keywords: keywords,
        similarity: this.calculateSimilarity(text, searchResults),
        analysis: this.analyzeSearchResults(formattedResults, text),
      };
    } catch (error) {
      throw new Error(`Error en Google Search API: ${error.message}`);
    }
  }

  // Análisis de imagen
  async analyzeImage(imageFile) {
    try {
      const results = {
        gemini: null,
        huggingface: null,
        finalResult: null,
        confidence: 0,
        explanation: "",
        pipeline: [],
      };

      // Paso 1: Análisis con Gemini Vision
      results.pipeline.push({
        step: 1,
        name: "Análisis Visual con Gemini",
        status: "Iniciando",
        description: "Analizando la imagen con Gemini Vision",
      });

      try {
        const geminiResult = await this.analyzeImageWithGemini(imageFile);
        results.gemini = geminiResult;
        results.pipeline[0].status = "Completado";
        results.pipeline[0].result = geminiResult;
      } catch (error) {
        results.pipeline[0].status = "Error";
        results.pipeline[0].error = error.message;
      }

      // Paso 2: Análisis con Hugging Face
      results.pipeline.push({
        step: 2,
        name: "Análisis de Metadatos",
        status: "Iniciando",
        description: "Analizando metadatos y patrones de la imagen",
      });

      try {
        const huggingfaceResult = await this.analyzeImageWithHuggingFace(
          imageFile
        );
        results.huggingface = huggingfaceResult;
        results.pipeline[1].status = "Completado";
        results.pipeline[1].result = huggingfaceResult;
      } catch (error) {
        results.pipeline[1].status = "Error";
        results.pipeline[1].error = error.message;
      }

      // Paso 3: Análisis final
      results.pipeline.push({
        step: 3,
        name: "Análisis Final",
        status: "Procesando",
        description: "Combinando resultados visuales y metadatos",
      });

      const finalAnalysis = this.combineImageResults(results);
      results.finalResult = finalAnalysis.result;
      results.confidence = finalAnalysis.confidence;
      results.explanation = finalAnalysis.explanation;
      results.pipeline[2].status = "Completado";
      results.pipeline[2].result = finalAnalysis;

      return results;
    } catch (error) {
      throw new Error(`Error en el análisis de imagen: ${error.message}`);
    }
  }

  // Análisis de imagen con Gemini Vision
  async analyzeImageWithGemini(imageFile) {
    try {
      // Convertir imagen a base64
      const base64Image = await this.fileToBase64(imageFile);

      const prompt = `
        Analiza esta imagen y determina si fue generada por inteligencia artificial o es una imagen real.
        
        Proporciona tu análisis en el siguiente formato JSON:
        {
          "isAI": true/false,
          "confidence": 0.85,
          "reasoning": "Explicación detallada de tu decisión",
          "visualIndicators": ["indicador1", "indicador2"],
          "quality": "Evaluación de la calidad de la imagen",
          "suggestions": "Sugerencias para mejorar la detección"
        }
        
        Sé objetivo y proporciona evidencia visual específica para tu conclusión.
      `;

      const response = await this.axios.post(
        `${API_CONFIG.GEMINI_API_URL.replace(
          "gemini-pro",
          "gemini-pro-vision"
        )}?key=${API_CONFIG.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: imageFile.type,
                    data: base64Image.split(",")[1],
                  },
                },
              ],
            },
          ],
        },
        {
          headers: getHeaders("gemini"),
        }
      );

      const result = response.data.candidates[0].content.parts[0].text;

      try {
        return JSON.parse(result);
      } catch {
        return {
          isAI:
            result.toLowerCase().includes("ia") ||
            result.toLowerCase().includes("artificial"),
          confidence: 0.7,
          reasoning: result,
          visualIndicators: ["Respuesta no estructurada"],
          quality: "Análisis basado en texto libre",
          suggestions:
            "Mejorar el prompt para obtener respuestas estructuradas",
        };
      }
    } catch (error) {
      throw new Error(`Error en Gemini Vision API: ${error.message}`);
    }
  }

  // Análisis de imagen con Hugging Face
  async analyzeImageWithHuggingFace(imageFile) {
    try {
      // Análisis básico de metadatos
      const metadata = {
        fileName: imageFile.name,
        fileSize: imageFile.size,
        fileType: imageFile.type,
        lastModified: new Date(imageFile.lastModified),
        dimensions: await this.getImageDimensions(imageFile),
      };

      return {
        metadata,
        analysis: "Análisis de metadatos completado",
        indicators: this.analyzeImageMetadata(metadata),
      };
    } catch (error) {
      throw new Error(
        `Error en análisis de imagen Hugging Face: ${error.message}`
      );
    }
  }

  // Funciones auxiliares
  calculateTextComplexity(text) {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const words = text.split(/\s+/).filter((w) => w.length > 0);
    const avgWordLength =
      words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const avgSentenceLength = words.length / sentences.length;

    return {
      avgWordLength: Math.round(avgWordLength * 100) / 100,
      avgSentenceLength: Math.round(avgSentenceLength * 100) / 100,
      complexity:
        avgWordLength > 6 || avgSentenceLength > 20 ? "Alta" : "Normal",
    };
  }

  extractKeywords(text) {
    // Algoritmo simple de extracción de palabras clave
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .filter(
        (word) =>
          ![
            "para",
            "con",
            "los",
            "las",
            "del",
            "una",
            "este",
            "esta",
            "como",
            "para",
          ].includes(word)
      );

    // Contar frecuencia y tomar las más comunes
    const wordCount = {};
    words.forEach((word) => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  calculateSimilarity(text, searchResults) {
    if (!searchResults.length) return 0;

    const textWords = new Set(text.toLowerCase().split(/\s+/));
    let totalSimilarity = 0;

    searchResults.forEach((result) => {
      const resultWords = new Set(result.title.toLowerCase().split(/\s+/));
      const intersection = new Set(
        [...textWords].filter((x) => resultWords.has(x))
      );
      const union = new Set([...textWords, ...resultWords]);
      const similarity = intersection.size / union.size;
      totalSimilarity += similarity;
    });

    return Math.round((totalSimilarity / searchResults.length) * 100) / 100;
  }

  // Calcular relevancia de cada resultado de búsqueda
  calculateRelevance(text, searchResult) {
    const textWords = new Set(text.toLowerCase().split(/\s+/));
    const titleWords = new Set(searchResult.title.toLowerCase().split(/\s+/));
    const snippetWords = new Set(searchResult.snippet.toLowerCase().split(/\s+/));
    
    const titleIntersection = new Set([...textWords].filter(x => titleWords.has(x)));
    const snippetIntersection = new Set([...textWords].filter(x => snippetWords.has(x)));
    
    const titleRelevance = titleIntersection.size / textWords.size;
    const snippetRelevance = snippetIntersection.size / textWords.size;
    
    return Math.round((titleRelevance * 0.7 + snippetRelevance * 0.3) * 100) / 100;
  }

  // Analizar resultados de búsqueda para contexto
  analyzeSearchResults(searchResults, originalText) {
    if (!searchResults.length) {
      return {
        summary: "No se encontraron resultados relevantes",
        conclusion: "La falta de fuentes verificadas sugiere contenido original o poco común",
        recommendation: "Verificar manualmente la información"
      };
    }

    const highRelevanceResults = searchResults.filter(r => r.relevance > 0.5);
    const mediumRelevanceResults = searchResults.filter(r => r.relevance > 0.2 && r.relevance <= 0.5);
    const lowRelevanceResults = searchResults.filter(r => r.relevance <= 0.2);

    let conclusion = "";
    let recommendation = "";

    if (highRelevanceResults.length > 0) {
      conclusion = `Se encontraron ${highRelevanceResults.length} fuentes altamente relevantes que respaldan o contradicen el contenido.`;
      recommendation = "El contenido parece estar basado en información verificable.";
    } else if (mediumRelevanceResults.length > 0) {
      conclusion = `Se encontraron ${mediumRelevanceResults.length} fuentes con relevancia moderada.`;
      recommendation = "El contenido tiene algunas referencias verificables pero requiere verificación adicional.";
    } else {
      conclusion = "Los resultados de búsqueda tienen baja relevancia con el contenido analizado.";
      recommendation = "El contenido puede ser original, poco común o requerir verificación manual.";
    }

    return {
      summary: `Análisis de ${searchResults.length} fuentes encontradas`,
      conclusion: conclusion,
      recommendation: recommendation,
      relevanceBreakdown: {
        high: highRelevanceResults.length,
        medium: mediumRelevanceResults.length,
        low: lowRelevanceResults.length
      }
    };
  }

  // Generar explicación detallada del resultado
  generateDetailedExplanation(isAI, confidence, explanations, results) {
    const baseExplanation = isAI 
      ? "El análisis sugiere que este contenido fue generado por Inteligencia Artificial"
      : "El análisis sugiere que este contenido fue creado por un ser humano";

    let contextExplanation = "";
    let sourceExplanation = "";
    let recommendation = "";

    // Explicación del contexto de búsqueda
    if (results.googleSearch && results.googleSearch.analysis) {
      const analysis = results.googleSearch.analysis;
      contextExplanation = ` ${analysis.conclusion} ${analysis.recommendation}`;
    }

    // Explicación de fuentes
    if (results.googleSearch && results.googleSearch.searchResults.length > 0) {
      const sources = results.googleSearch.searchResults;
      const highRelevance = sources.filter(s => s.relevance > 0.5).length;
      sourceExplanation = ` Se analizaron ${sources.length} fuentes web, de las cuales ${highRelevance} tienen alta relevancia.`;
    }

    // Recomendación basada en confianza
    if (confidence > 0.8) {
      recommendation = " La alta confianza del análisis sugiere que este resultado es muy confiable.";
    } else if (confidence > 0.6) {
      recommendation = " La confianza moderada sugiere que este resultado es confiable pero se recomienda verificación adicional.";
    } else {
      recommendation = " La baja confianza sugiere que se requiere verificación manual del contenido.";
    }

    return baseExplanation + contextExplanation + sourceExplanation + recommendation;
  }

  combineResults(results) {
    let aiScore = 0;
    let humanScore = 0;
    let totalConfidence = 0;
    let explanations = [];

    // Analizar resultados de Gemini
    if (results.gemini) {
      if (results.gemini.isAI) {
        aiScore += results.gemini.confidence || 0.7;
      } else {
        humanScore += results.gemini.confidence || 0.7;
      }
      totalConfidence += results.gemini.confidence || 0.7;
      explanations.push(`Gemini: ${results.gemini.reasoning}`);
    }

    // Analizar resultados de Hugging Face
    if (results.huggingface) {
      const complexity = results.huggingface.complexity;
      if (complexity === "Alta") {
        aiScore += 0.6;
        humanScore += 0.4;
      } else {
        aiScore += 0.4;
        humanScore += 0.6;
      }
      totalConfidence += 0.5;
      explanations.push(`Análisis lingüístico: Complejidad ${complexity}`);
    }

    // Analizar resultados de Google Search
    if (results.googleSearch) {
      const similarity = results.googleSearch.similarity;
      const searchAnalysis = results.googleSearch.analysis;
      
      if (similarity > 0.7) {
        humanScore += 0.8;
        aiScore += 0.2;
        explanations.push(
          `Búsqueda web: Similitud ${Math.round(similarity * 100)}% - ${searchAnalysis.conclusion}`
        );
      } else if (similarity < 0.3) {
        aiScore += 0.8;
        humanScore += 0.2;
        explanations.push(
          `Búsqueda web: Similitud ${Math.round(similarity * 100)}% - ${searchAnalysis.conclusion}`
        );
      } else {
        aiScore += 0.5;
        humanScore += 0.5;
        explanations.push(
          `Búsqueda web: Similitud ${Math.round(similarity * 100)}% - ${searchAnalysis.conclusion}`
        );
      }
      totalConfidence += 0.6;
    }

    // Calcular resultado final
    const finalScore = aiScore / (aiScore + humanScore);
    const isAI = finalScore > 0.6;
    const confidence = Math.min(totalConfidence / 3, 0.95);

    return {
      result: isAI ? "IA" : "Humano",
      confidence: Math.round(confidence * 100) / 100,
      explanation: explanations.join(" | "),
      scores: {
        ai: Math.round(aiScore * 100) / 100,
        human: Math.round(humanScore * 100) / 100,
      },
    };
  }

  combineImageResults(results) {
    let aiScore = 0;
    let humanScore = 0;
    let totalConfidence = 0;
    let explanations = [];

    // Analizar resultados de Gemini Vision
    if (results.gemini) {
      if (results.gemini.isAI) {
        aiScore += results.gemini.confidence || 0.7;
      } else {
        humanScore += results.gemini.confidence || 0.7;
      }
      totalConfidence += results.gemini.confidence || 0.7;
      explanations.push(`Análisis visual: ${results.gemini.reasoning}`);
    }

    // Analizar metadatos
    if (results.huggingface) {
      const metadata = results.huggingface.metadata;
      if (metadata.fileSize < 100000) {
        // Archivos muy pequeños pueden ser IA
        aiScore += 0.6;
        humanScore += 0.4;
      } else {
        aiScore += 0.4;
        humanScore += 0.6;
      }
      totalConfidence += 0.5;
      explanations.push(
        `Metadatos: Tamaño ${Math.round(metadata.fileSize / 1024)}KB`
      );
    }

    // Calcular resultado final
    const finalScore = aiScore / (aiScore + humanScore);
    const isAI = finalScore > 0.6;
    const confidence = Math.min(totalConfidence / 2, 0.95);

    return {
      result: isAI ? "IA" : "Humano",
      confidence: Math.round(confidence * 100) / 100,
      explanation: explanations.join(" | "),
      scores: {
        ai: Math.round(aiScore * 100) / 100,
        human: Math.round(humanScore * 100) / 100,
      },
    };
  }

  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  async getImageDimensions(file) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        });
      };
      img.src = URL.createObjectURL(file);
    });
  }

  analyzeImageMetadata(metadata) {
    const indicators = [];

    if (metadata.fileSize < 50000) {
      indicators.push("Archivo muy pequeño, posiblemente generado por IA");
    }

    if (metadata.fileType === "image/jpeg" && metadata.fileSize < 100000) {
      indicators.push(
        "JPEG de baja calidad, posiblemente comprimido artificialmente"
      );
    }

    return indicators;
  }
}

export default new AnalysisService();
