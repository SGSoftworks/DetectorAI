# Guía de Despliegue en Vercel - DetectorAI

Esta guía te ayudará a desplegar DetectorAI en Vercel paso a paso.

## 📋 Prerrequisitos

1. **Cuenta en GitHub**: Necesitas tener tu código en un repositorio de GitHub
2. **Cuenta en Vercel**: Regístrate en [vercel.com](https://vercel.com)
3. **APIs configuradas**: Asegúrate de tener todas las claves de API necesarias

## 🚀 Pasos para el Despliegue

### 1. Preparar el Repositorio

```bash
# Asegúrate de que tu código esté en GitHub
git remote add origin https://github.com/tu-usuario/detector-ai.git
git push -u origin master
```

### 2. Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en "New Project"
3. Conecta tu cuenta de GitHub
4. Selecciona el repositorio `detector-ai`
5. Haz clic en "Import"

### 3. Configurar Variables de Entorno

En la página de configuración del proyecto en Vercel:

1. Ve a **Settings** → **Environment Variables**
2. Agrega las siguientes variables:

```
VITE_GEMINI_API_KEY=tu_clave_gemini_aqui
VITE_HUGGING_FACE_API_KEY=tu_token_hugging_face_aqui
VITE_GOOGLE_SEARCH_API_KEY=tu_clave_google_search_aqui
VITE_GOOGLE_SEARCH_ENGINE_ID=tu_engine_id_aqui
VITE_FIREBASE_API_KEY=tu_clave_firebase_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

3. Asegúrate de que estén marcadas para **Production**, **Preview** y **Development**

### 4. Configurar Firebase

#### 4.1 Configurar Firestore

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Firestore Database**
4. Crea una base de datos en modo de producción
5. Ve a **Rules** y pega el contenido de `firebase-rules-production.rules`

#### 4.2 Configurar Storage

1. Ve a **Storage** en Firebase Console
2. Inicia Storage si no está habilitado
3. Configura las reglas de seguridad

### 5. Desplegar

1. En Vercel, haz clic en **Deploy**
2. Espera a que se complete el despliegue
3. Tu aplicación estará disponible en la URL proporcionada

## 🔧 Configuración Adicional

### Dominio Personalizado

1. En Vercel, ve a **Settings** → **Domains**
2. Agrega tu dominio personalizado
3. Configura los registros DNS según las instrucciones

### Configuración de Build

El proyecto ya está configurado con:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Variables de Entorno por Entorno

Puedes configurar variables diferentes para:
- **Production**: Variables para producción
- **Preview**: Variables para preview (pull requests)
- **Development**: Variables para desarrollo local

## 🚨 Solución de Problemas

### Error de Build

Si el build falla:

1. Revisa los logs en Vercel
2. Asegúrate de que todas las variables de entorno estén configuradas
3. Verifica que el proyecto compile localmente: `npm run build`

### Error de APIs

Si las APIs no funcionan:

1. Verifica que las claves estén correctas
2. Asegúrate de que las APIs estén habilitadas
3. Revisa los límites de cuota

### Error de Firebase

Si Firebase no funciona:

1. Verifica la configuración de Firebase
2. Asegúrate de que las reglas estén configuradas
3. Revisa que el proyecto esté en modo de producción

## 📊 Monitoreo

### Analytics de Vercel

Vercel proporciona analytics automáticos:
- Visitas
- Rendimiento
- Errores
- Core Web Vitals

### Logs

Puedes ver los logs en:
- **Functions** → **Logs** (para serverless functions)
- **Deployments** → Selecciona un deployment → **View Function Logs**

## 🔄 Actualizaciones

Para actualizar la aplicación:

1. Haz push de los cambios a GitHub
2. Vercel detectará automáticamente los cambios
3. Creará un nuevo deployment
4. Una vez que pase las pruebas, se desplegará automáticamente

## 🛡️ Seguridad

### Variables de Entorno

- Nunca commitees las variables de entorno
- Usa diferentes claves para desarrollo y producción
- Rota las claves regularmente

### Headers de Seguridad

El proyecto incluye headers de seguridad en `vercel.json`:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy

## 📈 Optimización

### Performance

- El proyecto usa code splitting automático
- Las imágenes se optimizan automáticamente
- CSS y JS se minifican

### SEO

- Meta tags configurados
- Sitemap automático
- Open Graph tags

## 🆘 Soporte

Si tienes problemas:

1. Revisa la [documentación de Vercel](https://vercel.com/docs)
2. Consulta los [foros de Vercel](https://github.com/vercel/vercel/discussions)
3. Contacta al equipo de desarrollo

## 📝 Checklist de Despliegue

- [ ] Código en GitHub
- [ ] Variables de entorno configuradas
- [ ] Firebase configurado
- [ ] Build exitoso localmente
- [ ] Deployment exitoso en Vercel
- [ ] Aplicación funcionando correctamente
- [ ] APIs respondiendo
- [ ] Firebase conectado
- [ ] Dominio configurado (opcional)
- [ ] Analytics funcionando

---

¡Tu aplicación DetectorAI está lista para producción! 🎉
