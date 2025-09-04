// Configuración de APIs para el sistema de detección de noticias falsas
export const API_CONFIG = {
  // Google Gemini API
  GEMINI_API_URL:
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || null,

  // Hugging Face API
  HUGGING_FACE_API_URL: "https://api-inference.huggingface.co",
  HUGGING_FACE_API_KEY: import.meta.env.VITE_HUGGING_FACE_API_KEY || null,

  // Google Custom Search API
  GOOGLE_SEARCH_API_URL: "https://www.googleapis.com/customsearch/v1",
  GOOGLE_SEARCH_API_KEY: import.meta.env.VITE_GOOGLE_SEARCH_API_KEY || null,
  GOOGLE_SEARCH_ENGINE_ID: import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID || null,

  // Backend URL (opcional)
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || null,

  // Configuración de timeouts
  TIMEOUTS: {
    GEMINI: 30000,
    HUGGING_FACE: 15000,
    GOOGLE_SEARCH: 10000,
    GENERAL: 20000,
  },
};

// APIs de análisis de texto alternativas (gratuitas)
export const TEXT_ANALYSIS_APIS = {
  // API gratuita de análisis de sentimientos
  SENTIMENT_API: "https://api.meaningcloud.com/sentiment-2.1",
  // API gratuita de clasificación de texto
  CLASSIFICATION_API: "https://api.meaningcloud.com/class-1.1",
  // API alternativa para análisis de texto
  TEXT_ANALYSIS_API: "https://api.meaningcloud.com/topics-2.0",
  // API de detección de idioma
  LANGUAGE_DETECTION_API: "https://api.meaningcloud.com/lang-2.0",
};

// Modelos de Hugging Face disponibles (mantener como respaldo)
export const HUGGING_FACE_MODELS = {
  // Modelos principales (pueden fallar)
  SENTIMENT: "cardiffnlp/twitter-roberta-base-sentiment",
  TEXT_CLASSIFICATION: "facebook/bart-large-mnli",
  ZERO_SHOT: "facebook/bart-large-mnli",

  // Modelos alternativos que funcionan mejor
  SENTIMENT_ALT1: "distilbert-base-uncased-finetuned-sst-2-english",
  SENTIMENT_ALT2: "nlptown/bert-base-multilingual-uncased-sentiment",
  CLASSIFICATION_ALT1: "microsoft/DialoGPT-medium",
  CLASSIFICATION_ALT2: "gpt2",

  // Modelos de respaldo simples
  FALLBACK_SENTIMENT: "cardiffnlp/twitter-roberta-base-sentiment",
  FALLBACK_CLASSIFICATION: "facebook/bart-large-mnli",

  // Modelos que funcionan sin API key (públicos)
  PUBLIC_SENTIMENT: "distilbert-base-uncased-finetuned-sst-2-english",
  PUBLIC_CLASSIFICATION: "gpt2",
};

// Función para obtener headers de autenticación
export const getHeaders = (apiType) => {
  const headers = {
    "Content-Type": "application/json",
  };

  switch (apiType) {
    case "gemini":
      // Gemini no requiere headers especiales
      break;
    case "huggingface":
      if (API_CONFIG.HUGGING_FACE_API_KEY) {
        headers.Authorization = `Bearer ${API_CONFIG.HUGGING_FACE_API_KEY}`;
      }
      break;
    case "google":
      // Google Search usa parámetros de query
      break;
    default:
      break;
  }

  return headers;
};

// Función para validar configuración de APIs
export const validateAPIConfig = () => {
  const errors = [];
  const warnings = [];

  if (!API_CONFIG.GEMINI_API_KEY) {
    errors.push("API key de Gemini no configurada");
  }

  if (!API_CONFIG.HUGGING_FACE_API_KEY) {
    errors.push("API key de Hugging Face no configurada");
  }

  if (!API_CONFIG.GOOGLE_SEARCH_API_KEY) {
    warnings.push("API key de Google Search no configurada (opcional)");
  }

  if (!API_CONFIG.GOOGLE_SEARCH_ENGINE_ID) {
    warnings.push("Engine ID de Google Search no configurado (opcional)");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    message:
      errors.length > 0
        ? `Configuración incompleta: ${errors.join(", ")}`
        : warnings.length > 0
        ? `Configuración básica completa. ${warnings.join(", ")}`
        : "Configuración completa",
  };
};

// Función para obtener información de uso de APIs
export const getAPIUsageInfo = () => {
  return {
    gemini: {
      name: "Google Gemini",
      status: API_CONFIG.GEMINI_API_KEY ? "Configurado" : "No configurado",
      url: "https://makersuite.google.com/app/apikey",
      limits: {
        "Requests per minute": "60",
        "Requests per day": "1500",
        "Characters per request": "30,720",
      },
    },
    huggingface: {
      name: "Hugging Face",
      status: API_CONFIG.HUGGING_FACE_API_KEY
        ? "Configurado"
        : "No configurado",
      url: "https://huggingface.co/settings/tokens",
      limits: {
        "Requests per hour": "30,000",
        "Concurrent requests": "6",
        "Model access": "Público",
      },
    },
    googleSearch: {
      name: "Google Custom Search",
      status: API_CONFIG.GOOGLE_SEARCH_API_KEY
        ? "Configurado"
        : "No configurado",
      url: "https://developers.google.com/custom-search/v1/introduction",
      limits: {
        "Queries per day": "10,000",
        "Queries per second": "10",
        "Results per query": "10",
      },
    },
  };
};

// Función para manejar errores de API de manera consistente
export const handleAPIError = (error, apiName) => {
  let userMessage = "Error desconocido";
  let technicalDetails = error.message;

  if (error.response) {
    const status = error.response.status;

    switch (status) {
      case 400:
        userMessage = "Solicitud incorrecta";
        break;
      case 401:
        userMessage = "API key inválida o expirada";
        break;
      case 403:
        userMessage = "Sin permisos para acceder al servicio";
        break;
      case 404:
        userMessage = "Servicio no encontrado";
        break;
      case 429:
        userMessage = "Límite de uso excedido";
        break;
      case 500:
        userMessage = "Error interno del servidor";
        break;
      case 503:
        userMessage = "Servicio temporalmente no disponible";
        break;
      default:
        userMessage = `Error del servidor (${status})`;
    }
  } else if (error.request) {
    userMessage = "No se pudo conectar con el servicio";
    technicalDetails = "Error de red o timeout";
  } else if (error.code === "ECONNABORTED") {
    userMessage = "Tiempo de espera agotado";
    technicalDetails = "La solicitud tardó demasiado en completarse";
  }

  return {
    userMessage,
    technicalDetails,
    apiName,
    timestamp: new Date().toISOString(),
    originalError: error,
  };
};

// Función para verificar si una API está disponible
export const isAPIAvailable = (apiType) => {
  switch (apiType) {
    case "gemini":
      return !!API_CONFIG.GEMINI_API_KEY;
    case "huggingface":
      return !!API_CONFIG.HUGGING_FACE_API_KEY;
    case "google":
      return !!(
        API_CONFIG.GOOGLE_SEARCH_API_KEY && API_CONFIG.GOOGLE_SEARCH_ENGINE_ID
      );
    default:
      return false;
  }
};

export default API_CONFIG;
