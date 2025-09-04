import axios from 'axios';
import { API_CONFIG, API_URLS } from '@/config/api';
import type { RelatedContent } from '@/types';

class GoogleSearchService {
  private apiKey: string;
  private searchEngineId: string;

  constructor() {
    this.apiKey = API_CONFIG.GOOGLE_SEARCH_API_KEY;
    this.searchEngineId = API_CONFIG.GOOGLE_SEARCH_ENGINE_ID;
    
    if (!this.apiKey || !this.searchEngineId) {
      console.warn('Google Search API no está configurada completamente');
    }
  }

  async searchRelatedContent(query: string, maxResults: number = 5): Promise<RelatedContent[]> {
    if (!this.apiKey || !this.searchEngineId) {
      console.warn('Google Search API no configurada - saltando búsqueda de contenido relacionado');
      return [];
    }

    try {
      const response = await axios.get(API_URLS.GOOGLE_SEARCH_BASE, {
        params: {
          key: this.apiKey,
          cx: this.searchEngineId,
          q: query,
          num: maxResults,
          safe: 'active',
          lr: 'lang_es', // Búsqueda en español
        },
        timeout: 5000, // Timeout de 5 segundos
      });

      if (response.data.items) {
        return response.data.items.map((item: any) => ({
          title: item.title,
          url: item.link,
          snippet: item.snippet,
          relevance: this.calculateRelevance(query, item.title, item.snippet),
          source: this.extractDomain(item.link),
        }));
      }

      return [];
    } catch (error: any) {
      if (error.response?.status === 429) {
        console.warn('Google Search API: Límite de cuota excedido - saltando búsqueda de contenido relacionado');
      } else if (error.response?.status === 403) {
        console.warn('Google Search API: Acceso denegado - verificar configuración');
      } else {
        console.warn('Google Search API: Error temporal - saltando búsqueda de contenido relacionado');
      }
      return [];
    }
  }

  async searchForFactCheck(query: string): Promise<RelatedContent[]> {
    const factCheckQuery = `${query} fact check verificación`;
    return this.searchRelatedContent(factCheckQuery, 3);
  }

  async searchForSimilarContent(query: string): Promise<RelatedContent[]> {
    const similarQuery = `"${query}" similar contenido`;
    return this.searchRelatedContent(similarQuery, 5);
  }

  private calculateRelevance(query: string, title: string, snippet: string): number {
    const queryWords = query.toLowerCase().split(/\s+/);
    const titleWords = title.toLowerCase().split(/\s+/);
    const snippetWords = snippet.toLowerCase().split(/\s+/);
    
    let relevance = 0;
    
    // Peso para coincidencias en el título
    queryWords.forEach(word => {
      if (titleWords.includes(word)) {
        relevance += 30;
      }
    });
    
    // Peso para coincidencias en el snippet
    queryWords.forEach(word => {
      if (snippetWords.includes(word)) {
        relevance += 10;
      }
    });
    
    // Bonus por coincidencias exactas
    const exactMatch = title.toLowerCase().includes(query.toLowerCase()) || 
                      snippet.toLowerCase().includes(query.toLowerCase());
    if (exactMatch) {
      relevance += 20;
    }
    
    return Math.min(100, relevance);
  }

  private extractDomain(url: string): string {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch (error) {
      return 'fuente desconocida';
    }
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey || !this.searchEngineId) {
      return false;
    }

    try {
      const response = await axios.get(API_URLS.GOOGLE_SEARCH_BASE, {
        params: {
          key: this.apiKey,
          cx: this.searchEngineId,
          q: 'test',
          num: 1,
        },
        timeout: 3000, // Timeout más corto para verificación
      });
      return response.status === 200;
    } catch (error: any) {
      if (error.response?.status === 429) {
        console.warn('Google Search API: Límite de cuota excedido');
      } else if (error.response?.status === 403) {
        console.warn('Google Search API: Acceso denegado');
      } else {
        console.warn('Google Search API: No disponible temporalmente');
      }
      return false;
    }
  }
}

export const googleSearchService = new GoogleSearchService();
