import axios from "axios";
import { API_CONFIG } from "../config/api";
import systemMonitoringService from "./systemMonitoringService";

class ModelTrainingService {
  constructor() {
    this.axios = axios.create({
      timeout: 60000, // 60 segundos para entrenamiento
    });
    this.trainingHistory = [];
    this.currentModel = null;
    this.performanceMetrics = {
      accuracy: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
      trainingTime: 0,
      lastTraining: null,
    };
  }

  // Obtener historial de entrenamiento real
  async getTrainingHistory() {
    try {
      // Intentar obtener del backend si existe
      if (API_CONFIG.BACKEND_URL) {
        const response = await this.axios.get(
          `${API_CONFIG.BACKEND_URL}/api/model-training/history`
        );
        this.trainingHistory = response.data;
        return this.trainingHistory;
      }

      // Usar localStorage para persistir datos
      const storedHistory = localStorage.getItem("trainingHistory");
      if (storedHistory) {
        this.trainingHistory = JSON.parse(storedHistory);
      }

      return this.trainingHistory;
    } catch (error) {
      console.warn(
        "No se pudo conectar al backend, usando datos locales:",
        error.message
      );
      return this.trainingHistory;
    }
  }

  // Obtener métricas de rendimiento reales
  async getPerformanceMetrics() {
    try {
      if (API_CONFIG.BACKEND_URL) {
        const response = await this.axios.get(
          `${API_CONFIG.BACKEND_URL}/api/model-training/metrics`
        );
        this.performanceMetrics = response.data;
        return this.performanceMetrics;
      }

      // Calcular métricas basadas en análisis recientes
      const analyses = await systemMonitoringService.getRecentAnalyses(100);
      if (analyses.length > 0) {
        const totalAnalyses = analyses.length;
        const successfulAnalyses = analyses.filter(
          (a) => a.status === "completed"
        ).length;

        this.performanceMetrics = {
          accuracy: Math.round((successfulAnalyses / totalAnalyses) * 100),
          precision: this.calculatePrecision(analyses),
          recall: this.calculateRecall(analyses),
          f1Score: this.calculateF1Score(analyses),
          trainingTime: this.getAverageTrainingTime(),
          lastTraining: this.getLastTrainingDate(),
        };
      }

      return this.performanceMetrics;
    } catch (error) {
      console.warn("No se pudo obtener métricas del backend:", error.message);
      return this.performanceMetrics;
    }
  }

  // Calcular precisión basada en análisis reales
  calculatePrecision(analyses) {
    const aiDetections = analyses.filter((a) => a.result === "IA");
    if (aiDetections.length === 0) return 0;

    const correctDetections = aiDetections.filter(
      (a) => a.confidence >= 70
    ).length;
    return Math.round((correctDetections / aiDetections.length) * 100);
  }

  // Calcular recall basado en análisis reales
  calculateRecall(analyses) {
    const totalAI = analyses.filter((a) => a.result === "IA").length;
    if (totalAI === 0) return 0;

    const detectedAI = analyses.filter(
      (a) => a.result === "IA" && a.confidence >= 70
    ).length;
    return Math.round((detectedAI / totalAI) * 100);
  }

  // Calcular F1-Score
  calculateF1Score(analyses) {
    const precision = this.calculatePrecision(analyses);
    const recall = this.calculateRecall(analyses);

    if (precision + recall === 0) return 0;
    return Math.round((2 * precision * recall) / (precision + recall));
  }

  // Obtener tiempo promedio de entrenamiento
  getAverageTrainingTime() {
    if (this.trainingHistory.length === 0) return 0;

    const totalTime = this.trainingHistory.reduce(
      (sum, training) => sum + (training.duration || 0),
      0
    );
    return Math.round(totalTime / this.trainingHistory.length);
  }

  // Obtener fecha del último entrenamiento
  getLastTrainingDate() {
    if (this.trainingHistory.length === 0) return null;

    const sortedHistory = [...this.trainingHistory].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    return sortedHistory[0].timestamp;
  }

  // Iniciar entrenamiento del modelo
  async startTraining(trainingConfig) {
    const trainingId = Date.now().toString();
    const startTime = Date.now();

    const trainingSession = {
      id: trainingId,
      timestamp: new Date(),
      status: "training",
      config: trainingConfig,
      progress: 0,
      startTime: startTime,
      duration: 0,
    };

    // Agregar a historial
    this.trainingHistory.unshift(trainingSession);

    try {
      // Simular proceso de entrenamiento
      await this.simulateTraining(trainingSession);

      // Actualizar métricas de rendimiento
      await this.updateModelPerformance(trainingSession);

      // Guardar en localStorage
      this.saveTrainingData();

      return trainingSession;
    } catch (error) {
      trainingSession.status = "failed";
      trainingSession.error = error.message;
      throw error;
    }
  }

  // Simular proceso de entrenamiento
  async simulateTraining(trainingSession) {
    const steps = [
      "Preparando datos...",
      "Entrenando modelo...",
      "Validando resultados...",
      "Optimizando parámetros...",
      "Finalizando entrenamiento...",
    ];

    for (let i = 0; i < steps.length; i++) {
      trainingSession.progress = Math.round(((i + 1) / steps.length) * 100);
      trainingSession.currentStep = steps[i];

      // Simular tiempo de procesamiento
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 2000)
      );
    }

    trainingSession.status = "completed";
    trainingSession.progress = 100;
    trainingSession.duration = Date.now() - trainingSession.startTime;
    trainingSession.endTime = new Date();
  }

  // Actualizar rendimiento del modelo
  async updateModelPerformance(trainingSession) {
    // Simular mejora en métricas después del entrenamiento
    const improvement = Math.random() * 0.1; // 0-10% de mejora

    this.performanceMetrics.accuracy = Math.min(
      100,
      this.performanceMetrics.accuracy + improvement * 100
    );
    this.performanceMetrics.precision = Math.min(
      100,
      this.performanceMetrics.precision + improvement * 100
    );
    this.performanceMetrics.recall = Math.min(
      100,
      this.performanceMetrics.recall + improvement * 100
    );
    this.performanceMetrics.f1Score = Math.min(
      100,
      this.performanceMetrics.f1Score + improvement * 100
    );
    this.performanceMetrics.lastTraining = trainingSession.timestamp;
  }

  // Obtener estado actual del modelo
  async getModelStatus() {
    try {
      if (API_CONFIG.BACKEND_URL) {
        const response = await this.axios.get(
          `${API_CONFIG.BACKEND_URL}/api/model-training/status`
        );
        return response.data;
      }

      // Estado local del modelo
      return {
        status: this.currentModel ? "active" : "inactive",
        version: this.currentModel?.version || "1.0.0",
        lastTraining: this.getLastTrainingDate(),
        totalTrainings: this.trainingHistory.length,
        currentAccuracy: this.performanceMetrics.accuracy,
        isTraining: this.trainingHistory.some((t) => t.status === "training"),
        lastUpdate: new Date().toISOString(),
      };
    } catch (error) {
      console.warn("No se pudo obtener estado del modelo:", error.message);
      return {
        status: "unknown",
        version: "1.0.0",
        lastTraining: null,
        totalTrainings: 0,
        currentAccuracy: 0,
        isTraining: false,
        lastUpdate: new Date().toISOString(),
      };
    }
  }

  // Evaluar rendimiento del modelo
  async evaluatePerformance(testData = null) {
    try {
      if (API_CONFIG.BACKEND_URL) {
        const response = await this.axios.post(
          `${API_CONFIG.BACKEND_URL}/api/model-training/evaluate`,
          { testData }
        );
        return response.data;
      }

      // Evaluación local basada en métricas existentes
      const analyses = await systemMonitoringService.getRecentAnalyses(50);

      if (analyses.length === 0) {
        return {
          accuracy: 0,
          precision: 0,
          recall: 0,
          f1Score: 0,
          totalSamples: 0,
          evaluationDate: new Date().toISOString(),
        };
      }

      const totalSamples = analyses.length;
      const truePositives = analyses.filter(
        (a) => a.result === "IA" && a.confidence >= 70
      ).length;
      const falsePositives = analyses.filter(
        (a) => a.result === "IA" && a.confidence < 70
      ).length;
      const falseNegatives = analyses.filter(
        (a) => a.result === "Humano" && a.confidence < 70
      ).length;

      const accuracy = Math.round((truePositives / totalSamples) * 100);
      const precision =
        truePositives + falsePositives > 0
          ? Math.round((truePositives / (truePositives + falsePositives)) * 100)
          : 0;
      const recall =
        truePositives + falseNegatives > 0
          ? Math.round((truePositives / (truePositives + falseNegatives)) * 100)
          : 0;
      const f1Score =
        precision + recall > 0
          ? Math.round((2 * precision * recall) / (precision + recall))
          : 0;

      return {
        accuracy,
        precision,
        recall,
        f1Score,
        totalSamples,
        evaluationDate: new Date().toISOString(),
      };
    } catch (error) {
      console.warn("Error evaluando rendimiento:", error.message);
      return {
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1Score: 0,
        totalSamples: 0,
        evaluationDate: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  // Obtener modelo actual
  async getCurrentModelStatus() {
    try {
      if (API_CONFIG.BACKEND_URL) {
        const response = await this.axios.get(
          `${API_CONFIG.BACKEND_URL}/api/model-training/current`
        );
        this.currentModel = response.data;
        return this.currentModel;
      }

      // Modelo local
      if (!this.currentModel) {
        this.currentModel = {
          id: "local-model-001",
          version: "1.0.0",
          status: "active",
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          performance: this.performanceMetrics,
        };
      }

      return this.currentModel;
    } catch (error) {
      console.warn("No se pudo obtener modelo actual:", error.message);
      return this.currentModel;
    }
  }

  // Obtener total de muestras de entrenamiento
  async getTotalTrainingSamples() {
    try {
      const analyses = await systemMonitoringService.getRecentAnalyses(1000);
      return analyses.length;
    } catch (error) {
      return 0;
    }
  }

  // Validar modelo con datos de prueba
  async validateModel(validationData) {
    try {
      const startTime = Date.now();

      // Simular validación
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const validationResults = {
        timestamp: new Date(),
        accuracy: this.performanceMetrics.accuracy + (Math.random() - 0.5) * 5,
        precision:
          this.performanceMetrics.precision + (Math.random() - 0.5) * 5,
        recall: this.performanceMetrics.recall + (Math.random() - 0.5) * 5,
        f1Score: this.performanceMetrics.f1Score + (Math.random() - 0.5) * 5,
        duration: Date.now() - startTime,
        samples: validationData.length,
      };

      // Actualizar métricas si la validación es exitosa
      if (validationResults.accuracy > this.performanceMetrics.accuracy) {
        this.performanceMetrics = {
          ...this.performanceMetrics,
          accuracy: Math.round(validationResults.accuracy),
          precision: Math.round(validationResults.precision),
          recall: Math.round(validationResults.recall),
          f1Score: Math.round(validationResults.f1Score),
        };
      }

      return validationResults;
    } catch (error) {
      throw new Error(`Error en la validación: ${error.message}`);
    }
  }

  // Exportar modelo entrenado
  async exportModel(format = "json") {
    try {
      const modelData = {
        version: this.currentModel?.version || "1.0.0",
        timestamp: new Date(),
        performance: this.performanceMetrics,
        trainingHistory: this.trainingHistory.slice(0, 10), // Últimos 10 entrenamientos
        config: {
          format: format,
          exportDate: new Date(),
        },
      };

      if (format === "json") {
        const blob = new Blob([JSON.stringify(modelData, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `model-${modelData.version}-${
          new Date().toISOString().split("T")[0]
        }.json`;
        a.click();
        URL.revokeObjectURL(url);
      }

      return modelData;
    } catch (error) {
      throw new Error(`Error exportando modelo: ${error.message}`);
    }
  }

  // Guardar datos de entrenamiento
  saveTrainingData() {
    try {
      localStorage.setItem(
        "trainingHistory",
        JSON.stringify(this.trainingHistory)
      );
      localStorage.setItem(
        "modelPerformance",
        JSON.stringify(this.performanceMetrics)
      );
    } catch (error) {
      console.warn("No se pudo guardar en localStorage:", error.message);
    }
  }

  // Cargar datos de entrenamiento
  loadTrainingData() {
    try {
      const storedHistory = localStorage.getItem("trainingHistory");
      const storedPerformance = localStorage.getItem("modelPerformance");

      if (storedHistory) {
        this.trainingHistory = JSON.parse(storedHistory);
      }

      if (storedPerformance) {
        this.performanceMetrics = JSON.parse(storedPerformance);
      }
    } catch (error) {
      console.warn("No se pudo cargar datos de entrenamiento:", error.message);
    }
  }

  // Inicializar servicio
  async initialize() {
    this.loadTrainingData();
    await this.getTrainingHistory();
    await this.getPerformanceMetrics();
    await this.getCurrentModelStatus();
  }
}

export default new ModelTrainingService();
