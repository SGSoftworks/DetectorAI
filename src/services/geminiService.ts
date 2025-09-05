import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_CONFIG } from "@/config/api";
import type { TextAnalysisRequest, AnalysisResult, ContentType } from "@/types";

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    if (!API_CONFIG.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY no está configurada");
    }

    this.genAI = new GoogleGenerativeAI(API_CONFIG.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  async analyzeText(request: TextAnalysisRequest): Promise<AnalysisResult> {
    try {
      const prompt = this.createAnalysisPrompt(request.text);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseAnalysisResponse(text, "text", request.text);
    } catch (error) {
      console.error("Error en análisis de Gemini:", error);
      throw new Error("Error al analizar el texto con Gemini");
    }
  }

  async analyzeImage(imageFile: File): Promise<AnalysisResult> {
    try {
      const prompt = this.createImageAnalysisPrompt();
      const imageData = await this.fileToGenerativePart(imageFile);

      const result = await this.model.generateContent([prompt, imageData]);
      const response = await result.response;
      const text = response.text();

      return this.parseAnalysisResponse(text, "image", imageFile.name);
    } catch (error) {
      console.error("Error en análisis de imagen con Gemini:", error);
      throw new Error("Error al analizar la imagen con Gemini");
    }
  }

  async analyzeVideo(videoFile: File): Promise<AnalysisResult> {
    try {
      const prompt = this.createVideoAnalysisPrompt();
      const videoData = await this.fileToGenerativePart(videoFile);

      const result = await this.model.generateContent([prompt, videoData]);
      const response = await result.response;
      const text = response.text();

      return this.parseAnalysisResponse(text, "video", videoFile.name);
    } catch (error) {
      console.error("Error en análisis de video con Gemini:", error);
      throw new Error("Error al analizar el video con Gemini");
    }
  }

  async analyzeDocument(documentFile: File): Promise<AnalysisResult> {
    try {
      // Para documentos Word, PDF y otros, extraer el texto primero
      const documentText = await this.extractTextFromDocument(documentFile);
      const prompt = this.createDocumentAnalysisPrompt(documentText);

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseAnalysisResponse(text, "document", documentFile.name);
    } catch (error) {
      console.error("Error en análisis de documento con Gemini:", error);
      throw new Error("Error al analizar el documento con Gemini");
    }
  }

  private createAnalysisPrompt(text: string): string {
    return `
Analiza el siguiente texto y determina si fue generado por inteligencia artificial o por un humano. 

IMPORTANTE: Considera que el contenido falso, conspirativo, o con afirmaciones científicamente incorrectas puede ser generado tanto por IA como por humanos, pero las IA modernas tienden a generar contenido más estructurado y "creíble" incluso cuando es falso.

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
2. Consistencia en el estilo y coherencia
3. Uso de conectores y transiciones naturales
4. Originalidad vs. contenido genérico
5. Errores típicos de IA (repetición, frases forzadas)
6. Fluidez natural del lenguaje
7. Credibilidad científica y factual
8. Estructura narrativa y desarrollo lógico
9. Uso de evidencia y referencias
10. Tono y estilo de escritura
11. Complejidad del vocabulario
12. Patrones de argumentación

NOTA: Si el contenido contiene afirmaciones falsas, conspirativas o científicamente incorrectas, evalúa si la forma de presentarlas es más característica de IA (estructurada, "creíble") o humana (más espontánea, menos pulida).
`;
  }

  private parseAnalysisResponse(
    response: string,
    type: ContentType,
    content: string
  ): AnalysisResult {
    try {
      // Extraer JSON del response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No se pudo extraer JSON del response");
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
          factors: analysis.factors || [],
        },
        metadata: {
          timestamp: new Date(),
          processingTime: 0, // Se calculará en el servicio principal
          model: "gemini-2.0-flash",
          version: "1.0.0",
        },
      };
    } catch (error) {
      console.error("Error al parsear respuesta de Gemini:", error);
      // Respuesta de fallback
      return {
        id: this.generateId(),
        type,
        content,
        result: {
          isAI: false,
          confidence: 50,
          probability: { ai: 50, human: 50 },
          explanation: "No se pudo analizar el contenido con precisión",
          methodology: "Análisis básico de texto",
          factors: [],
        },
        metadata: {
          timestamp: new Date(),
          processingTime: 0,
          model: "gemini-2.0-flash",
          version: "1.0.0",
        },
      };
    }
  }

  private createImageAnalysisPrompt(): string {
    return `
Analiza esta imagen y determina si fue generada por inteligencia artificial o es una imagen real capturada por humanos.

IMPORTANTE: 
- Responde SIEMPRE en español
- Busca patrones típicos de IA como:
  * Artefactos de generación (texturas extrañas, patrones repetitivos)
  * Inconsistencias en iluminación, sombras o perspectivas
  * Detalles imposibles o sobrenaturales
  * Calidad demasiado perfecta o artificial
  * Elementos que no siguen las leyes de la física

Proporciona tu análisis en el siguiente formato JSON:
{
  "isAI": boolean,
  "confidence": number (0-100),
  "probability": {
    "ai": number (0-100),
    "human": number (0-100)
  },
  "explanation": "Explicación detallada de tu decisión en español",
  "methodology": "Metodología utilizada para el análisis en español",
  "factors": [
    {
      "name": "nombre del factor en español",
      "weight": number (0-1),
      "value": number (0-100),
      "description": "descripción del factor en español",
      "impact": "positive|negative|neutral"
    }
  ]
}

Considera los siguientes factores:
1. Calidad y resolución de la imagen
2. Consistencia de iluminación y sombras
3. Detalles anatómicos o estructurales
4. Texturas y patrones
5. Perspectiva y proporciones
6. Elementos sobrenaturales o imposibles
7. Artefactos de compresión o generación
8. Estilo artístico vs. realismo fotográfico
9. Inconsistencias en el fondo o entorno
10. Calidad general de la imagen

RESPONDE ÚNICAMENTE EN ESPAÑOL.
`;
  }

  private createVideoAnalysisPrompt(): string {
    return `
Analiza este video y determina si fue generado por inteligencia artificial o es un video real capturado por humanos.

IMPORTANTE: 
- Responde SIEMPRE en español
- Los videos de IA modernos pueden ser muy convincentes, pero tienen patrones específicos
- Busca patrones típicos de IA como:
  * Movimientos antinaturales, robóticos o demasiado fluidos
  * Inconsistencias en iluminación, sombras o reflejos entre frames
  * Artefactos de generación, distorsiones o elementos imposibles
  * Transiciones extrañas, cortes antinaturales o saltos temporales
  * Calidad demasiado perfecta, uniforme o artificial
  * Elementos que no siguen las leyes de la física
  * Falta de micro-movimientos naturales (parpadeos, respiración)
  * Inconsistencias en texturas, patrones o detalles
  * Audio desincronizado o artificial
  * Falta de ruido natural o imperfecciones

Proporciona tu análisis en el siguiente formato JSON:
{
  "isAI": boolean,
  "confidence": number (0-100),
  "probability": {
    "ai": number (0-100),
    "human": number (0-100)
  },
  "explanation": "Explicación detallada de tu decisión en español",
  "methodology": "Metodología utilizada para el análisis en español",
  "factors": [
    {
      "name": "nombre del factor en español",
      "weight": number (0-1),
      "value": number (0-100),
      "description": "descripción del factor en español",
      "impact": "positive|negative|neutral"
    }
  ]
}

Considera los siguientes factores:
1. Fluidez y naturalidad del movimiento (busca movimientos demasiado perfectos)
2. Consistencia de iluminación entre frames (inconsistencias = IA)
3. Calidad de audio sincronizado (desincronización = IA)
4. Detalles anatómicos o estructurales (imperfecciones = humano)
5. Transiciones y cortes (antinaturales = IA)
6. Estabilidad de la cámara (demasiado estable = IA)
7. Elementos sobrenaturales o imposibles (física violada = IA)
8. Artefactos de compresión o generación (distorsiones = IA)
9. Duración y coherencia temporal (saltos = IA)
10. Calidad general del video (demasiado perfecta = IA)
11. Micro-movimientos naturales (falta de ellos = IA)
12. Texturas y patrones (inconsistencias = IA)

RESPONDE ÚNICAMENTE EN ESPAÑOL.
`;
  }

  private createDocumentAnalysisPrompt(documentText: string): string {
    return `
Analiza el siguiente texto de documento y determina si fue generado por inteligencia artificial o escrito por un humano.

IMPORTANTE: 
- Responde SIEMPRE en español
- Busca patrones típicos de IA como:
  * Estructura muy organizada y formal
  * Uso excesivo de conectores y transiciones
  * Lenguaje demasiado pulido o genérico
  * Falta de errores menores típicos humanos
  * Repetición de patrones de escritura
  * Contenido muy estructurado sin espontaneidad

Proporciona tu análisis en el siguiente formato JSON:
{
  "isAI": boolean,
  "confidence": number (0-100),
  "probability": {
    "ai": number (0-100),
    "human": number (0-100)
  },
  "explanation": "Explicación detallada de tu decisión en español",
  "methodology": "Metodología utilizada para el análisis en español",
  "factors": [
    {
      "name": "nombre del factor en español",
      "weight": number (0-1),
      "value": number (0-100),
      "description": "descripción del factor en español",
      "impact": "positive|negative|neutral"
    }
  ]
}

Considera los siguientes factores:
1. Estructura y organización del documento
2. Uso de conectores y transiciones
3. Estilo de escritura y tono
4. Consistencia en el formato
5. Originalidad del contenido
6. Complejidad del vocabulario
7. Patrones de argumentación
8. Uso de evidencia y referencias
9. Fluidez natural del texto
10. Errores menores típicos humanos
11. Coherencia temática
12. Longitud y desarrollo del contenido

Texto del documento a analizar:
${documentText}

RESPONDE ÚNICAMENTE EN ESPAÑOL.
`;
  }

  private async extractTextFromDocument(file: File): Promise<string> {
    try {
      // Para archivos de texto plano
      if (file.type === "text/plain") {
        return await file.text();
      }

      // Para archivos PDF
      if (file.type === "application/pdf") {
        try {
          const pdfjsLib = await import("pdfjs-dist");
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let fullText = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(" ");
            fullText += pageText + "\n";
          }

          return (
            fullText.trim() ||
            `[PDF: ${file.name}] - No se pudo extraer texto del PDF.`
          );
        } catch (error) {
          console.error("Error al extraer texto del PDF:", error);
          return `[PDF: ${file.name}] - Error al extraer texto del PDF.`;
        }
      }

      // Para archivos Word (.docx)
      if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        try {
          const mammoth = await import("mammoth");
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          return (
            result.value ||
            `[Word: ${file.name}] - No se pudo extraer texto del documento Word.`
          );
        } catch (error) {
          console.error("Error al extraer texto del Word:", error);
          return `[Word: ${file.name}] - Error al extraer texto del documento Word.`;
        }
      }

      // Para archivos Word (.doc) - formato más antiguo
      if (file.type === "application/msword") {
        return `[Word (.doc): ${file.name}] - Los archivos .doc no son compatibles. Convierta a .docx para análisis completo.`;
      }

      // Para archivos RTF
      if (file.type === "application/rtf") {
        try {
          return await file.text();
        } catch (error) {
          console.error("Error al extraer texto del RTF:", error);
          return `[RTF: ${file.name}] - Error al extraer texto del documento RTF.`;
        }
      }

      // Para otros tipos de archivo, intentar leer como texto
      try {
        return await file.text();
      } catch {
        return `[Archivo: ${file.name}] - No se pudo extraer el contenido del archivo. Tipo: ${file.type}`;
      }
    } catch (error) {
      console.error("Error al extraer texto del documento:", error);
      return `[Error] No se pudo procesar el documento: ${file.name}`;
    }
  }

  private async fileToGenerativePart(file: File): Promise<any> {
    const base64 = await this.fileToBase64(file);
    return {
      inlineData: {
        data: base64,
        mimeType: file.type,
      },
    };
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remover el prefijo "data:image/jpeg;base64," o similar
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
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
      console.error("Gemini no está disponible:", error);
      return false;
    }
  }
}

export const geminiService = new GeminiService();
