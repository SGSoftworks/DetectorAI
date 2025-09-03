# ⚡ Instalación Rápida - Detector de Contenido IA

## 🚀 Instalación en 5 Minutos

### 1. Clonar y Instalar

```bash
git clone https://github.com/tu-usuario/ai-content-detector.git
cd ai-content-detector
npm install
```

### 2. Configurar APIs (Obligatorio)

```bash
# Copiar archivo de ejemplo
cp env.example .env.local

# Editar con tus claves reales
nano .env.local
```

**APIs Requeridas:**

- 🔑 **Google Gemini**: https://makersuite.google.com/app/apikey
- 🔑 **Hugging Face**: https://huggingface.co/settings/tokens
- 🔑 **Google Search**: https://developers.google.com/custom-search/v1/overview

### 3. Ejecutar

```bash
npm run dev
```

¡Listo! Tu aplicación estará en `http://localhost:3000` 🎉

## 📋 Checklist Rápido

- [ ] `npm install` completado
- [ ] `.env.local` configurado con claves reales
- [ ] `npm run dev` ejecutándose
- [ ] Aplicación accesible en localhost:3000
- [ ] Navegación funcionando
- [ ] APIs respondiendo correctamente

## 🚨 Solución Rápida de Problemas

### Error: "Module not found"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "API Key invalid"

```bash
# Verificar archivo .env.local
cat .env.local

# Verificar que las claves no tengan espacios
VITE_GEMINI_API_KEY=tu_clave_sin_espacios
```

### Error: "Port already in use"

```bash
# Cambiar puerto en vite.config.js
server: { port: 3001 }
```

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev          # Inicia servidor

# Construcción
npm run build        # Build para producción
npm run preview      # Previsualizar build

# Linting
npm run lint         # Verificar código

# Limpiar
npm run clean        # Limpiar build
```

## 📱 Pruebas Rápidas

1. **Navegación**: Verifica que todas las páginas carguen
2. **Análisis de Texto**: Pega un texto de prueba
3. **Dashboard**: Verifica estado de APIs
4. **Responsive**: Prueba en móvil

## 🚀 Despliegue Rápido en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Configurar variables de entorno en Vercel Dashboard
```

---

**¿Problemas?** Consulta la documentación completa en `README.md` o `DOCUMENTACION_TECNICA.md`
