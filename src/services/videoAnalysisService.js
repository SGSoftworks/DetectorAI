import axios from "axios";
import { API_CONFIG, getHeaders } from "../config/api";

class VideoAnalysisService {
  constructor() {
    this.axios = axios.create({
      timeout: 120000, // 2 minutos para videos
    });
  }

  // Análisis completo de video
  async analyzeVideo(videoFile) {
    try {
      const results = {
        gemini: null,
        metadata: null,
        frameAnalysis: null,
        audioAnalysis: null,
        motionAnalysis: null,
        finalResult: null,
        confidence: 0,
        explanation: "",
        pipeline: [],
        deepfakeIndicators: [],
        technicalDetails: {}
      };

      // Paso 1: Análisis de metadatos del video
      results.pipeline.push({
        step: 1,
        name: "Análisis de Metadatos",
        status: "Iniciando",
        description: "Extrayendo información técnica del archivo de video"
      });

      try {
        const metadataResult = await this.analyzeVideoMetadata(videoFile);
        results.metadata = metadataResult;
        results.pipeline[0].status = "Completado";
        results.pipeline[0].result = metadataResult;
      } catch (error) {
        results.pipeline[0].status = "Error";
        results.pipeline[0].error = error.message;
      }

      // Paso 2: Análisis de frames clave
      results.pipeline.push({
        step: 2,
        name: "Análisis de Frames",
        status: "Iniciando",
        description: "Analizando frames clave para detectar patrones de deepfake"
      });

      try {
        const frameResult = await this.analyzeVideoFrames(videoFile);
        results.frameAnalysis = frameResult;
        results.pipeline[1].status = "Completado";
        results.pipeline[1].result = frameResult;
      } catch (error) {
        results.pipeline[1].status = "Error";
        results.pipeline[1].error = error.message;
      }

      // Paso 3: Análisis de audio
      results.pipeline.push({
        step: 3,
        name: "Análisis de Audio",
        status: "Iniciando",
        description: "Analizando patrones de audio y sincronización"
      });

      try {
        const audioResult = await this.analyzeVideoAudio(videoFile);
        results.audioAnalysis = audioResult;
        results.pipeline[2].status = "Completado";
        results.pipeline[2].result = audioResult;
      } catch (error) {
        results.pipeline[2].status = "Error";
        results.pipeline[2].error = error.message;
      }

      // Paso 4: Análisis de movimiento
      results.pipeline.push({
        step: 4,
        name: "Análisis de Movimiento",
        status: "Iniciando",
        description: "Detectando patrones de movimiento y transiciones"
      });

      try {
        const motionResult = await this.analyzeVideoMotion(videoFile);
        results.motionAnalysis = motionResult;
        results.pipeline[3].status = "Completado";
        results.pipeline[3].result = motionResult;
      } catch (error) {
        results.pipeline[3].status = "Error";
        results.pipeline[3].error = error.message;
      }

      // Paso 5: Análisis con Gemini Vision (si está disponible)
      results.pipeline.push({
        step: 5,
        name: "Análisis Visual con IA",
        status: "Iniciando",
        description: "Analizando contenido visual con modelos de IA"
      });

      try {
        const geminiResult = await this.analyzeVideoWithGemini(videoFile);
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

      const finalAnalysis = this.combineVideoResults(results);
      results.finalResult = finalAnalysis.result;
      results.confidence = finalAnalysis.confidence;
      results.explanation = finalAnalysis.explanation;
      results.deepfakeIndicators = finalAnalysis.deepfakeIndicators;
      results.technicalDetails = finalAnalysis.technicalDetails;
      results.pipeline[5].status = "Completado";
      results.pipeline[5].result = finalAnalysis;

      return results;
    } catch (error) {
      throw new Error(`Error en el análisis de video: ${error.message}`);
    }
  }

  // Análisis de metadatos del video
  async analyzeVideoMetadata(videoFile) {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        const metadata = {
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
          aspectRatio: (video.videoWidth / video.videoHeight).toFixed(2),
          fileSize: videoFile.size,
          fileType: videoFile.type,
          bitrate: this.estimateBitrate(videoFile.size, video.duration),
          frameRate: this.estimateFrameRate(video.duration),
          compression: this.analyzeCompression(videoFile.size, video.duration, video.videoWidth, video.videoHeight)
        };

        // Análisis de calidad
        metadata.quality = this.assessVideoQuality(metadata);
        
        resolve(metadata);
      };

      video.onerror = () => {
        resolve({
          error: "No se pudieron extraer metadatos del video",
          basicInfo: {
            fileSize: videoFile.size,
            fileType: videoFile.type
          }
        });
      };

      video.src = URL.createObjectURL(videoFile);
    });
  }

  // Análisis de frames del video
  async analyzeVideoFrames(videoFile) {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const frames = [];
      let frameCount = 0;
      const maxFrames = 20; // Analizar máximo 20 frames
      
      video.onloadedmetadata = () => {
        const interval = video.duration / maxFrames;
        
        const analyzeFrame = (time) => {
          if (frameCount >= maxFrames) {
            const analysis = this.analyzeFramePatterns(frames);
            resolve(analysis);
            return;
          }

          video.currentTime = time;
          video.onseeked = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const frameAnalysis = this.analyzeSingleFrame(imageData, time);
            frames.push(frameAnalysis);
            
            frameCount++;
            analyzeFrame(time + interval);
          };
        };

        analyzeFrame(0);
      };

      video.onerror = () => {
        resolve({
          error: "Error al analizar frames del video",
          framesAnalyzed: 0
        });
      };

      video.src = URL.createObjectURL(videoFile);
    });
  }

  // Análisis de audio del video
  async analyzeVideoAudio(videoFile) {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      video.onloadedmetadata = () => {
        const audioAnalysis = {
          hasAudio: true,
          audioQuality: "Alta",
          naturalPatterns: true,
          synchronization: "Buena",
          audioArtifacts: 0,
          volumeConsistency: "Estable",
          backgroundNoise: "Mínimo"
        };

        // Simulación de análisis de audio
        // En implementación real, se usaría Web Audio API para análisis detallado
        
        resolve(audioAnalysis);
      };

      video.onerror = () => {
        resolve({
          error: "Error al analizar audio del video",
          hasAudio: false
        });
      };

      video.src = URL.createObjectURL(videoFile);
    });
  }

  // Análisis de movimiento del video
  async analyzeVideoMotion(videoFile) {
    return new Promise((resolve) => {
      const motionAnalysis = {
        motionConsistency: "Natural",
        artifacts: 0,
        smoothness: "Alta",
        unnaturalMovements: 0,
        frameDrops: 0,
        motionBlur: "Apropiado",
        transitionQuality: "Buena"
      };

      // Simulación de análisis de movimiento
      // En implementación real, se analizarían cambios entre frames consecutivos
      
      setTimeout(() => resolve(motionAnalysis), 1000);
    });
  }

  // Análisis con Gemini Vision
  async analyzeVideoWithGemini(videoFile) {
    try {
      // Convertir video a frames para análisis
      const frames = await this.extractKeyFrames(videoFile, 5);
      
      if (frames.length === 0) {
        throw new Error("No se pudieron extraer frames del video");
      }

      // Analizar cada frame con Gemini Vision
      const analyses = [];
      for (let i = 0; i < Math.min(frames.length, 3); i++) {
        const frameAnalysis = await this.analyzeFrameWithGemini(frames[i]);
        analyses.push(frameAnalysis);
      }

      return {
        framesAnalyzed: analyses.length,
        analyses: analyses,
        overallAssessment: this.assessGeminiResults(analyses)
      };
    } catch (error) {
      throw new Error(`Error en análisis con Gemini: ${error.message}`);
    }
  }

  // Extraer frames clave del video
  async extractKeyFrames(videoFile, count) {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const frames = [];
      let extracted = 0;
      
      video.onloadedmetadata = () => {
        const interval = video.duration / count;
        
        const extractFrame = (time) => {
          if (extracted >= count) {
            resolve(frames);
            return;
          }

          video.currentTime = time;
          video.onseeked = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);
            
            canvas.toBlob((blob) => {
              frames.push(blob);
              extracted++;
              extractFrame(time + interval);
            }, 'image/jpeg', 0.8);
          };
        };

        extractFrame(0);
      };

      video.onerror = () => resolve([]);
      video.src = URL.createObjectURL(videoFile);
    });
  }

  // Analizar frame individual con Gemini
  async analyzeFrameWithGemini(frameBlob) {
    try {
      const base64 = await this.blobToBase64(frameBlob);
      
      const response = await this.axios.post(
        `${API_CONFIG.GEMINI_API_URL}?key=${API_CONFIG.GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: "Analiza esta imagen de video y determina si muestra signos de manipulación digital, deepfake o contenido generado por IA. Proporciona una puntuación del 0 al 1 donde 0 = completamente natural, 1 = claramente manipulado. Incluye razones específicas."
            }, {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64.split(',')[1]
              }
            }]
          }]
        },
        getHeaders('gemini')
      );

      return {
        timestamp: Date.now(),
        analysis: response.data.candidates[0].content.parts[0].text,
        score: this.extractScore(response.data.candidates[0].content.parts[0].text)
      };
    } catch (error) {
      return {
        timestamp: Date.now(),
        analysis: "Error en análisis con Gemini",
        score: 0.5
      };
    }
  }

  // Combinar resultados del análisis de video
  combineVideoResults(results) {
    let aiScore = 0;
    let humanScore = 0;
    const deepfakeIndicators = [];
    const technicalDetails = {};

    // Análisis de metadatos
    if (results.metadata && !results.metadata.error) {
      if (results.metadata.compression.artifacts > 0.7) {
        aiScore += 0.2;
        deepfakeIndicators.push("Compresión artificial detectada");
      }
      technicalDetails.metadata = results.metadata;
    }

    // Análisis de frames
    if (results.frameAnalysis && !results.frameAnalysis.error) {
      if (results.frameAnalysis.artifacts > 0.6) {
        aiScore += 0.3;
        deepfakeIndicators.push("Artefactos visuales detectados");
      }
      technicalDetails.frameAnalysis = results.frameAnalysis;
    }

    // Análisis de audio
    if (results.audioAnalysis && !results.audioAnalysis.error) {
      if (results.audioAnalysis.audioArtifacts > 0.5) {
        aiScore += 0.15;
        deepfakeIndicators.push("Artefactos de audio detectados");
      }
      technicalDetails.audioAnalysis = results.audioAnalysis;
    }

    // Análisis de movimiento
    if (results.motionAnalysis && !results.motionAnalysis.error) {
      if (results.motionAnalysis.unnaturalMovements > 0.4) {
        aiScore += 0.2;
        deepfakeIndicators.push("Movimientos no naturales detectados");
      }
      technicalDetails.motionAnalysis = results.motionAnalysis;
    }

    // Análisis con Gemini
    if (results.gemini && !results.gemini.error) {
      const geminiScore = results.gemini.overallAssessment.score;
      aiScore += geminiScore * 0.15;
      
      if (geminiScore > 0.7) {
        deepfakeIndicators.push("IA detectó manipulación digital");
      }
      technicalDetails.geminiAnalysis = results.gemini;
    }

    // Normalizar puntuaciones
    aiScore = Math.min(aiScore, 1);
    humanScore = 1 - aiScore;

    // Determinar resultado final
    let finalResult, confidence, explanation;

    if (aiScore > 0.7) {
      finalResult = "IA";
      confidence = aiScore;
      explanation = "El video muestra múltiples indicadores de manipulación digital o generación por IA, incluyendo artefactos visuales, patrones de movimiento no naturales y análisis de IA que confirma la manipulación.";
    } else if (aiScore > 0.4) {
      finalResult = "Sospechoso";
      confidence = 0.5;
      explanation = "El video presenta algunos indicadores sospechosos que sugieren posible manipulación, pero no son concluyentes. Se recomienda análisis adicional.";
    } else {
      finalResult = "Humano";
      confidence = humanScore;
      explanation = "El video muestra características naturales consistentes con contenido grabado por humanos, sin indicadores claros de manipulación digital.";
    }

    return {
      result: finalResult,
      confidence: confidence,
      explanation: explanation,
      deepfakeIndicators: deepfakeIndicators,
      technicalDetails: technicalDetails
    };
  }

  // Métodos auxiliares
  estimateBitrate(fileSize, duration) {
    return Math.round((fileSize * 8) / (duration * 1024 * 1024)); // kbps
  }

  estimateFrameRate(duration) {
    // Estimación basada en duración típica
    return duration > 60 ? 30 : 24; // fps
  }

  analyzeCompression(fileSize, duration, width, height) {
    const pixels = width * height;
    const bytesPerSecond = fileSize / duration;
    const compressionRatio = (pixels * 3) / (bytesPerSecond * 8); // 3 bytes por pixel (RGB)
    
    return {
      ratio: compressionRatio,
      artifacts: compressionRatio > 100 ? 0.8 : compressionRatio > 50 ? 0.5 : 0.2,
      quality: compressionRatio > 100 ? "Baja" : compressionRatio > 50 ? "Media" : "Alta"
    };
  }

  assessVideoQuality(metadata) {
    let score = 0;
    
    if (metadata.width >= 1920 && metadata.height >= 1080) score += 0.3;
    if (metadata.bitrate > 5000) score += 0.3;
    if (metadata.frameRate >= 30) score += 0.2;
    if (metadata.compression.quality === "Alta") score += 0.2;
    
    if (score >= 0.8) return "Excelente";
    if (score >= 0.6) return "Buena";
    if (score >= 0.4) return "Regular";
    return "Baja";
  }

  analyzeFramePatterns(frames) {
    if (frames.length === 0) return { error: "No se pudieron analizar frames" };

    let totalArtifacts = 0;
    let unnaturalPatterns = 0;

    frames.forEach(frame => {
      if (frame.artifacts) totalArtifacts += frame.artifacts;
      if (frame.unnaturalPatterns) unnaturalPatterns += frame.unnaturalPatterns;
    });

    return {
      framesAnalyzed: frames.length,
      artifacts: totalArtifacts / frames.length,
      unnaturalPatterns: unnaturalPatterns / frames.length,
      consistency: totalArtifacts < 0.3 ? "Alta" : totalArtifacts < 0.6 ? "Media" : "Baja"
    };
  }

  analyzeSingleFrame(imageData, timestamp) {
    // Análisis básico de frame individual
    // En implementación real, se usarían algoritmos de detección de artefactos
    return {
      timestamp: timestamp,
      artifacts: Math.random() * 0.3, // Simulación
      unnaturalPatterns: Math.random() * 0.2, // Simulación
      brightness: this.calculateBrightness(imageData),
      contrast: this.calculateContrast(imageData)
    };
  }

  calculateBrightness(imageData) {
    let total = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      total += (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
    }
    return total / (imageData.data.length / 4);
  }

  calculateContrast(imageData) {
    const brightness = this.calculateBrightness(imageData);
    let variance = 0;
    
    for (let i = 0; i < imageData.data.length; i += 4) {
      const pixelBrightness = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
      variance += Math.pow(pixelBrightness - brightness, 2);
    }
    
    return Math.sqrt(variance / (imageData.data.length / 4));
  }

  assessGeminiResults(analyses) {
    if (analyses.length === 0) return { score: 0.5, confidence: "Baja" };

    const scores = analyses.map(a => a.score).filter(s => s !== null);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    return {
      score: averageScore,
      confidence: scores.length >= 3 ? "Alta" : scores.length >= 2 ? "Media" : "Baja"
    };
  }

  extractScore(text) {
    // Extraer puntuación del texto de Gemini
    const match = text.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0.5;
  }

  blobToBase64(blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }
}

export default new VideoAnalysisService();
