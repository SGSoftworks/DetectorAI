// Tipos principales del sistema

export interface AnalysisResult {
  id: string;
  type: ContentType;
  content: string;
  result: {
    isAI: boolean;
    confidence: number;
    probability: {
      ai: number;
      human: number;
    };
    explanation: string;
    methodology: string;
    factors: AnalysisFactor[];
  };
  metadata: {
    timestamp: Date;
    processingTime: number;
    model: string;
    version: string;
  };
  relatedContent?: RelatedContent[];
  userFeedback?: UserFeedback;
}

export interface AnalysisFactor {
  name: string;
  weight: number;
  value: number;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface RelatedContent {
  title: string;
  url: string;
  snippet: string;
  relevance: number;
  source: string;
}

export interface UserFeedback {
  rating: number;
  comment?: string;
  isAccurate: boolean;
  timestamp: Date;
}

export type ContentType = 'text' | 'image' | 'video' | 'document';

export interface TextAnalysisRequest {
  text: string;
  language?: string;
  context?: string;
}

export interface ImageAnalysisRequest {
  file: File;
  description?: string;
}

export interface VideoAnalysisRequest {
  file: File;
  extractFrames?: boolean;
  maxFrames?: number;
}

export interface DocumentAnalysisRequest {
  file: File;
  extractText?: boolean;
  analyzeImages?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  preferences: UserPreferences;
  analytics: UserAnalytics;
}

export interface UserPreferences {
  language: string;
  notifications: boolean;
  dataRetention: number; // días
  privacyLevel: 'basic' | 'enhanced' | 'maximum';
}

export interface UserAnalytics {
  totalAnalyses: number;
  accuracyRating: number;
  lastActive: Date;
  favoriteTypes: ContentType[];
}

export interface SecuritySettings {
  dataEncryption: boolean;
  dataRetention: number;
  anonymizeData: boolean;
  shareAnalytics: boolean;
  deleteOnRequest: boolean;
}

export interface PrivacyPolicy {
  dataCollection: string[];
  dataUsage: string[];
  dataSharing: string[];
  dataRetention: string;
  userRights: string[];
  contactInfo: string;
}

export interface SystemStatus {
  apis: {
    gemini: 'online' | 'offline' | 'limited';
    huggingFace: 'online' | 'offline' | 'limited';
    googleSearch: 'online' | 'offline' | 'limited';
    firebase: 'online' | 'offline' | 'limited';
  };
  performance: {
    averageResponseTime: number;
    successRate: number;
    errorRate: number;
  };
  lastUpdated: Date;
}

export interface ErrorLog {
  id: string;
  timestamp: Date;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  context?: Record<string, any>;
  userId?: string;
}

export interface AnalysisHistory {
  id: string;
  userId: string;
  analyses: AnalysisResult[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalAnalyses: number;
  accuracyRate: number;
  averageConfidence: number;
  popularTypes: Array<{
    type: ContentType;
    count: number;
    percentage: number;
  }>;
  recentAnalyses: AnalysisResult[];
  systemHealth: SystemStatus;
}
