import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { 
  AnalysisResult, 
  User, 
  UserAnalytics,
  AnalysisHistory,
  DashboardStats,
  ErrorLog
} from '@/types';

class FirebaseService {
  private collections = {
    analyses: 'analyses',
    users: 'users',
    analysisHistory: 'analysisHistory',
    errorLogs: 'errorLogs',
    systemStats: 'systemStats'
  };

  // Análisis
  async saveAnalysis(analysis: AnalysisResult, userId?: string): Promise<string> {
    try {
      const analysisData = {
        ...analysis,
        userId: userId || 'anonymous',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, this.collections.analyses), analysisData);
      return docRef.id;
    } catch (error) {
      console.error('Error al guardar análisis:', error);
      throw new Error('No se pudo guardar el análisis');
    }
  }

  async getAnalysis(analysisId: string): Promise<AnalysisResult | null> {
    try {
      const docRef = doc(db, this.collections.analyses, analysisId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as AnalysisResult;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener análisis:', error);
      return null;
    }
  }

  async getUserAnalyses(userId: string, limitCount: number = 10): Promise<AnalysisResult[]> {
    try {
      const q = query(
        collection(db, this.collections.analyses),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as AnalysisResult);
    } catch (error) {
      console.error('Error al obtener análisis del usuario:', error);
      return [];
    }
  }

  // Usuarios
  async createUser(user: Omit<User, 'id'>): Promise<string> {
    try {
      const userData = {
        ...user,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, this.collections.users), userData);
      return docRef.id;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw new Error('No se pudo crear el usuario');
    }
  }

  async getUser(userId: string): Promise<User | null> {
    try {
      const docRef = doc(db, this.collections.users, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, this.collections.users, userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw new Error('No se pudo actualizar el usuario');
    }
  }

  async updateUserAnalytics(userId: string, analytics: Partial<UserAnalytics>): Promise<void> {
    try {
      const userRef = doc(db, this.collections.users, userId);
      await updateDoc(userRef, {
        'analytics': analytics,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error al actualizar analytics del usuario:', error);
    }
  }

  // Historial de análisis
  async saveAnalysisHistory(history: Omit<AnalysisHistory, 'id'>): Promise<string> {
    try {
      const historyData = {
        ...history,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, this.collections.analysisHistory), historyData);
      return docRef.id;
    } catch (error) {
      console.error('Error al guardar historial:', error);
      throw new Error('No se pudo guardar el historial');
    }
  }

  async getUserAnalysisHistory(userId: string): Promise<AnalysisHistory[]> {
    try {
      const q = query(
        collection(db, this.collections.analysisHistory),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AnalysisHistory));
    } catch (error) {
      console.error('Error al obtener historial:', error);
      return [];
    }
  }

  // Estadísticas del sistema
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Obtener estadísticas básicas
      const analysesSnapshot = await getDocs(collection(db, this.collections.analyses));
      const totalAnalyses = analysesSnapshot.size;

      // Calcular estadísticas
      let totalConfidence = 0;
      let accurateAnalyses = 0;
      const typeCounts: Record<string, number> = {};

      analysesSnapshot.docs.forEach(doc => {
        const analysis = doc.data() as AnalysisResult;
        totalConfidence += analysis.result.confidence;
        
        // Simular precisión basada en confianza
        if (analysis.result.confidence > 70) {
          accurateAnalyses++;
        }

        typeCounts[analysis.type] = (typeCounts[analysis.type] || 0) + 1;
      });

      const averageConfidence = totalAnalyses > 0 ? totalConfidence / totalAnalyses : 0;
      const accuracyRate = totalAnalyses > 0 ? (accurateAnalyses / totalAnalyses) * 100 : 0;

      // Obtener análisis recientes
      const recentAnalyses = analysesSnapshot.docs
        .slice(0, 5)
        .map(doc => doc.data() as AnalysisResult);

      // Calcular tipos populares
      const popularTypes = Object.entries(typeCounts)
        .map(([type, count]) => ({
          type: type as any,
          count,
          percentage: (count / totalAnalyses) * 100
        }))
        .sort((a, b) => b.count - a.count);

      return {
        totalAnalyses,
        accuracyRate,
        averageConfidence,
        popularTypes,
        recentAnalyses,
        systemHealth: {
          apis: {
            gemini: 'online',
            huggingFace: 'online',
            googleSearch: 'online',
            firebase: 'online'
          },
          performance: {
            averageResponseTime: 0,
            successRate: 0,
            errorRate: 0
          },
          lastUpdated: new Date()
        }
      };
    } catch (error: any) {
      console.warn('Error al obtener estadísticas del dashboard:', error.message);
      // Retornar datos por defecto sin fallar
      return {
        totalAnalyses: 0,
        accuracyRate: 0,
        averageConfidence: 0,
        popularTypes: [],
        recentAnalyses: [],
        systemHealth: {
          apis: {
            gemini: 'offline',
            huggingFace: 'offline',
            googleSearch: 'offline',
            firebase: 'offline'
          },
          performance: {
            averageResponseTime: 0,
            successRate: 0,
            errorRate: 0
          },
          lastUpdated: new Date()
        }
      };
    }
  }

  // Logs de errores
  async logError(error: Omit<ErrorLog, 'id'>): Promise<void> {
    try {
      const errorData = {
        ...error,
        timestamp: serverTimestamp()
      };

      await addDoc(collection(db, this.collections.errorLogs), errorData);
    } catch (logError) {
      console.error('Error al registrar error:', logError);
    }
  }

  // Eliminación de datos (GDPR)
  async deleteUserData(userId: string): Promise<void> {
    try {
      // Eliminar análisis del usuario
      const analysesQuery = query(
        collection(db, this.collections.analyses),
        where('userId', '==', userId)
      );
      const analysesSnapshot = await getDocs(analysesQuery);
      
      const deletePromises = analysesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Eliminar historial del usuario
      const historyQuery = query(
        collection(db, this.collections.analysisHistory),
        where('userId', '==', userId)
      );
      const historySnapshot = await getDocs(historyQuery);
      
      const historyDeletePromises = historySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(historyDeletePromises);

      // Eliminar usuario
      const userRef = doc(db, this.collections.users, userId);
      await deleteDoc(userRef);

    } catch (error) {
      console.error('Error al eliminar datos del usuario:', error);
      throw new Error('No se pudieron eliminar todos los datos del usuario');
    }
  }

  // Análisis anónimos (sin guardar datos personales)
  async saveAnonymousAnalysis(analysis: AnalysisResult): Promise<string> {
    try {
      const analysisData = {
        ...analysis,
        userId: 'anonymous',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, this.collections.analyses), analysisData);
      return docRef.id;
    } catch (error) {
      console.error('Error al guardar análisis anónimo:', error);
      throw new Error('No se pudo guardar el análisis');
    }
  }
}

export const firebaseService = new FirebaseService();
