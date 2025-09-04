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
        results.pipeline[0].timestamp = new Date().toISOString();
      } catch (error) {
        console.warn("Error en análisis Gemini:", error);
        results.pipeline[0].status = "Error";
        results.pipeline[0].error = error.message;
        results.pipeline[0].result = {
          error: error.message,
          fallback: "Análisis no disponible - API no configurada o error de conexión",
        };
        results.pipeline[0].timestamp = new Date().toISOString();
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
        results.pipeline[1].timestamp = new Date().toISOString();
      } catch (error) {
        console.warn("Error en análisis Hugging Face:", error);
        results.pipeline[1].status = "Error";
        results.pipeline[1].error = error.message;
        results.pipeline[1].result = {
          error: error.message,
          fallback: "Análisis no disponible - API no configurada o error de conexión",
        };
        results.pipeline[1].timestamp = new Date().toISOString();
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
        results.pipeline[2].timestamp = new Date().toISOString();
      } catch (error) {
        console.warn("Error en búsqueda Google:", error);
        results.pipeline[2].status = "Error";
        results.pipeline[2].error = error.message;
        results.pipeline[2].result = {
          error: error.message,
          fallback: "Verificación no disponible - API no configurada o error de conexión",
        };
        results.pipeline[2].timestamp = new Date().toISOString();
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
      results.pipeline[3].timestamp = new Date().toISOString();
      results.pipeline[3].processingTime = Date.now() - startTime;

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

  // Análisis con Hugging Face (PRODUCCIÓN REAL)
  async analyzeWithHuggingFace(text) {
    try {
      if (!API_CONFIG.HUGGING_FACE_API_KEY) {
        throw new Error("API key de Hugging Face no configurada");
      }

      // Análisis de sentimientos con fallback inteligente
      let sentimentResponse;
      let sentimentFallback = false;
      
      try {
        sentimentResponse = await this.axios.post(
          `${API_CONFIG.HUGGING_FACE_API_URL}/${HUGGING_FACE_MODELS.SENTIMENT}`,
          { inputs: text },
          {
            headers: getHeaders("huggingface"),
            timeout: API_CONFIG.TIMEOUTS.HUGGING_FACE,
          }
        );
      } catch (error) {
        console.warn("Modelo de sentimientos falló, usando análisis de fallback...");
        sentimentFallback = true;
        // No lanzar error, continuar con fallback
      }

      // Clasificación de texto con fallback inteligente
      let classificationResponse;
      let classificationFallback = false;
      
      try {
        classificationResponse = await this.axios.post(
          `${API_CONFIG.HUGGING_FACE_API_URL}/${HUGGING_FACE_MODELS.TEXT_CLASSIFICATION}`,
          {
            inputs: text,
            parameters: {
              candidate_labels: [
                "Texto generado por IA",
                "Texto escrito por humano",
                "Contenido académico",
                "Contenido periodístico",
                "Contenido informal",
              ],
            },
          },
          {
            headers: getHeaders("huggingface"),
            timeout: API_CONFIG.TIMEOUTS.HUGGING_FACE,
          }
        );
      } catch (error) {
        console.warn("Modelo de clasificación falló, usando análisis de fallback...");
        classificationFallback = true;
        // No lanzar error, continuar con fallback
      }

      // Si ambos fallaron, usar análisis de fallback completo
      if (sentimentFallback && classificationFallback) {
        console.warn("Todas las APIs de Hugging Face fallaron, usando análisis de fallback...");
        return this.fallbackTextAnalysis(text);
      }

      // Procesar resultados con manejo de errores robusto
      let sentiment, classification;
      
      // Procesar sentimientos
      if (!sentimentFallback && sentimentResponse) {
        try {
          sentiment = sentimentResponse.data[0];
        } catch (error) {
          console.warn("Error procesando sentimientos:", error);
          sentiment = { label: "neutral", score: 0.5 };
        }
      } else {
        sentiment = { label: "neutral", score: 0.5, fallback: true };
      }

      // Procesar clasificación
      if (!classificationFallback && classificationResponse) {
        try {
          classification = classificationResponse.data;
        } catch (error) {
          console.warn("Error procesando clasificación:", error);
          classification = { labels: ["Texto escrito por humano"], scores: [0.5] };
        }
      } else {
        classification = { labels: ["Texto escrito por humano"], scores: [0.5], fallback: true };
      }

      // Determinar si es IA basado en clasificación
      const isAI = classification.labels && classification.labels[0] === "Texto generado por IA";
      const confidence = classification.scores && classification.scores[0] ? classification.scores[0] : 0.5;

      // Crear explicación que indique fallbacks
      let explanation = `Clasificación: ${classification.labels ? classification.labels[0] : "No disponible"} (${Math.round(confidence * 100)}% confianza)`;
      
      if (classification.fallback) {
        explanation += " [FALLBACK]";
      }
      
      explanation += ` | Sentimiento: ${sentiment.label || "No disponible"} (${Math.round((sentiment.score || 0.5) * 100)}% confianza)`;
      
      if (sentiment.fallback) {
        explanation += " [FALLBACK]";
      }

      return {
        result: isAI ? "IA" : "HUMANO",
        confidence: confidence,
        explanation: explanation,
        sentiment: {
          label: sentiment.label || "neutral",
          score: sentiment.score || 0.5,
          fallback: sentiment.fallback || false,
        },
        classification: {
          label: classification.labels ? classification.labels[0] : "No disponible",
          score: classification.scores ? classification.scores[0] : 0.5,
          allLabels: classification.labels || ["No disponible"],
          allScores: classification.scores || [0.5],
          fallback: classification.fallback || false,
        },
        // Análisis adicional para PRODUCCIÓN
        textLength: text.length,
        wordCount: text.split(" ").length,
        complexity: this.calculateTextComplexity(text),
        patterns: this.detectLanguagePatterns(text),
        readability: this.calculateReadabilityScore(text),
        // Indicar qué APIs fallaron
        apiStatus: {
          sentiment: !sentimentFallback,
          classification: !classificationFallback,
          fallbackUsed: sentimentFallback || classificationFallback
        }
      };
    } catch (error) {
      console.error("Error en análisis Hugging Face:", error);
      
      // Fallback para PRODUCCIÓN cuando Hugging Face falle completamente
      console.warn("Usando análisis de fallback basado en características del texto...");
      return this.fallbackTextAnalysis(text);
    }
  }

  // Análisis de fallback cuando las APIs fallan
  fallbackTextAnalysis(text) {
    const complexity = this.calculateTextComplexity(text);
    const patterns = this.detectLanguagePatterns(text);
    const readability = this.calculateReadabilityScore(text);

    // Heurísticas simples para determinar si es IA
    let aiScore = 0;
    let humanScore = 0;
    const indicators = [];

    // Evaluar complejidad
    if (complexity.score > 2.0) {
      aiScore += 0.6;
      indicators.push("Complejidad muy alta");
    } else if (complexity.score > 1.5) {
      aiScore += 0.4;
      indicators.push("Complejidad alta");
    } else {
      humanScore += 0.6;
      indicators.push("Complejidad normal");
    }

    // Evaluar patrones de repetición
    if (patterns.repetition > 0.7) {
      aiScore += 0.7;
      indicators.push("Alta repetición de palabras");
    } else {
      humanScore += 0.5;
      indicators.push("Vocabulario diverso");
    }

    // Evaluar legibilidad
    if (readability < 30) {
      aiScore += 0.5;
      indicators.push("Baja legibilidad");
    } else if (readability > 70) {
      humanScore += 0.5;
      indicators.push("Alta legibilidad");
    }

    // Calcular resultado final
    const totalScore = aiScore + humanScore;
    const finalScore = aiScore / totalScore;
    const isAI = finalScore > 0.6;
    const confidence = Math.min(totalScore / 3, 0.8);

    return {
      result: isAI ? "IA" : "HUMANO",
      confidence: confidence,
      explanation: `Análisis de fallback: ${indicators.join(", ")} (${Math.round(confidence * 100)}% confianza)`,
      sentiment: {
        label: "neutral",
        score: 0.5,
      },
      classification: {
        label: isAI ? "Texto generado por IA" : "Texto escrito por humano",
        score: confidence,
        allLabels: [isAI ? "Texto generado por IA" : "Texto escrito por humano"],
        allScores: [confidence],
      },
      // Análisis adicional para PRODUCCIÓN
      textLength: text.length,
      wordCount: text.split(" ").length,
      complexity: complexity,
      patterns: patterns,
      readability: readability,
      fallback: true
    };
  }

  // Búsqueda en Google para verificar contenido
  async searchGoogleContent(text) {
    try {
      // Extraer palabras clave más inteligentes del texto
      const keywords = this.extractSmartKeywords(text);
      
      // Crear múltiples consultas para mejor cobertura
      const searchQueries = this.createSearchQueries(keywords, text);

      let allResults = [];
      let totalResults = 0;

      // Realizar búsquedas con diferentes consultas
      for (const query of searchQueries.slice(0, 3)) { // Máximo 3 consultas
        try {
          const response = await this.axios.get(API_CONFIG.GOOGLE_SEARCH_API_URL, {
            params: {
              key: API_CONFIG.GOOGLE_SEARCH_API_KEY,
              cx: API_CONFIG.GOOGLE_SEARCH_ENGINE_ID,
              q: query,
              num: 3, // Reducir por consulta para obtener más variedad
              lr: "lang_es", // Restringir a español
              cr: "countryCO", // Restringir a Colombia
            },
          });

          const searchResults = response.data.items || [];
          totalResults = Math.max(totalResults, response.data.searchInformation?.totalResults || 0);
          
          // Agregar resultados únicos
          searchResults.forEach(item => {
            if (!allResults.find(r => r.link === item.link)) {
              allResults.push(item);
            }
          });
        } catch (queryError) {
          console.warn(`Error en consulta "${query}":`, queryError.message);
        }
      }

      // Ordenar por relevancia y tomar los mejores
      const formattedResults = allResults
        .map((item, index) => ({
          id: index + 1,
          title: item.title,
          link: item.link,
          snippet: item.snippet,
          displayLink: item.displayLink,
          relevance: this.calculateRelevance(text, item),
        }))
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 5); // Solo los 5 más relevantes

      return {
        searchResults: formattedResults,
        totalResults: totalResults,
        keywords: keywords,
        similarity: this.calculateSimilarity(text, formattedResults),
        analysis: this.analyzeSearchResults(formattedResults, text),
        detailedResults: formattedResults.map(result => ({
          title: result.title,
          link: result.link,
          snippet: result.snippet,
          source: result.displayLink,
          relevance: result.relevance,
          relevanceScore: Math.round(result.relevance * 100)
        })),
        // Información adicional para PRODUCCIÓN
        searchQuery: searchQueries.join(" | "),
        searchTimestamp: new Date().toISOString(),
        searchEngine: "Google Custom Search",
        searchParameters: {
          maxResults: 5,
          language: "es",
          region: "CO",
          queries: searchQueries.length
        }
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

  // Funciones auxiliares para PRODUCCIÓN
  calculateTextComplexity(text) {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const words = text.split(/\s+/).filter((w) => w.length > 0);
    const avgWordLength =
      words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const avgSentenceLength = words.length / sentences.length;

    // Análisis avanzado de complejidad para PRODUCCIÓN
    const complexity = this.analyzeAdvancedComplexity(text, avgWordLength, avgSentenceLength);

    return {
      avgWordLength: Math.round(avgWordLength * 100) / 100,
      avgSentenceLength: Math.round(avgSentenceLength * 100) / 100,
      complexity: complexity.level,
      score: complexity.score,
      indicators: complexity.indicators,
      readability: this.calculateReadabilityScore(text)
    };
  }

  analyzeAdvancedComplexity(text, avgWordLength, avgSentenceLength) {
    let score = 0;
    const indicators = [];

    // Evaluar longitud de palabras
    if (avgWordLength > 8) {
      score += 0.8;
      indicators.push("Palabras muy largas");
    } else if (avgWordLength > 6) {
      score += 0.6;
      indicators.push("Palabras largas");
    } else if (avgWordLength > 4) {
      score += 0.4;
      indicators.push("Palabras medianas");
    } else {
      score += 0.2;
      indicators.push("Palabras cortas");
    }

    // Evaluar longitud de oraciones
    if (avgSentenceLength > 25) {
      score += 0.8;
      indicators.push("Oraciones muy largas");
    } else if (avgSentenceLength > 20) {
      score += 0.6;
      indicators.push("Oraciones largas");
    } else if (avgSentenceLength > 15) {
      score += 0.4;
      indicators.push("Oraciones medianas");
    } else {
      score += 0.2;
      indicators.push("Oraciones cortas");
    }

    // Evaluar vocabulario
    const uniqueWords = new Set(text.toLowerCase().split(/\s+/));
    const totalWords = text.split(/\s+/).length;
    const vocabularyDiversity = uniqueWords.size / totalWords;

    if (vocabularyDiversity < 0.3) {
      score += 0.8;
      indicators.push("Vocabulario repetitivo");
    } else if (vocabularyDiversity < 0.5) {
      score += 0.6;
      indicators.push("Vocabulario moderado");
    } else {
      score += 0.2;
      indicators.push("Vocabulario diverso");
    }

    // Determinar nivel de complejidad
    let level = "Normal";
    if (score > 2.0) level = "Muy Alta";
    else if (score > 1.5) level = "Alta";
    else if (score > 1.0) level = "Moderada";
    else level = "Baja";

    return {
      level,
      score: Math.round(score * 100) / 100,
      indicators
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

  // Extraer palabras clave más inteligentes del texto
  extractSmartKeywords(text) {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const stopWords = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'pero', 'si', 'no', 'que', 'cual', 'quien', 'donde', 'cuando', 'como', 'por', 'para', 'con', 'sin', 'sobre', 'bajo', 'entre', 'detras', 'delante', 'desde', 'hasta', 'durante', 'antes', 'despues', 'mientras', 'aunque', 'porque', 'pues', 'entonces', 'asi', 'tambien', 'tampoco', 'nunca', 'siempre', 'a veces', 'mucho', 'poco', 'mas', 'menos', 'muy', 'demasiado', 'bastante', 'casi', 'apenas', 'solo', 'solamente', 'incluso', 'ademas', 'tambien', 'tampoco', 'ni', 'o', 'u', 'pero', 'mas', 'aunque', 'sin embargo', 'no obstante', 'por el contrario', 'por otra parte', 'por un lado', 'por otro lado', 'en primer lugar', 'en segundo lugar', 'finalmente', 'en conclusion', 'en resumen', 'en resumidas cuentas', 'en definitiva', 'en fin', 'por ultimo', 'para terminar', 'para finalizar', 'para concluir', 'para resumir', 'para sintetizar', 'para resumir', 'para sintetizar', 'para resumir', 'para sintetizar']);
    
    const filteredWords = words.filter(word => !stopWords.has(word));
    
    // Contar frecuencia y tomar las más comunes
    const wordCount = {};
    filteredWords.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  // Crear consultas de búsqueda inteligentes
  createSearchQueries(keywords, text) {
    const queries = [];
    
    // Consulta 1: Palabras clave principales
    if (keywords.length > 0) {
      queries.push(keywords.slice(0, 5).join(" "));
    }
    
    // Consulta 2: Frases específicas del texto
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    if (sentences.length > 0) {
      const firstSentence = sentences[0].trim().substring(0, 100);
      queries.push(`"${firstSentence}"`);
    }
    
    // Consulta 3: Combinación de palabras clave más relevantes
    if (keywords.length > 2) {
      const relevantKeywords = keywords.filter(word => 
        word.length > 4 && !['gobierno', 'ministerio', 'presidente', 'partido'].includes(word)
      );
      if (relevantKeywords.length > 0) {
        queries.push(relevantKeywords.slice(0, 3).join(" "));
      }
    }
    
    return queries;
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

  // Métodos auxiliares para PRODUCCIÓN
  detectLanguagePatterns(text) {
    const patterns = {
      repetition: 0,
      formality: 0,
      structure: 0
    };

    // Detectar repetición de palabras
    const words = text.toLowerCase().split(/\s+/);
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    const repeatedWords = Object.values(wordCount).filter(count => count > 2).length;
    patterns.repetition = Math.min(repeatedWords / words.length, 1);

    // Detectar formalidad
    const formalWords = ['por consiguiente', 'en consecuencia', 'así mismo', 'de igual manera'];
    const formalCount = formalWords.filter(word => text.toLowerCase().includes(word)).length;
    patterns.formality = formalCount / formalWords.length;

    // Detectar estructura
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    patterns.structure = avgSentenceLength > 100 ? 0.8 : avgSentenceLength > 50 ? 0.5 : 0.2;

    return patterns;
  }

  calculateReadabilityScore(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/);
    const syllables = this.countSyllables(text);

    if (sentences.length === 0 || words.length === 0) return 0;

    const avgSentenceLength = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;

    // Fórmula de Flesch Reading Ease
    const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    
    return Math.max(0, Math.min(100, fleschScore));
  }

  countSyllables(text) {
    const words = text.toLowerCase().split(/\s+/);
    let totalSyllables = 0;

    words.forEach(word => {
      totalSyllables += this.countWordSyllables(word);
    });

    return totalSyllables;
  }

  countWordSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;

    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');

    const syllables = word.toLowerCase().match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
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
    
    // Estructura de explicación detallada
    const detailedExplanation = {
      gemini: {
        available: false,
        result: null,
        confidence: 0,
        reasoning: "",
        indicators: [],
        languagePatterns: "",
        suggestions: "",
        fallback: false
      },
      huggingface: {
        available: false,
        result: null,
        confidence: 0,
        explanation: "",
        complexity: null,
        readability: 0,
        patterns: {},
        fallback: false
      },
      webSearch: {
        available: false,
        keywords: [],
        similarity: 0,
        totalResults: 0,
        topSources: [],
        analysis: null
      },
      finalAnalysis: {
        conclusion: "",
        confidence: 0,
        recommendation: "",
        factors: []
      }
    };

    // Analizar resultados de Gemini (REAL)
    if (results.gemini && results.gemini.result) {
      const geminiResult = results.gemini.result;
      const geminiConfidence = results.gemini.confidence || 0.5;
      
      detailedExplanation.gemini.available = true;
      detailedExplanation.gemini.result = geminiResult;
      detailedExplanation.gemini.confidence = geminiConfidence;
      // Limpiar caracteres JSON y asegurar mención de Gemini 2.0 Flash
      let cleanReasoning = results.gemini.reasoning || results.gemini.explanation || "Análisis completado con Gemini 2.0 Flash";
      cleanReasoning = cleanReasoning
        .replace(/```json[\s\S]*?```/g, '') // Remover bloques JSON
        .replace(/[{}[\]]/g, '') // Remover llaves y corchetes
        .replace(/["']/g, '') // Remover comillas
        .replace(/\s+/g, ' ') // Normalizar espacios
        .trim();
      
      if (!cleanReasoning.includes("Gemini 2.0 Flash")) {
        cleanReasoning = `Análisis completado con Gemini 2.0 Flash: ${cleanReasoning}`;
      }
      
      detailedExplanation.gemini.reasoning = cleanReasoning;
      detailedExplanation.gemini.indicators = results.gemini.indicators || [];
      detailedExplanation.gemini.languagePatterns = results.gemini.languagePatterns || "";
      detailedExplanation.gemini.suggestions = results.gemini.suggestions || "";
      
      if (geminiResult === "IA") {
        aiScore += geminiConfidence;
      } else if (geminiResult === "HUMANO") {
        humanScore += geminiConfidence;
      }
      totalConfidence += geminiConfidence;
    } else if (results.gemini && results.gemini.error) {
      detailedExplanation.gemini.fallback = true;
      detailedExplanation.gemini.reasoning = `Error: ${results.gemini.error} - Usando análisis de respaldo`;
      totalConfidence += 0.3; // Confianza reducida por fallback
    } else if (results.gemini && results.gemini.isAI !== undefined) {
      // Si Gemini devuelve isAI en lugar de result
      const geminiConfidence = results.gemini.confidence || 0.7;
      
      detailedExplanation.gemini.available = true;
      detailedExplanation.gemini.result = results.gemini.isAI ? "IA" : "HUMANO";
      detailedExplanation.gemini.confidence = geminiConfidence;
      detailedExplanation.gemini.reasoning = results.gemini.reasoning || "Análisis completado con Gemini 2.0 Flash";
      detailedExplanation.gemini.indicators = results.gemini.indicators || [];
      detailedExplanation.gemini.languagePatterns = results.gemini.languagePatterns || "";
      detailedExplanation.gemini.suggestions = results.gemini.suggestions || "";
      
      if (results.gemini.isAI) {
        aiScore += geminiConfidence;
      } else {
        humanScore += geminiConfidence;
      }
      totalConfidence += geminiConfidence;
    }

    // Analizar resultados de Hugging Face (REAL)
    if (results.huggingface && results.huggingface.result) {
      const hfResult = results.huggingface.result;
      const hfConfidence = results.huggingface.confidence || 0.5;
      const apiStatus = results.huggingface.apiStatus;
      
      detailedExplanation.huggingface.available = true;
      detailedExplanation.huggingface.result = hfResult;
      detailedExplanation.huggingface.confidence = hfConfidence;
      // Limpiar explicación de Hugging Face y agregar más contexto
      let cleanExplanation = results.huggingface.explanation || "Análisis completado con Hugging Face";
      cleanExplanation = cleanExplanation
        .replace(/\[FALLBACK\]/g, '') // Remover marcadores de fallback
        .replace(/\[ANÁLISIS DE RESPALDO\]/g, '') // Remover marcadores de respaldo
        .replace(/\(\d+% confianza\)/g, '') // CORREGIR: Remover doble porcentaje
        .replace(/\s+/g, ' ') // Normalizar espacios
        .trim();
      
      // Agregar más explicación si es muy corta
      if (cleanExplanation.length < 50) {
        cleanExplanation = `Análisis de patrones lingüísticos completado: ${cleanExplanation}`;
      }
      
      detailedExplanation.huggingface.explanation = cleanExplanation;
      detailedExplanation.huggingface.complexity = results.huggingface.complexity || null;
      detailedExplanation.huggingface.readability = results.huggingface.readability || 0;
      detailedExplanation.huggingface.patterns = results.huggingface.patterns || {};
      detailedExplanation.huggingface.fallback = apiStatus && apiStatus.fallbackUsed;
      
      if (hfResult === "IA") {
        aiScore += hfConfidence;
      } else if (hfResult === "HUMANO") {
        humanScore += hfConfidence;
      }
      
      // Ajustar confianza basado en si se usó fallback
      if (apiStatus && apiStatus.fallbackUsed) {
        totalConfidence += hfConfidence * 0.7; // Reducir confianza por fallback
      } else {
        totalConfidence += hfConfidence;
      }
    } else if (results.huggingface && results.huggingface.fallback) {
      detailedExplanation.huggingface.fallback = true;
      detailedExplanation.huggingface.explanation = `Análisis de respaldo: ${results.huggingface.explanation}`;
      detailedExplanation.huggingface.complexity = results.huggingface.complexity || null;
      detailedExplanation.huggingface.readability = results.huggingface.readability || 0;
      totalConfidence += 0.4; // Confianza moderada por fallback
    }

    // Analizar resultados de Google Search (REAL)
    if (results.googleSearch) {
      const similarity = results.googleSearch.similarity || 0;
      const totalResults = results.googleSearch.totalResults || 0;
      const searchResults = results.googleSearch.searchResults || [];
      const keywords = results.googleSearch.keywords || [];
      
      detailedExplanation.webSearch.available = true;
      detailedExplanation.webSearch.keywords = keywords;
      detailedExplanation.webSearch.similarity = similarity;
      detailedExplanation.webSearch.totalResults = totalResults;
      // Limitar a 3-10 resultados más relevantes (no todos)
      const maxResults = Math.min(Math.max(3, Math.floor(searchResults.length * 0.6)), 10);
      detailedExplanation.webSearch.topSources = searchResults.slice(0, maxResults).map(r => ({
        title: r.title,
        link: r.link,
        source: r.displayLink,
        relevance: Math.round(r.relevance * 100)
      }));
      detailedExplanation.webSearch.analysis = results.googleSearch.analysis || null;
      
      if (similarity > 0.7 && totalResults > 0) {
        humanScore += 0.8;
        aiScore += 0.2;
      } else if (similarity < 0.3 || totalResults === 0) {
        aiScore += 0.8;
        humanScore += 0.2;
      } else {
        aiScore += 0.5;
        humanScore += 0.5;
      }
      totalConfidence += 0.6;
    }

    // Calcular resultado final con lógica mejorada y balanceada
    const totalScore = aiScore + humanScore;
    let finalScore = 0;
    let confidence = 0;
    
    if (totalScore > 0) {
      finalScore = aiScore / totalScore;
      
      // Calcular confianza basada en la diferencia entre scores
      const scoreDifference = Math.abs(aiScore - humanScore);
      
      // Normalizar scores para evitar valores excesivos
      const normalizedAiScore = Math.min(aiScore, 1.0);
      const normalizedHumanScore = Math.min(humanScore, 1.0);
      
      // CORREGIR: Calcular confianza de manera más realista
      if (scoreDifference > 0.5) {
        // Alta confianza cuando hay una diferencia clara
        confidence = Math.min(Math.max(normalizedAiScore, normalizedHumanScore) * 0.9, 0.95);
      } else if (scoreDifference > 0.2) {
        // Confianza moderada
        confidence = Math.min(Math.max(normalizedAiScore, normalizedHumanScore) * 0.8, 0.85);
      } else {
        // Baja confianza cuando los scores están muy cerca
        confidence = Math.min(Math.max(normalizedAiScore, normalizedHumanScore) * 0.6, 0.7);
      }
      
      // CORREGIR: Asegurar que la confianza nunca sea menor a 30%
      confidence = Math.max(confidence, 0.3);
    } else {
      // Fallback si no hay scores - confianza mínima realista
      confidence = 0.4;
    }
    
    // CORREGIR: Mejorar la clasificación basada en múltiples factores y contexto
    let isAI = finalScore > 0.6;
    
    // CORREGIR: Ser más conservador y requerir evidencia más fuerte
    if (finalScore < 0.7) {
      isAI = false; // Requerir evidencia más fuerte para clasificar como IA
    }
    
    // Ajustar clasificación basada en similitud web y contexto
    if (results.googleSearch) {
      const similarity = results.googleSearch.similarity || 0;
      const totalResults = results.googleSearch.totalResults || 0;
      
      // Si hay alta similitud con contenido existente, es más probable que sea humano
      if (similarity > 0.7 && totalResults > 1000) {
        isAI = false;
        confidence = Math.min(confidence + 0.1, 0.95);
      }
      // Si hay muy baja similitud y pocos resultados, es más probable que sea IA
      else if (similarity < 0.2 && totalResults < 100) {
        isAI = true;
        confidence = Math.min(confidence + 0.1, 0.95);
      }
    }
    
    // CORREGIR: Verificación adicional para textos largos y complejos
    if (results.huggingface && results.huggingface.textLength > 500) {
      // Para textos medianos y largos, ser más conservador
      if (finalScore < 0.75) {
        isAI = false;
        confidence = Math.min(confidence + 0.05, 0.95);
      }
    }
    
    // CORREGIR: Verificación especial para textos muy cortos o repetitivos
    if (results.huggingface && results.huggingface.textLength < 100) {
      // Para textos muy cortos, ser más estricto
      if (finalScore < 0.8) {
        isAI = false;
      }
    }

    // Generar explicación final estructurada
    const finalResult = isAI ? "IA" : "HUMANO";
    detailedExplanation.finalAnalysis.conclusion = finalResult;
    detailedExplanation.finalAnalysis.confidence = Math.round(confidence * 100) / 100;
    
    // Generar recomendación basada en confianza
    if (confidence > 0.8) {
      detailedExplanation.finalAnalysis.recommendation = "La alta confianza del análisis sugiere que este resultado es muy confiable.";
    } else if (confidence > 0.6) {
      detailedExplanation.finalAnalysis.recommendation = "La confianza moderada sugiere que este resultado es confiable pero se recomienda verificación adicional.";
    } else {
      detailedExplanation.finalAnalysis.recommendation = "La baja confianza sugiere que se requiere verificación manual del contenido.";
    }
    
    // Agregar factores que influyeron en la decisión
    const factors = [];
    if (detailedExplanation.gemini.available) {
      factors.push(`Análisis con Gemini 2.0 Flash: ${detailedExplanation.gemini.result} (${Math.round(detailedExplanation.gemini.confidence * 100)}% confianza)`);
    }
    if (detailedExplanation.huggingface.available) {
      const fallbackText = detailedExplanation.huggingface.fallback ? " [Análisis de respaldo]" : "";
      factors.push(`Análisis con Hugging Face: ${detailedExplanation.huggingface.result} (${Math.round(detailedExplanation.huggingface.confidence * 100)}% confianza)${fallbackText}`);
    }
    if (detailedExplanation.webSearch.available) {
      factors.push(`Verificación web: ${detailedExplanation.webSearch.totalResults} resultados, ${Math.round(detailedExplanation.webSearch.similarity * 100)}% similitud`);
    }
    detailedExplanation.finalAnalysis.factors = factors;

    return {
      result: finalResult,
      confidence: Math.round(confidence * 100) / 100,
      explanation: detailedExplanation, // Ahora es un objeto estructurado
      scores: {
        ai: Math.min(Math.round(aiScore * 100) / 100, 1.0),
        human: Math.min(Math.round(humanScore * 100) / 100, 1.0),
      },
      context: {
        geminiAnalysis: results.gemini?.explanation || "No disponible",
        huggingfaceAnalysis: results.huggingface?.explanation || "No disponible",
        searchContext: results.googleSearch ? {
          totalResults: results.googleSearch.totalResults,
          similarity: Math.round((results.googleSearch.similarity || 0) * 100),
          topSources: results.googleSearch.detailedResults?.slice(0, 3).map(r => r.source) || [],
          searchQuery: results.googleSearch.searchQuery || "No disponible",
          searchTimestamp: results.googleSearch.searchTimestamp || "No disponible",
          searchEngine: results.googleSearch.searchEngine || "No disponible"
        } : null,
        // Información adicional de análisis
        textMetrics: results.huggingface ? {
          length: results.huggingface.textLength || 0,
          words: results.huggingface.wordCount || 0,
          complexity: results.huggingface.complexity?.level || "No disponible",
          readability: results.huggingface.readability || 0,
          patterns: results.huggingface.patterns ? Object.keys(results.huggingface.patterns).filter(k => results.huggingface.patterns[k] > 0.5) : []
        } : null,
        // Estado de las APIs
        apiStatus: {
          gemini: results.gemini && !results.gemini.error,
          huggingface: results.huggingface && !results.huggingface.fallback,
          googleSearch: results.googleSearch && results.googleSearch.searchResults?.length > 0,
          fallbacksUsed: (results.huggingface && results.huggingface.apiStatus?.fallbackUsed) || false
        }
      }
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
