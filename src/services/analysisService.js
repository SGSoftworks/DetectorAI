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
          fallback:
            "Análisis no disponible - API no configurada o error de conexión",
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
          fallback: true,
          result: "HUMANO", // Asumir humano por defecto en caso de error
          confidence: 0.3,
          explanation: "Análisis no disponible - usando análisis de fallback",
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
          fallback: true,
          searchResults: [],
          totalResults: 0,
          similarity: 0,
          analysis: {
            summary: "Búsqueda no disponible",
            conclusion: "No se pudo verificar contenido en la web",
            recommendation: "Verificar manualmente la información",
            confidence: 0.2,
            evidenceStrength: "Muy baja",
          },
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
          googleSearchResult: results.googleSearch,
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
        console.warn(
          "API key de Hugging Face no configurada, usando análisis de fallback"
        );
        return this.createFallbackAnalysis(text);
      }

      // Intentar múltiples modelos de Hugging Face con fallback
      const sentimentModels = [
        HUGGING_FACE_MODELS.SENTIMENT,
        HUGGING_FACE_MODELS.SENTIMENT_ALT1,
        HUGGING_FACE_MODELS.SENTIMENT_ALT2,
      ];

      const classificationModels = [
        HUGGING_FACE_MODELS.TEXT_CLASSIFICATION,
        HUGGING_FACE_MODELS.CLASSIFICATION_ALT1,
        HUGGING_FACE_MODELS.CLASSIFICATION_ALT2,
      ];

      let sentimentResponse = null;
      let classificationResponse = null;
      let sentimentModel = null;
      let classificationModel = null;

      // Intentar modelos de sentimientos
      for (const model of sentimentModels) {
        try {
          console.log(`Intentando modelo de sentimientos: ${model}`);
          sentimentResponse = await this.axios.post(
            `${API_CONFIG.HUGGING_FACE_API_URL}/${model}`,
            { inputs: text },
            {
              headers: getHeaders("huggingface"),
              timeout: API_CONFIG.TIMEOUTS.HUGGING_FACE,
            }
          );
          sentimentModel = model;
          console.log(`Modelo de sentimientos exitoso: ${model}`);
          break;
        } catch (error) {
          console.warn(`Modelo ${model} falló:`, error.message);
          continue;
        }
      }

      // Intentar modelos de clasificación
      for (const model of classificationModels) {
        try {
          console.log(`Intentando modelo de clasificación: ${model}`);
          classificationResponse = await this.axios.post(
            `${API_CONFIG.HUGGING_FACE_API_URL}/${model}`,
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
          classificationModel = model;
          console.log(`Modelo de clasificación exitoso: ${model}`);
          break;
        } catch (error) {
          console.warn(`Modelo ${model} falló:`, error.message);
          continue;
        }
      }

      // Si ningún modelo funcionó, usar análisis de fallback
      if (!sentimentResponse && !classificationResponse) {
        console.warn(
          "Todos los modelos de Hugging Face fallaron, usando análisis de fallback completo"
        );
        return this.createFallbackAnalysis(text);
      }

      // Procesar resultados con manejo de errores robusto
      let sentiment, classification;

      // Procesar sentimientos
      if (sentimentResponse) {
        try {
          sentiment = sentimentResponse.data[0];
          console.log(`Sentimientos procesados con modelo: ${sentimentModel}`);
        } catch (error) {
          console.warn("Error procesando sentimientos:", error);
          sentiment = { label: "neutral", score: 0.5 };
        }
      } else {
        sentiment = { label: "neutral", score: 0.5, fallback: true };
        console.log("Usando sentimientos de fallback");
      }

      // Procesar clasificación
      if (classificationResponse) {
        try {
          classification = classificationResponse.data;
          console.log(
            `Clasificación procesada con modelo: ${classificationModel}`
          );
        } catch (error) {
          console.warn("Error procesando clasificación:", error);
          classification = {
            labels: ["Texto escrito por humano"],
            scores: [0.5],
          };
        }
      } else {
        classification = {
          labels: ["Texto escrito por humano"],
          scores: [0.5],
          fallback: true,
        };
        console.log("Usando clasificación de fallback");
      }

      // Determinar si es IA basado en clasificación
      const isAI =
        classification.labels &&
        classification.labels[0] === "Texto generado por IA";
      const confidence =
        classification.scores && classification.scores[0]
          ? classification.scores[0]
          : 0.5;

      // Crear explicación que indique fallbacks
      let explanation = `Clasificación: ${
        classification.labels ? classification.labels[0] : "No disponible"
      } (${Math.round(confidence * 100)}% confianza)`;

      if (classification.fallback) {
        explanation += " [FALLBACK]";
      }

      explanation += ` | Sentimiento: ${
        sentiment.label || "No disponible"
      } (${Math.round((sentiment.score || 0.5) * 100)}% confianza)`;

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
          label: classification.labels
            ? classification.labels[0]
            : "No disponible",
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
          fallbackUsed: sentimentFallback || classificationFallback,
        },
      };
    } catch (error) {
      console.error("Error en análisis Hugging Face:", error);

      // Fallback para PRODUCCIÓN cuando Hugging Face falle completamente
      console.warn(
        "Usando análisis de fallback basado en características del texto..."
      );
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
      explanation: `Análisis de fallback: ${indicators.join(
        ", "
      )} (${Math.round(confidence * 100)}% confianza)`,
      sentiment: {
        label: "neutral",
        score: 0.5,
      },
      classification: {
        label: isAI ? "Texto generado por IA" : "Texto escrito por humano",
        score: confidence,
        allLabels: [
          isAI ? "Texto generado por IA" : "Texto escrito por humano",
        ],
        allScores: [confidence],
      },
      // Análisis adicional para PRODUCCIÓN
      textLength: text.length,
      wordCount: text.split(" ").length,
      complexity: complexity,
      patterns: patterns,
      readability: readability,
      fallback: true,
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

      // Realizar búsquedas con diferentes consultas de manera más inteligente
      for (const query of searchQueries.slice(0, 3)) {
        // Máximo 3 consultas
        try {
          const response = await this.axios.get(
            API_CONFIG.GOOGLE_SEARCH_API_URL,
            {
              params: {
                key: API_CONFIG.GOOGLE_SEARCH_API_KEY,
                cx: API_CONFIG.GOOGLE_SEARCH_ENGINE_ID,
                q: query,
                num: 5, // Aumentar para mejor cobertura
                lr: "lang_es", // Restringir a español
                cr: "countryCO", // Restringir a Colombia
                dateRestrict: "y1", // Último año para contenido más relevante
              },
            }
          );

          const searchResults = response.data.items || [];
          const searchInfo = response.data.searchInformation || {};
          const currentTotalResults = parseInt(searchInfo.totalResults) || 0;

          // Solo considerar resultados si realmente existen
          if (currentTotalResults > 0) {
            totalResults = Math.max(totalResults, currentTotalResults);

            // Filtrar y agregar resultados únicos con mejor validación
            searchResults.forEach((item) => {
              if (
                !allResults.find((r) => r.link === item.link) &&
                this.isValidSearchResult(item, text)
              ) {
                allResults.push(item);
              }
            });
          }
        } catch (queryError) {
          console.warn(`Error en consulta "${query}":`, queryError.message);
          // No agregar resultados falsos en caso de error
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

      // Calcular similitud real basada en resultados válidos
      const realSimilarity =
        formattedResults.length > 0
          ? this.calculateSimilarity(text, formattedResults)
          : 0;

      // Análisis más realista de los resultados
      const analysis = this.analyzeSearchResults(formattedResults, text);

      return {
        searchResults: formattedResults,
        totalResults: totalResults,
        keywords: keywords,
        similarity: realSimilarity,
        analysis: analysis,
        detailedResults: formattedResults.map((result) => ({
          title: result.title,
          link: result.link,
          snippet: result.snippet,
          source: result.displayLink,
          relevance: result.relevance,
          relevanceScore: Math.round(result.relevance * 100),
        })),
        // Información adicional para PRODUCCIÓN
        searchQuery: searchQueries.join(" | "),
        searchTimestamp: new Date().toISOString(),
        searchEngine: "Google Custom Search",
        searchParameters: {
          maxResults: formattedResults.length, // Resultados reales encontrados
          language: "es",
          region: "CO",
          queries: searchQueries.length,
          validResults: formattedResults.length,
          totalQueries: searchQueries.length,
        },
        // Indicadores de calidad de la búsqueda
        searchQuality: {
          hasResults: formattedResults.length > 0,
          hasRelevantResults:
            formattedResults.filter((r) => r.relevance > 0.5).length > 0,
          averageRelevance:
            formattedResults.length > 0
              ? formattedResults.reduce((sum, r) => sum + r.relevance, 0) /
                formattedResults.length
              : 0,
          trustedSources: formattedResults.filter((r) =>
            this.isTrustedSource(r.displayLink || r.link)
          ).length,
        },
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
    const complexity = this.analyzeAdvancedComplexity(
      text,
      avgWordLength,
      avgSentenceLength
    );

    return {
      avgWordLength: Math.round(avgWordLength * 100) / 100,
      avgSentenceLength: Math.round(avgSentenceLength * 100) / 100,
      complexity: complexity.level,
      score: complexity.score,
      indicators: complexity.indicators,
      readability: this.calculateReadabilityScore(text),
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
      indicators,
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
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 3);

    const stopWords = new Set([
      "el",
      "la",
      "los",
      "las",
      "un",
      "una",
      "unos",
      "unas",
      "y",
      "o",
      "pero",
      "si",
      "no",
      "que",
      "cual",
      "quien",
      "donde",
      "cuando",
      "como",
      "por",
      "para",
      "con",
      "sin",
      "sobre",
      "bajo",
      "entre",
      "detras",
      "delante",
      "desde",
      "hasta",
      "durante",
      "antes",
      "despues",
      "mientras",
      "aunque",
      "porque",
      "pues",
      "entonces",
      "asi",
      "tambien",
      "tampoco",
      "nunca",
      "siempre",
      "a veces",
      "mucho",
      "poco",
      "mas",
      "menos",
      "muy",
      "demasiado",
      "bastante",
      "casi",
      "apenas",
      "solo",
      "solamente",
      "incluso",
      "ademas",
      "tambien",
      "tampoco",
      "ni",
      "o",
      "u",
      "pero",
      "mas",
      "aunque",
      "sin embargo",
      "no obstante",
      "por el contrario",
      "por otra parte",
      "por un lado",
      "por otro lado",
      "en primer lugar",
      "en segundo lugar",
      "finalmente",
      "en conclusion",
      "en resumen",
      "en resumidas cuentas",
      "en definitiva",
      "en fin",
      "por ultimo",
      "para terminar",
      "para finalizar",
      "para concluir",
      "para resumir",
      "para sintetizar",
      "para resumir",
      "para sintetizar",
      "para resumir",
      "para sintetizar",
    ]);

    const filteredWords = words.filter((word) => !stopWords.has(word));

    // Contar frecuencia y tomar las más comunes
    const wordCount = {};
    filteredWords.forEach((word) => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
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
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 20);
    if (sentences.length > 0) {
      const firstSentence = sentences[0].trim().substring(0, 100);
      queries.push(`"${firstSentence}"`);
    }

    // Consulta 3: Combinación de palabras clave más relevantes
    if (keywords.length > 2) {
      const relevantKeywords = keywords.filter(
        (word) =>
          word.length > 4 &&
          !["gobierno", "ministerio", "presidente", "partido"].includes(word)
      );
      if (relevantKeywords.length > 0) {
        queries.push(relevantKeywords.slice(0, 3).join(" "));
      }
    }

    return queries;
  }

  calculateSimilarity(text, searchResults) {
    if (!searchResults.length) return 0;

    const textWords = text
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 3);
    const textPhrases = this.extractPhrases(text);
    let totalSimilarity = 0;
    let validResults = 0;

    searchResults.forEach((result) => {
      const resultText = (result.title + " " + result.snippet).toLowerCase();
      const resultWords = resultText
        .split(/\s+/)
        .filter((word) => word.length > 3);

      // Calcular similitud por palabras clave importantes
      const importantWords = textWords.filter(
        (word) =>
          ![
            "el",
            "la",
            "de",
            "en",
            "un",
            "una",
            "es",
            "se",
            "que",
            "con",
            "por",
            "para",
            "del",
            "las",
            "los",
          ].includes(word)
      );

      let wordMatches = 0;
      importantWords.forEach((word) => {
        if (resultText.includes(word)) {
          wordMatches++;
        }
      });

      // Calcular similitud por frases
      let phraseMatches = 0;
      textPhrases.forEach((phrase) => {
        if (resultText.includes(phrase.toLowerCase())) {
          phraseMatches++;
        }
      });

      // Calcular similitud ponderada
      const wordSimilarity =
        importantWords.length > 0 ? wordMatches / importantWords.length : 0;
      const phraseSimilarity =
        textPhrases.length > 0 ? phraseMatches / textPhrases.length : 0;

      // Ponderar más las frases que las palabras individuales
      const finalSimilarity = wordSimilarity * 0.4 + phraseSimilarity * 0.6;

      if (finalSimilarity > 0) {
        totalSimilarity += finalSimilarity;
        validResults++;
      }
    });

    return validResults > 0
      ? Math.round((totalSimilarity / validResults) * 100) / 100
      : 0;
  }

  // Extraer frases significativas del texto
  extractPhrases(text) {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10);
    const phrases = [];

    sentences.forEach((sentence) => {
      const words = sentence.trim().split(/\s+/);
      // Extraer frases de 3-5 palabras
      for (let i = 0; i <= words.length - 3; i++) {
        const phrase = words.slice(i, i + 3).join(" ");
        if (phrase.length > 10 && !phrases.includes(phrase)) {
          phrases.push(phrase);
        }
      }
    });

    return phrases.slice(0, 5); // Máximo 5 frases más relevantes
  }

  // Validar si un resultado de búsqueda es válido y relevante
  isValidSearchResult(item, originalText) {
    if (!item || !item.title || !item.snippet) return false;

    // Verificar que no sea spam o contenido irrelevante
    const spamIndicators = [
      "spam",
      "scam",
      "fake",
      "clickbait",
      "advertisement",
    ];
    const titleLower = item.title.toLowerCase();
    const snippetLower = item.snippet.toLowerCase();

    if (
      spamIndicators.some(
        (indicator) =>
          titleLower.includes(indicator) || snippetLower.includes(indicator)
      )
    ) {
      return false;
    }

    // Verificar que tenga contenido sustancial
    if (item.snippet.length < 50) return false;

    // Verificar que sea de una fuente confiable
    const trustedDomains = [
      "wikipedia.org",
      "bbc.com",
      "cnn.com",
      "elpais.com",
      "elmundo.es",
      "semana.com",
      "eltiempo.com",
      "elespectador.com",
      "noticias.caracoltv.com",
      "elespectador.com",
      "publimetro.co",
      "colombia.com",
      "rcnradio.com",
    ];

    const domain = item.displayLink || item.link;
    const isTrustedSource = trustedDomains.some((trusted) =>
      domain.includes(trusted)
    );

    // Si no es fuente confiable, verificar relevancia mínima
    if (!isTrustedSource) {
      const relevance = this.calculateRelevance(originalText, item);
      return relevance > 0.3; // Solo aceptar si tiene relevancia mínima
    }

    return true;
  }

  // Verificar si una fuente es confiable
  isTrustedSource(domain) {
    if (!domain) return false;

    const trustedDomains = [
      "wikipedia.org",
      "bbc.com",
      "cnn.com",
      "elpais.com",
      "elmundo.es",
      "semana.com",
      "eltiempo.com",
      "elespectador.com",
      "noticias.caracoltv.com",
      "publimetro.co",
      "colombia.com",
      "rcnradio.com",
      "elespectador.com",
      "reuters.com",
      "ap.org",
      "afp.com",
      "efeverde.com",
      "marca.com",
      "as.com",
      "sport.es",
      "mundodeportivo.com",
    ];

    return trustedDomains.some((trusted) => domain.includes(trusted));
  }

  // Calcular fuerza de la evidencia
  calculateEvidenceStrength(results, aiScore, humanScore) {
    let strength = 0;
    let factors = 0;

    // Evidencia de Gemini
    if (results.gemini && results.gemini.result && !results.gemini.error) {
      strength += results.gemini.confidence || 0.5;
      factors++;
    }

    // Evidencia de Hugging Face
    if (
      results.huggingface &&
      results.huggingface.result &&
      !results.huggingface.error
    ) {
      strength += results.huggingface.confidence || 0.5;
      factors++;
    }

    // Evidencia de búsqueda web
    if (results.googleSearch && results.googleSearch.totalResults > 0) {
      const webEvidence = Math.min(results.googleSearch.totalResults / 1000, 1);
      strength += webEvidence * 0.7;
      factors++;
    }

    return factors > 0 ? strength / factors : 0.3;
  }

  // Calcular consistencia entre diferentes análisis
  calculateConsistencyScore(results) {
    const scores = [];

    if (results.gemini && results.gemini.result) {
      scores.push(results.gemini.result === "IA" ? 1 : 0);
    }

    if (results.huggingface && results.huggingface.result) {
      scores.push(results.huggingface.result === "IA" ? 1 : 0);
    }

    if (scores.length < 2) return 0.5; // Sin suficientes datos para comparar

    // Calcular varianza - menor varianza = mayor consistencia
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance =
      scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) /
      scores.length;

    return 1 - variance; // Invertir para que menor varianza = mayor consistencia
  }

  // Calcular calidad de los datos disponibles
  calculateDataQuality(results) {
    let quality = 0;
    let factors = 0;

    // Calidad de Gemini
    if (results.gemini) {
      if (results.gemini.error) {
        quality += 0.2; // Muy baja calidad por error
      } else if (results.gemini.fallback) {
        quality += 0.4; // Calidad reducida por fallback
      } else {
        quality += 0.8; // Buena calidad
      }
      factors++;
    }

    // Calidad de Hugging Face
    if (results.huggingface) {
      if (results.huggingface.error) {
        quality += 0.2;
      } else if (results.huggingface.fallback) {
        quality += 0.4;
      } else {
        quality += 0.8;
      }
      factors++;
    }

    // Calidad de búsqueda web
    if (results.googleSearch) {
      if (results.googleSearch.totalResults > 100) {
        quality += 0.9; // Excelente calidad
      } else if (results.googleSearch.totalResults > 10) {
        quality += 0.6; // Calidad moderada
      } else {
        quality += 0.3; // Calidad baja
      }
      factors++;
    }

    return factors > 0 ? quality / factors : 0.3;
  }

  // Verificar si hay inconsistencias en los resultados
  hasInconsistencies(results) {
    const results_array = [];

    if (results.gemini && results.gemini.result) {
      results_array.push(results.gemini.result);
    }

    if (results.huggingface && results.huggingface.result) {
      results_array.push(results.huggingface.result);
    }

    if (results_array.length < 2) return false;

    // Verificar si todos los resultados son iguales
    const firstResult = results_array[0];
    return !results_array.every((result) => result === firstResult);
  }

  // Verificar si hay indicadores fuertes de IA
  hasStrongAIIndicators(results) {
    let strongIndicators = 0;

    // Indicadores de Gemini
    if (
      results.gemini &&
      results.gemini.indicators &&
      results.gemini.indicators.length > 2
    ) {
      strongIndicators++;
    }

    // Indicadores de Hugging Face
    if (results.huggingface && results.huggingface.patterns) {
      const patterns = results.huggingface.patterns;
      if (patterns.repetition > 0.7 || patterns.formality > 0.8) {
        strongIndicators++;
      }
    }

    // Indicadores de búsqueda web (falta de contenido similar)
    if (
      results.googleSearch &&
      results.googleSearch.similarity < 0.2 &&
      results.googleSearch.totalResults < 50
    ) {
      strongIndicators++;
    }

    return strongIndicators >= 2;
  }

  // Resolver zona gris cuando la evidencia no es clara
  resolveGrayArea(results, finalScore, confidence) {
    // En zona gris, ser conservador y asumir humano a menos que haya evidencia muy fuerte
    if (finalScore > 0.6 && confidence > 0.6) {
      // Si hay evidencia moderada pero consistente, puede ser IA
      return this.hasStrongAIIndicators(results);
    }

    // En todos los demás casos, asumir humano
    return false;
  }

  // Métodos auxiliares para PRODUCCIÓN
  detectLanguagePatterns(text) {
    const patterns = {
      repetition: 0,
      formality: 0,
      structure: 0,
    };

    // Detectar repetición de palabras
    const words = text.toLowerCase().split(/\s+/);
    const wordCount = {};
    words.forEach((word) => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    const repeatedWords = Object.values(wordCount).filter(
      (count) => count > 2
    ).length;
    patterns.repetition = Math.min(repeatedWords / words.length, 1);

    // Detectar formalidad
    const formalWords = [
      "por consiguiente",
      "en consecuencia",
      "así mismo",
      "de igual manera",
    ];
    const formalCount = formalWords.filter((word) =>
      text.toLowerCase().includes(word)
    ).length;
    patterns.formality = formalCount / formalWords.length;

    // Detectar estructura
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const avgSentenceLength =
      sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    patterns.structure =
      avgSentenceLength > 100 ? 0.8 : avgSentenceLength > 50 ? 0.5 : 0.2;

    return patterns;
  }

  calculateReadabilityScore(text) {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const words = text.split(/\s+/);
    const syllables = this.countSyllables(text);

    if (sentences.length === 0 || words.length === 0) return 0;

    const avgSentenceLength = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;

    // Fórmula de Flesch Reading Ease
    const fleschScore =
      206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord;

    return Math.max(0, Math.min(100, fleschScore));
  }

  countSyllables(text) {
    const words = text.toLowerCase().split(/\s+/);
    let totalSyllables = 0;

    words.forEach((word) => {
      totalSyllables += this.countWordSyllables(word);
    });

    return totalSyllables;
  }

  countWordSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, "");
    if (word.length <= 3) return 1;

    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
    word = word.replace(/^y/, "");

    const syllables = word.toLowerCase().match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
  }

  // Calcular relevancia de cada resultado de búsqueda
  calculateRelevance(text, searchResult) {
    const textWords = text
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 3);
    const titleText = searchResult.title.toLowerCase();
    const snippetText = searchResult.snippet.toLowerCase();
    const fullResultText = titleText + " " + snippetText;

    // Filtrar palabras importantes (excluir artículos, preposiciones, etc.)
    const stopWords = [
      "el",
      "la",
      "de",
      "en",
      "un",
      "una",
      "es",
      "se",
      "que",
      "con",
      "por",
      "para",
      "del",
      "las",
      "los",
      "su",
      "sus",
      "le",
      "les",
      "lo",
      "al",
      "a",
      "o",
      "y",
      "pero",
      "sin",
      "sobre",
      "entre",
      "hasta",
      "desde",
    ];
    const importantWords = textWords.filter(
      (word) => !stopWords.includes(word)
    );

    if (importantWords.length === 0) return 0;

    // Calcular coincidencias de palabras importantes
    let titleMatches = 0;
    let snippetMatches = 0;
    let fullTextMatches = 0;

    importantWords.forEach((word) => {
      if (titleText.includes(word)) titleMatches++;
      if (snippetText.includes(word)) snippetMatches++;
      if (fullResultText.includes(word)) fullTextMatches++;
    });

    // Calcular relevancia ponderada
    const titleRelevance = titleMatches / importantWords.length;
    const snippetRelevance = snippetMatches / importantWords.length;
    const fullTextRelevance = fullTextMatches / importantWords.length;

    // Ponderar más el título que el snippet, y verificar coherencia general
    const baseRelevance = titleRelevance * 0.6 + snippetRelevance * 0.4;

    // Bonificación por coherencia general del texto
    const coherenceBonus = fullTextRelevance > 0.3 ? 0.1 : 0;

    // Penalización si hay muy pocas coincidencias
    const penalty = fullTextMatches < 2 ? -0.2 : 0;

    const finalRelevance = Math.max(
      0,
      Math.min(1, baseRelevance + coherenceBonus + penalty)
    );

    return Math.round(finalRelevance * 100) / 100;
  }

  // Analizar resultados de búsqueda para contexto
  analyzeSearchResults(searchResults, originalText) {
    if (!searchResults.length) {
      return {
        summary: "No se encontraron resultados relevantes",
        conclusion:
          "La falta de fuentes verificadas sugiere contenido original o poco común",
        recommendation: "Verificar manualmente la información",
        confidence: 0.2,
        evidenceStrength: "Muy baja",
      };
    }

    const highRelevanceResults = searchResults.filter((r) => r.relevance > 0.6);
    const mediumRelevanceResults = searchResults.filter(
      (r) => r.relevance > 0.3 && r.relevance <= 0.6
    );
    const lowRelevanceResults = searchResults.filter((r) => r.relevance <= 0.3);

    // Calcular calidad de las fuentes
    const trustedSources = searchResults.filter((r) =>
      this.isTrustedSource(r.displayLink || r.link)
    );

    const averageRelevance =
      searchResults.reduce((sum, r) => sum + r.relevance, 0) /
      searchResults.length;

    let conclusion = "";
    let recommendation = "";
    let confidence = 0.5;
    let evidenceStrength = "Moderada";

    if (highRelevanceResults.length > 0 && trustedSources.length > 0) {
      conclusion = `Se encontraron ${highRelevanceResults.length} fuentes altamente relevantes de fuentes confiables que respaldan el contenido.`;
      recommendation =
        "El contenido parece estar basado en información verificable y confiable.";
      confidence = 0.8;
      evidenceStrength = "Alta";
    } else if (highRelevanceResults.length > 0) {
      conclusion = `Se encontraron ${highRelevanceResults.length} fuentes altamente relevantes, pero algunas fuentes requieren verificación adicional.`;
      recommendation =
        "El contenido tiene referencias verificables pero se recomienda verificar las fuentes.";
      confidence = 0.6;
      evidenceStrength = "Moderada";
    } else if (mediumRelevanceResults.length > 0) {
      conclusion = `Se encontraron ${mediumRelevanceResults.length} fuentes con relevancia moderada.`;
      recommendation =
        "El contenido tiene algunas referencias verificables pero requiere verificación adicional.";
      confidence = 0.4;
      evidenceStrength = "Baja";
    } else if (lowRelevanceResults.length > 0) {
      conclusion =
        "Los resultados de búsqueda tienen baja relevancia con el contenido analizado.";
      recommendation =
        "El contenido puede ser original, poco común o requerir verificación manual.";
      confidence = 0.3;
      evidenceStrength = "Muy baja";
    } else {
      conclusion =
        "No se encontraron fuentes relevantes para el contenido analizado.";
      recommendation =
        "El contenido parece ser completamente original o muy específico.";
      confidence = 0.2;
      evidenceStrength = "Muy baja";
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
        low: lowRelevanceResults.length,
      },
      sourceQuality: {
        trustedSources: trustedSources.length,
        totalSources: searchResults.length,
        averageRelevance: Math.round(averageRelevance * 100) / 100,
      },
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
      const highRelevance = sources.filter((s) => s.relevance > 0.5).length;
      sourceExplanation = ` Se analizaron ${sources.length} fuentes web, de las cuales ${highRelevance} tienen alta relevancia.`;
    }

    // Recomendación basada en confianza
    if (confidence > 0.8) {
      recommendation =
        " La alta confianza del análisis sugiere que este resultado es muy confiable.";
    } else if (confidence > 0.6) {
      recommendation =
        " La confianza moderada sugiere que este resultado es confiable pero se recomienda verificación adicional.";
    } else {
      recommendation =
        " La baja confianza sugiere que se requiere verificación manual del contenido.";
    }

    return (
      baseExplanation + contextExplanation + sourceExplanation + recommendation
    );
  }

  combineResults(results) {
    // NUEVA LÓGICA COHERENTE: Análisis basado en evidencia real
    let finalDecision = "HUMANO"; // Por defecto asumir humano
    let finalConfidence = 0.5;
    let aiProbability = 0;
    let humanProbability = 0;

    // 1. Analizar evidencia de cada fuente
    const evidence = {
      gemini: { available: false, result: null, confidence: 0, reasoning: "" },
      huggingface: {
        available: false,
        result: null,
        confidence: 0,
        explanation: "",
      },
      webSearch: {
        available: false,
        similarity: 0,
        totalResults: 0,
        supportsAI: false,
        supportsHuman: false,
      },
    };

    // 2. Analizar evidencia de Gemini
    if (results.gemini && results.gemini.result) {
      evidence.gemini.available = true;
      evidence.gemini.result = results.gemini.result;
      evidence.gemini.confidence = results.gemini.confidence || 0.5;
      evidence.gemini.reasoning =
        results.gemini.reasoning ||
        results.gemini.explanation ||
        "Análisis completado con Gemini 2.0 Flash";
    } else if (results.gemini && results.gemini.isAI !== undefined) {
      evidence.gemini.available = true;
      evidence.gemini.result = results.gemini.isAI ? "IA" : "HUMANO";
      evidence.gemini.confidence = results.gemini.confidence || 0.7;
      evidence.gemini.reasoning =
        results.gemini.reasoning || "Análisis completado con Gemini 2.0 Flash";
    }

    // 3. Analizar evidencia de Hugging Face
    if (results.huggingface && results.huggingface.result) {
      evidence.huggingface.available = true;
      evidence.huggingface.result = results.huggingface.result;
      evidence.huggingface.confidence = results.huggingface.confidence || 0.5;
      evidence.huggingface.explanation =
        results.huggingface.explanation ||
        "Análisis completado con Hugging Face";

      // Reducir confianza si es fallback
      if (
        results.huggingface.fallback ||
        (results.huggingface.apiStatus &&
          results.huggingface.apiStatus.fallbackUsed)
      ) {
        evidence.huggingface.confidence *= 0.7; // Reducir confianza por fallback
      }
    }

    // 4. Analizar evidencia de búsqueda web
    if (results.googleSearch) {
      evidence.webSearch.available = true;
      evidence.webSearch.similarity = results.googleSearch.similarity || 0;
      evidence.webSearch.totalResults = results.googleSearch.totalResults || 0;

      // Determinar si la búsqueda web apoya IA o humano
      if (
        evidence.webSearch.similarity > 0.7 &&
        evidence.webSearch.totalResults > 100
      ) {
        evidence.webSearch.supportsHuman = true; // Mucho contenido similar = probablemente humano
      } else if (
        evidence.webSearch.similarity < 0.3 &&
        evidence.webSearch.totalResults < 50
      ) {
        evidence.webSearch.supportsAI = true; // Poco contenido similar = probablemente IA
      }
    }

    // 5. Determinar decisión final basada en evidencia
    if (evidence.gemini.available && evidence.huggingface.available) {
      // Ambas fuentes disponibles - usar consenso
      if (evidence.gemini.result === evidence.huggingface.result) {
        finalDecision = evidence.gemini.result;
        finalConfidence =
          Math.min(
            evidence.gemini.confidence,
            evidence.huggingface.confidence
          ) + 0.1;
      } else {
        // Conflicto - usar la fuente con mayor confianza
        if (evidence.gemini.confidence > evidence.huggingface.confidence) {
          finalDecision = evidence.gemini.result;
          finalConfidence = evidence.gemini.confidence - 0.2; // Reducir por conflicto
        } else {
          finalDecision = evidence.huggingface.result;
          finalConfidence = evidence.huggingface.confidence - 0.2; // Reducir por conflicto
        }
      }
    } else if (evidence.gemini.available) {
      // Solo Gemini disponible
      finalDecision = evidence.gemini.result;
      finalConfidence = evidence.gemini.confidence;
    } else if (evidence.huggingface.available) {
      // Solo Hugging Face disponible
      finalDecision = evidence.huggingface.result;
      finalConfidence = evidence.huggingface.confidence;
    } else {
      // Ninguna fuente disponible - análisis de fallback
      finalDecision = "HUMANO";
      finalConfidence = 0.3;
    }

    // 6. Ajustar confianza basada en evidencia web
    if (evidence.webSearch.available) {
      if (this.webSearchSupportsDecision(evidence.webSearch, finalDecision)) {
        finalConfidence = Math.min(finalConfidence + 0.1, 0.95);
      } else if (
        this.webSearchContradictsDecision(evidence.webSearch, finalDecision)
      ) {
        finalConfidence = Math.max(finalConfidence - 0.15, 0.2);
      }
    }

    // 7. Calcular probabilidades realistas
    if (finalDecision === "IA") {
      aiProbability = finalConfidence;
      humanProbability = 1 - finalConfidence;
    } else {
      humanProbability = finalConfidence;
      aiProbability = 1 - finalConfidence;
    }

    // 8. Asegurar coherencia final
    const isAI = finalDecision === "IA";

    // 9. Generar explicación coherente
    const explanation = this.generateCoherentExplanation(
      evidence,
      finalDecision,
      finalConfidence
    );

    // 10. Generar recomendación basada en confianza
    let recommendation = "";
    if (finalConfidence > 0.8) {
      recommendation =
        "La alta confianza del análisis sugiere que este resultado es muy confiable.";
    } else if (finalConfidence > 0.6) {
      recommendation =
        "La confianza moderada sugiere que este resultado es confiable pero se recomienda verificación adicional.";
    } else {
      recommendation =
        "La baja confianza sugiere que se requiere verificación manual del contenido.";
    }

    return {
      result: finalDecision,
      confidence: Math.round(finalConfidence * 100) / 100,
      explanation: explanation,
      recommendation: recommendation,
      aiProbability: Math.round(aiProbability * 100),
      humanProbability: Math.round(humanProbability * 100),
      evidence: evidence,
      isAI: isAI,
      context: {
        geminiAnalysis: results.gemini?.explanation || "No disponible",
        huggingfaceAnalysis:
          results.huggingface?.explanation || "No disponible",
        searchContext: results.googleSearch
          ? {
              totalResults: results.googleSearch.totalResults,
              similarity: Math.round(
                (results.googleSearch.similarity || 0) * 100
              ),
              topSources:
                results.googleSearch.detailedResults
                  ?.slice(0, 3)
                  .map((r) => r.source) || [],
              searchQuery: results.googleSearch.searchQuery || "No disponible",
              searchTimestamp:
                results.googleSearch.searchTimestamp || "No disponible",
              searchEngine:
                results.googleSearch.searchEngine || "No disponible",
            }
          : null,
        // Información adicional de análisis
        textMetrics: results.huggingface
          ? {
              length: results.huggingface.textLength || 0,
              words: results.huggingface.wordCount || 0,
              complexity:
                results.huggingface.complexity?.level || "No disponible",
              readability: results.huggingface.readability || 0,
              patterns: results.huggingface.patterns
                ? Object.keys(results.huggingface.patterns).filter(
                    (k) => results.huggingface.patterns[k] > 0.5
                  )
                : [],
            }
          : null,
        // Estado de las APIs
        apiStatus: {
          gemini: results.gemini && !results.gemini.error,
          huggingface: results.huggingface && !results.huggingface.fallback,
          googleSearch:
            results.googleSearch &&
            results.googleSearch.searchResults?.length > 0,
          fallbacksUsed:
            (results.huggingface &&
              results.huggingface.apiStatus?.fallbackUsed) ||
            false,
        },
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

  // Crear análisis de fallback cuando Hugging Face no está disponible
  createFallbackAnalysis(text) {
    const textLength = text.length;
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

    // Análisis básico de patrones
    const patterns = this.detectLanguagePatterns(text);

    // Determinar si es probable que sea IA basado en patrones simples
    let isAI = false;
    let confidence = 0.4; // Confianza baja para análisis de fallback
    let indicators = [];

    // Indicadores simples de IA
    if (patterns.repetition > 0.6) {
      isAI = true;
      confidence += 0.2;
      indicators.push("Patrones repetitivos detectados");
    }

    if (patterns.formality > 0.8) {
      isAI = true;
      confidence += 0.1;
      indicators.push("Formalidad excesiva");
    }

    // Detectar patrones específicos de IA
    const aiPatterns = this.detectAIPatterns(text);
    if (aiPatterns.length > 0) {
      isAI = true;
      confidence += 0.15;
      indicators.push(...aiPatterns);
    }

    // Detectar patrones humanos
    const humanPatterns = this.detectHumanPatterns(text);
    if (humanPatterns.length > 0 && !isAI) {
      confidence += 0.1;
      indicators.push(...humanPatterns);
    }

    if (textLength < 100) {
      confidence -= 0.1; // Textos muy cortos son difíciles de analizar
    }

    // Normalizar confianza
    confidence = Math.max(0.2, Math.min(confidence, 0.7));

    return {
      result: isAI ? "IA" : "HUMANO",
      confidence: confidence,
      explanation: `Análisis de fallback basado en patrones lingüísticos básicos. ${
        isAI
          ? "Se detectaron indicadores de texto generado por IA."
          : "No se detectaron indicadores claros de IA."
      }`,
      indicators:
        indicators.length > 0 ? indicators : ["Patrones naturales detectados"],
      languagePatterns: `Repetición: ${Math.round(
        patterns.repetition * 100
      )}%, Formalidad: ${Math.round(patterns.formality * 100)}%`,
      suggestions:
        "Para un análisis más preciso, configure la API key de Hugging Face",
      fallback: true,
      apiStatus: {
        huggingFaceAvailable: false,
        fallbackUsed: true,
        reason: "API no disponible o modelos no funcionando",
      },
      textLength: textLength,
      wordCount: words.length,
      sentenceCount: sentences.length,
      complexity:
        textLength > 500 ? "Alta" : textLength > 200 ? "Media" : "Baja",
      readability: this.calculateReadability(text),
    };
  }

  // Detectar patrones específicos de IA
  detectAIPatterns(text) {
    const patterns = [];
    const lowerText = text.toLowerCase();

    // Frases típicas de IA
    const aiPhrases = [
      "es importante mencionar",
      "cabe destacar que",
      "es fundamental",
      "en primer lugar",
      "en segundo lugar",
      "por un lado",
      "por otro lado",
      "en conclusión",
      "para finalizar",
      "es necesario",
      "se debe",
      "hay que",
      "resulta importante",
    ];

    let aiPhraseCount = 0;
    aiPhrases.forEach((phrase) => {
      if (lowerText.includes(phrase)) {
        aiPhraseCount++;
      }
    });

    if (aiPhraseCount >= 3) {
      patterns.push("Uso excesivo de frases formales típicas de IA");
    }

    // Estructura muy formal
    if (
      lowerText.includes("introducción") &&
      lowerText.includes("conclusión")
    ) {
      patterns.push("Estructura académica muy formal");
    }

    // Repetición de conectores
    const connectors = [
      "además",
      "asimismo",
      "por consiguiente",
      "en consecuencia",
    ];
    let connectorCount = 0;
    connectors.forEach((connector) => {
      const matches = (lowerText.match(new RegExp(connector, "g")) || [])
        .length;
      connectorCount += matches;
    });

    if (connectorCount >= 4) {
      patterns.push("Uso excesivo de conectores formales");
    }

    return patterns;
  }

  // Detectar patrones humanos
  detectHumanPatterns(text) {
    const patterns = [];
    const lowerText = text.toLowerCase();

    // Expresiones coloquiales
    const colloquialExpressions = [
      "bueno",
      "pues",
      "entonces",
      "o sea",
      "digamos",
      "tipo",
      "como que",
      "me parece",
      "creo que",
      "pienso que",
      "siento que",
      "opino que",
    ];

    let colloquialCount = 0;
    colloquialExpressions.forEach((expr) => {
      if (lowerText.includes(expr)) {
        colloquialCount++;
      }
    });

    if (colloquialCount >= 2) {
      patterns.push("Uso de expresiones coloquiales");
    }

    // Contracciones y abreviaciones
    if (
      lowerText.includes("'") ||
      lowerText.includes("q ") ||
      lowerText.includes("xq")
    ) {
      patterns.push("Uso de contracciones y abreviaciones");
    }

    // Preguntas retóricas
    if ((lowerText.match(/\?/g) || []).length >= 2) {
      patterns.push("Uso de preguntas retóricas");
    }

    // Exclamaciones
    if ((lowerText.match(/!/g) || []).length >= 1) {
      patterns.push("Uso de exclamaciones");
    }

    return patterns;
  }

  // Calcular legibilidad básica
  calculateReadability(text) {
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const syllables = words.reduce(
      (total, word) => total + this.countWordSyllables(word),
      0
    );

    if (sentences.length === 0) return 0;

    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;

    // Fórmula simplificada de legibilidad
    const readability =
      206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

    if (readability >= 80) return "Muy fácil";
    if (readability >= 60) return "Fácil";
    if (readability >= 40) return "Moderada";
    if (readability >= 20) return "Difícil";
    return "Muy difícil";
  }

  // Métodos auxiliares para la nueva lógica coherente
  webSearchSupportsDecision(webSearch, decision) {
    if (decision === "HUMANO") {
      return webSearch.supportsHuman;
    } else if (decision === "IA") {
      return webSearch.supportsAI;
    }
    return false;
  }

  webSearchContradictsDecision(webSearch, decision) {
    if (decision === "HUMANO") {
      return webSearch.supportsAI;
    } else if (decision === "IA") {
      return webSearch.supportsHuman;
    }
    return false;
  }

  generateCoherentExplanation(evidence, finalDecision, finalConfidence) {
    let explanation = `El análisis ha determinado que el contenido es ${
      finalDecision === "IA"
        ? "generado por Inteligencia Artificial"
        : "escrito por un ser humano"
    }. `;

    const sources = [];
    if (evidence.gemini.available) {
      sources.push(
        `Gemini 2.0 Flash (${Math.round(
          evidence.gemini.confidence * 100
        )}% confianza)`
      );
    }
    if (evidence.huggingface.available) {
      sources.push(
        `Hugging Face (${Math.round(
          evidence.huggingface.confidence * 100
        )}% confianza)`
      );
    }
    if (evidence.webSearch.available) {
      sources.push(
        `Verificación web (${evidence.webSearch.totalResults} resultados)`
      );
    }

    if (sources.length > 0) {
      explanation += `Esta conclusión se basa en el análisis de ${sources.join(
        ", "
      )}. `;
    }

    if (finalConfidence > 0.7) {
      explanation +=
        "La alta confianza en este resultado indica una evaluación sólida y confiable.";
    } else if (finalConfidence > 0.5) {
      explanation +=
        "La confianza moderada sugiere que el resultado es probable pero podría beneficiarse de verificación adicional.";
    } else {
      explanation +=
        "La baja confianza indica que se requiere análisis manual adicional para una evaluación definitiva.";
    }

    return explanation;
  }
}

export default new AnalysisService();
