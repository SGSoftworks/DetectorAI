import React, { useState, useCallback } from "react";
import {
  Search,
  FileText,
  Image as ImageIcon,
  Video,
  File,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  ExternalLink,
  Shield,
  BarChart3,
  Clock,
  Database
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import contentVerificationService from "../services/contentVerificationService";
import toast from "react-hot-toast";

const ContentVerification = () => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentType, setContentType] = useState("text");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResults, setVerificationResults] = useState(null);
  const [showMethodology, setShowMethodology] = useState(false);
  const [textContent, setTextContent] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedContent(file);
      setVerificationResults(null);
      toast.success("Contenido cargado exitosamente");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"],
      "video/*": [".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm", ".mkv"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
      "text/markdown": [".md"],
      "application/rtf": [".rtf"]
    },
    multiple: false,
  });

  const handleTextVerification = async () => {
    if (!textContent.trim()) {
      toast.error("Por favor ingresa texto para verificar");
      return;
    }

    setIsVerifying(true);
    setVerificationResults(null);

    try {
      const results = await contentVerificationService.verifyTextContent(textContent);
      setVerificationResults(results);
      toast.success("Verificación de texto completada exitosamente");
    } catch (error) {
      console.error("Error en verificación:", error);
      toast.error("Error al verificar el texto. Por favor intenta de nuevo.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFileVerification = async () => {
    if (!selectedContent) {
      toast.error("Por favor selecciona un archivo para verificar");
      return;
    }

    setIsVerifying(true);
    setVerificationResults(null);

    try {
      let results;
      
      if (contentType === "image") {
        results = await contentVerificationService.verifyImageContent(selectedContent);
      } else if (contentType === "video") {
        results = await contentVerificationService.verifyVideoContent(selectedContent);
      } else if (contentType === "document") {
        results = await contentVerificationService.verifyDocumentContent(selectedContent);
      }

      setVerificationResults(results);
      toast.success("Verificación completada exitosamente");
    } catch (error) {
      console.error("Error en verificación:", error);
      toast.error("Error al verificar el contenido. Por favor intenta de nuevo.");
    } finally {
      setIsVerifying(false);
    }
  };

  const getVerificationStatusColor = (status) => {
    switch (status) {
      case 'Verificado': return 'text-green-600';
      case 'Parcialmente Verificado': return 'text-yellow-600';
      case 'No Verificado': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getVerificationStatusIcon = (status) => {
    switch (status) {
      case 'Verificado': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Parcialmente Verificado': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'No Verificado': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'Alto': return 'text-red-600 bg-red-100';
      case 'Medio': return 'text-yellow-600 bg-yellow-100';
      case 'Bajo': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Verificación de Contenido
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Verifica la autenticidad y originalidad de diferentes tipos de contenido
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selección de Tipo de Contenido */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Tipo de Contenido
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setContentType("text")}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    contentType === "text"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <FileText className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">Texto</span>
                </button>
                
                <button
                  onClick={() => setContentType("image")}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    contentType === "image"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">Imagen</span>
                </button>
                
                <button
                  onClick={() => setContentType("video")}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    contentType === "video"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Video className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">Video</span>
                </button>
                
                <button
                  onClick={() => setContentType("document")}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    contentType === "document"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <File className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">Documento</span>
                </button>
              </div>
            </div>

            {/* Entrada de Contenido */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2" />
                {contentType === "text" ? "Ingresar Texto" : "Subir Archivo"}
              </h2>
              
              {contentType === "text" ? (
                <div className="space-y-4">
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Pega aquí el texto que quieres verificar..."
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleTextVerification}
                    disabled={isVerifying || !textContent.trim()}
                    className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isVerifying ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5 mr-2" />
                    )}
                    {isVerifying ? "Verificando..." : "Verificar Texto"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input {...getInputProps()} />
                    {selectedContent ? (
                      <div className="space-y-2">
                        <File className="w-12 h-12 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Archivo seleccionado: <strong>{selectedContent.name}</strong>
                        </p>
                        <p className="text-xs text-gray-500">
                          Tamaño: {(selectedContent.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <File className="w-12 h-12 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Arrastra y suelta un archivo aquí, o haz clic para seleccionar
                        </p>
                        <p className="text-xs text-gray-500">
                          Formatos soportados: {contentType === "image" ? "JPG, PNG, GIF, BMP, WebP" :
                                             contentType === "video" ? "MP4, AVI, MOV, WMV, FLV, WebM, MKV" :
                                             "PDF, DOC, DOCX, TXT, MD, RTF"}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {selectedContent && (
                    <button
                      onClick={handleFileVerification}
                      disabled={isVerifying}
                      className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isVerifying ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <Search className="w-5 h-5 mr-2" />
                      )}
                      {isVerifying ? "Verificando..." : `Verificar ${contentType === "image" ? "Imagen" : contentType === "video" ? "Video" : "Documento"}`}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Metodología */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Metodología de Verificación
                </h2>
                <button
                  onClick={() => setShowMethodology(!showMethodology)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {showMethodology ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              
              {showMethodology && (
                <div className="space-y-4 text-sm text-gray-600">
                  <p>
                    Nuestro sistema de verificación utiliza múltiples capas de análisis para determinar la autenticidad del contenido:
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Análisis de Similitud:</strong> Compara el contenido con fuentes existentes en la web</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Verificación de Fuentes:</strong> Evalúa la credibilidad de las fuentes encontradas</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Detección de Plagio:</strong> Identifica posibles casos de contenido duplicado</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Verificación de Hechos:</strong> Valida declaraciones fácticas contra fuentes confiables</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Resultados de Verificación */}
            {verificationResults && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Resultados de Verificación
                </h2>
                
                {/* Estado Final */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">Estado de Verificación</h3>
                    <div className="flex items-center space-x-2">
                      {getVerificationStatusIcon(verificationResults.finalVerification?.verificationStatus)}
                      <span className={`font-semibold ${getVerificationStatusColor(verificationResults.finalVerification?.verificationStatus)}`}>
                        {verificationResults.finalVerification?.verificationStatus}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {verificationResults.finalVerification?.overallScore || 0}/100
                      </div>
                      <div className="text-sm text-gray-600">Puntuación</div>
                    </div>
                    
                    {verificationResults.similarityAnalysis && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {((1 - verificationResults.similarityAnalysis.averageSimilarity) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Originalidad</div>
                      </div>
                    )}
                    
                    {verificationResults.sourceVerification && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {verificationResults.sourceVerification.credibilityScore.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Credibilidad</div>
                      </div>
                    )}
                    
                    {verificationResults.plagiarismCheck && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {verificationResults.plagiarismCheck.plagiarismScore.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Riesgo Plagio</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pipeline de Verificación */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Proceso de Verificación</h3>
                  <div className="space-y-3">
                    {verificationResults.pipeline.map((step, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{step.name}</div>
                          <div className="text-sm text-gray-600">{step.description}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${
                            step.status === 'Completado' ? 'text-green-600' : 
                            step.status === 'Error' ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {step.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Factores de Riesgo */}
                {verificationResults.finalVerification?.riskFactors?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Factores de Riesgo</h3>
                    <div className="space-y-2">
                      {verificationResults.finalVerification.riskFactors.map((factor, index) => (
                        <div key={index} className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <span className="text-red-800">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recomendaciones */}
                {verificationResults.finalVerification?.recommendations?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recomendaciones</h3>
                    <div className="space-y-2">
                      {verificationResults.finalVerification.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                          <span className="text-blue-800">{recommendation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resumen */}
                {verificationResults.finalVerification?.summary && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Resumen</h3>
                    <p className="text-gray-700">{verificationResults.finalVerification.summary}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Panel Lateral */}
          <div className="space-y-6">
            {/* Estadísticas de Verificación */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Estadísticas de Verificación
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Verificaciones Totales</span>
                  <span className="text-sm font-medium">2,450</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tasa de Éxito</span>
                  <span className="text-sm font-medium text-green-600">94.2%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tiempo Promedio</span>
                  <span className="text-sm font-medium">3.2s</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cache Hit Rate</span>
                  <span className="text-sm font-medium text-blue-600">85%</span>
                </div>
              </div>
            </div>

            {/* Tipos de Contenido Verificados */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Contenido Verificado
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Textos
                  </span>
                  <span className="text-sm font-medium">1,250</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Imágenes
                  </span>
                  <span className="text-sm font-medium">850</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Video className="w-4 h-4 mr-2" />
                    Videos
                  </span>
                  <span className="text-sm font-medium">320</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <File className="w-4 h-4 mr-2" />
                    Documentos
                  </span>
                  <span className="text-sm font-medium">180</span>
                </div>
              </div>
            </div>

            {/* Información de Cache */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Información de Cache
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Entradas en Cache</span>
                  <span className="text-sm font-medium">1,024</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tamaño del Cache</span>
                  <span className="text-sm font-medium">45.2 MB</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tasa de Aciertos</span>
                  <span className="text-sm font-medium text-green-600">85%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tiempo de Vida</span>
                  <span className="text-sm font-medium">24 horas</span>
                </div>
              </div>
            </div>

            {/* Enlaces Útiles */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ExternalLink className="w-5 h-5 mr-2" />
                Enlaces Útiles
              </h2>
              
              <div className="space-y-3">
                <a
                  href="#"
                  className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900">Guía de Verificación</div>
                  <div className="text-xs text-gray-600">Aprende cómo interpretar los resultados</div>
                </a>
                
                <a
                  href="#"
                  className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900">API de Verificación</div>
                  <div className="text-xs text-gray-600">Integra verificación en tu aplicación</div>
                </a>
                
                <a
                  href="#"
                  className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900">Reportar Falso Positivo</div>
                  <div className="text-xs text-gray-600">Ayúdanos a mejorar la precisión</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentVerification;
