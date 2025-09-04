/**
 * Servicio de Seguridad y Privacidad
 * Maneja la protección de datos, consentimiento del usuario y cumplimiento legal
 * Versión: 2.0.0
 */

import { SECURITY_CONFIG } from '../config/api.js';

class SecurityService {
  constructor() {
    this.consentGiven = false;
    this.dataRetentionPolicy = SECURITY_CONFIG.DATA_RETENTION_DAYS;
    this.rateLimits = new Map();
    this.initializeSecurity();
  }

  /**
   * Inicializar sistema de seguridad
   */
  initializeSecurity() {
    this.loadConsentStatus();
    this.setupRateLimiting();
    this.initializeDataProtection();
  }

  /**
   * Cargar estado de consentimiento del usuario
   */
  loadConsentStatus() {
    const consent = localStorage.getItem('user_consent');
    this.consentGiven = consent === 'true';
  }

  /**
   * Configurar rate limiting
   */
  setupRateLimiting() {
    const { PER_MINUTE, PER_HOUR, PER_DAY } = SECURITY_CONFIG.RATE_LIMIT;
    
    this.rateLimits.set('minute', {
      limit: PER_MINUTE,
      window: 60 * 1000, // 1 minuto
      requests: []
    });
    
    this.rateLimits.set('hour', {
      limit: PER_HOUR,
      window: 60 * 60 * 1000, // 1 hora
      requests: []
    });
    
    this.rateLimits.set('day', {
      limit: PER_DAY,
      window: 24 * 60 * 60 * 1000, // 1 día
      requests: []
    });
  }

  /**
   * Inicializar protección de datos
   */
  initializeDataProtection() {
    // Configurar limpieza automática de datos
    this.scheduleDataCleanup();
    
    // Configurar monitoreo de privacidad
    this.setupPrivacyMonitoring();
  }

  /**
   * Solicitar consentimiento del usuario
   */
  async requestUserConsent() {
    if (this.consentGiven) {
      return true;
    }

    const consentData = {
      dataCollection: SECURITY_CONFIG.PRIVACY.COLLECT_USER_DATA,
      dataStorage: SECURITY_CONFIG.PRIVACY.STORE_CONTENT,
      dataRetention: this.dataRetentionPolicy,
      anonymization: SECURITY_CONFIG.PRIVACY.ANONYMIZE_RESULTS,
      gdprCompliance: SECURITY_CONFIG.PRIVACY.GDPR_COMPLIANT
    };

    return new Promise((resolve) => {
      // Crear modal de consentimiento
      const modal = this.createConsentModal(consentData, resolve);
      document.body.appendChild(modal);
    });
  }

  /**
   * Crear modal de consentimiento
   */
  createConsentModal(consentData, resolve) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-8 max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            Consentimiento de Privacidad y Uso de Datos
          </h2>
          <p class="text-gray-600 mb-4">
            Antes de continuar, necesitamos tu consentimiento para procesar tu información de manera segura y transparente.
          </p>
        </div>

        <div class="space-y-4 mb-6">
          <div class="border rounded-lg p-4">
            <h3 class="font-semibold text-gray-800 mb-2">¿Qué datos recopilamos?</h3>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• Contenido que analizas (se procesa pero no se almacena permanentemente)</li>
              <li>• Resultados del análisis (anonimizados)</li>
              <li>• Métricas de uso del sistema (sin información personal)</li>
            </ul>
          </div>

          <div class="border rounded-lg p-4">
            <h3 class="font-semibold text-gray-800 mb-2">¿Cómo protegemos tus datos?</h3>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• Encriptación de extremo a extremo</li>
              <li>• Anonimización de resultados</li>
              <li>• Retención limitada a ${this.dataRetentionPolicy} días</li>
              <li>• Cumplimiento con GDPR y leyes de protección de datos</li>
            </ul>
          </div>

          <div class="border rounded-lg p-4">
            <h3 class="font-semibold text-gray-800 mb-2">Tus derechos</h3>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• Acceso a tus datos</li>
              <li>• Rectificación de información incorrecta</li>
              <li>• Eliminación de datos</li>
              <li>• Portabilidad de datos</li>
              <li>• Oposición al procesamiento</li>
            </ul>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <button 
            id="accept-consent"
            class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Aceptar y Continuar
          </button>
          <button 
            id="decline-consent"
            class="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Rechazar
          </button>
        </div>

        <div class="mt-4 text-xs text-gray-500">
          Al continuar, aceptas nuestra 
          <a href="/privacy-policy" class="text-blue-600 hover:underline">Política de Privacidad</a> 
          y 
          <a href="/terms-of-service" class="text-blue-600 hover:underline">Términos de Servicio</a>.
        </div>
      </div>
    `;

    // Agregar event listeners
    modal.querySelector('#accept-consent').addEventListener('click', () => {
      this.giveConsent();
      document.body.removeChild(modal);
      resolve(true);
    });

    modal.querySelector('#decline-consent').addEventListener('click', () => {
      document.body.removeChild(modal);
      resolve(false);
    });

    return modal;
  }

  /**
   * Dar consentimiento
   */
  giveConsent() {
    this.consentGiven = true;
    localStorage.setItem('user_consent', 'true');
    localStorage.setItem('consent_timestamp', new Date().toISOString());
    
    // Registrar evento de consentimiento
    this.logSecurityEvent('consent_given', {
      timestamp: new Date().toISOString(),
      ip: this.getClientIP(),
      userAgent: navigator.userAgent
    });
  }

  /**
   * Verificar rate limiting
   */
  checkRateLimit() {
    const now = Date.now();
    let isLimited = false;

    for (const [period, config] of this.rateLimits) {
      // Limpiar requests antiguos
      config.requests = config.requests.filter(
        timestamp => now - timestamp < config.window
      );

      // Verificar límite
      if (config.requests.length >= config.limit) {
        isLimited = true;
        break;
      }

      // Agregar request actual
      config.requests.push(now);
    }

    if (isLimited) {
      this.logSecurityEvent('rate_limit_exceeded', {
        timestamp: new Date().toISOString(),
        limits: Object.fromEntries(
          Array.from(this.rateLimits.entries()).map(([period, config]) => [
            period,
            { current: config.requests.length, limit: config.limit }
          ])
        )
      });
    }

    return !isLimited;
  }

  /**
   * Anonimizar datos
   */
  anonymizeData(data) {
    if (!SECURITY_CONFIG.PRIVACY.ANONYMIZE_RESULTS) {
      return data;
    }

    const anonymized = { ...data };
    
    // Remover información personal identificable
    delete anonymized.userId;
    delete anonymized.ipAddress;
    delete anonymized.userAgent;
    
    // Anonimizar timestamps (mantener solo fecha, no hora exacta)
    if (anonymized.timestamp) {
      const date = new Date(anonymized.timestamp);
      anonymized.timestamp = date.toISOString().split('T')[0];
    }

    return anonymized;
  }

  /**
   * Limpiar datos expirados
   */
  scheduleDataCleanup() {
    // Ejecutar limpieza cada 24 horas
    setInterval(() => {
      this.cleanupExpiredData();
    }, 24 * 60 * 60 * 1000);
  }

  /**
   * Limpiar datos expirados
   */
  cleanupExpiredData() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.dataRetentionPolicy);

    // Limpiar localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('analysis_')) {
        const data = JSON.parse(localStorage.getItem(key));
        if (data.timestamp && new Date(data.timestamp) < cutoffDate) {
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));

    this.logSecurityEvent('data_cleanup', {
      timestamp: new Date().toISOString(),
      itemsRemoved: keysToRemove.length,
      cutoffDate: cutoffDate.toISOString()
    });
  }

  /**
   * Configurar monitoreo de privacidad
   */
  setupPrivacyMonitoring() {
    // Monitorear cambios en localStorage
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      if (key.includes('personal') || key.includes('sensitive')) {
        console.warn('Intento de almacenar datos sensibles detectado');
      }
      return originalSetItem.apply(this, arguments);
    };
  }

  /**
   * Obtener IP del cliente (aproximada)
   */
  getClientIP() {
    // En un entorno real, esto se obtendría del servidor
    return 'anonymized';
  }

  /**
   * Registrar evento de seguridad
   */
  logSecurityEvent(eventType, data) {
    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      data: this.anonymizeData(data)
    };

    // En desarrollo, log a consola
    if (import.meta.env.MODE === 'development') {
      console.log('Security Event:', event);
    }

    // En producción, enviar a servicio de logging
    if (import.meta.env.MODE === 'production') {
      this.sendSecurityLog(event);
    }
  }

  /**
   * Enviar log de seguridad
   */
  async sendSecurityLog(event) {
    try {
      // Aquí se enviaría a un servicio de logging seguro
      // Por ahora, solo almacenamos localmente
      const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
      logs.push(event);
      
      // Mantener solo los últimos 100 logs
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      localStorage.setItem('security_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Error enviando log de seguridad:', error);
    }
  }

  /**
   * Eliminar todos los datos del usuario
   */
  async deleteUserData() {
    if (!this.consentGiven) {
      throw new Error('Consentimiento no dado');
    }

    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('analysis_') ||
        key.startsWith('user_') ||
        key.startsWith('security_')
      )) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));

    this.logSecurityEvent('user_data_deleted', {
      timestamp: new Date().toISOString(),
      itemsRemoved: keysToRemove.length
    });

    return {
      success: true,
      itemsRemoved: keysToRemove.length,
      message: 'Todos los datos del usuario han sido eliminados'
    };
  }

  /**
   * Exportar datos del usuario
   */
  async exportUserData() {
    if (!this.consentGiven) {
      throw new Error('Consentimiento no dado');
    }

    const userData = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('analysis_') ||
        key.startsWith('user_')
      )) {
        userData[key] = JSON.parse(localStorage.getItem(key));
      }
    }

    this.logSecurityEvent('user_data_exported', {
      timestamp: new Date().toISOString(),
      dataKeys: Object.keys(userData)
    });

    return userData;
  }

  /**
   * Verificar estado de seguridad
   */
  getSecurityStatus() {
    return {
      consentGiven: this.consentGiven,
      dataRetentionDays: this.dataRetentionPolicy,
      rateLimits: Object.fromEntries(
        Array.from(this.rateLimits.entries()).map(([period, config]) => [
          period,
          {
            current: config.requests.length,
            limit: config.limit,
            remaining: config.limit - config.requests.length
          }
        ])
      ),
      privacySettings: SECURITY_CONFIG.PRIVACY,
      lastCleanup: localStorage.getItem('last_cleanup') || 'Nunca'
    };
  }
}

export default new SecurityService();
