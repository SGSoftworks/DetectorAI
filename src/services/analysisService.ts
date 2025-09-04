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
        combinedResult.relatedContent = relatedContent;
      }).catch(error => {
        console.error('Error al buscar contenido relacionado:', error);
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
