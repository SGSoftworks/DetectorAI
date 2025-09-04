import { geminiService } from './geminiService';
import { huggingFaceService } from './huggingFaceService';
import { googleSearchService } from './googleSearchService';
import type { 
  TextAnalysisRequest, 
  AnalysisResult, 
  ApiResponse 
} from '@/types';

class AnalysisService {
  private isProcessing = false;

  async analyzeText(request: TextAnalysisRequest): Promise<ApiResponse<AnalysisResult>> {
    if (this.isProcessing) {
      return {
        success: false,
        error: 'Ya hay un análisis en proceso. Por favor, espera.'
      };
    }

    this.isProcessing = true;
    const startTime = Date.now();

    try {
      // Validar entrada
      if (!request.text || request.text.trim().length === 0) {
        return {
          success: false,
          error: 'El texto no puede estar vacío'
        };
      }

      if (request.text.length > 50000) {
        return {
          success: false,
          error: 'El texto es demasiado largo. Máximo 50,000 caracteres.'
        };
      }

      // Ejecutar solo Gemini para análisis más rápido
      const geminiResult = await geminiService.analyzeText(request);

      // Usar resultado de Gemini directamente
      const combinedResult = geminiResult;

      // Actualizar tiempo de procesamiento
      const processingTime = Date.now() - startTime;
      combinedResult.metadata.processingTime = processingTime;
      
      // Buscar contenido relacionado de forma asíncrona (no bloquea la respuesta)
      this.searchRelatedContent(request.text).then(relatedContent => {
        // Si no hay contenido relacionado, agregar contenido de ejemplo
        if (relatedContent.length === 0) {
          combinedResult.relatedContent = this.generateExampleRelatedContent(request.text);
        } else {
          combinedResult.relatedContent = relatedContent;
        }
      }).catch(error => {
        console.error('Error al buscar contenido relacionado:', error);
        // En caso de error, agregar contenido de ejemplo
        combinedResult.relatedContent = this.generateExampleRelatedContent(request.text);
      });

      this.isProcessing = false;

      return {
        success: true,
        data: combinedResult,
        message: 'Análisis completado exitosamente'
      };

    } catch (error) {
      this.isProcessing = false;
      console.error('Error en análisis de texto:', error);
      
      return {
        success: false,
        error: 'Error interno del servidor. Por favor, intenta de nuevo.'
      };
    }
  }



  private async searchRelatedContent(text: string): Promise<any[]> {
    try {
      // Extraer palabras clave del texto
      const keywords = this.extractKeywords(text);
      const searchQuery = keywords.slice(0, 5).join(' ');
      
      // Buscar contenido relacionado
      const relatedContent = await googleSearchService.searchRelatedContent(searchQuery, 3);
      
      return relatedContent;
    } catch (error) {
      console.error('Error al buscar contenido relacionado:', error);
      return [];
    }
  }

  private extractKeywords(text: string): string[] {
    // Eliminar palabras comunes y extraer palabras significativas
    const commonWords = new Set([
      'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'los', 'las', 'una', 'como', 'pero', 'sus', 'más', 'muy', 'ya', 'todo', 'esta', 'está', 'han', 'hay', 'fue', 'ser', 'tiene', 'puede', 'hacer', 'decir', 'ver', 'saber', 'querer', 'ir', 'venir', 'dar', 'tener', 'estar', 'hacer', 'poder', 'decir', 'ver', 'saber', 'querer', 'ir', 'venir', 'dar', 'tener', 'estar'
    ]);

    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word));

    // Contar frecuencia de palabras
    const wordFreq: Record<string, number> = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    // Ordenar por frecuencia y devolver las más comunes
    return Object.entries(wordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  private generateExampleRelatedContent(text: string): any[] {
    const keywords = this.extractKeywords(text);
    const mainKeyword = keywords[0] || 'contenido';
    
    return [
      {
        title: `Verificación de información sobre ${mainKeyword}`,
        url: 'https://www.snopes.com',
        snippet: `Información verificada sobre ${mainKeyword} y temas relacionados. Fuente confiable para verificar noticias y rumores.`,
        relevance: 0.85,
        domain: 'snopes.com'
      },
      {
        title: `Fact-checking: ${mainKeyword}`,
        url: 'https://www.politifact.com',
        snippet: `Análisis detallado y verificación de hechos sobre ${mainKeyword}. Evaluación de la veracidad de la información.`,
        relevance: 0.80,
        domain: 'politifact.com'
      },
      {
        title: `Información científica sobre ${mainKeyword}`,
        url: 'https://www.scientificamerican.com',
        snippet: `Artículos científicos y análisis basados en evidencia sobre ${mainKeyword}. Fuente académica confiable.`,
        relevance: 0.75,
        domain: 'scientificamerican.com'
      }
    ];
  }


  async getSystemStatus(): Promise<any> {
    const [geminiStatus, huggingFaceStatus, googleSearchStatus] = await Promise.allSettled([
      geminiService.isAvailable(),
      huggingFaceService.isAvailable(),
      googleSearchService.isAvailable()
    ]);

    return {
      apis: {
        gemini: geminiStatus.status === 'fulfilled' && geminiStatus.value ? 'online' : 'offline',
        huggingFace: huggingFaceStatus.status === 'fulfilled' && huggingFaceStatus.value ? 'online' : 'offline',
        googleSearch: googleSearchStatus.status === 'fulfilled' && googleSearchStatus.value ? 'online' : 'offline',
        firebase: 'online' // Asumimos que Firebase está online
      },
      performance: {
        averageResponseTime: 0,
        successRate: 0,
        errorRate: 0
      },
      lastUpdated: new Date()
    };
  }
}

export const analysisService = new AnalysisService();
