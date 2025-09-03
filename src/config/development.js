// Configuración específica para el entorno de desarrollo
export const DEVELOPMENT_CONFIG = {
  // Configuración del servidor de desarrollo
  DEV_SERVER: {
    port: 3000,
    host: "localhost",
    hotReload: true,
    openBrowser: true,
    cors: {
      enabled: true,
      origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
      ],
    },
  },

  // Configuración de debugging
  DEBUG: {
    enabled: true,
    level: "debug",
    showPerformanceMetrics: true,
    showNetworkRequests: true,
    showComponentUpdates: true,
    showStateChanges: true,
  },

  // Configuración de hot reload
  HOT_RELOAD: {
    enabled: true,
    watchDirectories: ["src/**/*", "public/**/*"],
    ignorePatterns: ["**/node_modules/**", "**/dist/**", "**/.git/**"],
    reloadDelay: 100,
  },

  // Configuración de mock data
  MOCK_DATA: {
    enabled: true,
    delay: 1000, // Simular latencia de red
    randomize: true,
    errorRate: 0.05, // 5% de probabilidad de error
  },

  // Configuración de logging en desarrollo
  LOGGING: {
    level: "debug",
    showTimestamps: true,
    showLogLevel: true,
    showSourceFile: true,
    showLineNumber: true,
    colors: true,
  },

  // Configuración de herramientas de desarrollo
  DEV_TOOLS: {
    reactDevTools: true,
    reduxDevTools: true,
    performanceMonitor: true,
    networkMonitor: true,
    errorBoundary: true,
  },

  // Configuración de testing
  TESTING: {
    enabled: true,
    watchMode: true,
    coverage: true,
    coverageThreshold: {
      global: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  },

  // Configuración de linting
  LINTING: {
    enabled: true,
    autoFix: true,
    showWarnings: true,
    failOnError: false,
    rules: {
      "no-console": "warn",
      "no-debugger": "warn",
      "no-unused-vars": "warn",
    },
  },

  // Configuración de build
  BUILD: {
    sourceMaps: true,
    minify: false,
    optimize: false,
    analyze: true,
    bundleAnalyzer: true,
  },

  // Configuración de proxy para desarrollo
  PROXY: {
    enabled: true,
    targets: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        logLevel: "debug",
      },
      "/auth": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // Configuración de variables de entorno de desarrollo
  ENV_VARS: {
    NODE_ENV: "development",
    VITE_APP_ENV: "development",
    VITE_DEBUG_MODE: "true",
    VITE_MOCK_API: "true",
    VITE_LOG_LEVEL: "debug",
    VITE_API_BASE_URL: "http://localhost:3001",
    VITE_WS_URL: "ws://localhost:3001",
  },

  // Configuración de performance en desarrollo
  PERFORMANCE: {
    measureRenderTime: true,
    measureNetworkTime: true,
    measureMemoryUsage: true,
    showPerformanceWarnings: true,
    slowRenderThreshold: 16, // ms
    slowNetworkThreshold: 1000, // ms
  },

  // Configuración de seguridad en desarrollo
  SECURITY: {
    strictMode: true,
    validateInputs: true,
    sanitizeData: true,
    showSecurityWarnings: true,
    allowUnsafeEval: true, // Solo en desarrollo
    allowUnsafeInline: true, // Solo en desarrollo
  },

  // Configuración de cache en desarrollo
  CACHE: {
    enabled: false, // Deshabilitar cache en desarrollo
    maxAge: 0,
    etag: false,
    lastModified: false,
  },

  // Configuración de compresión en desarrollo
  COMPRESSION: {
    enabled: false, // Deshabilitar compresión en desarrollo
    level: 0,
    threshold: 0,
  },

  // Configuración de SSL en desarrollo
  SSL: {
    enabled: false,
    key: null,
    cert: null,
    ca: null,
  },

  // Configuración de WebSocket en desarrollo
  WEBSOCKET: {
    enabled: true,
    port: 3001,
    path: "/ws",
    heartbeat: 30000,
    reconnectAttempts: 5,
    reconnectInterval: 1000,
  },

  // Configuración de PWA en desarrollo
  PWA: {
    enabled: false, // Deshabilitar PWA en desarrollo
    workbox: false,
    manifest: false,
    serviceWorker: false,
  },

  // Configuración de internacionalización en desarrollo
  I18N: {
    enabled: true,
    defaultLocale: "es",
    fallbackLocale: "en",
    supportedLocales: ["es", "en", "fr"],
    debug: true,
  },

  // Configuración de accesibilidad en desarrollo
  ACCESSIBILITY: {
    enabled: true,
    showWarnings: true,
    validateARIA: true,
    validateContrast: true,
    validateKeyboard: true,
  },

  // Configuración de responsive en desarrollo
  RESPONSIVE: {
    enabled: true,
    breakpoints: {
      mobile: 768,
      tablet: 1024,
      desktop: 1200,
    },
    showBreakpointIndicator: true,
  },
};

// Funciones de utilidad para desarrollo
export const DevUtils = {
  // Función para simular latencia de red
  simulateNetworkDelay(delay = 1000) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  },

  // Función para simular errores aleatorios
  simulateRandomError(errorRate = 0.05) {
    if (Math.random() < errorRate) {
      throw new Error("Error simulado para desarrollo");
    }
  },

  // Función para generar datos mock
  generateMockData(type, count = 1) {
    const mockGenerators = {
      text: () => `Texto de ejemplo ${Math.random().toString(36).substr(2, 9)}`,
      image: () => `imagen_${Math.random().toString(36).substr(2, 9)}.jpg`,
      video: () => `video_${Math.random().toString(36).substr(2, 9)}.mp4`,
      document: () =>
        `documento_${Math.random().toString(36).substr(2, 9)}.pdf`,
      user: () => ({
        id: Math.floor(Math.random() * 1000),
        name: `Usuario ${Math.floor(Math.random() * 100)}`,
        email: `usuario${Math.floor(Math.random() * 100)}@example.com`,
      }),
    };

    if (count === 1) {
      return mockGenerators[type]();
    }

    return Array.from({ length: count }, () => mockGenerators[type]());
  },

  // Función para logging en desarrollo
  log(level, message, data = null) {
    if (!DEVELOPMENT_CONFIG.LOGGING.enabled) return;

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      data,
      source: "DevUtils",
    };

    if (DEVELOPMENT_CONFIG.LOGGING.colors) {
      const colors = {
        debug: "\x1b[36m", // Cyan
        info: "\x1b[32m", // Green
        warn: "\x1b[33m", // Yellow
        error: "\x1b[31m", // Red
      };

      console.log(
        `${
          colors[level]
        }[${level.toUpperCase()}]\x1b[0m ${timestamp} - ${message}`,
        data || ""
      );
    } else {
      console.log(
        `[${level.toUpperCase()}] ${timestamp} - ${message}`,
        data || ""
      );
    }
  },

  // Función para medir performance
  measurePerformance(name, fn) {
    if (!DEVELOPMENT_CONFIG.PERFORMANCE.measureRenderTime) {
      return fn();
    }

    const start = performance.now();
    const result = fn();
    const end = performance.now();
    const duration = end - start;

    if (duration > DEVELOPMENT_CONFIG.PERFORMANCE.slowRenderThreshold) {
      console.warn(
        `⚠️  Operación lenta detectada: ${name} tomó ${duration.toFixed(2)}ms`
      );
    }

    return result;
  },

  // Función para validar datos en desarrollo
  validateData(data, schema) {
    if (!DEVELOPMENT_CONFIG.SECURITY.validateInputs) {
      return true;
    }

    // Implementación básica de validación
    for (const [key, rules] of Object.entries(schema)) {
      if (rules.required && !data[key]) {
        throw new Error(`Campo requerido faltante: ${key}`);
      }

      if (data[key] && rules.type && typeof data[key] !== rules.type) {
        throw new Error(
          `Tipo incorrecto para ${key}: esperado ${
            rules.type
          }, recibido ${typeof data[key]}`
        );
      }
    }

    return true;
  },

  // Función para sanitizar datos en desarrollo
  sanitizeData(data, options = {}) {
    if (!DEVELOPMENT_CONFIG.SECURITY.sanitizeData) {
      return data;
    }

    const sanitized = { ...data };

    for (const [key, value] of Object.entries(sanitized)) {
      if (typeof value === "string") {
        sanitized[key] = value
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/<[^>]*>/g, "")
          .replace(/[<>\"'&]/g, "");
      }
    }

    return sanitized;
  },
};

// Configuración de desarrollo para diferentes entornos
export const DEV_ENVIRONMENTS = {
  local: {
    ...DEVELOPMENT_CONFIG,
    DEV_SERVER: {
      ...DEVELOPMENT_CONFIG.DEV_SERVER,
      port: 3000,
    },
  },

  docker: {
    ...DEVELOPMENT_CONFIG,
    DEV_SERVER: {
      ...DEVELOPMENT_CONFIG.DEV_SERVER,
      host: "0.0.0.0",
      port: 3000,
    },
  },

  codespace: {
    ...DEVELOPMENT_CONFIG,
    DEV_SERVER: {
      ...DEVELOPMENT_CONFIG.DEV_SERVER,
      host: "0.0.0.0",
      port: 3000,
    },
  },
};

export default {
  DEVELOPMENT_CONFIG,
  DevUtils,
  DEV_ENVIRONMENTS,
};
