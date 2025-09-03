// Configuración del backend API
export const BACKEND_CONFIG = {
  // Configuración del servidor
  SERVER: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || "localhost",
    environment: process.env.NODE_ENV || "development",
    cors: {
      enabled: true,
      origin:
        process.env.NODE_ENV === "production"
          ? ["https://yourdomain.com"]
          : ["http://localhost:3000", "http://localhost:5173"],
    },
  },

  // Configuración de la base de datos
  DATABASE: {
    type: "postgresql", // o 'mysql', 'mongodb', 'sqlite'
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "detector_ia",
    ssl: process.env.NODE_ENV === "production",
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
  },

  // Configuración de Redis para cache y sesiones
  REDIS: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || null,
    db: process.env.REDIS_DB || 0,
    keyPrefix: "detector_ia:",
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
  },

  // Configuración de JWT
  JWT: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    expiresIn: "24h",
    refreshExpiresIn: "7d",
    issuer: "detector-ia",
    audience: "detector-ia-users",
  },

  // Configuración de rate limiting
  RATE_LIMIT: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por ventana
    message: "Demasiadas solicitudes desde esta IP",
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Configuración de logging
  LOGGING: {
    level: process.env.LOG_LEVEL || "info",
    format: "combined",
    transports: ["console", "file"],
    filename: "logs/app.log",
    maxSize: "20m",
    maxFiles: "14d",
  },

  // Configuración de monitoreo
  MONITORING: {
    enabled: true,
    metrics: {
      collectionInterval: 60000, // 1 minuto
      retentionPeriod: 7 * 24 * 60 * 60 * 1000, // 7 días
    },
    healthCheck: {
      enabled: true,
      interval: 30000, // 30 segundos
      timeout: 5000, // 5 segundos
    },
  },

  // Configuración de almacenamiento de archivos
  STORAGE: {
    type: "local", // 'local', 's3', 'gcs', 'azure'
    local: {
      path: "./uploads",
      maxSize: 100 * 1024 * 1024, // 100MB
      allowedTypes: ["image/*", "video/*", "application/pdf", "text/*"],
    },
    s3: {
      bucket: process.env.S3_BUCKET,
      region: process.env.S3_REGION,
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  },

  // Configuración de análisis de contenido
  ANALYSIS: {
    maxConcurrentAnalyses: 10,
    analysisTimeout: 300000, // 5 minutos
    cacheResults: true,
    cacheExpiry: 24 * 60 * 60 * 1000, // 24 horas
    batchProcessing: {
      enabled: true,
      maxBatchSize: 50,
      batchTimeout: 60000, // 1 minuto
    },
  },

  // Configuración de entrenamiento del modelo
  MODEL_TRAINING: {
    enabled: true,
    maxTrainingJobs: 5,
    trainingTimeout: 3600000, // 1 hora
    gpuAcceleration: process.env.GPU_ACCELERATION === "true",
    modelStorage: {
      path: "./models",
      maxSize: 1024 * 1024 * 1024, // 1GB
    },
  },
};

// Configuración de endpoints de la API
export const API_ENDPOINTS = {
  // Endpoints de análisis
  ANALYSIS: {
    TEXT: "/api/v1/analyze/text",
    IMAGE: "/api/v1/analyze/image",
    VIDEO: "/api/v1/analyze/video",
    DOCUMENT: "/api/v1/analyze/document",
    BATCH: "/api/v1/analyze/batch",
  },

  // Endpoints de verificación
  VERIFICATION: {
    CONTENT: "/api/v1/verify/content",
    SOURCE: "/api/v1/verify/source",
    PLAGIARISM: "/api/v1/verify/plagiarism",
    FACT_CHECK: "/api/v1/verify/fact-check",
  },

  // Endpoints de entrenamiento
  TRAINING: {
    START: "/api/v1/training/start",
    STATUS: "/api/v1/training/status",
    STOP: "/api/v1/training/stop",
    MODELS: "/api/v1/training/models",
    PERFORMANCE: "/api/v1/training/performance",
  },

  // Endpoints de gestión
  MANAGEMENT: {
    USERS: "/api/v1/users",
    ANALYSES: "/api/v1/analyses",
    STATISTICS: "/api/v1/statistics",
    HEALTH: "/api/v1/health",
    METRICS: "/api/v1/metrics",
  },
};

// Configuración de middleware
export const MIDDLEWARE_CONFIG = {
  // Orden de ejecución del middleware
  ORDER: [
    "cors",
    "helmet",
    "compression",
    "bodyParser",
    "rateLimit",
    "securityHeaders",
    "requestLogger",
    "apiKeyValidation",
    "errorHandler",
  ],

  // Configuración específica de cada middleware
  CORS: {
    origin: BACKEND_CONFIG.SERVER.cors.origin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
  },

  HELMET: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https:"],
        fontSrc: ["'self'", "https:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
  },

  COMPRESSION: {
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  },

  BODY_PARSER: {
    json: {
      limit: "10mb",
      strict: true,
    },
    urlencoded: {
      extended: true,
      limit: "10mb",
    },
  },
};

// Configuración de validación de esquemas
export const VALIDATION_SCHEMAS = {
  // Esquema para análisis de texto
  TEXT_ANALYSIS: {
    text: {
      type: "string",
      required: true,
      minLength: 10,
      maxLength: 10000,
      sanitize: true,
    },
    options: {
      type: "object",
      properties: {
        language: { type: "string", enum: ["auto", "es", "en", "fr", "de"] },
        detailed: { type: "boolean", default: false },
        includeSources: { type: "boolean", default: true },
      },
    },
  },

  // Esquema para análisis de imagen
  IMAGE_ANALYSIS: {
    image: {
      type: "file",
      required: true,
      maxSize: "25MB",
      allowedTypes: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/webp",
      ],
    },
    options: {
      type: "object",
      properties: {
        detailed: { type: "boolean", default: false },
        includeMetadata: { type: "boolean", default: true },
        frameAnalysis: { type: "boolean", default: false },
      },
    },
  },

  // Esquema para análisis de video
  VIDEO_ANALYSIS: {
    video: {
      type: "file",
      required: true,
      maxSize: "100MB",
      allowedTypes: [
        "video/mp4",
        "video/avi",
        "video/mov",
        "video/wmv",
        "video/flv",
        "video/webm",
        "video/mkv",
      ],
    },
    options: {
      type: "object",
      properties: {
        frameRate: { type: "number", minimum: 1, maximum: 60, default: 30 },
        quality: {
          type: "string",
          enum: ["low", "medium", "high"],
          default: "medium",
        },
        audioAnalysis: { type: "boolean", default: true },
      },
    },
  },

  // Esquema para análisis de documento
  DOCUMENT_ANALYSIS: {
    document: {
      type: "file",
      required: true,
      maxSize: "50MB",
      allowedTypes: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "text/markdown",
        "application/rtf",
      ],
    },
    options: {
      type: "object",
      properties: {
        extractText: { type: "boolean", default: true },
        analyzeStructure: { type: "boolean", default: true },
        checkPlagiarism: { type: "boolean", default: true },
      },
    },
  },
};

// Configuración de respuestas de la API
export const API_RESPONSES = {
  // Códigos de estado HTTP
  STATUS_CODES: {
    SUCCESS: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  },

  // Mensajes de error estándar
  ERROR_MESSAGES: {
    INVALID_API_KEY: "API Key inválida o expirada",
    RATE_LIMIT_EXCEEDED: "Límite de solicitudes excedido",
    INVALID_INPUT: "Datos de entrada inválidos",
    FILE_TOO_LARGE: "Archivo excede el tamaño máximo permitido",
    UNSUPPORTED_FILE_TYPE: "Tipo de archivo no soportado",
    ANALYSIS_FAILED: "El análisis falló. Intenta de nuevo",
    SERVICE_UNAVAILABLE: "Servicio temporalmente no disponible",
    INTERNAL_ERROR: "Error interno del servidor",
  },

  // Formato de respuesta estándar
  RESPONSE_FORMAT: {
    success: true,
    data: null,
    error: null,
    message: "",
    timestamp: new Date().toISOString(),
    requestId: "",
    processingTime: 0,
  },
};

// Configuración de monitoreo y métricas
export const MONITORING_CONFIG = {
  // Métricas de rendimiento
  PERFORMANCE: {
    responseTime: {
      enabled: true,
      thresholds: {
        warning: 1000, // 1 segundo
        critical: 5000, // 5 segundos
      },
    },
    throughput: {
      enabled: true,
      windowSize: 60000, // 1 minuto
    },
    errorRate: {
      enabled: true,
      threshold: 0.05, // 5%
    },
  },

  // Métricas de negocio
  BUSINESS: {
    totalAnalyses: {
      enabled: true,
      aggregation: "sum",
    },
    accuracyRate: {
      enabled: true,
      aggregation: "average",
    },
    userSatisfaction: {
      enabled: true,
      aggregation: "average",
    },
  },

  // Alertas
  ALERTS: {
    enabled: true,
    channels: ["email", "slack", "webhook"],
    rules: [
      {
        name: "High Error Rate",
        condition: "errorRate > 0.1",
        severity: "critical",
      },
      {
        name: "Slow Response Time",
        condition: "avgResponseTime > 5000",
        severity: "warning",
      },
      {
        name: "Service Down",
        condition: "healthCheck = false",
        severity: "critical",
      },
    ],
  },
};

// Configuración de cache
export const CACHE_CONFIG = {
  // Configuración de Redis
  REDIS: {
    defaultTTL: 3600, // 1 hora
    maxMemory: "256mb",
    evictionPolicy: "allkeys-lru",
    compression: true,
  },

  // Configuración de cache en memoria
  MEMORY: {
    maxSize: 1000,
    ttl: 300000, // 5 minutos
    checkPeriod: 60000, // 1 minuto
  },

  // Estrategias de cache
  STRATEGIES: {
    ANALYSIS_RESULTS: {
      ttl: 24 * 60 * 60, // 24 horas
      keyPrefix: "analysis:",
      compression: true,
    },
    USER_SESSIONS: {
      ttl: 30 * 60, // 30 minutos
      keyPrefix: "session:",
      compression: false,
    },
    MODEL_CACHE: {
      ttl: 7 * 24 * 60 * 60, // 7 días
      keyPrefix: "model:",
      compression: true,
    },
  },
};

export default {
  BACKEND_CONFIG,
  API_ENDPOINTS,
  MIDDLEWARE_CONFIG,
  VALIDATION_SCHEMAS,
  API_RESPONSES,
  MONITORING_CONFIG,
  CACHE_CONFIG,
};
