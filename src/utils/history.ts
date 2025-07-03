export interface PolynomialHistoryItem {
  id: string;
  polynomial: string;
  timestamp: number;
  isFavorite: boolean;
  lastEvaluation?: {
    xValue: number;
    result: number;
    traversalType: 'pre' | 'in' | 'post';
  };
}

export class PolynomialHistory {
  private static readonly STORAGE_KEY = 'polynomial-history';
  private static readonly MAX_HISTORY_SIZE = 50;
  private static readonly MAX_FAVORITES = 20;

  /**
   * Obtiene todo el historial desde localStorage
   */
  static getHistory(): PolynomialHistoryItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const history: PolynomialHistoryItem[] = JSON.parse(stored);
      // Ordenar por timestamp descendente (más reciente primero)
      return history.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error loading polynomial history:', error);
      return [];
    }
  }

  /**
   * Obtiene solo los favoritos
   */
  static getFavorites(): PolynomialHistoryItem[] {
    return this.getHistory().filter(item => item.isFavorite);
  }

  /**
   * Obtiene el historial reciente (no favoritos)
   */
  static getRecentHistory(): PolynomialHistoryItem[] {
    return this.getHistory()
      .filter(item => !item.isFavorite)
      .slice(0, 20); // Últimos 20 elementos no favoritos
  }

  /**
   * Agrega un polinomio al historial
   */
  static addToHistory(polynomial: string): PolynomialHistoryItem {
    const history = this.getHistory();
    
    // Verificar si ya existe
    const existing = history.find(item => item.polynomial === polynomial);
    if (existing) {
      // Actualizar timestamp y devolver el existente
      existing.timestamp = Date.now();
      this.saveHistory(history);
      return existing;
    }

    // Crear nuevo elemento
    const newItem: PolynomialHistoryItem = {
      id: this.generateId(),
      polynomial,
      timestamp: Date.now(),
      isFavorite: false
    };

    // Agregar al inicio
    history.unshift(newItem);

    // Limpiar historial si excede el límite
    this.cleanupHistory(history);

    this.saveHistory(history);
    return newItem;
  }

  /**
   * Actualiza la última evaluación de un polinomio
   */
  static updateLastEvaluation(
    polynomial: string, 
    xValue: number, 
    result: number, 
    traversalType: 'pre' | 'in' | 'post'
  ): void {
    const history = this.getHistory();
    const item = history.find(h => h.polynomial === polynomial);
    
    if (item) {
      item.lastEvaluation = { xValue, result, traversalType };
      item.timestamp = Date.now();
      this.saveHistory(history);
    }
  }

  /**
   * Alterna el estado de favorito de un polinomio
   */
  static toggleFavorite(id: string): boolean {
    const history = this.getHistory();
    const item = history.find(h => h.id === id);
    
    if (!item) return false;

    if (!item.isFavorite) {
      // Verificar límite de favoritos
      const favoritesCount = history.filter(h => h.isFavorite).length;
      if (favoritesCount >= this.MAX_FAVORITES) {
        throw new Error(`No se pueden tener más de ${this.MAX_FAVORITES} favoritos`);
      }
    }

    item.isFavorite = !item.isFavorite;
    item.timestamp = Date.now();
    
    this.saveHistory(history);
    return item.isFavorite;
  }

  /**
   * Elimina un elemento del historial
   */
  static removeFromHistory(id: string): boolean {
    const history = this.getHistory();
    const index = history.findIndex(h => h.id === id);
    
    if (index === -1) return false;

    history.splice(index, 1);
    this.saveHistory(history);
    return true;
  }

  /**
   * Limpia todo el historial
   */
  static clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Limpia solo el historial no favorito
   */
  static clearRecentHistory(): void {
    const favorites = this.getFavorites();
    this.saveHistory(favorites);
  }

  /**
   * Exporta el historial completo
   */
  static exportHistory(): string {
    const history = this.getHistory();
    return JSON.stringify(history, null, 2);
  }

  /**
   * Importa historial desde JSON
   */
  static importHistory(jsonData: string): { success: boolean; imported: number; errors: number } {
    try {
      const importedData: PolynomialHistoryItem[] = JSON.parse(jsonData);
      const currentHistory = this.getHistory();
      let imported = 0;
      let errors = 0;

      for (const item of importedData) {
        try {
          // Validar estructura del elemento
          if (!this.isValidHistoryItem(item)) {
            errors++;
            continue;
          }

          // Verificar si ya existe
          const exists = currentHistory.some(h => h.polynomial === item.polynomial);
          if (!exists) {
            // Generar nuevo ID para evitar conflictos
            item.id = this.generateId();
            currentHistory.push(item);
            imported++;
          }
        } catch {
          errors++;
        }
      }

      // Limpiar y guardar
      this.cleanupHistory(currentHistory);
      this.saveHistory(currentHistory);

      return { success: true, imported, errors };
    } catch (error) {
      console.error('Error importing history:', error);
      return { success: false, imported: 0, errors: 1 };
    }
  }

  /**
   * Busca en el historial
   */
  static searchHistory(query: string): PolynomialHistoryItem[] {
    const history = this.getHistory();
    const lowerQuery = query.toLowerCase();
    
    return history.filter(item => 
      item.polynomial.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Obtiene estadísticas del historial
   */
  static getStatistics() {
    const history = this.getHistory();
    const favorites = history.filter(h => h.isFavorite);
    const withEvaluations = history.filter(h => h.lastEvaluation);
    
    return {
      total: history.length,
      favorites: favorites.length,
      withEvaluations: withEvaluations.length,
      oldestTimestamp: history.length > 0 ? Math.min(...history.map(h => h.timestamp)) : null,
      newestTimestamp: history.length > 0 ? Math.max(...history.map(h => h.timestamp)) : null
    };
  }

  /**
   * Limpia el historial manteniendo favoritos y elementos recientes
   */
  private static cleanupHistory(history: PolynomialHistoryItem[]): void {
    const favorites = history.filter(h => h.isFavorite);
    const nonFavorites = history.filter(h => !h.isFavorite);
    
    // Mantener solo los elementos más recientes que no son favoritos
    const recentNonFavorites = nonFavorites
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, this.MAX_HISTORY_SIZE - favorites.length);
    
    // Combinar favoritos y recientes
    history.length = 0;
    history.push(...favorites, ...recentNonFavorites);
  }

  /**
   * Guarda el historial en localStorage
   */
  private static saveHistory(history: PolynomialHistoryItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving polynomial history:', error);
    }
  }

  /**
   * Genera un ID único
   */
  private static generateId(): string {
    return `poly_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Valida si un elemento es válido
   */
  private static isValidHistoryItem(item: any): item is PolynomialHistoryItem {
    return (
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      typeof item.polynomial === 'string' &&
      typeof item.timestamp === 'number' &&
      typeof item.isFavorite === 'boolean' &&
      item.polynomial.trim().length > 0
    );
  }
}