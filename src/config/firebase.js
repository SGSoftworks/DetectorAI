// Firebase Configuration
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Collections
export const COLLECTIONS = {
  ANALYSES: "analyses",
  SEARCH_RESULTS: "search_results",
  SYSTEM_LOGS: "system_logs",
  USER_FEEDBACK: "user_feedback",
};

// Database service
export class DatabaseService {
  // Save analysis result
  static async saveAnalysis(analysisData) {
    try {
      // Limpiar datos para Firebase - eliminar campos undefined
      const cleanedData = this.cleanDataForFirebase(analysisData);
      
      const dataToSave = {
        ...cleanedData,
        timestamp: new Date(),
        createdAt: new Date().toISOString(),
      };
      
      // Validar datos antes de guardar
      this.validateAnalysisData(dataToSave);

      const docRef = await addDoc(collection(db, COLLECTIONS.ANALYSES), dataToSave);
      return docRef.id;
    } catch (error) {
      console.error("Error saving analysis:", error);
      throw error;
    }
  }

  // Limpiar datos para Firebase eliminando campos undefined
  static cleanDataForFirebase(data) {
    if (data === null || data === undefined) {
      return null;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.cleanDataForFirebase(item));
    }

    if (typeof data === "object") {
      const cleaned = {};
      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) {
          cleaned[key] = this.cleanDataForFirebase(value);
        }
      }
      return cleaned;
    }

    return data;
  }

  // Get recent analyses
  static async getRecentAnalyses(limitCount = 10) {
    try {
      const q = query(
        collection(db, COLLECTIONS.ANALYSES),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting recent analyses:", error);
      return [];
    }
  }

  // Save search results
  static async saveSearchResults(searchData) {
    try {
      const cleanedData = this.cleanDataForFirebase(searchData);

      const docRef = await addDoc(collection(db, COLLECTIONS.SEARCH_RESULTS), {
        ...cleanedData,
        timestamp: new Date(),
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error saving search results:", error);
      throw error;
    }
  }

  // Get system logs
  static async getSystemLogs(limitCount = 50) {
    try {
      const q = query(
        collection(db, COLLECTIONS.SYSTEM_LOGS),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting system logs:", error);
      return [];
    }
  }

  // Save user feedback
  static async saveUserFeedback(feedbackData) {
    try {
      const cleanedData = this.cleanDataForFirebase(feedbackData);

      const docRef = await addDoc(collection(db, COLLECTIONS.USER_FEEDBACK), {
        ...cleanedData,
        timestamp: new Date(),
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error saving user feedback:", error);
      throw error;
    }
  }

  // Initialize anonymous auth
  static async initializeAuth() {
    try {
      // Solo intentar autenticación si está habilitada
      if (auth) {
        await signInAnonymously(auth);
        console.log("Anonymous authentication successful");
        return true;
      } else {
        console.log("Auth not configured, continuing without authentication");
        return false;
      }
    } catch (error) {
      console.warn(
        "Error initializing auth (continuing without auth):",
        error.message
      );
      // Continuar sin autenticación para que la app funcione
      return false;
    }
  }

  // Validar datos antes de guardar
  static validateAnalysisData(data) {
    const requiredFields = ['timestamp', 'createdAt'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    return true;
  }

  // Validar datos de búsqueda
  static validateSearchData(data) {
    const requiredFields = ['timestamp', 'createdAt'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    return true;
  }

  // Validar feedback de usuario
  static validateFeedbackData(data) {
    const requiredFields = ['timestamp', 'createdAt', 'rating'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    
    return true;
  }
}

export default DatabaseService;
