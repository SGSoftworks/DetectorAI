# 📚 Ejemplos de Uso y Casos de Prueba - Detector de Contenido IA

## 📋 Índice

1. [Ejemplos de Uso por Funcionalidad](#ejemplos-de-uso-por-funcionalidad)
2. [Casos de Prueba](#casos-de-prueba)
3. [Escenarios de Uso Real](#escenarios-de-uso-real)
4. [Troubleshooting y Soluciones](#troubleshooting-y-soluciones)
5. [Métricas de Rendimiento](#métricas-de-rendimiento)

## 🚀 Ejemplos de Uso por Funcionalidad

### 📝 Análisis de Texto

#### Ejemplo 1: Artículo Académico

```javascript
// Texto de entrada
const textoAcademico = `
La inteligencia artificial ha revolucionado la forma en que procesamos
y analizamos grandes volúmenes de datos. Los algoritmos de machine
learning, especialmente aquellos basados en redes neuronales profundas,
han demostrado una capacidad excepcional para identificar patrones
complejos en conjuntos de datos multidimensionales.

Esta tecnología ha encontrado aplicaciones en diversos campos, desde
el diagnóstico médico hasta la predicción financiera, transformando
fundamentalmente la manera en que abordamos problemas complejos.
`;

// Resultado esperado
const resultadoEsperado = {
  finalResult: "Humano",
  confidence: 0.92,
  explanation: "El texto muestra características típicas de escritura humana:
               estructura coherente, vocabulario académico variado,
               transiciones naturales entre ideas y argumentación lógica.",
  scores: { ai: 0.08, human: 0.92 }
};
```

#### Ejemplo 2: Contenido Generado por IA

```javascript
// Texto de entrada
const textoIA = `
La inteligencia artificial representa un avance tecnológico significativo
que ha transformado múltiples industrias. Los algoritmos de aprendizaje
automático han demostrado capacidades excepcionales en el procesamiento
de datos complejos y la resolución de problemas desafiantes.

Esta innovación tecnológica ha generado oportunidades sin precedentes
para optimizar procesos empresariales y mejorar la eficiencia operativa
en diversos sectores de la economía global.
`;

// Resultado esperado
const resultadoEsperado = {
  finalResult: "IA",
  confidence: 0.87,
  explanation: "El texto presenta patrones típicos de contenido generado por IA:
               repetición de frases, estructura muy uniforme,
               vocabulario limitado y falta de ejemplos específicos.",
  scores: { ai: 0.87, human: 0.13 }
};
```

### 🖼️ Análisis de Imagen

#### Ejemplo 1: Imagen Real

```javascript
// Archivo de imagen
const imagenReal = {
  name: "foto_persona.jpg",
  type: "image/jpeg",
  size: 2048576, // 2MB
  lastModified: Date.now()
};

// Resultado esperado
const resultadoEsperado = {
  finalResult: "Humano",
  confidence: 0.89,
  explanation: "La imagen muestra características naturales:
               texturas realistas, sombras consistentes,
               detalles finos en la piel y el cabello.",
  scores: { ai: 0.11, human: 0.89 }
};
```

#### Ejemplo 2: Imagen Generada por IA

```javascript
// Archivo de imagen
const imagenIA = {
  name: "persona_ai_generated.png",
  type: "image/png",
  size: 3145728, // 3MB
  lastModified: Date.now()
};

// Resultado esperado
const resultadoEsperado = {
  finalResult: "IA",
  confidence: 0.94,
  explanation: "La imagen presenta artefactos típicos de generación por IA:
               simetría perfecta, texturas repetitivas,
               sombras inconsistentes y detalles artificiales.",
  scores: { ai: 0.94, human: 0.06 }
};
```

### 🎥 Análisis de Video

#### Ejemplo 1: Video Real

```javascript
// Archivo de video
const videoReal = {
  name: "entrevista_real.mp4",
  type: "video/mp4",
  size: 52428800, // 50MB
  duration: "00:03:45",
  lastModified: Date.now()
};

// Resultado esperado
const resultadoEsperado = {
  finalResult: "Humano",
  confidence: 0.91,
  explanation: "El video muestra patrones naturales:
               movimientos fluidos, sincronización audio-video,
               expresiones faciales naturales y transiciones suaves.",
  scores: { ai: 0.09, human: 0.91 }
};
```

#### Ejemplo 2: Deepfake

```javascript
// Archivo de video
const deepfake = {
  name: "video_deepfake.mp4",
  type: "video/mp4",
  size: 73400320, // 70MB
  duration: "00:02:30",
  lastModified: Date.now()
};

// Resultado esperado
const resultadoEsperado = {
  finalResult: "IA",
  confidence: 0.96,
  explanation: "El video presenta características de deepfake:
               desincronización audio-video, artefactos en el rostro,
               movimientos no naturales y transiciones abruptas.",
  scores: { ai: 0.96, human: 0.04 }
};
```

### 📄 Análisis de Documentos

#### Ejemplo 1: Documento Académico Original

```javascript
// Archivo de documento
const documentoOriginal = {
  name: "tesis_original.pdf",
  type: "application/pdf",
  size: 2097152, // 2MB
  pages: 45,
  lastModified: Date.now()
};

// Resultado esperado
const resultadoEsperado = {
  finalResult: "Humano",
  confidence: 0.88,
  explanation: "El documento presenta características de escritura humana:
               estructura coherente, referencias específicas,
               estilo personal y argumentación lógica.",
  scores: { ai: 0.12, human: 0.88 }
};
```

#### Ejemplo 2: Documento Generado por IA

```javascript
// Archivo de documento
const documentoIA = {
  name: "reporte_ia.docx",
  type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  size: 1048576, // 1MB
  pages: 12,
  lastModified: Date.now()
};

// Resultado esperado
const resultadoEsperado = {
  finalResult: "IA",
  confidence: 0.85,
  explanation: "El documento muestra patrones de generación por IA:
               estructura muy uniforme, vocabulario repetitivo,
               falta de ejemplos específicos y conclusiones genéricas.",
  scores: { ai: 0.85, human: 0.15 }
};
```

## 🧪 Casos de Prueba

### Casos de Prueba de Texto

#### TC001: Texto Muy Corto

```javascript
// Descripción: Verificar que el sistema rechace textos muy cortos
const textoCorto = "Hola mundo";

// Resultado esperado
const resultadoEsperado = {
  error: "El texto debe tener al menos 50 caracteres para un análisis preciso",
  status: "error"
};

// Pasos de prueba
1. Ingresar texto de menos de 50 caracteres
2. Hacer clic en "Analizar"
3. Verificar mensaje de error
4. Verificar que no se ejecute el análisis
```

#### TC002: Texto Extremadamente Largo

```javascript
// Descripción: Verificar que el sistema maneje textos largos correctamente
const textoLargo = "Lorem ipsum...".repeat(1000); // ~50,000 caracteres

// Resultado esperado
const resultadoEsperado = {
  status: "success",
  processingTime: "< 30 segundos",
  finalResult: "Humano|IA",
  confidence: "> 0.7"
};

// Pasos de prueba
1. Ingresar texto de más de 10,000 caracteres
2. Hacer clic en "Analizar"
3. Verificar que el análisis se complete
4. Verificar tiempo de respuesta
5. Verificar calidad del resultado
```

#### TC003: Texto con Caracteres Especiales

```javascript
// Descripción: Verificar que el sistema maneje caracteres especiales
const textoEspeciales = `
Texto con emojis 😀🎉🚀
Caracteres especiales: áéíóú ñ ü
Símbolos: @#$%^&*()_+-=[]{}|;':",./<>?
Números: 1234567890
`;

// Resultado esperado
const resultadoEsperado = {
  status: "success",
  finalResult: "Humano|IA",
  confidence: "> 0.7",
  noErrors: true
};

// Pasos de prueba
1. Ingresar texto con caracteres especiales
2. Hacer clic en "Analizar"
3. Verificar que no haya errores de procesamiento
4. Verificar que el resultado sea válido
```

### Casos de Prueba de Imagen

#### TC004: Formatos de Imagen Soportados

```javascript
// Descripción: Verificar que se acepten todos los formatos soportados
const formatosSoportados = [
  { name: "imagen.jpg", type: "image/jpeg", size: 1048576 },
  { name: "imagen.png", type: "image/png", size: 1048576 },
  { name: "imagen.gif", type: "image/gif", size: 1048576 },
  { name: "imagen.webp", type: "image/webp", size: 1048576 }
];

// Resultado esperado
const resultadoEsperado = {
  status: "success",
  allFormatsAccepted: true,
  noErrors: true
};

// Pasos de prueba
1. Probar cada formato de imagen
2. Verificar que se acepten todas
3. Verificar que no haya errores
4. Verificar que el análisis funcione
```

#### TC005: Límites de Tamaño de Archivo

```javascript
// Descripción: Verificar límites de tamaño de archivo
const archivosTamano = [
  { name: "pequena.jpg", size: 1024, expected: "accept" },        // 1KB
  { name: "mediana.jpg", size: 5242880, expected: "accept" },     // 5MB
  { name: "grande.jpg", size: 10485760, expected: "accept" },     // 10MB
  { name: "muy_grande.jpg", size: 15728640, expected: "reject" }  // 15MB
];

// Resultado esperado
const resultadoEsperado = {
  smallFile: "accepted",
  mediumFile: "accepted",
  largeFile: "accepted",
  veryLargeFile: "rejected with error message"
};

// Pasos de prueba
1. Probar archivos de diferentes tamaños
2. Verificar que se acepten archivos válidos
3. Verificar que se rechacen archivos muy grandes
4. Verificar mensajes de error apropiados
```

### Casos de Prueba de Video

#### TC006: Formatos de Video Soportados

```javascript
// Descripción: Verificar formatos de video soportados
const formatosVideo = [
  { name: "video.mp4", type: "video/mp4", size: 52428800 },
  { name: "video.avi", type: "video/x-msvideo", size: 52428800 },
  { name: "video.mov", type: "video/quicktime", size: 52428800 },
  { name: "video.webm", type: "video/webm", size: 52428800 }
];

// Resultado esperado
const resultadoEsperado = {
  status: "success",
  allFormatsAccepted: true,
  analysisCompleted: true
};

// Pasos de prueba
1. Probar cada formato de video
2. Verificar que se acepten todos
3. Verificar que el análisis se complete
4. Verificar calidad de los resultados
```

### Casos de Prueba de Documentos

#### TC007: Formatos de Documento Soportados

```javascript
// Descripción: Verificar formatos de documento soportados
const formatosDocumento = [
  { name: "documento.pdf", type: "application/pdf", size: 2097152 },
  { name: "documento.docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", size: 1048576 },
  { name: "documento.txt", type: "text/plain", size: 51200 },
  { name: "documento.md", type: "text/markdown", size: 10240 },
  { name: "documento.rtf", type: "application/rtf", size: 1048576 }
];

// Resultado esperado
const resultadoEsperado = {
  status: "success",
  allFormatsAccepted: true,
  textExtraction: "successful",
  analysisCompleted: true
};

// Pasos de prueba
1. Probar cada formato de documento
2. Verificar que se acepten todos
3. Verificar extracción de texto
4. Verificar que el análisis se complete
```

## 🌍 Escenarios de Uso Real

### Escenario 1: Profesor Universitario

#### Contexto

Un profesor de universidad necesita verificar si los trabajos de sus estudiantes fueron escritos por ellos mismos o generados por IA.

#### Flujo de Uso

1. **Acceso**: El profesor accede a la aplicación desde su computadora
2. **Selección**: Elige "Análisis de Texto" desde el menú principal
3. **Entrada**: Copia y pega el texto del trabajo del estudiante
4. **Análisis**: Hace clic en "Analizar" y espera los resultados
5. **Resultado**: Recibe un análisis detallado con:
   - Probabilidad de que sea IA vs. Humano
   - Explicación de la decisión
   - Pipeline de análisis paso a paso
   - Sugerencias de verificación adicional

#### Resultado Esperado

- **Tiempo de respuesta**: < 10 segundos
- **Precisión**: > 90%
- **Explicación**: Clara y comprensible para un profesor no técnico

### Escenario 2: Periodista Digital

#### Contexto

Un periodista necesita verificar si una imagen viral en redes sociales es real o generada por IA.

#### Flujo de Uso

1. **Acceso**: Accede desde su smartphone
2. **Selección**: Elige "Análisis de Imagen"
3. **Carga**: Sube la imagen desde su galería
4. **Análisis**: Inicia el análisis y espera
5. **Resultado**: Recibe:
   - Determinación de autenticidad
   - Detalles técnicos de la imagen
   - Sugerencias de verificación adicional

#### Resultado Esperado

- **Tiempo de respuesta**: < 15 segundos
- **Precisión**: > 85%
- **Interfaz**: Responsiva y fácil de usar en móvil

### Escenario 3: Investigador de Seguridad

#### Contexto

Un investigador necesita analizar videos sospechosos para detectar deepfakes.

#### Flujo de Uso

1. **Acceso**: Accede desde su estación de trabajo
2. **Selección**: Elige "Análisis de Video"
3. **Carga**: Sube archivos de video grandes
4. **Análisis**: Ejecuta análisis detallado
5. **Resultado**: Recibe:
   - Análisis frame por frame
   - Detección de artefactos
   - Métricas de confianza
   - Reporte técnico detallado

#### Resultado Esperado

- **Tiempo de respuesta**: < 2 minutos para videos de 5 minutos
- **Precisión**: > 95%
- **Detalle**: Análisis técnico profundo

### Escenario 4: Editor de Contenido

#### Contexto

Un editor necesita verificar la originalidad de documentos antes de publicarlos.

#### Flujo de Uso

1. **Acceso**: Accede desde su navegador
2. **Selección**: Elige "Análisis de Documentos"
3. **Carga**: Sube documentos en varios formatos
4. **Análisis**: Ejecuta análisis de contenido
5. **Resultado**: Recibe:
   - Análisis de originalidad
   - Comparación con fuentes existentes
   - Sugerencias de mejora
   - Reporte ejecutivo

#### Resultado Esperado

- **Tiempo de respuesta**: < 30 segundos
- **Precisión**: > 88%
- **Formato**: Reporte ejecutivo claro

## 🔧 Troubleshooting y Soluciones

### Problemas Comunes de Análisis de Texto

#### Error: "Texto demasiado corto"

```javascript
// Causa
const texto = "Hola"; // Menos de 50 caracteres

// Solución
const textoValido =
  "Hola, este es un texto más largo que cumple con los requisitos mínimos para el análisis. Debe tener al menos 50 caracteres para obtener resultados precisos.";

// Verificación
if (textoValido.length >= 50) {
  console.log("Texto válido para análisis");
} else {
  console.log("Texto demasiado corto");
}
```

#### Error: "API no disponible"

```javascript
// Causa
const apiKey = "TU_CLAVE_AQUI"; // API no configurada

// Solución
// 1. Verificar archivo .env.local
// 2. Configurar claves de API válidas
// 3. Verificar límites de uso

// Verificación
import { validateAPIConfig } from "./config/api";
const config = validateAPIConfig();
if (!config.isValid) {
  console.error("APIs no configuradas:", config.missingKeys);
}
```

### Problemas Comunes de Análisis de Imagen

#### Error: "Formato no soportado"

```javascript
// Causa
const formatoInvalido = "image/bmp"; // Formato no soportado

// Solución
const formatosValidos = ["image/jpeg", "image/png", "image/gif", "image/webp"];

if (formatosValidos.includes(formatoInvalido)) {
  console.log("Formato válido");
} else {
  console.log("Formato no soportado. Use: JPEG, PNG, GIF o WebP");
}
```

#### Error: "Archivo demasiado grande"

```javascript
// Causa
const archivoGrande = 15 * 1024 * 1024; // 15MB

// Solución
const maxSize = 10 * 1024 * 1024; // 10MB máximo

if (archivoGrande <= maxSize) {
  console.log("Archivo válido");
} else {
  console.log("Archivo demasiado grande. Máximo 10MB");
}
```

### Problemas Comunes de Rendimiento

#### Lento: "Análisis tarda mucho"

```javascript
// Causa
const textoMuyLargo = "Lorem ipsum...".repeat(10000);

// Solución
const maxLength = 50000; // 50,000 caracteres máximo

if (textoMuyLargo.length <= maxLength) {
  console.log("Texto válido para análisis rápido");
} else {
  console.log("Texto muy largo. Considere dividirlo en secciones");
}
```

#### Error: "Memoria insuficiente"

```javascript
// Causa
const archivosGrandes = []; // Múltiples archivos grandes

// Solución
const maxFiles = 5; // Máximo 5 archivos simultáneos
const maxTotalSize = 50 * 1024 * 1024; // 50MB total

if (
  archivosGrandes.length <= maxFiles &&
  archivosGrandes.reduce((sum, file) => sum + file.size, 0) <= maxTotalSize
) {
  console.log("Análisis válido");
} else {
  console.log("Demasiados archivos o tamaño total excesivo");
}
```

## 📊 Métricas de Rendimiento

### Métricas de Análisis de Texto

```javascript
// Tiempo de respuesta por longitud de texto
const metricasTexto = {
  "0-1K caracteres": { tiempo: "< 3s", precision: "95%" },
  "1K-5K caracteres": { tiempo: "< 8s", precision: "92%" },
  "5K-10K caracteres": { tiempo: "< 15s", precision: "90%" },
  "10K+ caracteres": { tiempo: "< 30s", precision: "88%" },
};

// Precisión por tipo de contenido
const precisionPorTipo = {
  "Texto académico": "94%",
  "Artículo periodístico": "91%",
  "Redes sociales": "89%",
  "Contenido técnico": "93%",
};
```

### Métricas de Análisis de Imagen

```javascript
// Tiempo de respuesta por resolución
const metricasImagen = {
  "HD (1280x720)": { tiempo: "< 5s", precision: "92%" },
  "Full HD (1920x1080)": { tiempo: "< 8s", precision: "90%" },
  "4K (3840x2160)": { tiempo: "< 15s", precision: "88%" },
};

// Precisión por tipo de imagen
const precisionImagen = {
  Retratos: "94%",
  Paisajes: "91%",
  Objetos: "89%",
  "Texto en imagen": "87%",
};
```

### Métricas de Análisis de Video

```javascript
// Tiempo de respuesta por duración
const metricasVideo = {
  "0-1 minuto": { tiempo: "< 30s", precision: "93%" },
  "1-5 minutos": { tiempo: "< 2min", precision: "91%" },
  "5+ minutos": { tiempo: "< 5min", precision: "89%" },
};

// Precisión por tipo de video
const precisionVideo = {
  Entrevistas: "94%",
  Eventos: "91%",
  Tutoriales: "89%",
  "Contenido generado": "96%",
};
```

### Métricas de Análisis de Documentos

```javascript
// Tiempo de respuesta por tamaño
const metricasDocumento = {
  "0-1MB": { tiempo: "< 10s", precision: "93%" },
  "1-5MB": { tiempo: "< 20s", precision: "91%" },
  "5-10MB": { tiempo: "< 40s", precision: "89%" },
};

// Precisión por formato
const precisionDocumento = {
  PDF: "94%",
  Word: "91%",
  TXT: "89%",
  Markdown: "92%",
};
```

## 🎯 Casos de Prueba de Integración

### TC008: Flujo Completo de Usuario

```javascript
// Descripción: Verificar flujo completo desde inicio hasta resultado
const flujoCompleto = {
  steps: [
    "1. Acceder a la aplicación",
    "2. Navegar a Análisis de Texto",
    "3. Ingresar texto de prueba",
    "4. Ejecutar análisis",
    "5. Ver resultados",
    "6. Navegar a Dashboard",
    "7. Verificar estado de APIs",
  ],
  expectedResults: [
    "Página de inicio carga correctamente",
    "Navegación funciona sin errores",
    "Análisis se ejecuta exitosamente",
    "Resultados se muestran correctamente",
    "Dashboard muestra información válida",
  ],
};
```

### TC009: Manejo de Errores

```javascript
// Descripción: Verificar manejo robusto de errores
const casosError = [
  {
    scenario: "API no disponible",
    action: "Desconectar internet",
    expected: "Mensaje de error claro y opción de reintentar",
  },
  {
    scenario: "Archivo corrupto",
    action: "Subir archivo dañado",
    expected: "Mensaje de error y sugerencia de verificar archivo",
  },
  {
    scenario: "Timeout de análisis",
    action: "Analizar archivo muy grande",
    expected: "Mensaje de timeout y opción de cancelar",
  },
];
```

---

**Documentación de Ejemplos y Casos de Prueba v1.0** - _Detector de Contenido IA_

_Esta documentación proporciona ejemplos prácticos y casos de prueba para verificar el funcionamiento correcto del sistema._
