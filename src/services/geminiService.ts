import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_CONFIG } from '@/config/api';
import type { TextAnalysisRequest, AnalysisResult, ContentType } from '@/types';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    if (!API_CONFIG.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY no está configurada');
    }
    
    this.genAI = new GoogleGenerativeAI(API_CONFIG.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async analyzeText(request: TextAnalysisRequest): Promise<AnalysisResult> {
    try {
      const prompt = this.createAnalysisPrompt(request.text);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseAnalysisResponse(text, 'text', request.text);
    } catch (error) {
      console.error('Error en análisis de Gemini:', error);
      throw new Error('Error al analizar el texto con Gemini');
    }
  }

  private createAnalysisPrompt(text: string): string {
    return `
Analiza el siguiente texto y determina si fue generado por inteligencia artificial o por un humano. 

Proporciona tu análisis en el siguiente formato JSON:
{
  "isAI": boolean,
  "confidence": number (0-100),
  "probability": {
    "ai": number (0-100),
    "human": number (0-100)
  },
  "explanation": "Explicación detallada de tu decisión",
  "methodology": "Metodología utilizada para el análisis",
  "factors": [
    {
      "name": "nombre del factor",
      "weight": number (0-1),
      "value": number (0-100),
      "description": "descripción del factor",
      "impact": "positive|negative|neutral"
    }
  ]
}

Texto a analizar:
${text}

Considera los siguientes factores:
1. Patrones de lenguaje y estructura
2. Consistencia en el estilo
3. Complejidad y coherencia
4. Uso de conectores y transiciones
5. Originalidad y creatividad
6. Errores típicos de IA
7. Fluidez natural del lenguaje
8. Contexto y conocimiento específico
`;
  }

  private parseAnalysisResponse(response: string, type: ContentType, content: string): AnalysisResult {
    try {
      // Extraer JSON del response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No se pudo extraer JSON del response');
      }

      const analysis = JSON.parse(jsonMatch[0]);
      
      return {
        id: this.generateId(),
        type,
        content,
        result: {
          isAI: analysis.isAI,
          confidence: analysis.confidence,
          probability: analysis.probability,
          explanation: analysis.explanation,
          methodology: analysis.methodology,
          factors: analysis.factors || []
        },
        metadata: {
          timestamp: new Date(),
          processingTime: 0, // Se calculará en el servicio principal
          model: 'gemini-pro',
          version: '1.0.0'
        }
      };
    } catch (error) {
      console.error('Error al parsear respuesta de Gemini:', error);
      // Respuesta de fallback
      return {
        id: this.generateId(),
        type,
        content,
        result: {
          isAI: false,
          confidence: 50,
          probability: { ai: 50, human: 50 },
          explanation: 'No se pudo analizar el contenido con precisión',
          methodology: 'Análisis básico de texto',
          factors: []
        },
        metadata: {
          timestamp: new Date(),
          processingTime: 0,
          model: 'gemini-pro',
          version: '1.0.0'
        }
      };
    }
  }

  private generateId(): string {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const testPrompt = "Responde 'OK' si puedes procesar este mensaje.";
      await this.model.generateContent(testPrompt);
      return true;
    } catch (error) {
      console.error('Gemini no está disponible:', error);
      return false;
    }
  }
}

export const geminiService = new GeminiService();
