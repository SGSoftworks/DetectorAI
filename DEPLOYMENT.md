# Guía de Despliegue - Sistema de Detección de IA

## 🚀 Despliegue en Vercel

### 1. Conectar con GitHub

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en "New Project"
3. Importa el repositorio `SGSoftworks/DetectorAI`
4. Vercel detectará automáticamente que es un proyecto Vite

### 2. Configurar Variables de Entorno

En el dashboard de Vercel, ve a **Settings > Environment Variables** y agrega:

```env
VITE_GEMINI_API_KEY=tu_clave_gemini_aqui
VITE_HUGGING_FACE_API_KEY=tu_token_huggingface_aqui
VITE_GOOGLE_SEARCH_API_KEY=tu_clave_google_search_aqui
VITE_GOOGLE_SEARCH_ENGINE_ID=tu_engine_id_aqui
VITE_FIREBASE_API_KEY=tu_firebase_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id_aqui
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id_aqui
VITE_FIREBASE_APP_ID=tu_firebase_app_id_aqui
```

### 3. Configuración de Build

Vercel detectará automáticamente:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Despliegue Automático

Una vez configurado:
- Cada push a `main` desplegará automáticamente
- Los pull requests crearán preview deployments
- Las variables de entorno se aplicarán automáticamente

## 🔧 Despliegue Manual

### Usando Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar
vercel

# Desplegar a producción
vercel --prod
```

### Usando npm scripts

```bash
# Construir para producción
npm run build

# Vista previa local
npm run preview
```

## 🌐 Configuración de Dominio

### Dominio Personalizado

1. En Vercel Dashboard, ve a **Settings > Domains**
2. Agrega tu dominio personalizado
3. Configura los registros DNS según las instrucciones

### Subdominio de Vercel

El proyecto estará disponible en:
`https://detector-ai-{hash}.vercel.app`

## 📊 Monitoreo y Analytics

### Vercel Analytics

1. Habilita Vercel Analytics en el dashboard
2. Obtén métricas de rendimiento automáticamente
3. Monitorea Core Web Vitals

### Logs de Aplicación

```bash
# Ver logs en tiempo real
vercel logs

# Ver logs de una función específica
vercel logs --function=api/analyze
```

## 🔒 Configuración de Seguridad

### Headers de Seguridad

El archivo `vercel.json` incluye headers de seguridad:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Variables de Entorno Seguras

- Nunca commitees archivos `.env`
- Usa Vercel Environment Variables
- Rota las claves de API regularmente

## 🚨 Troubleshooting

### Error de Build

```bash
# Verificar logs de build
vercel logs --build

# Construir localmente
npm run build
```

### Error de Variables de Entorno

1. Verificar que todas las variables estén configuradas
2. Reiniciar el deployment
3. Verificar el formato de las variables

### Error de CORS

1. Verificar configuración de APIs
2. Confirmar dominios permitidos
3. Revisar headers de respuesta

## 📈 Optimización de Rendimiento

### Code Splitting

El proyecto ya incluye:
- Lazy loading de componentes
- Code splitting automático
- Optimización de bundles

### Caching

- Vercel CDN automático
- Cache de assets estáticos
- Cache de API responses

### Monitoring

```bash
# Ver métricas de rendimiento
vercel analytics

# Ver Core Web Vitals
vercel speed-insights
```

## 🔄 CI/CD Pipeline

### GitHub Actions (Opcional)

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📱 Configuración PWA (Futuro)

Para convertir en PWA:

1. Agregar `vite-plugin-pwa`
2. Configurar manifest.json
3. Agregar service worker
4. Configurar cache strategies

## 🎯 Checklist de Despliegue

- [ ] Variables de entorno configuradas
- [ ] Build exitoso localmente
- [ ] Dominio configurado
- [ ] Analytics habilitado
- [ ] Headers de seguridad configurados
- [ ] Monitoreo de errores configurado
- [ ] Backup de configuración
- [ ] Documentación actualizada

---

**El proyecto está listo para despliegue en Vercel con configuración automática.**
