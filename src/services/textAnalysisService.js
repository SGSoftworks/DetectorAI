/**
 * Servicio de Análisis de Texto
 * Maneja análisis específico de contenido textual
 * Versión: 2.0.0
 */

import axios from "axios";
import { API_CONFIG, getAuthHeaders, buildAPIUrl } from "../config/api.js";

class TextAnalysisService {
  constructor() {
    this.axios = axios.create({
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Análisis con Gemini
   */
  async analyzeWithGemini(text) {
    if (!API_CONFIG.GEMINI.API_KEY) {
      throw new Error("API key de Gemini no configurada");
    }

    const prompt = `
Analiza el siguiente texto y determina si fue generado por inteligencia artificial o escrito por un humano.

Texto: "${text}"

Proporciona tu análisis en el siguiente formato JSON:
{
  "isAI": true/false,
  "confidence": 0.85,
  "reasoning": "Explicación detallada de tu decisión basada en evidencia específica",
  "indicators": ["indicador1", "indicador2", "indicador3"],
  "languagePatterns": "Análisis de patrones lingüísticos detectados",
  "suggestions": "Sugerencias para mejorar la detección"
}

Sé objetivo y proporciona evidencia específica para tu conclusión. Considera:
- Patrones de repetición
- Estructura del texto
- Vocabulario y complejidad
- Coherencia y fluidez
- Marcadores típicos de IA vs escritura humana
`;

    const url = buildAPIUrl("gemini", API_CONFIG.GEMINI.ENDPOINTS.GENERATE);

    const response = await this.axios.post(
      url,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: API_CONFIG.GEMINI.TEMPERATURE,
          maxOutputTokens: API_CONFIG.GEMINI.MAX_TOKENS,
        },
      },
      {
        headers: getAuthHeaders("gemini"),
        timeout: API_CONFIG.GEMINI.TIMEOUT,
      }
    );

    const result = response.data.candidates[0].content.parts[0].text;

    try {
      // Intentar parsear el JSON principal
      const parsedResult = JSON.parse(result);

      // Si hay un campo 'reasoning' que es un string JSON, parsearlo también
      if (
        parsedResult.reasoning &&
        typeof parsedResult.reasoning === "string"
      ) {
        try {
          parsedResult.reasoning = JSON.parse(parsedResult.reasoning);
        } catch {
          // Si no se puede parsear, mantener como string
        }
      }

      // Normalizar la estructura para que sea consistente
      return {
        isAI: parsedResult.isAI || false,
        confidence: parsedResult.confidence || 0.5,
        reasoning: parsedResult.reasoning || result,
        indicators: parsedResult.indicators || [],
        languagePatterns:
          parsedResult.languagePatterns || "Análisis completado",
        suggestions: parsedResult.suggestions || "Sin sugerencias específicas",
        // Agregar metadatos adicionales
        textLength: text.length,
        wordCount: text.split(" ").length,
        sentenceCount: text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
          .length,
        complexity: this.calculateTextComplexity(text),
        readability: this.calculateReadability(text),
      };
    } catch {
      // Si no es JSON válido, extraer información del texto
      return {
        isAI:
          result.toLowerCase().includes("ia") ||
          result.toLowerCase().includes("artificial"),
        confidence: this.calculateGeminiConfidence(result),
        reasoning: result,
        indicators: ["Respuesta no estructurada"],
        languagePatterns: "Análisis basado en texto libre",
        suggestions: "Mejorar el prompt para obtener respuestas estructuradas",
        // Agregar metadatos adicionales
        textLength: text.length,
        wordCount: text.split(" ").length,
        sentenceCount: text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
          .length,
        complexity: this.calculateTextComplexity(text),
        readability: this.calculateReadability(text),
      };
    }
  }

  /**
   * Análisis con Hugging Face
   */
  async analyzeWithHuggingFace(text) {
    if (!API_CONFIG.HUGGING_FACE.API_KEY) {
      // Usar análisis de patrones locales
      return this.analyzeWithLocalPatterns(text);
    }

    try {
      // Intentar con el modelo principal primero
      let sentimentResponse, classificationResponse;

      try {
        // Análisis de sentimientos con modelo principal
        sentimentResponse = await this.axios.post(
          `${API_CONFIG.HUGGING_FACE.BASE_URL}/${API_CONFIG.HUGGING_FACE.MODELS.SENTIMENT}`,
          { inputs: text },
          {
            headers: getAuthHeaders("huggingface"),
            timeout: API_CONFIG.HUGGING_FACE.TIMEOUT,
          }
        );
      } catch (error) {
        console.warn(
          "Modelo principal de sentimientos no disponible, usando análisis local"
        );
        // Si falla, usar análisis local directamente
        return this.analyzeWithLocalPatterns(text);
      }

      try {
        // Análisis de clasificación con modelo principal
        classificationResponse = await this.axios.post(
          `${API_CONFIG.HUGGING_FACE.BASE_URL}/${API_CONFIG.HUGGING_FACE.MODELS.TEXT_CLASSIFICATION}`,
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
            headers: getAuthHeaders("huggingface"),
            timeout: API_CONFIG.HUGGING_FACE.TIMEOUT,
          }
        );
      } catch (error) {
        console.warn(
          "Modelo principal de clasificación no disponible, usando análisis local"
        );
        // Si falla, usar análisis local directamente
        return this.analyzeWithLocalPatterns(text);
      }

      const sentiment = sentimentResponse.data[0];
      const classification = classificationResponse.data;

      const isAI =
        classification.labels &&
        classification.labels[0] === "Texto generado por IA";
      const confidence = classification.scores ? classification.scores[0] : 0.5;

      return {
        result: isAI ? "IA" : "HUMANO",
        confidence: confidence,
        explanation: `Clasificación: ${classification.labels ? classification.labels[0] : "No disponible"} (${Math.round(confidence * 100)}% confianza) | Sentimiento: ${sentiment.label || "No disponible"} (${Math.round((sentiment.score || 0.5) * 100)}% confianza)`,
        sentiment: {
          label: sentiment.label || "neutral",
          score: sentiment.score || 0.5,
        },
        classification: {
          label: classification.labels
            ? classification.labels[0]
            : "No disponible",
          score: classification.scores ? classification.scores[0] : 0.5,
          allLabels: classification.labels || ["No disponible"],
          allScores: classification.scores || [0.5],
        },
        textLength: text.length,
        wordCount: text.split(" ").length,
        complexity: this.calculateTextComplexity(text),
        patterns: this.detectLanguagePatterns(text),
        readability: this.calculateReadability(text),
      };
    } catch (error) {
      console.warn(
        "Error en Hugging Face, usando análisis local:",
        error.message
      );
      return this.analyzeWithLocalPatterns(text);
    }
  }

  /**
   * Análisis con patrones locales (fallback)
   */
  analyzeWithLocalPatterns(text) {
    const patterns = this.detectLanguagePatterns(text);
    const aiPatterns = this.detectAIPatterns(text);
    const humanPatterns = this.detectHumanPatterns(text);

    let confidence = 0.5;
    let isAI = false;
    let indicators = [];

    // Evaluar patrones de IA
    if (aiPatterns.length > 0) {
      isAI = true;
      confidence += aiPatterns.length * 0.15;
      indicators.push(...aiPatterns);
    }

    // Evaluar patrones humanos
    if (humanPatterns.length > 0 && !isAI) {
      confidence += humanPatterns.length * 0.1;
      indicators.push(...humanPatterns);
    }

    // Evaluar patrones generales
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

    // Análisis de longitud y complejidad
    if (text.length > 1000 && patterns.formality > 0.6) {
      isAI = true;
      confidence += 0.1;
      indicators.push("Texto largo con formalidad alta");
    }

    // Análisis de estructura
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    
    if (avgSentenceLength > 80 && patterns.formality > 0.5) {
      isAI = true;
      confidence += 0.1;
      indicators.push("Oraciones largas y formales");
    }

    confidence = Math.max(0.3, Math.min(0.8, confidence));

    return {
      result: isAI ? "IA" : "HUMANO",
      confidence: confidence,
      explanation: `Análisis basado en patrones lingüísticos avanzados. ${isAI ? "Se detectaron múltiples indicadores de texto generado por IA." : "Se detectaron patrones típicos de escritura humana."}`,
      indicators:
        indicators.length > 0 ? indicators : ["Patrones naturales detectados"],
      languagePatterns: `Repetición: ${Math.round(patterns.repetition * 100)}%, Formalidad: ${Math.round(patterns.formality * 100)}%`,
      textLength: text.length,
      wordCount: text.split(/\s+/).length,
      sentenceCount: text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
        .length,
      complexity:
        text.length > 500 ? "Alta" : text.length > 200 ? "Media" : "Baja",
      readability: this.calculateReadability(text),
      fallback: true,
    };
  }

  // Métodos de análisis de patrones
  detectLanguagePatterns(text) {
    const patterns = { repetition: 0, formality: 0, structure: 0 };

    const words = text.toLowerCase().split(/\s+/);
    const wordCount = {};
    words.forEach((word) => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    const repeatedWords = Object.values(wordCount).filter(
      (count) => count > 2
    ).length;
    patterns.repetition = Math.min(repeatedWords / words.length, 1);

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

    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const avgSentenceLength =
      sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    patterns.structure =
      avgSentenceLength > 100 ? 0.8 : avgSentenceLength > 50 ? 0.5 : 0.2;

    return patterns;
  }

  detectAIPatterns(text) {
    const patterns = [];
    const lowerText = text.toLowerCase();

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
    ];

    let aiPhraseCount = 0;
    aiPhrases.forEach((phrase) => {
      if (lowerText.includes(phrase)) aiPhraseCount++;
    });

    if (aiPhraseCount >= 3) {
      patterns.push("Uso excesivo de frases formales típicas de IA");
    }

    if (
      lowerText.includes("introducción") &&
      lowerText.includes("conclusión")
    ) {
      patterns.push("Estructura académica muy formal");
    }

    return patterns;
  }

  detectHumanPatterns(text) {
    const patterns = [];
    const lowerText = text.toLowerCase();

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
      if (lowerText.includes(expr)) colloquialCount++;
    });

    if (colloquialCount >= 2) {
      patterns.push("Uso de expresiones coloquiales");
    }

    if (
      lowerText.includes("'") ||
      lowerText.includes("q ") ||
      lowerText.includes("xq")
    ) {
      patterns.push("Uso de contracciones y abreviaciones");
    }

    if ((lowerText.match(/\?/g) || []).length >= 2) {
      patterns.push("Uso de preguntas retóricas");
    }

    if ((lowerText.match(/!/g) || []).length >= 1) {
      patterns.push("Uso de exclamaciones");
    }

    return patterns;
  }

  calculateTextComplexity(text) {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const words = text.split(/\s+/).filter((w) => w.length > 0);
    const avgWordLength =
      words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const avgSentenceLength = words.length / sentences.length;

    let score = 0;
    if (avgWordLength > 8) score += 0.8;
    else if (avgWordLength > 6) score += 0.6;
    else if (avgWordLength > 4) score += 0.4;
    else score += 0.2;

    if (avgSentenceLength > 25) score += 0.8;
    else if (avgSentenceLength > 20) score += 0.6;
    else if (avgSentenceLength > 15) score += 0.4;
    else score += 0.2;

    const uniqueWords = new Set(text.toLowerCase().split(/\s+/));
    const vocabularyDiversity = uniqueWords.size / words.length;
    if (vocabularyDiversity < 0.3) score += 0.8;
    else if (vocabularyDiversity < 0.5) score += 0.6;
    else score += 0.2;

    let level = "Normal";
    if (score > 2.0) level = "Muy Alta";
    else if (score > 1.5) level = "Alta";
    else if (score > 1.0) level = "Moderada";
    else level = "Baja";

    return { level, score: Math.round(score * 100) / 100 };
  }

  calculateReadability(text) {
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

    if (sentences.length === 0) return "No disponible";

    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = this.estimateSyllables(words);

    const readability =
      206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

    if (readability >= 80) return "Muy fácil";
    if (readability >= 60) return "Fácil";
    if (readability >= 40) return "Moderada";
    if (readability >= 20) return "Difícil";
    return "Muy difícil";
  }

  estimateSyllables(words) {
    return (
      words.reduce((total, word) => {
        const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "");
        if (cleanWord.length <= 3) return total + 1;

        const syllables = cleanWord.match(/[aeiouy]+/g);
        return total + (syllables ? syllables.length : 1);
      }, 0) / words.length
    );
  }

  calculateGeminiConfidence(result) {
    let confidence = 0.5;
    const lowerResult = result.toLowerCase();

    if (
      lowerResult.includes("claramente") ||
      lowerResult.includes("definitivamente")
    ) {
      confidence += 0.3;
    }
    if (lowerResult.includes("evidencia") || lowerResult.includes("patrones")) {
      confidence += 0.2;
    }
    if (
      lowerResult.includes("posiblemente") ||
      lowerResult.includes("podría")
    ) {
      confidence -= 0.2;
    }

    return Math.max(0.2, Math.min(0.95, confidence));
  }
}

export default new TextAnalysisService();
