import React, { useState } from 'react';
import { type TreeNode } from '../models/TreeNode';
import { type TraversalStep } from '../services/TreeTraversal';
import { ExportManager, type ExportData } from '../utils/export';
import './ExportPanel.css';

interface ExportPanelProps {
  polynomial: string;
  tree: TreeNode;
  evaluation?: {
    xValue: number;
    traversalType: 'pre' | 'in' | 'post';
    steps: TraversalStep[];
    result: number;
  };
}

const ExportPanel: React.FC<ExportPanelProps> = ({ polynomial, tree, evaluation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExportJSON = () => {
    const exportData: ExportData = {
      polynomial,
      tree,
      evaluation,
      timestamp: new Date().toISOString()
    };
    ExportManager.exportAsJSON(exportData);
  };

  const handleExportTreeText = () => {
    ExportManager.exportTreeAsText(tree);
  };

  const handleExportTreeSVG = () => {
    ExportManager.exportTreeAsSVG(tree, polynomial);
  };

  const handleExportStepsCSV = () => {
    if (evaluation) {
      ExportManager.exportStepsAsCSV(evaluation.steps, polynomial, evaluation.xValue);
    }
  };

  return (
    <div className="export-panel">
      <button 
        className="export-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="export-options"
        aria-label={isExpanded ? 'Ocultar opciones de exportación' : 'Mostrar opciones de exportación'}
      >
        <span className="export-icon" aria-hidden="true">📁</span>
        <span>Exportar</span>
        <span className={`arrow ${isExpanded ? 'expanded' : ''}`} aria-hidden="true">▼</span>
      </button>

      {isExpanded && (
        <div id="export-options" className="export-options" role="region" aria-label="Opciones de exportación">
          <div className="export-section">
            <h4>Árbol Binario</h4>
            <div className="export-buttons">
              <button 
                className="export-btn tree-btn"
                onClick={handleExportTreeText}
                aria-label="Exportar árbol como archivo de texto"
              >
                <span className="btn-icon" aria-hidden="true">📄</span>
                Texto (.txt)
              </button>
              <button 
                className="export-btn tree-btn"
                onClick={handleExportTreeSVG}
                aria-label="Exportar árbol como imagen SVG"
              >
                <span className="btn-icon" aria-hidden="true">🖼️</span>
                Imagen (.svg)
              </button>
            </div>
          </div>

          {evaluation && (
            <div className="export-section">
              <h4>Evaluación</h4>
              <div className="export-buttons">
                <button 
                  className="export-btn eval-btn"
                  onClick={handleExportStepsCSV}
                  aria-label="Exportar pasos de evaluación como archivo CSV"
                >
                  <span className="btn-icon" aria-hidden="true">📊</span>
                  Pasos (.csv)
                </button>
              </div>
            </div>
          )}

          <div className="export-section">
            <h4>Datos Completos</h4>
            <div className="export-buttons">
              <button 
                className="export-btn complete-btn"
                onClick={handleExportJSON}
                aria-label="Exportar todos los datos como archivo JSON"
              >
                <span className="btn-icon" aria-hidden="true">💾</span>
                Todo (.json)
              </button>
            </div>
          </div>

          <div className="export-info">
            <small>
              💡 Los archivos se descargarán automáticamente en tu carpeta de descargas
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportPanel;