// Configuración específica para el entorno de producción
export const PRODUCTION_CONFIG = {
  // Configuración del servidor de producción
  PROD_SERVER: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    cluster: true,
    workers: process.env.WORKERS || 4,
    maxConnections: 1000,
    timeout: 30000
  },

  // Configuración de optimización
  OPTIMIZATION: {
    enabled: true,
    minify: true,
    compress: true,
    treeShaking: true,
    codeSplitting: true,
    lazyLoading: true,
    preload: true,
    prefetch: true
  },

  // Configuración de cache
  CACHE: {
    enabled: true,
    strategy: 'stale-while-revalidate',
    maxAge: 24 * 60 * 60, // 24 horas
    staleWhileRevalidate: 7 * 24 * 60 * 60, // 7 días
    compression: true,
    etag: true,
    lastModified: true
  },

  // Configuración de CDN
  CDN: {
    enabled: true,
    domain: process.env.CDN_DOMAIN || 'cdn.yourdomain.com',
    ssl: true,
    compression: true,
    cacheControl: 'public, max-age=31536000, immutable',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range'
    }
  },

  // Configuración de compresión
  COMPRESSION: {
    enabled: true,
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    }
  },

  // Configuración de logging en producción
  LOGGING: {
    level: 'warn',
    format: 'json',
    transports: ['file', 'syslog'],
    filename: 'logs/production.log',
    maxSize: '100m',
    maxFiles: '30d',
    compress: true
  },

  // Configuración de monitoreo en producción
  MONITORING: {
    enabled: true,
    metrics: {
      collectionInterval: 30000, // 30 segundos
      retentionPeriod: 30 * 24 * 60 * 60 * 1000 // 30 días
    },
    healthCheck: {
      enabled: true,
      interval: 15000, // 15 segundos
      timeout: 3000 // 3 segundos
    },
    alerting: {
      enabled: true,
      channels: ['email', 'slack', 'pagerduty'],
      thresholds: {
        errorRate: 0.05, // 5%
        responseTime: 2000, // 2 segundos
        memoryUsage: 0.8, // 80%
        cpuUsage: 0.8 // 80%
      }
    }
  },

  // Configuración de seguridad en producción
  SECURITY: {
    strictMode: true,
    validateInputs: true,
    sanitizeData: true,
    rateLimit: true,
    cors: true,
    helmet: true,
    csrf: true,
    xss: true,
    sqlInjection: true,
    allowUnsafeEval: false,
    allowUnsafeInline: false
  },

  // Configuración de SSL/TLS
  SSL: {
    enabled: true,
    redirect: true,
    hsts: true,
    hstsMaxAge: 31536000, // 1 año
    hstsIncludeSubDomains: true,
    hstsPreload: true,
    ocsp: true,
    certbot: true
  },

  // Configuración de base de datos en producción
  DATABASE: {
    connectionPool: {
      min: 5,
      max: 20,
      acquireTimeoutMillis: 30000,
      createTimeoutMillis: 30000,
      destroyTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 200
    },
    ssl: true,
    replication: {
      enabled: true,
      read: process.env.DB_READ_URL,
      write: process.env.DB_WRITE_URL
    },
    backup: {
      enabled: true,
      schedule: '0 2 * * *', // 2 AM diario
      retention: 30 // 30 días
    }
  },

  // Configuración de Redis en producción
  REDIS: {
    cluster: true,
    sentinel: true,
    password: process.env.REDIS_PASSWORD,
    ssl: true,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3
  },

  // Configuración de almacenamiento en producción
  STORAGE: {
    type: 's3', // Cambiar a S3 en producción
    s3: {
      bucket: process.env.S3_BUCKET,
      region: process.env.S3_REGION,
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      encryption: 'AES256',
      lifecycle: {
        enabled: true,
        rules: [
          {
            id: 'archive-old-files',
            status: 'Enabled',
            transitions: [
              {
                days: 90,
                storageClass: 'GLACIER'
              }
            ]
          }
        ]
      }
    }
  },

  // Configuración de análisis en producción
  ANALYSIS: {
    maxConcurrentAnalyses: 50,
    analysisTimeout: 300000, // 5 minutos
    cacheResults: true,
    cacheExpiry: 7 * 24 * 60 * 60 * 1000, // 7 días
    batchProcessing: {
      enabled: true,
      maxBatchSize: 100,
      batchTimeout: 120000 // 2 minutos
    },
    queue: {
      enabled: true,
      type: 'redis',
      concurrency: 10,
      retryAttempts: 3,
      retryDelay: 5000
    }
  },

  // Configuración de entrenamiento en producción
  MODEL_TRAINING: {
    enabled: true,
    maxTrainingJobs: 10,
    trainingTimeout: 7200000, // 2 horas
    gpuAcceleration: process.env.GPU_ACCELERATION === 'true',
    distributed: true,
    modelStorage: {
      type: 's3',
      path: 'models/',
      versioning: true,
      backup: true
    },
    monitoring: {
      enabled: true,
      metrics: ['accuracy', 'loss', 'training_time', 'gpu_usage'],
      alerts: true
    }
  },

  // Configuración de PWA en producción
  PWA: {
    enabled: true,
    workbox: true,
    manifest: true,
    serviceWorker: true,
    offline: true,
    updateNotification: true,
    backgroundSync: true
  },

  // Configuración de internacionalización en producción
  I18N: {
    enabled: true,
    defaultLocale: 'es',
    fallbackLocale: 'en',
    supportedLocales: ['es', 'en', 'fr'],
    debug: false,
    cache: true
  },

  // Configuración de accesibilidad en producción
  ACCESSIBILITY: {
    enabled: true,
    showWarnings: false,
    validateARIA: true,
    validateContrast: true,
    validateKeyboard: true,
    screenReader: true,
    keyboardNavigation: true
  },

  // Configuración de SEO
  SEO: {
    enabled: true,
    sitemap: true,
    robots: true,
    metaTags: true,
    structuredData: true,
    analytics: {
      google: process.env.GOOGLE_ANALYTICS_ID,
      facebook: process.env.FACEBOOK_PIXEL_ID
    }
  },

  // Configuración de backup y recuperación
  BACKUP: {
    enabled: true,
    schedule: '0 1 * * *', // 1 AM diario
    retention: 90, // 90 días
    compression: true,
    encryption: true,
    storage: {
      type: 's3',
      bucket: process.env.BACKUP_BUCKET,
      path: 'backups/'
    },
    monitoring: {
      enabled: true,
      alerts: true
    }
  },

  // Configuración de escalabilidad
  SCALABILITY: {
    autoScaling: true,
    loadBalancer: true,
    healthChecks: true,
    circuitBreaker: true,
    retryPolicy: {
      maxRetries: 3,
      backoff: 'exponential',
      baseDelay: 1000
    }
  }
};

// Funciones de utilidad para producción
export const ProdUtils = {
  // Función para logging estructurado
  log(level, message, data = null, context = {}) {
    if (!PRODUCTION_CONFIG.LOGGING.enabled) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      data,
      context,
      environment: 'production',
      version: process.env.APP_VERSION || '1.0.0'
    };

    // En producción, enviar a sistema de logging centralizado
    if (process.env.LOG_ENDPOINT) {
      fetch(process.env.LOG_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry)
      }).catch(console.error);
    }

    // También escribir a archivo local
    console.log(JSON.stringify(logEntry));
  },

  // Función para métricas de performance
  recordMetric(name, value, tags = {}) {
    if (!PRODUCTION_CONFIG.MONITORING.enabled) return;

    const metric = {
      name,
      value,
      tags: { ...tags, environment: 'production' },
      timestamp: Date.now()
    };

    // Enviar métrica a sistema de monitoreo
    if (process.env.METRICS_ENDPOINT) {
      fetch(process.env.METRICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric)
      }).catch(console.error);
    }
  },

  // Función para health check
  async healthCheck() {
    const checks = {
      database: await this.checkDatabase(),
      redis: await this.checkRedis(),
      storage: await this.checkStorage(),
      externalApis: await this.checkExternalApis()
    };

    const allHealthy = Object.values(checks).every(check => check.status === 'healthy');
    
    return {
      status: allHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks
    };
  },

  // Función para verificar base de datos
  async checkDatabase() {
    try {
      // Implementar verificación real de base de datos
      return { status: 'healthy', responseTime: 50 };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  },

  // Función para verificar Redis
  async checkRedis() {
    try {
      // Implementar verificación real de Redis
      return { status: 'healthy', responseTime: 10 };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  },

  // Función para verificar almacenamiento
  async checkStorage() {
    try {
      // Implementar verificación real de almacenamiento
      return { status: 'healthy', responseTime: 100 };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  },

  // Función para verificar APIs externas
  async checkExternalApis() {
    const apis = [
      { name: 'Google Gemini', url: 'https://generativelanguage.googleapis.com' },
      { name: 'Hugging Face', url: 'https://api-inference.huggingface.co' },
      { name: 'Google Search', url: 'https://www.googleapis.com' }
    ];

    const results = await Promise.allSettled(
      apis.map(api => 
        fetch(api.url, { method: 'HEAD' })
          .then(() => ({ name: api.name, status: 'healthy' }))
          .catch(() => ({ name: api.name, status: 'unhealthy' }))
      )
    );

    return {
      status: results.every(r => r.status === 'fulfilled' && r.value.status === 'healthy') ? 'healthy' : 'degraded',
      apis: results.map(r => r.status === 'fulfilled' ? r.value : { name: 'unknown', status: 'unhealthy' })
    };
  },

  // Función para manejo de errores en producción
  handleError(error, context = {}) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      environment: 'production'
    };

    // Log del error
    this.log('error', error.message, errorInfo);

    // Enviar a sistema de monitoreo de errores
    if (process.env.ERROR_TRACKING_ENDPOINT) {
      fetch(process.env.ERROR_TRACKING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorInfo)
      }).catch(console.error);
    }

    // Retornar respuesta segura para el usuario
    return {
      error: 'Internal Server Error',
      message: 'Ha ocurrido un error interno. Por favor intenta de nuevo más tarde.',
      requestId: context.requestId || 'unknown'
    };
  },

  // Función para validación de datos en producción
  validateData(data, schema) {
    if (!PRODUCTION_CONFIG.SECURITY.validateInputs) {
      return true;
    }

    try {
      // Implementar validación robusta
      for (const [key, rules] of Object.entries(schema)) {
        if (rules.required && !data[key]) {
          throw new Error(`Campo requerido faltante: ${key}`);
        }
        
        if (data[key] && rules.type && typeof data[key] !== rules.type) {
          throw new Error(`Tipo incorrecto para ${key}: esperado ${rules.type}, recibido ${typeof data[key]}`);
        }
        
        if (data[key] && rules.pattern && !rules.pattern.test(data[key])) {
          throw new Error(`Formato inválido para ${key}`);
        }
      }

      return true;
    } catch (error) {
      this.log('warn', 'Validación de datos falló', { data, schema, error: error.message });
      throw error;
    }
  },

  // Función para sanitización de datos en producción
  sanitizeData(data, options = {}) {
    if (!PRODUCTION_CONFIG.SECURITY.sanitizeData) {
      return data;
    }

    const sanitized = { ...data };
    
    for (const [key, value] of Object.entries(sanitized)) {
      if (typeof value === 'string') {
        sanitized[key] = value
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<[^>]*>/g, '')
          .replace(/[<>\"'&]/g, '')
          .replace(/javascript:/gi, '')
          .replace(/vbscript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
      }
    }

    return sanitized;
  }
};

// Configuración de producción para diferentes entornos
export const PROD_ENVIRONMENTS = {
  staging: {
    ...PRODUCTION_CONFIG,
    LOGGING: { ...PRODUCTION_CONFIG.LOGGING, level: 'debug' },
    MONITORING: { ...PRODUCTION_CONFIG.MONITORING, alerting: { enabled: false } }
  },
  
  production: {
    ...PRODUCTION_CONFIG
  },
  
  canary: {
    ...PRODUCTION_CONFIG,
    MONITORING: { 
      ...PRODUCTION_CONFIG.MONITORING, 
      alerting: { 
        ...PRODUCTION_CONFIG.MONITORING.alerting,
        thresholds: {
          errorRate: 0.02, // Más estricto en canary
          responseTime: 1000,
          memoryUsage: 0.7,
          cpuUsage: 0.7
        }
      }
    }
  }
};

export default {
  PRODUCTION_CONFIG,
  ProdUtils,
  PROD_ENVIRONMENTS
};
