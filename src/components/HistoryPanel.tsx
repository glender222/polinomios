import React, { useState, useEffect } from 'react';
import { PolynomialHistory, type PolynomialHistoryItem } from '../utils/history';
import './HistoryPanel.css';

interface HistoryPanelProps {
  onSelectPolynomial: (polynomial: string) => void;
  currentPolynomial: string;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ onSelectPolynomial, currentPolynomial }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'recent' | 'favorites'>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [, forceUpdate] = useState({});

  // Cargar historial al montar el componente
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    // Forzar re-render para actualizar la UI
    forceUpdate({});
  };

  const getFilteredItems = (): PolynomialHistoryItem[] => {
    let items = activeTab === 'favorites' 
      ? PolynomialHistory.getFavorites()
      : PolynomialHistory.getRecentHistory();

    if (searchQuery.trim()) {
      items = items.filter(item => 
        item.polynomial.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return items;
  };

  const handleSelectPolynomial = (polynomial: string) => {
    onSelectPolynomial(polynomial);
    setIsExpanded(false);
  };

  const handleToggleFavorite = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      PolynomialHistory.toggleFavorite(id);
      loadHistory();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al cambiar favorito');
    }
  };

  const handleRemoveItem = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm('¿Estás seguro de que quieres eliminar este polinomio del historial?')) {
      PolynomialHistory.removeFromHistory(id);
      loadHistory();
    }
  };

  const handleClearHistory = () => {
    const message = activeTab === 'favorites' 
      ? '¿Estás seguro de que quieres eliminar todos los favoritos?'
      : '¿Estás seguro de que quieres limpiar el historial reciente?';
    
    if (confirm(message)) {
      if (activeTab === 'favorites') {
        const favorites = PolynomialHistory.getFavorites();
        favorites.forEach(item => PolynomialHistory.toggleFavorite(item.id));
      } else {
        PolynomialHistory.clearRecentHistory();
      }
      loadHistory();
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) {
      return 'Hace menos de una hora';
    } else if (diffHours < 24) {
      return `Hace ${Math.floor(diffHours)} hora${Math.floor(diffHours) > 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
      return `Hace ${Math.floor(diffDays)} día${Math.floor(diffDays) > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredItems = getFilteredItems();
  const stats = PolynomialHistory.getStatistics();

  return (
    <div className="history-panel">
      <button 
        className="history-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="history-options"
        aria-label={isExpanded ? 'Ocultar historial' : 'Mostrar historial'}
      >
        <span className="history-icon" aria-hidden="true">📚</span>
        <span>Historial</span>
        <span className="history-badge" aria-label={`${stats.total} elementos en historial`}>
          {stats.total}
        </span>
        <span className={`arrow ${isExpanded ? 'expanded' : ''}`} aria-hidden="true">▼</span>
      </button>

      {isExpanded && (
        <div id="history-options" className="history-options" role="region" aria-label="Historial de polinomios">
          <div className="history-header">
            <div className="history-tabs" role="tablist">
              <button 
                className={`tab-button ${activeTab === 'recent' ? 'active' : ''}`}
                onClick={() => setActiveTab('recent')}
                role="tab"
                aria-selected={activeTab === 'recent'}
                aria-controls="recent-panel"
              >
                Recientes ({PolynomialHistory.getRecentHistory().length})
              </button>
              <button 
                className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
                onClick={() => setActiveTab('favorites')}
                role="tab"
                aria-selected={activeTab === 'favorites'}
                aria-controls="favorites-panel"
              >
                ⭐ Favoritos ({stats.favorites})
              </button>
            </div>

            <div className="history-controls">
              <input
                type="text"
                placeholder="Buscar polinomio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Buscar en historial"
              />
              <button 
                className="clear-button"
                onClick={handleClearHistory}
                title={activeTab === 'favorites' ? 'Limpiar favoritos' : 'Limpiar historial'}
                aria-label={activeTab === 'favorites' ? 'Limpiar favoritos' : 'Limpiar historial'}
              >
                🗑️
              </button>
            </div>
          </div>

          <div 
            className="history-content"
            role="tabpanel"
            id={activeTab === 'recent' ? 'recent-panel' : 'favorites-panel'}
          >
            {filteredItems.length === 0 ? (
              <div className="empty-state">
                {searchQuery ? (
                  <p>No se encontraron polinomios que coincidan con "{searchQuery}"</p>
                ) : activeTab === 'favorites' ? (
                  <p>No tienes favoritos aún. Marca algunos polinomios como favoritos para acceso rápido.</p>
                ) : (
                  <p>No hay historial reciente. Los polinomios que ingreses aparecerán aquí.</p>
                )}
              </div>
            ) : (
              <div className="history-list">
                {filteredItems.map((item) => (
                  <div 
                    key={item.id}
                    className={`history-item ${item.polynomial === currentPolynomial ? 'current' : ''}`}
                    onClick={() => handleSelectPolynomial(item.polynomial)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectPolynomial(item.polynomial);
                      }
                    }}
                    aria-label={`Seleccionar polinomio: ${item.polynomial}`}
                  >
                    <div className="item-main">
                      <div className="polynomial-text" title={item.polynomial}>
                        {item.polynomial}
                      </div>
                      <div className="item-meta">
                        <span className="timestamp">{formatTimestamp(item.timestamp)}</span>
                        {item.lastEvaluation && (
                          <span className="last-eval" title={`Última evaluación: x=${item.lastEvaluation.xValue}, resultado=${item.lastEvaluation.result}`}>
                            x={item.lastEvaluation.xValue} → {item.lastEvaluation.result}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="item-actions">
                      <button
                        className={`favorite-btn ${item.isFavorite ? 'active' : ''}`}
                        onClick={(e) => handleToggleFavorite(item.id, e)}
                        title={item.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                        aria-label={item.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                      >
                        {item.isFavorite ? '⭐' : '☆'}
                      </button>
                      <button
                        className="remove-btn"
                        onClick={(e) => handleRemoveItem(item.id, e)}
                        title="Eliminar del historial"
                        aria-label="Eliminar del historial"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {filteredItems.length > 0 && (
            <div className="history-footer">
              <small>
                Total: {stats.total} polinomios | Favoritos: {stats.favorites}
              </small>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;