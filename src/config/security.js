// Configuración de seguridad y validaciones del backend
export const SECURITY_CONFIG = {
  // Configuración de API Keys
  API_KEY_VALIDATION: {
    required: true,
    minLength: 32,
    maxLength: 128,
    pattern: /^[A-Za-z0-9_-]+$/,
    rateLimit: {
      requestsPerMinute: 60,
      requestsPerHour: 1000,
      requestsPerDay: 10000,
    },
  },

  // Configuración de autenticación
  AUTHENTICATION: {
    sessionTimeout: 30 * 60 * 1000, // 30 minutos
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutos
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
  },

  // Configuración de validación de archivos
  FILE_VALIDATION: {
    maxFileSize: {
      text: 10 * 1024 * 1024, // 10MB
      image: 25 * 1024 * 1024, // 25MB
      video: 100 * 1024 * 1024, // 100MB
      document: 50 * 1024 * 1024, // 50MB
    },
    allowedTypes: {
      text: ["text/plain", "text/markdown"],
      image: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/webp",
      ],
      video: [
        "video/mp4",
        "video/avi",
        "video/mov",
        "video/wmv",
        "video/flv",
        "video/webm",
        "video/mkv",
      ],
      document: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "text/markdown",
        "application/rtf",
      ],
    },
    virusScan: true,
    contentValidation: true,
  },

  // Configuración de rate limiting
  RATE_LIMITING: {
    global: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      maxRequests: 1000,
    },
    perIP: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      maxRequests: 100,
    },
    perUser: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      maxRequests: 200,
    },
  },

  // Configuración de CORS
  CORS: {
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://yourdomain.com", "https://www.yourdomain.com"]
        : ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
    credentials: true,
    maxAge: 86400, // 24 horas
  },

  // Configuración de headers de seguridad
  SECURITY_HEADERS: {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:; frame-ancestors 'none';",
  },

  // Configuración de encriptación
  ENCRYPTION: {
    algorithm: "aes-256-gcm",
    keyLength: 32,
    ivLength: 16,
    saltRounds: 12,
  },

  // Configuración de logging
  LOGGING: {
    level: process.env.NODE_ENV === "production" ? "warn" : "debug",
    sensitiveFields: ["password", "apiKey", "token", "secret"],
    logSecurityEvents: true,
    logPerformanceMetrics: true,
  },

  // Configuración de monitoreo
  MONITORING: {
    healthCheck: {
      enabled: true,
      interval: 30000, // 30 segundos
      timeout: 5000, // 5 segundos
    },
    metrics: {
      enabled: true,
      collectionInterval: 60000, // 1 minuto
      retentionPeriod: 7 * 24 * 60 * 60 * 1000, // 7 días
    },
  },
};

// Funciones de validación
export const SecurityValidator = {
  // Validar API Key
  validateAPIKey(apiKey) {
    if (!apiKey) {
      throw new Error("API Key es requerida");
    }

    if (apiKey.length < SECURITY_CONFIG.API_KEY_VALIDATION.minLength) {
      throw new Error(
        `API Key debe tener al menos ${SECURITY_CONFIG.API_KEY_VALIDATION.minLength} caracteres`
      );
    }

    if (apiKey.length > SECURITY_CONFIG.API_KEY_VALIDATION.maxLength) {
      throw new Error(
        `API Key no puede exceder ${SECURITY_CONFIG.API_KEY_VALIDATION.maxLength} caracteres`
      );
    }

    if (!SECURITY_CONFIG.API_KEY_VALIDATION.pattern.test(apiKey)) {
      throw new Error("API Key contiene caracteres no válidos");
    }

    return true;
  },

  // Validar archivo
  validateFile(file, type) {
    if (!file) {
      throw new Error("Archivo es requerido");
    }

    const maxSize = SECURITY_CONFIG.FILE_VALIDATION.maxFileSize[type];
    if (file.size > maxSize) {
      throw new Error(
        `Archivo excede el tamaño máximo de ${maxSize / (1024 * 1024)}MB`
      );
    }

    const allowedTypes = SECURITY_CONFIG.FILE_VALIDATION.allowedTypes[type];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        `Tipo de archivo no permitido. Tipos válidos: ${allowedTypes.join(
          ", "
        )}`
      );
    }

    return true;
  },

  // Validar entrada de texto
  validateTextInput(text, options = {}) {
    const {
      minLength = 10,
      maxLength = 10000,
      allowHTML = false,
      allowScripts = false,
    } = options;

    if (!text || typeof text !== "string") {
      throw new Error("Texto es requerido y debe ser una cadena");
    }

    if (text.length < minLength) {
      throw new Error(`Texto debe tener al menos ${minLength} caracteres`);
    }

    if (text.length > maxLength) {
      throw new Error(`Texto no puede exceder ${maxLength} caracteres`);
    }

    // Detectar posibles ataques XSS
    if (!allowHTML && /<[^>]*>/.test(text)) {
      throw new Error("HTML no está permitido en el texto");
    }

    if (
      !allowScripts &&
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(text)
    ) {
      throw new Error("Scripts no están permitidos");
    }

    // Detectar posibles ataques de inyección
    const injectionPatterns = [
      /javascript:/i,
      /vbscript:/i,
      /onload\s*=/i,
      /onerror\s*=/i,
      /onclick\s*=/i,
    ];

    for (const pattern of injectionPatterns) {
      if (pattern.test(text)) {
        throw new Error("Contenido potencialmente peligroso detectado");
      }
    }

    return true;
  },

  // Validar URL
  validateURL(url) {
    if (!url) {
      throw new Error("URL es requerida");
    }

    try {
      const parsedURL = new URL(url);

      // Verificar protocolo
      if (!["http:", "https:"].includes(parsedURL.protocol)) {
        throw new Error("Solo se permiten URLs HTTP y HTTPS");
      }

      // Verificar dominio
      const domain = parsedURL.hostname;
      if (domain.includes("localhost") || domain.includes("127.0.0.1")) {
        throw new Error("No se permiten URLs locales");
      }

      // Verificar longitud
      if (url.length > 2048) {
        throw new Error("URL excede la longitud máxima permitida");
      }

      return true;
    } catch (error) {
      if (
        error.message.includes("URL es requerida") ||
        error.message.includes("No se permiten URLs locales")
      ) {
        throw error;
      }
      throw new Error("URL no válida");
    }
  },

  // Sanitizar entrada de texto
  sanitizeText(text, options = {}) {
    const {
      removeHTML = true,
      removeScripts = true,
      removeSpecialChars = false,
      maxLength = 10000,
    } = options;

    let sanitized = text;

    // Remover HTML
    if (removeHTML) {
      sanitized = sanitized.replace(/<[^>]*>/g, "");
    }

    // Remover scripts
    if (removeScripts) {
      sanitized = sanitized.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        ""
      );
    }

    // Remover caracteres especiales peligrosos
    sanitized = sanitized.replace(/[<>\"'&]/g, "");

    // Truncar si excede la longitud máxima
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized.trim();
  },

  // Generar token CSRF
  generateCSRFToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  },

  // Validar token CSRF
  validateCSRFToken(token, storedToken) {
    if (!token || !storedToken) {
      return false;
    }

    return token === storedToken;
  },

  // Validar rate limit
  checkRateLimit(identifier, type = "perIP") {
    const config = SECURITY_CONFIG.RATE_LIMITING[type];
    if (!config) {
      return true;
    }

    // Esta es una implementación simplificada
    // En producción, usar Redis o similar para almacenar contadores
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Simular verificación de rate limit
    return true;
  },

  // Log de eventos de seguridad
  logSecurityEvent(event, details = {}) {
    if (!SECURITY_CONFIG.LOGGING.logSecurityEvents) {
      return;
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      level: "security",
    };

    // En producción, enviar a sistema de logging
    console.log("SECURITY EVENT:", logEntry);
  },

  // Validar headers de seguridad
  validateSecurityHeaders(headers) {
    const requiredHeaders = Object.keys(SECURITY_CONFIG.SECURITY_HEADERS);
    const missingHeaders = [];

    for (const header of requiredHeaders) {
      if (!headers[header.toLowerCase()]) {
        missingHeaders.push(header);
      }
    }

    if (missingHeaders.length > 0) {
      throw new Error(
        `Headers de seguridad faltantes: ${missingHeaders.join(", ")}`
      );
    }

    return true;
  },
};

// Middleware de seguridad
export const SecurityMiddleware = {
  // Middleware de validación de API Key
  validateAPIKey(req, res, next) {
    try {
      const apiKey = req.headers["x-api-key"] || req.query.apiKey;
      SecurityValidator.validateAPIKey(apiKey);
      next();
    } catch (error) {
      res.status(401).json({
        error: "API Key inválida",
        message: error.message,
      });
    }
  },

  // Middleware de rate limiting
  rateLimit(req, res, next) {
    const identifier = req.ip || req.connection.remoteAddress;

    if (!SecurityValidator.checkRateLimit(identifier, "perIP")) {
      return res.status(429).json({
        error: "Rate limit excedido",
        message: "Demasiadas solicitudes. Intenta de nuevo más tarde.",
      });
    }

    next();
  },

  // Middleware de validación de archivos
  validateFileUpload(type) {
    return (req, res, next) => {
      try {
        if (!req.file) {
          throw new Error("Archivo no encontrado");
        }

        SecurityValidator.validateFile(req.file, type);
        next();
      } catch (error) {
        res.status(400).json({
          error: "Archivo inválido",
          message: error.message,
        });
      }
    };
  },

  // Middleware de headers de seguridad
  securityHeaders(req, res, next) {
    Object.entries(SECURITY_CONFIG.SECURITY_HEADERS).forEach(
      ([header, value]) => {
        res.set(header, value);
      }
    );
    next();
  },

  // Middleware de CORS
  cors(req, res, next) {
    const origin = req.headers.origin;

    if (SECURITY_CONFIG.CORS.origin.includes(origin)) {
      res.set("Access-Control-Allow-Origin", origin);
    }

    res.set(
      "Access-Control-Allow-Methods",
      SECURITY_CONFIG.CORS.methods.join(", ")
    );
    res.set(
      "Access-Control-Allow-Headers",
      SECURITY_CONFIG.CORS.allowedHeaders.join(", ")
    );
    res.set(
      "Access-Control-Allow-Credentials",
      SECURITY_CONFIG.CORS.credentials
    );
    res.set("Access-Control-Max-Age", SECURITY_CONFIG.CORS.maxAge);

    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  },
};

export default {
  SECURITY_CONFIG,
  SecurityValidator,
  SecurityMiddleware,
};
