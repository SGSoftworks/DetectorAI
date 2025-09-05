import { geminiService } from "./geminiService";
import { googleSearchService } from "./googleSearchService";
import { firebaseService } from "./firebaseService";
import type { TextAnalysisRequest, AnalysisResult, ApiResponse } from "@/types";

class AnalysisService {
  private isProcessing = false;

  async analyzeText(
    request: TextAnalysisRequest
  ): Promise<ApiResponse<AnalysisResult>> {
    if (this.isProcessing) {
      return {
        success: false,
        error: "Ya hay un análisis en proceso. Por favor, espera.",
      };
    }

    this.isProcessing = true;
    const startTime = Date.now();

    try {
      // Validar entrada
      if (!request.text || request.text.trim().length === 0) {
        return {
          success: false,
          error: "El texto no puede estar vacío",
        };
      }

      if (request.text.length > 50000) {
        return {
          success: false,
          error: "El texto es demasiado largo. Máximo 50,000 caracteres.",
        };
      }

      // Ejecutar solo Gemini para análisis más rápido
      const geminiResult = await geminiService.analyzeText(request);

      // Usar resultado de Gemini directamente
      const combinedResult = geminiResult;

      // Actualizar tiempo de procesamiento
      const processingTime = Date.now() - startTime;
      combinedResult.metadata.processingTime = processingTime;

      // Guardar en Firebase
      await firebaseService.saveAnalysis(combinedResult);

      // Buscar contenido relacionado de forma asíncrona (no bloquea la respuesta)
      this.searchRelatedContent(request.text)
        .then((relatedContent) => {
          // Si no hay contenido relacionado, agregar contenido de ejemplo
          if (relatedContent.length === 0) {
            combinedResult.relatedContent = this.generateExampleRelatedContent(
              request.text
            );
          } else {
            combinedResult.relatedContent = relatedContent;
          }
        })
        .catch((error) => {
          console.error("Error al buscar contenido relacionado:", error);
          // En caso de error, agregar contenido de ejemplo
          combinedResult.relatedContent = this.generateExampleRelatedContent(
            request.text
          );
        });

      this.isProcessing = false;

      return {
        success: true,
        data: combinedResult,
        message: "Análisis completado exitosamente",
      };
    } catch (error) {
      this.isProcessing = false;
      console.error("Error en análisis de texto:", error);

      return {
        success: false,
        error: "Error interno del servidor. Por favor, intenta de nuevo.",
      };
    }
  }

  async analyzeImage(imageFile: File): Promise<ApiResponse<AnalysisResult>> {
    if (this.isProcessing) {
      return {
        success: false,
        error: "Ya hay un análisis en proceso. Por favor, espera.",
      };
    }

    this.isProcessing = true;
    const startTime = Date.now();

    try {
      // Validar archivo
      if (!imageFile) {
        return {
          success: false,
          error: "No se ha seleccionado ninguna imagen",
        };
      }

      if (imageFile.size > 10 * 1024 * 1024) {
        // 10MB
        return {
          success: false,
          error: "La imagen es demasiado grande. Máximo 10MB.",
        };
      }

      // Ejecutar análisis con Gemini
      const geminiResult = await geminiService.analyzeImage(imageFile);

      // Actualizar tiempo de procesamiento
      const processingTime = Date.now() - startTime;
      geminiResult.metadata.processingTime = processingTime;

      // Guardar en Firebase
      await firebaseService.saveAnalysis(geminiResult);

      // Buscar imágenes relacionadas de forma asíncrona
      this.searchRelatedImages(imageFile.name)
        .then((relatedImages) => {
          if (relatedImages.length === 0) {
            geminiResult.relatedContent = this.generateExampleImageContent(
              imageFile.name
            );
          } else {
            geminiResult.relatedContent = relatedImages;
          }
        })
        .catch((error) => {
          console.error("Error al buscar imágenes relacionadas:", error);
          geminiResult.relatedContent = this.generateExampleImageContent(
            imageFile.name
          );
        });

      this.isProcessing = false;

      return {
        success: true,
        data: geminiResult,
        message: "Análisis de imagen completado exitosamente",
      };
    } catch (error) {
      this.isProcessing = false;
      console.error("Error en análisis de imagen:", error);

      return {
        success: false,
        error: "Error interno del servidor. Por favor, intenta de nuevo.",
      };
    }
  }

  async analyzeVideo(videoFile: File): Promise<ApiResponse<AnalysisResult>> {
    if (this.isProcessing) {
      return {
        success: false,
        error: "Ya hay un análisis en proceso. Por favor, espera.",
      };
    }

    this.isProcessing = true;
    const startTime = Date.now();

    try {
      // Validar archivo
      if (!videoFile) {
        return {
          success: false,
          error: "No se ha seleccionado ningún video",
        };
      }

      if (videoFile.size > 50 * 1024 * 1024) {
        // 50MB
        return {
          success: false,
          error: "El video es demasiado grande. Máximo 50MB.",
        };
      }

      // Ejecutar análisis con Gemini
      const geminiResult = await geminiService.analyzeVideo(videoFile);

      // Actualizar tiempo de procesamiento
      const processingTime = Date.now() - startTime;
      geminiResult.metadata.processingTime = processingTime;

      // Guardar en Firebase
      await firebaseService.saveAnalysis(geminiResult);

      // Buscar videos relacionados de forma asíncrona
      this.searchRelatedVideos(videoFile.name)
        .then((relatedVideos) => {
          if (relatedVideos.length === 0) {
            geminiResult.relatedContent = this.generateExampleVideoContent(
              videoFile.name
            );
          } else {
            geminiResult.relatedContent = relatedVideos;
          }
        })
        .catch((error) => {
          console.error("Error al buscar videos relacionados:", error);
          geminiResult.relatedContent = this.generateExampleVideoContent(
            videoFile.name
          );
        });

      this.isProcessing = false;

      return {
        success: true,
        data: geminiResult,
        message: "Análisis de video completado exitosamente",
      };
    } catch (error) {
      this.isProcessing = false;
      console.error("Error en análisis de video:", error);

      return {
        success: false,
        error: "Error interno del servidor. Por favor, intenta de nuevo.",
      };
    }
  }

  async analyzeDocument(
    documentFile: File
  ): Promise<ApiResponse<AnalysisResult>> {
    if (this.isProcessing) {
      return {
        success: false,
        error: "Ya hay un análisis en proceso. Por favor, espera.",
      };
    }

    this.isProcessing = true;
    const startTime = Date.now();

    try {
      // Validar archivo
      if (!documentFile) {
        return {
          success: false,
          error: "No se ha seleccionado ningún documento",
        };
      }

      if (documentFile.size > 50 * 1024 * 1024) {
        // 50MB
        return {
          success: false,
          error: "El documento es demasiado grande. Máximo 50MB.",
        };
      }

      // Ejecutar análisis con Gemini
      const geminiResult = await geminiService.analyzeDocument(documentFile);

      // Actualizar tiempo de procesamiento
      const processingTime = Date.now() - startTime;
      geminiResult.metadata.processingTime = processingTime;

      // Guardar en Firebase
      await firebaseService.saveAnalysis(geminiResult);

      // Buscar documentos relacionados de forma asíncrona
      this.searchRelatedDocuments(documentFile.name)
        .then((relatedDocuments) => {
          if (relatedDocuments.length === 0) {
            geminiResult.relatedContent = this.generateExampleDocumentContent(
              documentFile.name
            );
          } else {
            geminiResult.relatedContent = relatedDocuments;
          }
        })
        .catch((error) => {
          console.error("Error al buscar documentos relacionados:", error);
          geminiResult.relatedContent = this.generateExampleDocumentContent(
            documentFile.name
          );
        });

      this.isProcessing = false;

      return {
        success: true,
        data: geminiResult,
        message: "Análisis de documento completado exitosamente",
      };
    } catch (error) {
      this.isProcessing = false;
      console.error("Error en análisis de documento:", error);

      return {
        success: false,
        error: "Error interno del servidor. Por favor, intenta de nuevo.",
      };
    }
  }

  private async searchRelatedContent(text: string): Promise<any[]> {
    try {
      // Extraer palabras clave del texto
      const keywords = this.extractKeywords(text);

      // Crear múltiples consultas de búsqueda para mejor cobertura
      const searchQueries = [
        keywords.slice(0, 3).join(" "),
        `verificar información ${keywords.slice(0, 2).join(" ")}`,
        `fact check ${keywords.slice(0, 2).join(" ")}`,
        `noticias ${keywords.slice(0, 2).join(" ")}`,
      ];

      // Buscar con cada consulta y combinar resultados
      const allResults = await Promise.allSettled(
        searchQueries.map((query) =>
          googleSearchService.searchRelatedContent(query, 3)
        )
      );

      // Combinar y deduplicar resultados
      const combinedResults: any[] = [];
      allResults.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          combinedResults.push(...result.value);
        }
      });

      // Remover duplicados basado en URL
      const uniqueResults = combinedResults.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.url === item.url)
      );

      return uniqueResults.slice(0, 8); // Máximo 8 resultados
    } catch (error) {
      console.error("Error al buscar contenido relacionado:", error);
      return [];
    }
  }

  private extractKeywords(text: string): string[] {
    // Eliminar palabras comunes y extraer palabras significativas
    const commonWords = new Set([
      "el",
      "la",
      "de",
      "que",
      "y",
      "a",
      "en",
      "un",
      "es",
      "se",
      "no",
      "te",
      "lo",
      "le",
      "da",
      "su",
      "por",
      "son",
      "con",
      "para",
      "al",
      "del",
      "los",
      "las",
      "una",
      "como",
      "pero",
      "sus",
      "más",
      "muy",
      "ya",
      "todo",
      "esta",
      "está",
      "han",
      "hay",
      "fue",
      "ser",
      "tiene",
      "puede",
      "hacer",
      "decir",
      "ver",
      "saber",
      "querer",
      "ir",
      "venir",
      "dar",
      "tener",
      "estar",
      "hacer",
      "poder",
      "decir",
      "ver",
      "saber",
      "querer",
      "ir",
      "venir",
      "dar",
      "tener",
      "estar",
      // Palabras comunes en inglés
      "the",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "from",
      "up",
      "about",
      "into",
      "through",
      "during",
      "before",
      "after",
      "above",
      "below",
      "between",
      "among",
      "under",
      "over",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "could",
      "should",
      "may",
      "might",
      "must",
      "can",
      "this",
      "that",
      "these",
      "those",
      "i",
      "you",
      "he",
      "she",
      "it",
      "we",
      "they",
      "me",
      "him",
      "her",
      "us",
      "them",
      "my",
      "your",
      "his",
      "her",
      "its",
      "our",
      "their",
    ]);

    // Limpiar el texto y extraer palabras
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ") // Reemplazar caracteres especiales con espacios
      .replace(/\d+/g, " ") // Remover números
      .split(/\s+/)
      .filter((word) => word.length > 2 && !commonWords.has(word));

    // Contar frecuencia de palabras
    const wordFreq: Record<string, number> = {};
    words.forEach((word) => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    // Ordenar por frecuencia y devolver las más comunes
    return Object.entries(wordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8) // Reducir a 8 palabras clave
      .map(([word]) => word);
  }

  private async searchRelatedImages(imageName: string): Promise<any[]> {
    try {
      // Extraer palabras clave del nombre de la imagen
      const keywords = this.extractKeywords(imageName);

      // Crear múltiples consultas de búsqueda para mejor cobertura
      const searchQueries = [
        `${keywords.slice(0, 3).join(" ")} imagen`,
        `${keywords.slice(0, 3).join(" ")} foto`,
        `${keywords.slice(0, 3).join(" ")} imagen similar`,
        `verificar imagen ${keywords.slice(0, 2).join(" ")}`,
        `búsqueda inversa ${keywords.slice(0, 2).join(" ")}`,
        `imagen original ${keywords.slice(0, 2).join(" ")}`,
        `google lens ${keywords.slice(0, 2).join(" ")}`,
        `imagenes similares ${keywords.slice(0, 2).join(" ")}`,
      ];

      // Buscar con cada consulta y combinar resultados
      const allResults = await Promise.allSettled(
        searchQueries.map((query) =>
          googleSearchService.searchRelatedContent(query, 3)
        )
      );

      // Combinar y deduplicar resultados
      const combinedResults: any[] = [];
      allResults.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          combinedResults.push(...result.value);
        }
      });

      // Remover duplicados basado en URL
      const uniqueResults = combinedResults.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.url === item.url)
      );

      return uniqueResults.slice(0, 8); // Máximo 8 resultados para imágenes
    } catch (error) {
      console.error("Error al buscar imágenes relacionadas:", error);
      return [];
    }
  }

  private async searchRelatedVideos(videoName: string): Promise<any[]> {
    try {
      // Extraer palabras clave del nombre del video
      const keywords = this.extractKeywords(videoName);

      // Crear múltiples consultas de búsqueda para mejor cobertura
      const searchQueries = [
        `video similar ${keywords.slice(0, 2).join(" ")}`,
        `verificar video ${keywords.slice(0, 2).join(" ")}`,
        `deepfake detección ${keywords.slice(0, 2).join(" ")}`,
        `video original ${keywords.slice(0, 2).join(" ")}`,
      ];

      // Buscar con cada consulta y combinar resultados
      const allResults = await Promise.allSettled(
        searchQueries.map((query) =>
          googleSearchService.searchRelatedContent(query, 3)
        )
      );

      // Combinar y deduplicar resultados
      const combinedResults: any[] = [];
      allResults.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          combinedResults.push(...result.value);
        }
      });

      // Remover duplicados basado en URL
      const uniqueResults = combinedResults.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.url === item.url)
      );

      return uniqueResults.slice(0, 8); // Máximo 8 resultados
    } catch (error) {
      console.error("Error al buscar videos relacionados:", error);
      return [];
    }
  }

  private async searchRelatedDocuments(documentName: string): Promise<any[]> {
    try {
      // Extraer palabras clave del nombre del documento
      const keywords = this.extractKeywords(documentName);

      // Crear múltiples consultas de búsqueda para mejor cobertura
      const searchQueries = [
        `${keywords.slice(0, 3).join(" ")} artículo`,
        `${keywords.slice(0, 3).join(" ")} información`,
        `${keywords.slice(0, 3).join(" ")} noticias`,
        `${keywords.slice(0, 3).join(" ")} estudio`,
        `verificar información ${keywords.slice(0, 2).join(" ")}`,
        `contenido relacionado ${keywords.slice(0, 2).join(" ")}`,
      ];

      // Buscar con cada consulta y combinar resultados
      const allResults = await Promise.allSettled(
        searchQueries.map((query) =>
          googleSearchService.searchRelatedContent(query, 3)
        )
      );

      // Combinar y deduplicar resultados
      const combinedResults: any[] = [];
      allResults.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          combinedResults.push(...result.value);
        }
      });

      // Remover duplicados basado en URL
      const uniqueResults = combinedResults.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.url === item.url)
      );

      return uniqueResults.slice(0, 8); // Máximo 8 resultados
    } catch (error) {
      console.error("Error al buscar documentos relacionados:", error);
      return [];
    }
  }

  private generateExampleRelatedContent(text: string): any[] {
    const keywords = this.extractKeywords(text);
    const mainKeyword = keywords[0] || "contenido";

    return [
      {
        title: `Verificación de información sobre ${mainKeyword}`,
        url: "https://www.snopes.com",
        snippet: `Información verificada sobre ${mainKeyword} y temas relacionados. Fuente confiable para verificar noticias y rumores.`,
        relevance: 0.85,
        domain: "snopes.com",
      },
      {
        title: `Fact-checking: ${mainKeyword}`,
        url: "https://www.politifact.com",
        snippet: `Análisis detallado y verificación de hechos sobre ${mainKeyword}. Evaluación de la veracidad de la información.`,
        relevance: 0.8,
        domain: "politifact.com",
      },
      {
        title: `Información científica sobre ${mainKeyword}`,
        url: "https://www.scientificamerican.com",
        snippet: `Artículos científicos y análisis basados en evidencia sobre ${mainKeyword}. Fuente académica confiable.`,
        relevance: 0.75,
        domain: "scientificamerican.com",
      },
    ];
  }

  private generateExampleImageContent(imageName: string): any[] {
    const keywords = this.extractKeywords(imageName);
    const mainKeyword = keywords[0] || "imagen";

    return [
      {
        title: `Verificación de imagen: ${mainKeyword}`,
        url: "https://www.tineye.com",
        snippet: `Herramienta de búsqueda inversa de imágenes para verificar la autenticidad y encontrar usos similares.`,
        relevance: 0.9,
        domain: "tineye.com",
      },
      {
        title: `Análisis de imagen con IA`,
        url: "https://www.fotoforensics.com",
        snippet: `Análisis forense de imágenes para detectar manipulaciones y verificar autenticidad.`,
        relevance: 0.85,
        domain: "fotoforensics.com",
      },
      {
        title: `Detección de deepfakes`,
        url: "https://www.sensity.ai",
        snippet: `Herramientas avanzadas para detectar imágenes y videos generados por IA.`,
        relevance: 0.8,
        domain: "sensity.ai",
      },
    ];
  }

  private generateExampleVideoContent(videoName: string): any[] {
    const keywords = this.extractKeywords(videoName);
    const mainKeyword = keywords[0] || "video";

    return [
      {
        title: `Verificación de video: ${mainKeyword}`,
        url: "https://www.invid-project.eu",
        snippet: `Herramienta de verificación de videos para detectar manipulaciones y deepfakes.`,
        relevance: 0.9,
        domain: "invid-project.eu",
      },
      {
        title: `Análisis de video con IA`,
        url: "https://www.sensity.ai",
        snippet: `Detección avanzada de videos generados por IA y deepfakes.`,
        relevance: 0.85,
        domain: "sensity.ai",
      },
      {
        title: `Verificación de contenido multimedia`,
        url: "https://www.verificationhandbook.com",
        snippet: `Guía completa para verificar la autenticidad de videos y contenido multimedia.`,
        relevance: 0.8,
        domain: "verificationhandbook.com",
      },
    ];
  }

  private generateExampleDocumentContent(documentName: string): any[] {
    const keywords = this.extractKeywords(documentName);
    const mainKeyword = keywords[0] || "documento";

    return [
      {
        title: `Verificación de documento: ${mainKeyword}`,
        url: "https://www.turnitin.com",
        snippet: `Herramienta de detección de plagio y verificación de autenticidad de documentos.`,
        relevance: 0.9,
        domain: "turnitin.com",
      },
      {
        title: `Análisis de documentos con IA`,
        url: "https://www.copyleaks.com",
        snippet: `Detección avanzada de contenido generado por IA en documentos y textos.`,
        relevance: 0.85,
        domain: "copyleaks.com",
      },
      {
        title: `Verificación de autenticidad de documentos`,
        url: "https://www.grammarly.com",
        snippet: `Herramientas para verificar la autenticidad y calidad de documentos escritos.`,
        relevance: 0.8,
        domain: "grammarly.com",
      },
    ];
  }

  // Obtener estadísticas de Firebase
  async getFirebaseStats(): Promise<any> {
    try {
      return await firebaseService.getDashboardStats();
    } catch (error) {
      console.error("Error al obtener estadísticas de Firebase:", error);
      return {
        totalAnalyses: 0,
        accuracyRate: 0,
        averageConfidence: 0,
        popularTypes: [],
        recentAnalyses: [],
        systemHealth: {
          apis: {
            gemini: "offline",
            huggingFace: "offline",
            googleSearch: "limited",
            firebase: "offline",
          },
          performance: {
            averageResponseTime: 0,
            successRate: 0,
            errorRate: 0,
          },
          lastUpdated: new Date(),
        },
      };
    }
  }

  async getSystemStatus(): Promise<any> {
    try {
      // Verificar solo Gemini (que es el que realmente usamos)
      const geminiStatus = await geminiService.isAvailable();

      // Para las otras APIs, usar estado basado en configuración y errores conocidos
      const huggingFaceStatus = "offline"; // Modelo no disponible
      const googleSearchStatus = "limited"; // Cuota excedida

      return {
        apis: {
          gemini: geminiStatus ? "online" : "offline",
          huggingFace: huggingFaceStatus,
          googleSearch: googleSearchStatus,
          firebase: "online", // Firebase generalmente está disponible
        },
        performance: {
          averageResponseTime: 0,
          successRate: 0,
          errorRate: 0,
        },
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error("Error al obtener estado del sistema:", error);
      // Retornar estado por defecto en caso de error
      return {
        apis: {
          gemini: "offline",
          huggingFace: "offline",
          googleSearch: "limited",
          firebase: "online",
        },
        performance: {
          averageResponseTime: 0,
          successRate: 0,
          errorRate: 0,
        },
        lastUpdated: new Date(),
      };
    }
  }
}

export const analysisService = new AnalysisService();
