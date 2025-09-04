# DetectorAI - Sistema de Detección de Contenido Generado por IA

Un sistema avanzado desarrollado para detectar contenido generado por inteligencia artificial en textos, imágenes, videos y documentos.

## 🚀 Características

- **Análisis de Texto**: Detecta si textos fueron generados por IA usando modelos avanzados
- **Análisis de Imagen**: Identifica imágenes generadas por IA o manipuladas digitalmente
- **Análisis de Video**: Detecta deepfakes y contenido generado en videos
- **Análisis de Documento**: Analiza documentos completos con texto e imágenes
- **Dashboard**: Estadísticas y monitoreo del sistema
- **Privacidad**: Políticas estrictas de protección de datos

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **Backend**: Firebase (Firestore, Auth, Storage)
- **APIs**: Google Gemini, Hugging Face, Google Search
- **Deployment**: Vercel
- **Animations**: Framer Motion

## 📋 Requisitos

- Node.js 18+
- npm o yarn
- Cuentas en las APIs requeridas

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/detector-ai.git
cd detector-ai
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus claves de API:
```env
VITE_GEMINI_API_KEY=tu_clave_gemini
VITE_HUGGING_FACE_API_KEY=tu_token_hugging_face
VITE_GOOGLE_SEARCH_API_KEY=tu_clave_google_search
VITE_GOOGLE_SEARCH_ENGINE_ID=tu_engine_id
VITE_FIREBASE_API_KEY=tu_clave_firebase
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

## 🔑 Configuración de APIs

### Google Gemini API
1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Agrega la clave a tu `.env.local`

### Hugging Face API
1. Ve a [Hugging Face Settings](https://huggingface.co/settings/tokens)
2. Crea un nuevo token
3. Agrega el token a tu `.env.local`

### Google Custom Search API
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Habilita la Custom Search API
3. Crea una API key y un Search Engine ID
4. Agrega ambos a tu `.env.local`

### Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita Firestore, Auth y Storage
4. Copia la configuración a tu `.env.local`

## 🚀 Despliegue en Vercel

1. **Conectar con GitHub**
   - Haz push de tu código a GitHub
   - Conecta tu repositorio con Vercel

2. **Configurar variables de entorno en Vercel**
   - Ve a tu proyecto en Vercel
   - Settings → Environment Variables
   - Agrega todas las variables de `.env.local`

3. **Desplegar**
   - Vercel detectará automáticamente el proyecto
   - El despliegue se realizará automáticamente

## 🔒 Configuración de Firebase para Producción

1. **Configurar reglas de Firestore**
```bash
firebase deploy --only firestore:rules
```

2. **Configurar reglas de Storage**
```bash
firebase deploy --only storage
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── pages/              # Páginas de la aplicación
├── services/           # Servicios de API
├── types/              # Definiciones de TypeScript
├── utils/              # Utilidades
├── hooks/              # Custom hooks
├── config/             # Configuraciones
└── assets/             # Recursos estáticos
```

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Ejecutar tests con coverage
npm run test:coverage
```

## 📊 Monitoreo

El sistema incluye:
- Dashboard con estadísticas en tiempo real
- Monitoreo de APIs
- Logs de errores
- Métricas de rendimiento

## 🔐 Seguridad

- Encriptación de datos en tránsito y reposo
- Validación de entrada
- Sanitización de datos
- Headers de seguridad
- Políticas de privacidad estrictas

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **Iván Jair Mendoza Solano** - Desarrollador Principal
- **Juan David Gómez Ruidiaz** - Desarrollador Principal

## 📞 Soporte

Para soporte técnico o preguntas:
- Email: support@detectorai.com
- GitHub Issues: [Crear un issue](https://github.com/tu-usuario/detector-ai/issues)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📈 Roadmap

- [ ] Soporte para más idiomas
- [ ] API REST pública
- [ ] Plugin para navegadores
- [ ] Análisis en tiempo real
- [ ] Machine Learning mejorado
- [ ] Integración con redes sociales

---

Desarrollado con ❤️ para combatir la desinformación
