# Configuración de Firebase para Producción

## 🔥 **Reglas de Seguridad**

### **Para Desarrollo (Temporal)**

Usa las reglas en `firebase-rules-development.rules`:

```javascript
// Permitir todo temporalmente
allow read, write: if true;
```

### **Para Producción (Recomendado)**

Usa las reglas en `firebase-rules-production.rules`:

```javascript
// Requiere autenticación y validación
allow read, write: if isAuthenticated() &&
                    isValidAnalysis(resource.data) &&
                    request.time < timestamp.date(2025, 12, 31);
```

## 🚀 **Pasos para Configurar Firebase en Producción**

### **1. Actualizar Reglas de Seguridad**

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Ve a **Firestore Database** > **Rules**
4. Reemplaza las reglas actuales con las de `firebase-rules-production.rules`

### **2. Configurar Autenticación**

1. Ve a **Authentication** > **Sign-in method**
2. Habilita **Anonymous** authentication
3. Configura las restricciones de dominio si es necesario

### **3. Configurar Variables de Entorno**

En Vercel, asegúrate de tener estas variables:

```env
VITE_FIREBASE_API_KEY=tu_firebase_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id_aqui
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id_aqui
VITE_FIREBASE_APP_ID=tu_firebase_app_id_aqui
```

### **4. Configurar Índices**

Firebase puede requerir índices para consultas complejas. Si ves errores, ve a **Firestore** > **Indexes** y crea los índices necesarios.

## 🔒 **Características de Seguridad**

### **Reglas de Producción Incluyen:**

1. **Autenticación Requerida**: Solo usuarios autenticados pueden acceder
2. **Validación de Datos**: Estructura de datos validada
3. **Límites de Tiempo**: Datos expiran en 2025
4. **Validación de Rating**: Feedback debe tener rating 1-5
5. **Validación de Logs**: Logs deben tener nivel válido

### **Validaciones Implementadas:**

- ✅ **Timestamp**: Fecha de creación requerida
- ✅ **Estructura**: Campos obligatorios validados
- ✅ **Tipos de Datos**: Tipos correctos para cada campo
- ✅ **Rangos**: Valores dentro de rangos válidos
- ✅ **Expiración**: Datos con fecha de expiración

## 📊 **Monitoreo y Logs**

### **Estructura de Datos:**

```javascript
// Análisis
{
  timestamp: Date,
  createdAt: string,
  // ... datos del análisis
}

// Búsquedas
{
  timestamp: Date,
  createdAt: string,
  // ... resultados de búsqueda
}

// Feedback
{
  timestamp: Date,
  createdAt: string,
  rating: number (1-5),
  // ... comentarios del usuario
}

// Logs del Sistema
{
  timestamp: Date,
  createdAt: string,
  level: 'info' | 'warn' | 'error' | 'debug',
  // ... información del log
}
```

## 🛠️ **Comandos de Firebase CLI**

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar proyecto
firebase init firestore

# Desplegar reglas
firebase deploy --only firestore:rules

# Ver logs
firebase functions:log
```

## ⚠️ **Consideraciones Importantes**

### **Para Desarrollo:**

- Usa reglas de desarrollo temporalmente
- No expongas datos sensibles
- Prueba todas las funcionalidades

### **Para Producción:**

- Usa reglas de producción
- Monitorea el uso y costos
- Configura alertas de seguridad
- Haz backup regular de datos

## 🔍 **Troubleshooting**

### **Error: "Missing or insufficient permissions"**

- Verifica que las reglas estén desplegadas
- Confirma que la autenticación esté habilitada
- Revisa la estructura de datos

### **Error: "Invalid data structure"**

- Verifica que todos los campos requeridos estén presentes
- Confirma que los tipos de datos sean correctos
- Revisa las validaciones en el código

### **Error: "Authentication failed"**

- Verifica que Anonymous auth esté habilitada
- Confirma que las variables de entorno estén configuradas
- Revisa la configuración de Firebase

## 📈 **Métricas y Monitoreo**

### **Firebase Console:**

- **Usage**: Monitorea el uso de Firestore
- **Performance**: Revisa tiempos de respuesta
- **Security**: Verifica intentos de acceso no autorizados

### **Vercel Analytics:**

- **Performance**: Tiempos de carga
- **Errors**: Errores de Firebase
- **Usage**: Uso de la aplicación

---

**¡Firebase está configurado para producción con máxima seguridad!** 🔒
