/**
 * Configuración de APIs para el Sistema de Detección de Contenido Generado por IA
 * Versión: 2.0.0
 * Autor: Sistema de Análisis de Contenido
 */

// Configuración principal de APIs
export const API_CONFIG = {
  // Google Gemini API (Versión más reciente)
  GEMINI: {
    API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
    BASE_URL: "https://generativelanguage.googleapis.com/v1beta",
    MODELS: {
      TEXT: "gemini-2.0-flash-exp",
      VISION: "gemini-2.0-flash-exp",
      MULTIMODAL: "gemini-2.0-flash-exp"
    },
    ENDPOINTS: {
      GENERATE: "/models/gemini-2.0-flash-exp:generateContent",
      STREAM: "/models/gemini-2.0-flash-exp:streamGenerateContent"
    },
    TIMEOUT: 30000,
    MAX_TOKENS: 8192,
    TEMPERATURE: 0.1
  },

  // Hugging Face API (Versión más reciente)
  HUGGING_FACE: {
    API_KEY: import.meta.env.VITE_HUGGING_FACE_API_KEY,
    BASE_URL: "https://api-inference.huggingface.co",
    MODELS: {
      SENTIMENT: "cardiffnlp/twitter-roberta-base-sentiment-latest",
      TEXT_CLASSIFICATION: "facebook/bart-large-mnli",
      ZERO_SHOT: "facebook/bart-large-mnli",
      AI_DETECTION: "microsoft/DialoGPT-medium",
      LANGUAGE_DETECTION: "papluca/xlm-roberta-base-language-detection",
      TEXT_GENERATION: "gpt2",
      // Modelos alternativos que funcionan
      ALTERNATIVE_SENTIMENT: "nlptown/bert-base-multilingual-uncased-sentiment",
      ALTERNATIVE_CLASSIFICATION: "distilbert-base-uncased"
    },
    TIMEOUT: 25000,
    MAX_RETRIES: 3
  },

  // Google Custom Search API
  GOOGLE_SEARCH: {
    API_KEY: import.meta.env.VITE_GOOGLE_SEARCH_API_KEY,
    ENGINE_ID: import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID,
    BASE_URL: "https://www.googleapis.com/customsearch/v1",
    TIMEOUT: 20000,
    MAX_RESULTS: 10,
    LANGUAGE: "es",
    REGION: "CO"
  },

  // Firebase Configuration
  FIREBASE: {
    API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    APP_ID: import.meta.env.VITE_FIREBASE_APP_ID
  }
};

// Configuración de análisis por tipo de contenido
export const ANALYSIS_CONFIG = {
  TEXT: {
    MAX_LENGTH: 50000,
    MIN_LENGTH: 50,
    SUPPORTED_FORMATS: ['txt', 'md', 'docx', 'pdf'],
    ANALYSIS_METHODS: ['gemini', 'huggingface', 'web_search']
  },
  IMAGE: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    SUPPORTED_FORMATS: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    ANALYSIS_METHODS: ['gemini_vision', 'metadata', 'reverse_search']
  },
  VIDEO: {
    MAX_SIZE: 100 * 1024 * 1024, // 100MB
    SUPPORTED_FORMATS: ['mp4', 'avi', 'mov', 'mkv'],
    ANALYSIS_METHODS: ['frame_analysis', 'audio_analysis', 'metadata']
  },
  DOCUMENT: {
    MAX_SIZE: 50 * 1024 * 1024, // 50MB
    SUPPORTED_FORMATS: ['pdf', 'docx', 'doc', 'rtf', 'txt'],
    ANALYSIS_METHODS: ['text_extraction', 'structure_analysis', 'content_analysis']
  }
};

// Configuración de seguridad y privacidad
export const SECURITY_CONFIG = {
  DATA_RETENTION_DAYS: 30,
  MAX_ANALYSES_PER_USER: 100,
  RATE_LIMIT: {
    PER_MINUTE: 10,
    PER_HOUR: 100,
    PER_DAY: 1000
  },
  PRIVACY: {
    COLLECT_USER_DATA: false,
    STORE_CONTENT: false,
    ANONYMIZE_RESULTS: true,
    GDPR_COMPLIANT: true
  }
};

// Configuración de UI y UX
export const UI_CONFIG = {
  THEME: {
    PRIMARY_COLOR: '#3B82F6',
    SECONDARY_COLOR: '#64748B',
    SUCCESS_COLOR: '#10B981',
    WARNING_COLOR: '#F59E0B',
    ERROR_COLOR: '#EF4444',
    BACKGROUND_COLOR: '#F8FAFC'
  },
  ANIMATIONS: {
    ENABLED: true,
    DURATION: 300,
    EASING: 'ease-in-out'
  },
  RESPONSIVE: {
    BREAKPOINTS: {
      SM: '640px',
      MD: '768px',
      LG: '1024px',
      XL: '1280px',
      '2XL': '1536px'
    }
  }
};

// Función para validar configuración de APIs
export const validateAPIConfig = () => {
  const errors = [];
  const warnings = [];

  // Validar Gemini
  if (!API_CONFIG.GEMINI.API_KEY) {
    errors.push('GEMINI_API_KEY es requerida');
  }

  // Validar Hugging Face
  if (!API_CONFIG.HUGGING_FACE.API_KEY) {
    errors.push('HUGGING_FACE_API_KEY es requerida');
  }

  // Validar Google Search (opcional)
  if (!API_CONFIG.GOOGLE_SEARCH.API_KEY || !API_CONFIG.GOOGLE_SEARCH.ENGINE_ID) {
    warnings.push('Google Search API no configurada - funcionalidad limitada');
  }

  // Validar Firebase
  const firebaseRequired = [
    'API_KEY', 'AUTH_DOMAIN', 'PROJECT_ID', 
    'STORAGE_BUCKET', 'MESSAGING_SENDER_ID', 'APP_ID'
  ];
  
  firebaseRequired.forEach(key => {
    if (!API_CONFIG.FIREBASE[key]) {
      errors.push(`FIREBASE_${key} es requerida`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Función para obtener headers de autenticación
export const getAuthHeaders = (apiType) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  switch (apiType) {
    case 'gemini':
      if (API_CONFIG.GEMINI.API_KEY) {
        headers['x-goog-api-key'] = API_CONFIG.GEMINI.API_KEY;
      }
      break;
    
    case 'huggingface':
      if (API_CONFIG.HUGGING_FACE.API_KEY) {
        headers['Authorization'] = `Bearer ${API_CONFIG.HUGGING_FACE.API_KEY}`;
      }
      break;
    
    case 'google_search':
      // Google Search usa query parameters, no headers
      break;
    
    default:
      break;
  }

  return headers;
};

// Función para construir URLs de API
export const buildAPIUrl = (apiType, endpoint, params = {}) => {
  let baseUrl = '';
  let url = '';

  switch (apiType) {
    case 'gemini':
      baseUrl = API_CONFIG.GEMINI.BASE_URL;
      url = `${baseUrl}${endpoint}`;
      if (API_CONFIG.GEMINI.API_KEY) {
        url += `?key=${API_CONFIG.GEMINI.API_KEY}`;
      }
      break;
    
    case 'huggingface':
      baseUrl = API_CONFIG.HUGGING_FACE.BASE_URL;
      url = `${baseUrl}${endpoint}`;
      break;
    
    case 'google_search':
      baseUrl = API_CONFIG.GOOGLE_SEARCH.BASE_URL;
      url = `${baseUrl}?key=${API_CONFIG.GOOGLE_SEARCH.API_KEY}&cx=${API_CONFIG.GOOGLE_SEARCH.ENGINE_ID}`;
      Object.keys(params).forEach(key => {
        url += `&${key}=${encodeURIComponent(params[key])}`;
      });
      break;
    
    default:
      throw new Error(`Tipo de API no soportado: ${apiType}`);
  }

  return url;
};

// Configuración de logging
export const LOGGING_CONFIG = {
  LEVEL: import.meta.env.MODE === 'development' ? 'debug' : 'error',
  ENABLE_CONSOLE: import.meta.env.MODE === 'development',
  ENABLE_REMOTE: import.meta.env.MODE === 'production'
};

export default API_CONFIG;