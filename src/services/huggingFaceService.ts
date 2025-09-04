import axios from 'axios';
import { API_CONFIG, API_URLS, HUGGING_FACE_MODELS } from '@/config/api';
import type { TextAnalysisRequest, AnalysisResult } from '@/types';

class HuggingFaceService {
  private headers: Record<string, string>;

  constructor() {
    if (!API_CONFIG.HUGGING_FACE_API_KEY) {
      throw new Error('HUGGING_FACE_API_KEY no está configurada');
    }
    
    this.headers = {
      'Authorization': `Bearer ${API_CONFIG.HUGGING_FACE_API_KEY}`,
      'Content-Type': 'application/json',
    };
  }

  async analyzeText(request: TextAnalysisRequest): Promise<AnalysisResult> {
    try {
      // Análisis de sentimientos
      const sentimentResult = await this.analyzeSentiment(request.text);
      
      // Análisis de características del texto
      const textFeatures = this.extractTextFeatures(request.text);
      
      // Combinar resultados
      const isAI = this.determineIfAI(sentimentResult, textFeatures);
      const confidence = this.calculateConfidence(sentimentResult, textFeatures);
      
      return {
        id: this.generateId(),
        type: 'text',
        content: request.text,
        result: {
          isAI,
          confidence,
          probability: {
            ai: isAI ? confidence : 100 - confidence,
            human: isAI ? 100 - confidence : confidence
          },
          explanation: this.generateExplanation(isAI, confidence, sentimentResult, textFeatures),
          methodology: 'Análisis de sentimientos y características del texto usando Hugging Face',
          factors: this.generateFactors(sentimentResult, textFeatures)
        },
        metadata: {
          timestamp: new Date(),
          processingTime: 0,
          model: HUGGING_FACE_MODELS.SENTIMENT_ANALYSIS,
          version: '1.0.0'
        }
      };
    } catch (error) {
      console.error('Error en análisis de Hugging Face:', error);
      throw new Error('Error al analizar el texto con Hugging Face');
    }
  }

  private async analyzeSentiment(text: string): Promise<any> {
    try {
      const response = await axios.post(
        `${API_URLS.HUGGING_FACE_BASE}/${HUGGING_FACE_MODELS.SENTIMENT_ANALYSIS}`,
        { inputs: text },
        { headers: this.headers }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error en análisis de sentimientos:', error);
      return null;
    }
  }

  private extractTextFeatures(text: string): any {
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      averageWordsPerSentence: words.length / sentences.length,
      averageSentencesPerParagraph: sentences.length / paragraphs.length,
      uniqueWords: new Set(words.map(w => w.toLowerCase())).size,
      vocabularyDiversity: new Set(words.map(w => w.toLowerCase())).size / words.length,
      averageWordLength: words.reduce((sum, word) => sum + word.length, 0) / words.length,
      punctuationDensity: (text.match(/[.!?,:;]/g) || []).length / text.length,
      capitalizationRatio: (text.match(/[A-Z]/g) || []).length / text.length,
      hasRepetitivePatterns: this.detectRepetitivePatterns(text),
      hasUnusualTransitions: this.detectUnusualTransitions(text),
      complexityScore: this.calculateComplexityScore(text)
    };
  }

  private detectRepetitivePatterns(text: string): boolean {
    const words = text.toLowerCase().split(/\s+/);
    const wordFreq: Record<string, number> = {};
    
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    const maxFreq = Math.max(...Object.values(wordFreq));
    const totalWords = words.length;
    
    return maxFreq / totalWords > 0.1; // Más del 10% de repetición
  }

  private detectUnusualTransitions(text: string): boolean {
    const unusualTransitions = [
      'furthermore', 'moreover', 'additionally', 'consequently',
      'therefore', 'thus', 'hence', 'accordingly'
    ];
    
    const lowerText = text.toLowerCase();
    return unusualTransitions.some(transition => lowerText.includes(transition));
  }

  private calculateComplexityScore(text: string): number {
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Fórmula simplificada de complejidad
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = this.estimateSyllables(words);
    
    return (avgWordsPerSentence * 0.39) + (avgSyllablesPerWord * 11.8) - 15.59;
  }

  private estimateSyllables(words: string[]): number {
    let totalSyllables = 0;
    words.forEach(word => {
      const cleanWord = word.replace(/[^a-zA-Z]/g, '');
      if (cleanWord.length > 0) {
        totalSyllables += Math.max(1, Math.floor(cleanWord.length / 3));
      }
    });
    return totalSyllables / words.length;
  }

  private determineIfAI(sentimentResult: any, textFeatures: any): boolean {
    let aiScore = 0;
    
    // Factores que sugieren contenido generado por IA
    if (textFeatures.hasRepetitivePatterns) aiScore += 20;
    if (textFeatures.hasUnusualTransitions) aiScore += 15;
    if (textFeatures.vocabularyDiversity < 0.3) aiScore += 25;
    if (textFeatures.complexityScore < 10) aiScore += 15;
    if (textFeatures.averageWordsPerSentence > 25) aiScore += 10;
    if (textFeatures.punctuationDensity > 0.05) aiScore += 10;
    
    // Factores de sentimientos (si están disponibles)
    if (sentimentResult && sentimentResult.length > 0) {
      const sentiment = sentimentResult[0];
      if (sentiment.label === 'NEUTRAL' && sentiment.score > 0.8) {
        aiScore += 15;
      }
    }
    
    return aiScore > 50;
  }

  private calculateConfidence(_sentimentResult: any, textFeatures: any): number {
    let confidence = 50; // Base
    
    // Ajustar confianza basado en la claridad de los indicadores
    if (textFeatures.hasRepetitivePatterns) confidence += 15;
    if (textFeatures.vocabularyDiversity < 0.2) confidence += 20;
    if (textFeatures.complexityScore < 5) confidence += 15;
    
    return Math.min(95, Math.max(30, confidence));
  }

  private generateExplanation(isAI: boolean, confidence: number, _sentimentResult: any, textFeatures: any): string {
    const result = isAI ? 'generado por inteligencia artificial' : 'escrito por un humano';
    const confidenceLevel = confidence > 80 ? 'alta' : confidence > 60 ? 'moderada' : 'baja';
    
    let explanation = `El análisis sugiere que este contenido fue ${result} con una confianza ${confidenceLevel} (${confidence}%). `;
    
    if (isAI) {
      explanation += 'Los indicadores principales incluyen: ';
      const indicators = [];
      if (textFeatures.hasRepetitivePatterns) indicators.push('patrones repetitivos');
      if (textFeatures.vocabularyDiversity < 0.3) indicators.push('vocabulario limitado');
      if (textFeatures.complexityScore < 10) indicators.push('estructura simplificada');
      explanation += indicators.join(', ') + '.';
    } else {
      explanation += 'El texto muestra características típicas de escritura humana como variabilidad en el vocabulario y estructura natural.';
    }
    
    return explanation;
  }

  private generateFactors(_sentimentResult: any, textFeatures: any): any[] {
    const factors = [];
    
    factors.push({
      name: 'Diversidad de vocabulario',
      weight: 0.3,
      value: textFeatures.vocabularyDiversity * 100,
      description: 'Variedad de palabras únicas en el texto',
      impact: textFeatures.vocabularyDiversity < 0.3 ? 'negative' : 'positive'
    });
    
    factors.push({
      name: 'Complejidad del texto',
      weight: 0.25,
      value: Math.max(0, Math.min(100, textFeatures.complexityScore * 5)),
      description: 'Nivel de complejidad lingüística',
      impact: textFeatures.complexityScore < 10 ? 'negative' : 'positive'
    });
    
    factors.push({
      name: 'Patrones repetitivos',
      weight: 0.2,
      value: textFeatures.hasRepetitivePatterns ? 80 : 20,
      description: 'Presencia de patrones repetitivos',
      impact: textFeatures.hasRepetitivePatterns ? 'negative' : 'positive'
    });
    
    factors.push({
      name: 'Transiciones naturales',
      weight: 0.15,
      value: textFeatures.hasUnusualTransitions ? 30 : 70,
      description: 'Uso de transiciones naturales',
      impact: textFeatures.hasUnusualTransitions ? 'negative' : 'positive'
    });
    
    factors.push({
      name: 'Densidad de puntuación',
      weight: 0.1,
      value: Math.min(100, textFeatures.punctuationDensity * 2000),
      description: 'Uso de signos de puntuación',
      impact: textFeatures.punctuationDensity > 0.05 ? 'negative' : 'positive'
    });
    
    return factors;
  }

  private generateId(): string {
    return `hf_analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await axios.get(
        `${API_URLS.HUGGING_FACE_BASE}/${HUGGING_FACE_MODELS.SENTIMENT_ANALYSIS}`,
        { headers: this.headers }
      );
      return response.status === 200;
    } catch (error) {
      console.error('Hugging Face no está disponible:', error);
      return false;
    }
  }
}

export const huggingFaceService = new HuggingFaceService();
