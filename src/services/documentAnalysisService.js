import axios from "axios";
import { API_CONFIG, getHeaders } from "../config/api";

class DocumentAnalysisService {
  constructor() {
    this.axios = axios.create({
      timeout: 60000, // 1 minuto para documentos
    });
  }

  // Análisis completo de documento
  async analyzeDocument(documentFile) {
    try {
      const results = {
        textExtraction: null,
        structureAnalysis: null,
        linguisticAnalysis: null,
        contentVerification: null,
        gemini: null,
        finalResult: null,
        confidence: 0,
        explanation: "",
        pipeline: [],
        aiIndicators: [],
        technicalDetails: {}
      };

      // Paso 1: Extracción de texto
      results.pipeline.push({
        step: 1,
        name: "Extracción de Texto",
        status: "Iniciando",
        description: "Extrayendo y limpiando el contenido textual del documento"
      });

      try {
        const textResult = await this.extractDocumentText(documentFile);
        results.textExtraction = textResult;
        results.pipeline[0].status = "Completado";
        results.pipeline[0].result = textResult;
      } catch (error) {
        results.pipeline[0].status = "Error";
        results.pipeline[0].error = error.message;
      }

      // Paso 2: Análisis de estructura
      results.pipeline.push({
        step: 2,
        name: "Análisis de Estructura",
        status: "Iniciando",
        description: "Analizando la estructura y organización del documento"
      });

      try {
        const structureResult = await this.analyzeDocumentStructure(results.textExtraction);
        results.structureAnalysis = structureResult;
        results.pipeline[1].status = "Completado";
        results.pipeline[1].result = structureResult;
      } catch (error) {
        results.pipeline[1].status = "Error";
        results.pipeline[1].error = error.message;
      }

      // Paso 3: Análisis lingüístico
      results.pipeline.push({
        step: 3,
        name: "Análisis Lingüístico",
        status: "Iniciando",
        description: "Analizando patrones lingüísticos y estilo de escritura"
      });

      try {
        const linguisticResult = await this.analyzeLinguisticPatterns(results.textExtraction);
        results.linguisticAnalysis = linguisticResult;
        results.pipeline[2].status = "Completado";
        results.pipeline[2].result = linguisticResult;
      } catch (error) {
        results.pipeline[2].status = "Error";
        results.pipeline[2].error = error.message;
      }

      // Paso 4: Verificación de contenido
      results.pipeline.push({
        step: 4,
        name: "Verificación de Contenido",
        status: "Iniciando",
        description: "Buscando similitudes y verificando fuentes"
      });

      try {
        const verificationResult = await this.verifyContent(results.textExtraction);
        results.contentVerification = verificationResult;
        results.pipeline[3].status = "Completado";
        results.pipeline[3].result = verificationResult;
      } catch (error) {
        results.pipeline[3].status = "Error";
        results.pipeline[3].error = error.message;
      }

      // Paso 5: Análisis con Gemini
      results.pipeline.push({
        step: 5,
        name: "Análisis con IA",
        status: "Iniciando",
        description: "Analizando el contenido con modelos de IA avanzados"
      });

      try {
        const geminiResult = await this.analyzeWithGemini(results.textExtraction);
        results.gemini = geminiResult;
        results.pipeline[4].status = "Completado";
        results.pipeline[4].result = geminiResult;
      } catch (error) {
        results.pipeline[4].status = "Error";
        results.pipeline[4].error = error.message;
      }

      // Paso 6: Análisis final y decisión
      results.pipeline.push({
        step: 6,
        name: "Análisis Final",
        status: "Procesando",
        description: "Combinando todos los análisis para tomar decisión final"
      });

      const finalAnalysis = this.combineDocumentResults(results);
      results.finalResult = finalAnalysis.result;
      results.confidence = finalAnalysis.confidence;
      results.explanation = finalAnalysis.explanation;
      results.aiIndicators = finalAnalysis.aiIndicators;
      results.technicalDetails = finalAnalysis.technicalDetails;
      results.pipeline[5].status = "Completado";
      results.pipeline[5].result = finalAnalysis;

      return results;
    } catch (error) {
      throw new Error(`Error en el análisis de documento: ${error.message}`);
    }
  }

  // Extracción de texto del documento
  async extractDocumentText(documentFile) {
    return new Promise((resolve, reject) => {
      if (documentFile.type === 'text/plain' || documentFile.type === 'text/markdown') {
        // Para archivos de texto plano
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target.result;
          resolve({
            text: text,
            length: text.length,
            paragraphs: this.countParagraphs(text),
            sentences: this.countSentences(text),
            words: this.countWords(text),
            characters: text.length,
            format: documentFile.type
          });
        };
        reader.onerror = () => reject(new Error("Error al leer el archivo de texto"));
        reader.readAsText(documentFile);
      } else if (documentFile.type === 'application/pdf') {
        // Para PDFs (simulación - en implementación real usar PDF.js)
        resolve({
          text: "Texto extraído del PDF (simulado)",
          length: 2500,
          paragraphs: 15,
          sentences: 120,
          words: 450,
          characters: 2500,
          format: "PDF",
          note: "Extracción de PDF simulada - implementar con PDF.js en producción"
        });
      } else if (documentFile.type.includes('word') || documentFile.type === 'application/rtf') {
        // Para documentos de Word y RTF (simulación)
        resolve({
          text: "Texto extraído del documento (simulado)",
          length: 1800,
          paragraphs: 12,
          sentences: 90,
          words: 320,
          characters: 1800,
          format: documentFile.type,
          note: "Extracción de Word/RTF simulada - implementar con mammoth.js en producción"
        });
      } else {
        reject(new Error("Formato de documento no soportado"));
      }
    });
  }

  // Análisis de estructura del documento
  async analyzeDocumentStructure(textExtraction) {
    if (!textExtraction || !textExtraction.text) {
      return { error: "No hay texto para analizar" };
    }

    const text = textExtraction.text;
    
    // Análisis de estructura
    const structure = {
      hasTitle: this.hasTitle(text),
      hasIntroduction: this.hasIntroduction(text),
      hasConclusion: this.hasConclusion(text),
      hasReferences: this.hasReferences(text),
      paragraphStructure: this.analyzeParagraphStructure(text),
      formatting: this.analyzeFormatting(text),
      coherence: this.assessCoherence(text),
      organization: this.assessOrganization(text)
    };

    return {
      structure: structure,
      score: this.calculateStructureScore(structure),
      quality: this.assessStructureQuality(structure)
    };
  }

  // Análisis de patrones lingüísticos
  async analyzeLinguisticPatterns(textExtraction) {
    if (!textExtraction || !textExtraction.text) {
      return { error: "No hay texto para analizar" };
    }

    const text = textExtraction.text;
    
    // Análisis lingüístico
    const patterns = {
      vocabulary: this.analyzeVocabulary(text),
      sentenceStructure: this.analyzeSentenceStructure(text),
      complexity: this.assessComplexity(text),
      style: this.assessWritingStyle(text),
      repetition: this.analyzeRepetition(text),
      transitions: this.analyzeTransitions(text)
    };

    return {
      patterns: patterns,
      score: this.calculateLinguisticScore(patterns),
      quality: this.assessLinguisticQuality(patterns)
    };
  }

  // Verificación de contenido
  async verifyContent(textExtraction) {
    if (!textExtraction || !textExtraction.text) {
      return { error: "No hay texto para verificar" };
    }

    try {
      // Extraer fragmentos clave para búsqueda
      const keyFragments = this.extractKeyFragments(textExtraction.text, 3);
      
      // Búsqueda en Google para verificar contenido
      const searchResults = [];
      for (const fragment of keyFragments) {
        try {
          const searchResult = await this.searchGoogleContent(fragment);
          searchResults.push(searchResult);
        } catch (error) {
          console.warn("Error en búsqueda de fragmento:", error);
        }
      }

      return {
        keyFragments: keyFragments,
        searchResults: searchResults,
        similarity: this.calculateSimilarity(searchResults),
        sources: this.extractSources(searchResults),
        originality: this.assessOriginality(searchResults)
      };
    } catch (error) {
      return {
        error: "Error en verificación de contenido",
        details: error.message
      };
    }
  }

  // Análisis con Gemini
  async analyzeWithGemini(textExtraction) {
    try {
      if (!textExtraction || !textExtraction.text) {
        throw new Error("No hay texto para analizar");
      }

      // Limitar el texto a 4000 caracteres para Gemini
      const limitedText = textExtraction.text.substring(0, 4000);
      
      const response = await this.axios.post(
        `${API_CONFIG.GEMINI_API_URL}?key=${API_CONFIG.GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: `Analiza este texto y determina si fue generado por inteligencia artificial o escrito por un humano. 
                     Proporciona una puntuación del 0 al 1 donde 0 = completamente humano, 1 = claramente generado por IA.
                     Incluye razones específicas y patrones detectados.
                     
                     Texto a analizar:
                     ${limitedText}`
            }]
          }]
        },
        getHeaders('gemini')
      );

      return {
        analysis: response.data.candidates[0].content.parts[0].text,
        score: this.extractScore(response.data.candidates[0].content.parts[0].text),
        confidence: "Alta"
      };
    } catch (error) {
      return {
        error: "Error en análisis con Gemini",
        details: error.message,
        score: 0.5,
        confidence: "Baja"
      };
    }
  }

  // Combinar resultados del análisis de documento
  combineDocumentResults(results) {
    let aiScore = 0;
    let humanScore = 0;
    const aiIndicators = [];
    const technicalDetails = {};

    // Análisis de estructura
    if (results.structureAnalysis && !results.structureAnalysis.error) {
      const structureScore = results.structureAnalysis.score;
      if (structureScore < 0.4) {
        aiScore += 0.2;
        aiIndicators.push("Estructura muy uniforme y artificial");
      }
      technicalDetails.structure = results.structureAnalysis;
    }

    // Análisis lingüístico
    if (results.linguisticAnalysis && !results.linguisticAnalysis.error) {
      const linguisticScore = results.linguisticAnalysis.score;
      if (linguisticScore < 0.4) {
        aiScore += 0.25;
        aiIndicators.push("Patrones lingüísticos repetitivos");
      }
      technicalDetails.linguistic = results.linguisticAnalysis;
    }

    // Verificación de contenido
    if (results.contentVerification && !results.contentVerification.error) {
      if (results.contentVerification.similarity > 0.7) {
        aiScore += 0.15;
        aiIndicators.push("Alto contenido similar encontrado en la web");
      }
      technicalDetails.verification = results.contentVerification;
    }

    // Análisis con Gemini
    if (results.gemini && !results.gemini.error) {
      const geminiScore = results.gemini.score;
      aiScore += geminiScore * 0.4;
      
      if (geminiScore > 0.7) {
        aiIndicators.push("IA detectó patrones de generación artificial");
      }
      technicalDetails.gemini = results.gemini;
    }

    // Normalizar puntuaciones
    aiScore = Math.min(aiScore, 1);
    humanScore = 1 - aiScore;

    // Determinar resultado final
    let finalResult, confidence, explanation;

    if (aiScore > 0.7) {
      finalResult = "IA";
      confidence = aiScore;
      explanation = "El documento muestra múltiples indicadores de generación por inteligencia artificial, incluyendo estructura uniforme, patrones lingüísticos repetitivos y análisis de IA que confirma la generación artificial.";
    } else if (aiScore > 0.4) {
      finalResult = "Sospechoso";
      confidence = 0.5;
      explanation = "El documento presenta algunos indicadores sospechosos que sugieren posible generación por IA, pero no son concluyentes. Se recomienda análisis adicional.";
    } else {
      finalResult = "Humano";
      confidence = humanScore;
      explanation = "El documento muestra características naturales consistentes con escritura humana, incluyendo estructura orgánica, estilo personal y patrones lingüísticos variados.";
    }

    return {
      result: finalResult,
      confidence: confidence,
      explanation: explanation,
      aiIndicators: aiIndicators,
      technicalDetails: technicalDetails
    };
  }

  // Métodos auxiliares
  countParagraphs(text) {
    return text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  }

  countSentences(text) {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  }

  countWords(text) {
    return text.split(/\s+/).filter(w => w.trim().length > 0).length;
  }

  hasTitle(text) {
    const lines = text.split('\n');
    const firstLine = lines[0].trim();
    return firstLine.length > 0 && firstLine.length < 100 && !firstLine.includes('.');
  }

  hasIntroduction(text) {
    const lowerText = text.toLowerCase();
    return lowerText.includes('introducción') || lowerText.includes('introduction') || 
           lowerText.includes('introducir') || lowerText.includes('presentar');
  }

  hasConclusion(text) {
    const lowerText = text.toLowerCase();
    return lowerText.includes('conclusión') || lowerText.includes('conclusion') || 
           lowerText.includes('concluir') || lowerText.includes('finalizar');
  }

  hasReferences(text) {
    const lowerText = text.toLowerCase();
    return lowerText.includes('referencias') || lowerText.includes('bibliografía') || 
           lowerText.includes('fuentes') || lowerText.includes('citas');
  }

  analyzeParagraphStructure(text) {
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const lengths = paragraphs.map(p => p.length);
    
    return {
      count: paragraphs.length,
      averageLength: lengths.reduce((a, b) => a + b, 0) / lengths.length,
      variance: this.calculateVariance(lengths),
      consistency: this.calculateConsistency(lengths)
    };
  }

  analyzeFormatting(text) {
    return {
      hasBold: /\*\*.*\*\*/.test(text) || /<b>.*<\/b>/.test(text),
      hasItalic: /\*.*\*/.test(text) || /<i>.*<\/i>/.test(text),
      hasLists: /^\s*[-*+]\s/.test(text) || /^\s*\d+\.\s/.test(text),
      hasHeaders: /^#{1,6}\s/.test(text)
    };
  }

  assessCoherence(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    let coherenceScore = 0;
    
    // Análisis básico de coherencia
    for (let i = 1; i < sentences.length; i++) {
      const prev = sentences[i-1].toLowerCase();
      const curr = sentences[i].toLowerCase();
      
      // Verificar conectores lógicos
      if (curr.includes('por lo tanto') || curr.includes('además') || 
          curr.includes('sin embargo') || curr.includes('por otro lado')) {
        coherenceScore += 0.1;
      }
    }
    
    return Math.min(coherenceScore, 1);
  }

  assessOrganization(text) {
    let score = 0;
    
    if (this.hasTitle(text)) score += 0.2;
    if (this.hasIntroduction(text)) score += 0.2;
    if (this.hasConclusion(text)) score += 0.2;
    if (this.hasReferences(text)) score += 0.2;
    if (this.assessCoherence(text) > 0.5) score += 0.2;
    
    return score;
  }

  calculateStructureScore(structure) {
    let score = 0;
    
    if (structure.hasTitle) score += 0.2;
    if (structure.hasIntroduction) score += 0.2;
    if (structure.hasConclusion) score += 0.2;
    if (structure.hasReferences) score += 0.2;
    if (structure.coherence > 0.5) score += 0.2;
    
    return score;
  }

  assessStructureQuality(structure) {
    const score = this.calculateStructureScore(structure);
    if (score >= 0.8) return "Excelente";
    if (score >= 0.6) return "Buena";
    if (score >= 0.4) return "Regular";
    return "Baja";
  }

  analyzeVocabulary(text) {
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const uniqueWords = new Set(words);
    
    return {
      totalWords: words.length,
      uniqueWords: uniqueWords.size,
      diversity: uniqueWords.size / words.length,
      averageLength: words.reduce((a, b) => a + b.length, 0) / words.length
    };
  }

  analyzeSentenceStructure(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const lengths = sentences.map(s => s.split(/\s+/).length);
    
    return {
      count: sentences.length,
      averageLength: lengths.reduce((a, b) => a + b, 0) / lengths.length,
      variance: this.calculateVariance(lengths),
      complexity: this.assessSentenceComplexity(sentences)
    };
  }

  assessComplexity(text) {
    const words = text.split(/\s+/);
    const longWords = words.filter(w => w.length > 6).length;
    const complexityRatio = longWords / words.length;
    
    if (complexityRatio > 0.3) return "Alta";
    if (complexityRatio > 0.15) return "Media";
    return "Baja";
  }

  assessWritingStyle(text) {
    const style = {
      formal: /usted|su|le|les/.test(text.toLowerCase()),
      academic: /investigación|estudio|análisis|metodología/.test(text.toLowerCase()),
      technical: /tecnología|sistema|proceso|implementación/.test(text.toLowerCase()),
      creative: /imaginación|creatividad|inspiración|arte/.test(text.toLowerCase())
    };
    
    const dominantStyle = Object.entries(style).reduce((a, b) => style[a] ? a : b);
    return { ...style, dominant: dominantStyle };
  }

  analyzeRepetition(text) {
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const wordCount = {};
    
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    const repetitions = Object.values(wordCount).filter(count => count > 2);
    return {
      totalRepetitions: repetitions.length,
      averageRepetition: repetitions.length > 0 ? repetitions.reduce((a, b) => a + b, 0) / repetitions.length : 0,
      score: repetitions.length / words.length
    };
  }

  analyzeTransitions(text) {
    const transitions = [
      'por lo tanto', 'además', 'sin embargo', 'por otro lado', 'en primer lugar',
      'en segundo lugar', 'finalmente', 'conclusión', 'por ejemplo', 'específicamente'
    ];
    
    let count = 0;
    transitions.forEach(transition => {
      const regex = new RegExp(transition, 'gi');
      const matches = text.match(regex);
      if (matches) count += matches.length;
    });
    
    return {
      count: count,
      density: count / this.countSentences(text),
      quality: count > 5 ? "Buena" : count > 2 ? "Regular" : "Baja"
    };
  }

  calculateLinguisticScore(patterns) {
    let score = 0;
    
    if (patterns.vocabulary.diversity > 0.6) score += 0.2;
    if (patterns.sentenceStructure.complexity > 0.5) score += 0.2;
    if (patterns.complexity === "Media" || patterns.complexity === "Alta") score += 0.2;
    if (patterns.repetition.score < 0.1) score += 0.2;
    if (patterns.transitions.quality === "Buena") score += 0.2;
    
    return score;
  }

  assessLinguisticQuality(patterns) {
    const score = this.calculateLinguisticScore(patterns);
    if (score >= 0.8) return "Excelente";
    if (score >= 0.6) return "Buena";
    if (score >= 0.4) return "Regular";
    return "Baja";
  }

  extractKeyFragments(text, count) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const fragments = [];
    
    for (let i = 0; i < Math.min(count, sentences.length); i++) {
      const index = Math.floor(Math.random() * sentences.length);
      fragments.push(sentences[index].trim());
    }
    
    return fragments;
  }

  async searchGoogleContent(fragment) {
    try {
      const response = await this.axios.get(API_CONFIG.GOOGLE_SEARCH_API_URL, {
        params: {
          key: API_CONFIG.GOOGLE_SEARCH_API_KEY,
          cx: API_CONFIG.GOOGLE_SEARCH_ENGINE_ID,
          q: fragment.substring(0, 100),
          num: 5
        }
      });

      return {
        query: fragment,
        results: response.data.items || [],
        totalResults: response.data.searchInformation?.totalResults || 0
      };
    } catch (error) {
      return {
        query: fragment,
        error: error.message,
        results: [],
        totalResults: 0
      };
    }
  }

  calculateSimilarity(searchResults) {
    if (!searchResults || searchResults.length === 0) return 0;
    
    let totalSimilarity = 0;
    let validResults = 0;
    
    searchResults.forEach(result => {
      if (result.totalResults > 0) {
        totalSimilarity += Math.min(result.totalResults / 1000, 1); // Normalizar
        validResults++;
      }
    });
    
    return validResults > 0 ? totalSimilarity / validResults : 0;
  }

  extractSources(searchResults) {
    const sources = [];
    searchResults.forEach(result => {
      if (result.results) {
        result.results.forEach(item => {
          sources.push({
            title: item.title,
            url: item.link,
            snippet: item.snippet
          });
        });
      }
    });
    return sources;
  }

  assessOriginality(searchResults) {
    const similarity = this.calculateSimilarity(searchResults);
    
    if (similarity < 0.2) return "Muy alta";
    if (similarity < 0.4) return "Alta";
    if (similarity < 0.6) return "Media";
    if (similarity < 0.8) return "Baja";
    return "Muy baja";
  }

  calculateVariance(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  calculateConsistency(values) {
    const variance = this.calculateVariance(values);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return variance / mean; // Coeficiente de variación
  }

  assessSentenceComplexity(sentences) {
    let complexCount = 0;
    sentences.forEach(sentence => {
      const words = sentence.split(/\s+/);
      if (words.length > 20) complexCount++;
    });
    
    return complexCount / sentences.length;
  }

  extractScore(text) {
    const match = text.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0.5;
  }
}

export default new DocumentAnalysisService();
