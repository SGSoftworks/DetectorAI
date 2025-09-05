# 📚 Documentación Técnica - DetectorAI

## 📋 Tabla de Contenidos
1. [Información General](#información-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Guía de Instalación](#guía-de-instalación)
4. [Guía de Despliegue](#guía-de-despliegue)
5. [Módulos del Sistema](#módulos-del-sistema)
6. [APIs y Servicios](#apis-y-servicios)
7. [Casos de Prueba](#casos-de-prueba)
8. [Control de Versiones](#control-de-versiones)
9. [Estructura de Archivos](#estructura-de-archivos)
10. [Configuración de Entorno](#configuración-de-entorno)

---

## 📖 Información General

**DetectorAI** es una aplicación web especializada en la detección de contenido generado por inteligencia artificial. Utiliza múltiples APIs y servicios para analizar texto, imágenes, videos y documentos, proporcionando análisis detallados y contenido relacionado.

### 🎯 Características Principales
- **Análisis Multimodal**: Texto, imágenes, videos y documentos
- **Detección de IA**: Utiliza Google Gemini 2.0 Flash para análisis avanzado
- **Contenido Relacionado**: Búsqueda web integrada con Google Custom Search
- **Interfaz Responsiva**: Diseño moderno con TailwindCSS
- **Despliegue en la Nube**: Vercel + Firebase

---

## 🏗️ Arquitectura del Sistema

### Diagrama de Arquitectura
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   APIs          │
│   (React/Vite)  │◄──►│   (Firebase)    │◄──►│   Externas      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌────▼────┐            ┌─────▼─────┐           ┌─────▼─────┐
    │ Tailwind│            │ Firestore │           │  Gemini   │
    │   CSS   │            │    DB     │           │   2.0     │
    └─────────┘            └───────────┘           └───────────┘
                                                           │
                                                    ┌─────▼─────┐
                                                    │  Google   │
                                                    │  Search   │
                                                    └───────────┘
```

### Componentes Principales
- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: TailwindCSS 3.4.x
- **Backend**: Firebase (Firestore + Authentication)
- **APIs**: Google Gemini, Google Custom Search, Hugging Face
- **Despliegue**: Vercel

---

## 🚀 Guía de Instalación

### Prerrequisitos
- Node.js 18+ 
- npm 9+
- Cuenta de Google Cloud Platform
- Cuenta de Firebase
- Cuenta de Vercel

### Instalación Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/SGSoftworks/DetectorAI.git
cd DetectorAI
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env.local
cp env\ ejemplo.txt .env.local
# Editar .env.local con tus API keys
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Construir para producción**
```bash
npm run build
```

---

## 🌐 Guía de Despliegue

### Despliegue en Vercel

1. **Configurar Vercel**
```bash
npm install -g vercel
vercel login
```

2. **Configurar variables de entorno en Vercel**
- `VITE_GEMINI_API_KEY`: Tu API key de Google Gemini
- `VITE_GOOGLE_SEARCH_API_KEY`: Tu API key de Google Custom Search
- `VITE_GOOGLE_SEARCH_ENGINE_ID`: Tu Search Engine ID
- `VITE_FIREBASE_API_KEY`: Tu API key de Firebase
- `VITE_FIREBASE_AUTH_DOMAIN`: Tu dominio de autenticación
- `VITE_FIREBASE_PROJECT_ID`: Tu Project ID de Firebase

3. **Desplegar**
```bash
vercel --prod
```

### Configuración de Firebase

1. **Crear proyecto en Firebase Console**
2. **Habilitar Firestore Database**
3. **Configurar reglas de seguridad** (ver `firebase-rules-production.rules`)
4. **Habilitar Authentication**

---

## 🔧 Módulos del Sistema

### 1. Análisis de Texto (`TextAnalysis.tsx`)
**Propósito**: Analizar contenido textual para detectar generación por IA

**Funcionalidades**:
- Detección de patrones de escritura de IA
- Análisis de estructura y coherencia
- Búsqueda de contenido relacionado
- Explicación detallada del análisis

**APIs utilizadas**:
- Google Gemini 2.0 Flash
- Google Custom Search

### 2. Análisis de Imágenes (`ImageAnalysis.tsx`)
**Propósito**: Analizar imágenes para detectar generación por IA

**Funcionalidades**:
- Detección de artefactos de generación
- Análisis de texturas y patrones
- Búsqueda de imágenes similares
- Verificación de autenticidad

**APIs utilizadas**:
- Google Gemini 2.0 Flash (multimodal)
- Google Custom Search

### 3. Análisis de Videos (`VideoAnalysis.tsx`)
**Propósito**: Analizar videos para detectar generación por IA

**Funcionalidades**:
- Detección de movimientos antinaturales
- Análisis de consistencia temporal
- Búsqueda de videos relacionados
- Verificación de deepfakes

**APIs utilizadas**:
- Google Gemini 2.0 Flash (multimodal)
- Google Custom Search

### 4. Análisis de Documentos (`DocumentAnalysis.tsx`)
**Propósito**: Analizar documentos para detectar generación por IA

**Funcionalidades**:
- Extracción de texto de documentos
- Análisis de estructura y estilo
- Búsqueda de contenido relacionado
- Verificación de plagio

**APIs utilizadas**:
- Google Gemini 2.0 Flash
- Google Custom Search

### 5. Dashboard (`Dashboard.tsx`)
**Propósito**: Panel de control y estadísticas

**Funcionalidades**:
- Estadísticas de uso
- Historial de análisis
- Configuración de usuario
- Reportes de rendimiento

---

## 🔌 APIs y Servicios

### Google Gemini 2.0 Flash
**Uso**: Análisis principal de contenido
**Configuración**: `src/services/geminiService.ts`
**Modelo**: `gemini-2.0-flash`

### Google Custom Search
**Uso**: Búsqueda de contenido relacionado
**Configuración**: `src/services/googleSearchService.ts`
**Límites**: 100 consultas/día (gratuito)

### Firebase
**Uso**: Base de datos y autenticación
**Configuración**: `src/config/firebase.ts`
**Servicios**: Firestore, Authentication

### Hugging Face
**Uso**: Modelos adicionales de IA
**Configuración**: `src/services/huggingFaceService.ts`
**Estado**: Preparado para uso futuro

---

## 🧪 Casos de Prueba

### Caso 1: Análisis de Texto Falso
**Entrada**: "Científicos afirman haber encontrado pruebas de que las nubes no son formaciones naturales..."
**Resultado esperado**: Detección de IA con alta confianza
**Verificación**: ✅ Funciona correctamente

### Caso 2: Análisis de Imagen Real
**Entrada**: Foto de paisaje natural
**Resultado esperado**: Detección de contenido humano
**Verificación**: ✅ Funciona correctamente

### Caso 3: Análisis de Video de IA
**Entrada**: Video generado por IA
**Resultado esperado**: Detección de IA con explicación detallada
**Verificación**: ✅ Funciona correctamente

### Caso 4: Análisis de Documento Word
**Entrada**: Documento .docx
**Resultado esperado**: Extracción de texto y análisis
**Verificación**: ✅ Funciona correctamente

---

## 📊 Control de Versiones

### Versión 0.0.1 - Alpha (Pruebas de Visualización)
**Fecha**: Diciembre 2024
**Cambios**:
- Estructura inicial del proyecto
- Configuración básica de React + Vite
- Diseño inicial de la interfaz
- Integración básica con Firebase

**Código relevante**:
```typescript
// Configuración inicial de Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Configuración básica
};
```

### Versión 0.1.0 - Beta (Corrección de Errores)
**Fecha**: Diciembre 2024
**Cambios**:
- Corrección de errores de TypeScript
- Mejora de la configuración de APIs
- Optimización de rendimiento
- Pruebas finales de funcionalidad

**Mejoras implementadas**:
- Manejo robusto de errores
- Validación de tipos
- Optimización de consultas

### Versión 1.0.0 - Lanzamiento
**Fecha**: Diciembre 2024
**Cambios**:
- Lanzamiento oficial
- Todas las funcionalidades implementadas
- Documentación completa
- Despliegue en producción

**Características principales**:
- Análisis multimodal completo
- Interfaz de usuario pulida
- Integración completa de APIs
- Sistema de búsqueda web

### Versión 1.0.1 - Mejoras Continuas
**Fecha**: Diciembre 2024
**Cambios**:
- Mejora de prompts de Gemini
- Optimización de búsquedas web
- Corrección de errores menores
- Mejora de experiencia de usuario

### Versión 1.1.0 - Análisis Mejorado
**Fecha**: Diciembre 2024
**Cambios**:
- Actualización a Gemini 2.0 Flash
- Mejora de detección de videos de IA
- Implementación de carrusel de contenido
- Mejora de búsqueda de imágenes similares

### Versión 1.2.0 - UI/UX Mejorada
**Fecha**: Diciembre 2024
**Cambios**:
- Reorganización de interfaz en cuadrícula
- Implementación de textos expandibles
- Mejora de navegación del carrusel
- Optimización de layout responsive

### Versión 1.3.0 - Funcionalidades Avanzadas
**Fecha**: Diciembre 2024
**Cambios**:
- Soporte para documentos Word
- Mejora de extracción de texto
- Búsqueda web mejorada
- Deduplicación de resultados

### Versión 1.4.0 - Optimización de Rendimiento
**Fecha**: Diciembre 2024
**Cambios**:
- Búsquedas asíncronas
- Mejora de manejo de errores
- Optimización de consultas
- Mejora de tiempo de respuesta

### Versión 1.5.0 - Estabilidad y Confiabilidad
**Fecha**: Diciembre 2024
**Cambios**:
- Corrección de errores de runtime
- Mejora de validación de datos
- Optimización de memoria
- Mejora de estabilidad general

### Versión 1.5.1 - Correcciones Menores
**Fecha**: Diciembre 2024
**Cambios**:
- Corrección de cálculo de relevancia
- Mejora de navegación del carrusel
- Optimización de búsquedas
- Mejora de experiencia de usuario

### Versión 1.5.2 - Versión Actual
**Fecha**: Diciembre 2024
**Cambios**:
- Restauración completa del carrusel
- Mejora de detección de videos de IA
- Soporte mejorado para documentos
- Optimización final de rendimiento

---

## 📁 Estructura de Archivos

```
DetectorAI/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── ExpandableText.tsx
│   │   ├── Layout.tsx
│   │   └── RelatedContentCarousel.tsx
│   ├── config/              # Configuración
│   │   ├── api.ts
│   │   └── firebase.ts
│   ├── pages/               # Páginas principales
│   │   ├── About.tsx
│   │   ├── Dashboard.tsx
│   │   ├── DocumentAnalysis.tsx
│   │   ├── Home.tsx
│   │   ├── ImageAnalysis.tsx
│   │   ├── Privacy.tsx
│   │   ├── TextAnalysis.tsx
│   │   └── VideoAnalysis.tsx
│   ├── services/            # Servicios de API
│   │   ├── analysisService.ts
│   │   ├── firebaseService.ts
│   │   ├── geminiService.ts
│   │   ├── googleSearchService.ts
│   │   └── huggingFaceService.ts
│   ├── types/               # Definiciones de tipos
│   │   └── index.ts
│   ├── utils/               # Utilidades
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Punto de entrada
│   └── index.css            # Estilos globales
├── firebase-rules-production.rules
├── vercel.json
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## ⚙️ Configuración de Entorno

### Variables de Entorno Requeridas
```bash
# Google Gemini
VITE_GEMINI_API_KEY=tu_api_key_aqui

# Google Custom Search
VITE_GOOGLE_SEARCH_API_KEY=tu_api_key_aqui
VITE_GOOGLE_SEARCH_ENGINE_ID=tu_engine_id_aqui

# Firebase
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_dominio_aqui
VITE_FIREBASE_PROJECT_ID=tu_project_id_aqui
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id_aqui
VITE_FIREBASE_APP_ID=tu_app_id_aqui
VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id_aqui
```

### Configuración de Desarrollo
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar tests
npm run test
```

---

## 📞 Soporte y Contacto

Para soporte técnico o preguntas sobre la implementación:
- **GitHub**: [SGSoftworks/DetectorAI](https://github.com/SGSoftworks/DetectorAI)
- **Documentación**: Ver este archivo y README.md
- **Issues**: Usar el sistema de issues de GitHub

---

**Última actualización**: Diciembre 2024  
**Versión de documentación**: 1.5.2  
**Mantenido por**: SGSoftworks
