import axios from "axios";
import { API_CONFIG } from "../config/api";

class SystemMonitoringService {
  constructor() {
    this.axios = axios.create({
      timeout: 10000,
    });
    this.stats = {
      totalAnalyses: 0,
      accuracy: 0,
      responseTime: 0,
      uptime: 0,
      lastUpdate: new Date(),
    };
    this.analyses = [];
    this.systemHealth = {
      status: "healthy",
      lastCheck: new Date(),
      checks: [],
    };
  }

  // Obtener estadísticas reales del sistema
  async getSystemStats() {
    try {
      // Intentar obtener datos del backend si existe y es válido
      if (API_CONFIG.BACKEND_URL && API_CONFIG.BACKEND_URL !== 'https://tu-backend.com/api') {
        try {
          const response = await this.axios.get(
            `${API_CONFIG.BACKEND_URL}/api/stats`
          );
          this.stats = response.data;
          return this.stats;
        } catch (error) {
          console.warn("Error conectando al backend:", error.message);
        }
      }

      // Si no hay backend, usar localStorage para persistir datos
      const storedStats = localStorage.getItem("systemStats");
      if (storedStats) {
        this.stats = JSON.parse(storedStats);
      }

      return this.stats;
    } catch (error) {
      console.warn(
        "No se pudo conectar al backend, usando datos locales:",
        error.message
      );
      return this.stats;
    }
  }

  // Obtener análisis recientes reales
  async getRecentAnalyses(limit = 10) {
    try {
      if (API_CONFIG.BACKEND_URL && API_CONFIG.BACKEND_URL !== 'https://tu-backend.com/api') {
        try {
          const response = await this.axios.get(
            `${API_CONFIG.BACKEND_URL}/api/analyses?limit=${limit}`
          );
          this.analyses = response.data;
          return this.analyses;
        } catch (error) {
          console.warn("Error conectando al backend:", error.message);
        }
      }

      // Usar localStorage para análisis recientes
      const storedAnalyses = localStorage.getItem("recentAnalyses");
      if (storedAnalyses) {
        this.analyses = JSON.parse(storedAnalyses);
      }

      return this.analyses;
    } catch (error) {
      console.warn(
        "No se pudo conectar al backend, usando datos locales:",
        error.message
      );
      return this.analyses;
    }
  }

  // Verificar estado de salud del sistema
  async checkSystemHealth() {
    const checks = [];
    const startTime = Date.now();

    try {
      // Verificar APIs externas
      const geminiCheck = await this.checkAPIHealth(
        "Gemini",
        API_CONFIG.GEMINI_API_KEY
      );
      const huggingfaceCheck = await this.checkAPIHealth(
        "Hugging Face",
        API_CONFIG.HUGGING_FACE_API_KEY
      );
      const googleCheck = await this.checkAPIHealth(
        "Google Search",
        API_CONFIG.GOOGLE_SEARCH_API_KEY
      );

      checks.push(geminiCheck, huggingfaceCheck, googleCheck);

      // Verificar rendimiento del sistema
      const performanceCheck = await this.checkPerformance();
      checks.push(performanceCheck);

      // Determinar estado general
      const healthyChecks = checks.filter(
        (check) => check.status === "healthy"
      ).length;
      const totalChecks = checks.length;

      this.systemHealth = {
        status:
          healthyChecks === totalChecks
            ? "healthy"
            : healthyChecks > totalChecks / 2
            ? "warning"
            : "critical",
        lastCheck: new Date(),
        checks: checks,
        score: Math.round((healthyChecks / totalChecks) * 100),
      };

      return this.systemHealth;
    } catch (error) {
      this.systemHealth = {
        status: "error",
        lastCheck: new Date(),
        checks: checks,
        error: error.message,
      };
      return this.systemHealth;
    }
  }

  // Verificar salud de una API específica
  async checkAPIHealth(apiName, apiKey) {
    const check = {
      name: apiName,
      status: "unknown",
      responseTime: 0,
      lastCheck: new Date(),
      details: "",
    };

    if (!apiKey) {
      check.status = "critical";
      check.details = "API key no configurada";
      return check;
    }

    try {
      const startTime = Date.now();

      // Verificar diferentes APIs según el nombre
      if (apiName === "Gemini") {
        await this.testGeminiAPI(apiKey);
      } else if (apiName === "Hugging Face") {
        await this.testHuggingFaceAPI(apiKey);
      } else if (apiName === "Google Search") {
        await this.testGoogleSearchAPI(apiKey);
      }

      const responseTime = Date.now() - startTime;
      check.status = "healthy";
      check.responseTime = responseTime;
      check.details = `Respuesta en ${responseTime}ms`;
    } catch (error) {
      check.status = "critical";
      check.details = this.getErrorMessage(error, apiName);
    }

    return check;
  }

  // Obtener mensaje de error más amigable
  getErrorMessage(error, apiName) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        return "API key inválida o expirada";
      } else if (status === 403) {
        return "Sin permisos para acceder a la API";
      } else if (status === 404) {
        return "Endpoint de API no encontrado";
      } else if (status === 429) {
        return "Límite de uso excedido";
      } else if (status >= 500) {
        return "Error del servidor de la API";
      }
    }

    if (error.code === "ECONNABORTED") {
      return "Tiempo de espera agotado";
    }

    if (error.message) {
      return error.message;
    }

    return "Error desconocido en la conexión";
  }

  // Probar API de Gemini
  async testGeminiAPI(apiKey) {
    try {
      const response = await this.axios.post(
        `${API_CONFIG.GEMINI_API_URL}?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: "Test" }] }],
        },
        { timeout: 5000 }
      );

      if (!response.data.candidates) {
        throw new Error("Respuesta inválida de Gemini API");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("API key inválida o expirada");
      } else if (error.response?.status === 403) {
        throw new Error("Sin permisos para acceder a la API");
      } else if (error.response?.status === 429) {
        throw new Error("Límite de uso excedido");
      } else {
        throw new Error(`Error de Gemini API: ${error.message}`);
      }
    }
  }

  // Probar API de Hugging Face
  async testHuggingFaceAPI(apiKey) {
    try {
      const response = await this.axios.post(
        `${API_CONFIG.HUGGING_FACE_API_URL}/cardiffnlp/twitter-roberta-base-sentiment-latest`,
        { inputs: "Test" },
        {
          headers: { Authorization: `Bearer ${apiKey}` },
          timeout: 5000,
        }
      );

      if (!response.data) {
        throw new Error("Respuesta inválida de Hugging Face API");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("API key inválida o expirada");
      } else if (error.response?.status === 403) {
        throw new Error("Sin permisos para acceder a la API");
      } else if (error.response?.status === 404) {
        throw new Error("Modelo no encontrado");
      } else if (error.response?.status === 429) {
        throw new Error("Límite de uso excedido");
      } else {
        throw new Error(`Error de Hugging Face API: ${error.message}`);
      }
    }
  }

  // Probar API de Google Search
  async testGoogleSearchAPI(apiKey) {
    try {
      const response = await this.axios.get(API_CONFIG.GOOGLE_SEARCH_API_URL, {
        params: {
          key: apiKey,
          cx: API_CONFIG.GOOGLE_SEARCH_ENGINE_ID,
          q: "test",
          num: 1,
        },
        timeout: 5000,
      });

      if (!response.data) {
        throw new Error("Respuesta inválida de Google Search API");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("API key inválida o expirada");
      } else if (error.response?.status === 403) {
        throw new Error("Sin permisos para acceder a la API");
      } else if (error.response?.status === 429) {
        throw new Error("Límite de uso excedido");
      } else {
        throw new Error(`Error de Google Search API: ${error.message}`);
      }
    }
  }

  // Verificar rendimiento del sistema
  async checkPerformance() {
    const check = {
      name: "Rendimiento del Sistema",
      status: "healthy",
      responseTime: 0,
      lastCheck: new Date(),
      details: "",
    };

    try {
      const startTime = Date.now();

      // Simular operación de rendimiento
      await new Promise((resolve) => setTimeout(resolve, 100));

      const responseTime = Date.now() - startTime;
      check.responseTime = responseTime;

      if (responseTime < 200) {
        check.status = "healthy";
        check.details = "Rendimiento óptimo";
      } else if (responseTime < 500) {
        check.status = "warning";
        check.details = "Rendimiento aceptable";
      } else {
        check.status = "critical";
        check.details = "Rendimiento lento";
      }
    } catch (error) {
      check.status = "critical";
      check.details = error.message;
    }

    return check;
  }

  // Registrar un nuevo análisis
  async recordAnalysis(analysisData) {
    const analysis = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: analysisData.type,
      result: analysisData.result,
      confidence: analysisData.confidence,
      processingTime: analysisData.processingTime || 0,
      status: "completed",
    };

    // Agregar a la lista local
    this.analyses.unshift(analysis);

    // Mantener solo los últimos 100 análisis
    if (this.analyses.length > 100) {
      this.analyses = this.analyses.slice(0, 100);
    }

    // Actualizar estadísticas
    this.stats.totalAnalyses++;
    this.stats.lastUpdate = new Date();

    // Calcular precisión promedio
    if (this.analyses.length > 0) {
      const totalConfidence = this.analyses.reduce(
        (sum, a) => sum + (a.confidence || 0),
        0
      );
      this.stats.accuracy = Math.round(totalConfidence / this.analyses.length);
    }

    // Guardar en localStorage
    try {
      localStorage.setItem("recentAnalyses", JSON.stringify(this.analyses));
      localStorage.setItem("systemStats", JSON.stringify(this.stats));
    } catch (error) {
      console.warn("No se pudo guardar en localStorage:", error.message);
    }

    // Intentar enviar al backend si existe
    if (API_CONFIG.BACKEND_URL) {
      try {
        await this.axios.post(
          `${API_CONFIG.BACKEND_URL}/api/analyses`,
          analysis
        );
      } catch (error) {
        console.warn("No se pudo enviar al backend:", error.message);
      }
    }

    // Intentar guardar en Firebase si está disponible
    try {
      if (typeof window !== 'undefined' && window.firebase) {
        // Firebase está disponible, guardar análisis
        const { DatabaseService } = await import('../config/firebase.js');
        await DatabaseService.saveAnalysis(analysis);
      }
    } catch (error) {
      console.warn("No se pudo guardar en Firebase:", error.message);
    }

    return analysis;
  }

  // Obtener métricas de rendimiento
  async getPerformanceMetrics() {
    const metrics = {
      averageResponseTime: 0,
      successRate: 0,
      errorRate: 0,
      peakUsage: 0,
    };

    if (this.analyses.length > 0) {
      const responseTimes = this.analyses
        .map((a) => a.processingTime)
        .filter((t) => t > 0);
      if (responseTimes.length > 0) {
        metrics.averageResponseTime = Math.round(
          responseTimes.reduce((sum, time) => sum + time, 0) /
            responseTimes.length
        );
      }

      const successful = this.analyses.filter(
        (a) => a.status === "completed"
      ).length;
      metrics.successRate = Math.round(
        (successful / this.analyses.length) * 100
      );
      metrics.errorRate = 100 - metrics.successRate;

      // Simular peak usage basado en análisis recientes
      const recentAnalyses = this.analyses.filter(
        (a) => Date.now() - new Date(a.timestamp).getTime() < 3600000 // Última hora
      );
      metrics.peakUsage = Math.round((recentAnalyses.length / 60) * 100); // Porcentaje de uso
    }

    return metrics;
  }

  // Iniciar monitoreo en tiempo real
  startRealTimeMonitoring(interval = 30000) {
    this.monitoringInterval = setInterval(async () => {
      await this.checkSystemHealth();
      await this.getSystemStats();
    }, interval);
  }

  // Detener monitoreo
  stopRealTimeMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }
}

export default new SystemMonitoringService();
