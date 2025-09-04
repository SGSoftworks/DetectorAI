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

  private combineResults(
    geminiResult: AnalysisResult | null,
    huggingFaceResult: AnalysisResult | null,
    originalText: string
  ): AnalysisResult {
    // Si solo uno de los servicios funcionó, usar ese resultado
    if (!geminiResult && !huggingFaceResult) {
      throw new Error('Ningún servicio de análisis está disponible');
    }

    if (!geminiResult) {
      return huggingFaceResult!;
    }

    if (!huggingFaceResult) {
      return geminiResult;
    }

    // Combinar resultados de ambos servicios
    const combinedConfidence = this.calculateWeightedAverage(
      geminiResult.result.confidence,
      huggingFaceResult.result.confidence,
      0.6, // Gemini tiene más peso
      0.4  // Hugging Face tiene menos peso
    );

    const combinedAIProbability = this.calculateWeightedAverage(
      geminiResult.result.probability.ai,
      huggingFaceResult.result.probability.ai,
      0.6,
      0.4
    );

    const isAI = combinedAIProbability > 50;

    // Combinar factores
    const combinedFactors = this.combineFactors(
      geminiResult.result.factors,
      huggingFaceResult.result.factors
    );

    return {
      id: this.generateId(),
      type: 'text',
      content: originalText,
      result: {
        isAI,
        confidence: combinedConfidence,
        probability: {
          ai: combinedAIProbability,
          human: 100 - combinedAIProbability
        },
        explanation: this.combineExplanations(
          geminiResult.result.explanation,
          huggingFaceResult.result.explanation,
          isAI,
          combinedConfidence
        ),
        methodology: `Análisis combinado usando ${geminiResult.metadata.model} y ${huggingFaceResult.metadata.model}`,
        factors: combinedFactors
      },
      metadata: {
        timestamp: new Date(),
        processingTime: 0, // Se actualizará después
        model: 'combined-analysis',
        version: '1.0.0'
      }
    };
  }

  private calculateWeightedAverage(
    value1: number,
    value2: number,
    weight1: number,
    weight2: number
  ): number {
    return Math.round((value1 * weight1 + value2 * weight2) / (weight1 + weight2));
  }

  private combineFactors(
    factors1: any[],
    factors2: any[]
  ): any[] {
    const factorMap = new Map();

    // Agregar factores del primer servicio
    factors1.forEach(factor => {
      factorMap.set(factor.name, {
        ...factor,
        weight: factor.weight * 0.6 // Peso reducido para Gemini
      });
    });

    // Combinar con factores del segundo servicio
    factors2.forEach(factor => {
      if (factorMap.has(factor.name)) {
        const existing = factorMap.get(factor.name);
        factorMap.set(factor.name, {
          ...existing,
          value: this.calculateWeightedAverage(
            existing.value,
            factor.value,
            0.6,
            0.4
          ),
          weight: existing.weight + (factor.weight * 0.4)
        });
      } else {
        factorMap.set(factor.name, {
          ...factor,
          weight: factor.weight * 0.4 // Peso reducido para Hugging Face
        });
      }
    });

    return Array.from(factorMap.values()).sort((a, b) => b.weight - a.weight);
  }

  private combineExplanations(
    _explanation1: string,
    _explanation2: string,
    isAI: boolean,
    confidence: number
  ): string {
    const confidenceLevel = confidence > 80 ? 'alta' : confidence > 60 ? 'moderada' : 'baja';
    const result = isAI ? 'generado por inteligencia artificial' : 'escrito por un humano';
    
    return `Análisis combinado sugiere que este contenido fue ${result} con una confianza ${confidenceLevel} (${confidence}%). ` +
           `Se utilizaron múltiples modelos de IA para llegar a esta conclusión, considerando tanto patrones lingüísticos como características estructurales del texto.`;
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

  private generateId(): string {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
