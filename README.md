# 🚀 DetectorAI - Sistema de Detección de Contenido Generado por IA

[![React](https://img.shields.io/badge/React-18.0.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.5.0-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Sistema avanzado de detección de contenido generado por Inteligencia Artificial** que analiza textos, imágenes, videos y documentos para determinar si fueron creados por humanos o por IA.

## ✨ Características Principales

- 🔍 **Análisis Multimodal**: Texto, imágenes, videos y documentos
- 🤖 **APIs de Última Generación**: Google Gemini, Hugging Face, Google Search
- 📊 **Dashboard en Tiempo Real**: Monitoreo del sistema y métricas
- 🎯 **Alta Precisión**: Modelos entrenados para máxima exactitud
- 🔒 **Seguridad Total**: Protección de datos y privacidad garantizada
- 📱 **Diseño Responsivo**: Funciona perfectamente en todos los dispositivos
- 🚀 **Despliegue Automático**: Listo para Vercel, Netlify y más

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + Vite + Tailwind CSS
- **APIs**: Google Gemini, Hugging Face, Google Custom Search
- **Estado**: React Hooks + Context API
- **Iconos**: Lucide React (SVG)
- **Despliegue**: Vercel (recomendado)

## 🚀 Instalación Rápida

### Prerrequisitos

- Node.js 16+
- npm o yarn
- Cuentas en las APIs (gratuitas)

### 1. Clonar el repositorio

```bash
git clone https://github.com/SGSoftworks/DetectorAI.git
cd DetectorAI
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp env.example .env.local

# Editar .env.local con tus claves de API
VITE_GEMINI_API_KEY=tu_clave_gemini_aqui
VITE_HUGGING_FACE_API_KEY=tu_token_huggingface_aqui
VITE_GOOGLE_SEARCH_API_KEY=tu_clave_google_search_aqui
VITE_GOOGLE_SEARCH_ENGINE_ID=tu_engine_id_aqui
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🔑 Configuración de APIs

### Google Gemini API (Requerido)

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Agrega la clave a `VITE_GEMINI_API_KEY`

### Hugging Face API (Requerido)

1. Ve a [Hugging Face Settings](https://huggingface.co/settings/tokens)
2. Crea un nuevo token
3. Agrega el token a `VITE_HUGGING_FACE_API_KEY`

### Google Custom Search API (Opcional)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Habilita Custom Search API
3. Crea credenciales de API
4. Configura un motor de búsqueda personalizado
5. Agrega las claves a las variables correspondientes

## 📁 Estructura del Proyecto

```
DetectorAI/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes reutilizables
│   ├── pages/             # Páginas de la aplicación
│   ├── services/          # Servicios de API y lógica de negocio
│   ├── config/            # Configuración de APIs y entorno
│   ├── utils/             # Utilidades y helpers
│   ├── App.jsx            # Componente principal
│   └── main.jsx           # Punto de entrada
├── .env.example           # Ejemplo de variables de entorno
├── vercel.json            # Configuración de Vercel
├── tailwind.config.js     # Configuración de Tailwind CSS
└── package.json           # Dependencias y scripts
```

## 🌐 Despliegue

### Despliegue en Vercel (Recomendado)

1. **Conectar con GitHub**:

   - Ve a [Vercel](https://vercel.com)
   - Conecta tu cuenta de GitHub
   - Importa el repositorio `DetectorAI`

2. **Configurar variables de entorno**:

   - En el dashboard de Vercel, ve a Settings > Environment Variables
   - Agrega todas las variables de `VITE_*`

3. **Despliegue automático**:
   - Cada push a `main` se desplegará automáticamente
   - Vercel detectará que es un proyecto Vite/React

### Despliegue Manual

```bash
# Construir para producción
npm run build

# El resultado estará en la carpeta dist/
```

## 📊 Funcionalidades

### 🔍 Análisis de Texto

- Detección de patrones lingüísticos
- Análisis de sentimientos
- Verificación de contenido con Google Search
- Pipeline de análisis paso a paso

### 🖼️ Análisis de Imágenes

- Detección de deepfakes
- Análisis de metadatos
- Verificación de autenticidad
- Integración con Gemini Vision

### 🎥 Análisis de Video

- Análisis de frames
- Detección de manipulación
- Análisis de audio
- Indicadores de deepfake

### 📄 Análisis de Documentos

- Extracción de texto
- Análisis de estructura
- Verificación de contenido
- Detección de patrones de IA

### 📈 Dashboard

- Estadísticas en tiempo real
- Estado de las APIs
- Historial de análisis
- Métricas de rendimiento

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- [Google Gemini](https://ai.google.dev/) por la API de IA
- [Hugging Face](https://huggingface.co/) por los modelos de NLP
- [Vercel](https://vercel.com/) por la plataforma de despliegue
- [Tailwind CSS](https://tailwindcss.com/) por el framework de CSS

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda:

- 📧 **Email**: [tu-email@ejemplo.com]
- 🐛 **Issues**: [GitHub Issues](https://github.com/SGSoftworks/DetectorAI/issues)
- 📖 **Documentación**: [Wiki del proyecto](https://github.com/SGSoftworks/DetectorAI/wiki)

---

**⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!**

**🔗 [Demo en vivo](https://detector-ai.vercel.app) | [Documentación](https://github.com/SGSoftworks/DetectorAI/wiki)**
