# 🚀 Guía de Despliegue en Vercel - Detector de Contenido IA

## 📋 Prerrequisitos

- ✅ Proyecto React configurado y funcionando localmente
- ✅ Cuenta de GitHub con el repositorio del proyecto
- ✅ Cuenta de Vercel (gratuita)
- ✅ APIs configuradas (Gemini, Hugging Face, Google Search)

## 🔧 Preparación del Proyecto

### 1. Verificar Configuración de Build

Asegúrate de que tu `package.json` tenga los scripts correctos:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

### 2. Verificar Configuración de Vite

Tu `vite.config.js` debe estar configurado correctamente:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
```

### 3. Verificar Tailwind CSS

Asegúrate de que `tailwind.config.js` esté configurado:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          /* tu paleta de colores */
        },
        secondary: {
          /* tu paleta secundaria */
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

## 🚀 Despliegue en Vercel

### Opción 1: Despliegue Automático (Recomendado)

#### Paso 1: Conectar Repositorio de GitHub

1. Ve a [vercel.com](https://vercel.com) y inicia sesión
2. Haz clic en **"New Project"**
3. Selecciona tu repositorio de GitHub
4. Haz clic en **"Import"**

#### Paso 2: Configurar el Proyecto

Vercel detectará automáticamente que es un proyecto React con Vite:

- **Framework Preset**: Vite (seleccionado automáticamente)
- **Build Command**: `npm run build` (por defecto)
- **Output Directory**: `dist` (por defecto)
- **Install Command**: `npm install` (por defecto)

#### Paso 3: Configurar Variables de Entorno

**IMPORTANTE**: Antes de hacer clic en "Deploy", configura las variables de entorno:

1. En la sección **"Environment Variables"**, agrega:

```bash
# Google Gemini API
VITE_GEMINI_API_KEY=tu_clave_gemini_aqui

# Hugging Face API
VITE_HUGGING_FACE_API_KEY=tu_clave_huggingface_aqui

# Google Custom Search API
VITE_GOOGLE_SEARCH_API_KEY=tu_clave_google_search_aqui
VITE_GOOGLE_SEARCH_ENGINE_ID=tu_engine_id_aqui

# OpenAI API (opcional)
VITE_OPENAI_API_KEY=tu_clave_openai_aqui
```

2. Haz clic en **"Add"** para cada variable
3. Asegúrate de que estén marcadas para **Production**, **Preview** y **Development**

#### Paso 4: Desplegar

1. Haz clic en **"Deploy"**
2. Espera a que se complete el build (2-5 minutos)
3. ¡Tu aplicación estará disponible en la URL proporcionada!

### Opción 2: Despliegue Manual con Vercel CLI

#### Paso 1: Instalar Vercel CLI

```bash
npm i -g vercel
```

#### Paso 2: Iniciar Sesión

```bash
vercel login
```

#### Paso 3: Desplegar desde el Directorio del Proyecto

```bash
cd tu-proyecto
vercel
```

#### Paso 4: Seguir las Instrucciones

```bash
? Set up and deploy "~/tu-proyecto"? [Y/n] y
? Which scope do you want to deploy to? [tu-usuario]
? Link to existing project? [y/N] n
? What's your project's name? detector-ia
? In which directory is your code located? ./
? Want to override the settings? [y/N] n
```

## ⚙️ Configuración Post-Despliegue

### 1. Configurar Dominio Personalizado (Opcional)

1. Ve al dashboard de Vercel
2. Selecciona tu proyecto
3. Ve a **Settings > Domains**
4. Agrega tu dominio personalizado
5. Sigue las instrucciones para configurar DNS

### 2. Configurar Variables de Entorno Adicionales

Si necesitas agregar más variables después del despliegue:

1. Ve a **Settings > Environment Variables**
2. Agrega las nuevas variables
3. Haz clic en **"Redeploy"** para aplicar los cambios

### 3. Configurar Headers de Seguridad

Crea un archivo `vercel.json` en la raíz de tu proyecto:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

## 🔍 Verificación del Despliegue

### 1. Verificar Funcionalidades

Después del despliegue, verifica que:

- ✅ La página de inicio se carga correctamente
- ✅ La navegación funciona en todas las páginas
- ✅ Los análisis de texto funcionan
- ✅ Los análisis de imagen funcionan
- ✅ El dashboard muestra el estado de las APIs
- ✅ La política de privacidad es accesible

### 2. Verificar Variables de Entorno

En el dashboard de Vercel:

1. Ve a **Settings > Environment Variables**
2. Verifica que todas las variables estén configuradas
3. Asegúrate de que estén marcadas para **Production**

### 3. Verificar Logs

1. Ve a **Functions** en tu proyecto de Vercel
2. Revisa los logs para detectar errores
3. Verifica que las APIs estén respondiendo correctamente

## 🚨 Solución de Problemas Comunes

### Error: "Build Failed"

#### Problema: Dependencias no encontradas

```bash
# Solución: Verificar package.json
npm install
npm run build
```

#### Problema: Error de TypeScript

```bash
# Solución: Verificar que no haya errores de TypeScript
npm run lint
```

### Error: "Environment Variables Not Found"

#### Problema: Variables no configuradas

```bash
# Solución: Verificar en Vercel Dashboard
# Settings > Environment Variables
```

### Error: "API Key Invalid"

#### Problema: Claves de API incorrectas

```bash
# Solución: Verificar las claves en las APIs
# Regenerar si es necesario
```

### Error: "CORS Error"

#### Problema: Configuración de CORS

```javascript
// Solución: Agregar en vercel.json
{
  "functions": {
    "api/*.js": {
      "headers": {
        "Access-Control-Allow-Origin": "*"
      }
    }
  }
}
```

## 📱 Optimizaciones para Producción

### 1. Configurar Cache

Agrega en `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. Configurar Compresión

Vercel comprime automáticamente los archivos, pero puedes optimizar:

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["lucide-react", "react-dropzone"],
        },
      },
    },
  },
});
```

### 3. Configurar PWA (Opcional)

```javascript
// vite.config.js
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
});
```

## 🔄 Actualizaciones y Redeploy

### Despliegue Automático

- Cada push a la rama principal se despliega automáticamente
- Vercel crea previews para cada pull request
- Puedes configurar ramas específicas para producción

### Redeploy Manual

```bash
# Desde la línea de comandos
vercel --prod

# O desde el dashboard de Vercel
# Deployments > Redeploy
```

### Rollback

Si algo sale mal:

1. Ve a **Deployments** en Vercel
2. Selecciona una versión anterior
3. Haz clic en **"Promote to Production"**

## 📊 Monitoreo y Analytics

### 1. Vercel Analytics (Gratuito)

1. Ve a **Settings > Analytics**
2. Habilita Vercel Analytics
3. Obtén métricas de rendimiento automáticamente

### 2. Logs en Tiempo Real

1. Ve a **Functions** en tu proyecto
2. Monitorea los logs en tiempo real
3. Configura alertas para errores

### 3. Métricas de Performance

- **Core Web Vitals**: LCP, FID, CLS
- **Tiempo de respuesta**: TTFB, TTI
- **Tamaño del bundle**: Análisis automático

## 🌐 Configuración de Dominios

### Dominio Personalizado

1. **Comprar dominio** (GoDaddy, Namecheap, etc.)
2. **Configurar DNS**:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
3. **Agregar en Vercel**:
   - Settings > Domains
   - Agregar tu dominio
   - Seguir instrucciones de verificación

### Subdominios

```bash
# Para staging
staging.tudominio.com -> staging branch

# Para desarrollo
dev.tudominio.com -> development branch
```

## 🔐 Seguridad Adicional

### 1. Headers de Seguridad

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
        }
      ]
    }
  ]
}
```

### 2. Rate Limiting

```json
{
  "functions": {
    "api/*.js": {
      "maxDuration": 10
    }
  }
}
```

## 📚 Recursos Adicionales

- [Documentación Oficial de Vercel](https://vercel.com/docs)
- [Guía de Despliegue de React](https://vercel.com/guides/deploying-react-with-vercel)
- [Configuración de Vite](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Optimización de Performance](https://vercel.com/docs/concepts/performance)

## 🎯 Checklist de Despliegue

- [ ] Proyecto funciona localmente (`npm run dev`)
- [ ] Build exitoso (`npm run build`)
- [ ] Variables de entorno configuradas en Vercel
- [ ] Repositorio conectado a Vercel
- [ ] Despliegue exitoso
- [ ] Funcionalidades verificadas
- [ ] Headers de seguridad configurados
- [ ] Dominio personalizado configurado (opcional)
- [ ] Analytics habilitados
- [ ] Monitoreo configurado

---

**¡Tu Detector de Contenido IA está listo para producción en Vercel! 🚀**

_Para soporte técnico, consulta la documentación oficial o crea un issue en el repositorio._
