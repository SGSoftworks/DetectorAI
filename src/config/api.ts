// Configuración de APIs con validación
export const API_CONFIG = {
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || '',
  HUGGING_FACE_API_KEY: import.meta.env.VITE_HUGGING_FACE_API_KEY || '',
  GOOGLE_SEARCH_API_KEY: import.meta.env.VITE_GOOGLE_SEARCH_API_KEY || '',
  GOOGLE_SEARCH_ENGINE_ID: import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID || '',
};

// URLs de las APIs
export const API_URLS = {
  HUGGING_FACE_BASE: "https://api-inference.huggingface.co/models",
  GOOGLE_SEARCH_BASE: "https://www.googleapis.com/customsearch/v1",
  GEMINI_BASE: "https://generativelanguage.googleapis.com/v1beta",
};

// Modelos de Hugging Face para diferentes tipos de análisis
export const HUGGING_FACE_MODELS = {
  TEXT_DETECTION: "microsoft/DialoGPT-medium",
  IMAGE_DETECTION: "facebook/detr-resnet-50",
  SENTIMENT_ANALYSIS: "cardiffnlp/twitter-roberta-base-sentiment-latest",
  FAKE_NEWS_DETECTION: "microsoft/DialoGPT-medium",
};

// Configuración de límites y timeouts
export const API_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_TEXT_LENGTH: 50000, // 50,000 caracteres
  REQUEST_TIMEOUT: 30000, // 30 segundos
  MAX_RETRIES: 3,
};

// Validación de configuración
export const validateApiConfig = () => {
  const requiredKeys = [
    "VITE_GEMINI_API_KEY",
    "VITE_HUGGING_FACE_API_KEY",
    "VITE_FIREBASE_API_KEY",
  ];

  const missingKeys = requiredKeys.filter((key) => !import.meta.env[key]);

  if (missingKeys.length > 0) {
    console.warn("Faltan las siguientes variables de entorno:", missingKeys);
    return false;
  }

  return true;
};

// Función para verificar si una API está disponible
export const isApiAvailable = (apiKey: string): boolean => {
  return Boolean(apiKey && apiKey.length > 0 && apiKey !== 'undefined');
};

// Estado de las APIs
export const getApiStatus = () => {
  return {
    gemini: isApiAvailable(API_CONFIG.GEMINI_API_KEY),
    huggingFace: isApiAvailable(API_CONFIG.HUGGING_FACE_API_KEY),
    googleSearch: isApiAvailable(API_CONFIG.GOOGLE_SEARCH_API_KEY) && isApiAvailable(API_CONFIG.GOOGLE_SEARCH_ENGINE_ID),
    firebase: true // Firebase siempre está disponible si la app se carga
  };
};
