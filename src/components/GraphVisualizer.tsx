import React, { useRef, useEffect, useState } from 'react';
import { type TreeNode } from '../models/TreeNode';
import './GraphVisualizer.css';

interface GraphVisualizerProps {
  tree: TreeNode;
  polynomial: string;
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ tree, polynomial, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [range, setRange] = useState({ min: -10, max: 10 });
  const [showGrid, setShowGrid] = useState(true);
  const [highlightValue, setHighlightValue] = useState<number | null>(null);

  useEffect(() => {
    drawGraph();
  }, [tree, range, showGrid, highlightValue]);

  const evaluatePolynomial = (x: number): number => {
    return evaluateNode(tree, x);
  };

  const evaluateNode = (node: TreeNode | null, x: number): number => {
    if (!node) return 0;

    if (node.type === 'constant') {
      return parseFloat(node.value);
    }
    
    if (node.type === 'variable') {
      return x;
    }
    
    if (node.type === 'operator') {
      const left = evaluateNode(node.left, x);
      const right = evaluateNode(node.right, x);
      
      switch (node.value) {
        case '+': return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/': return right !== 0 ? left / right : Infinity;
        case '^': return Math.pow(left, right);
        default: return 0;
      }
    }
    
    return 0;
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Configurar transformación
    const scaleX = width / (range.max - range.min);
    const scaleY = height / (range.max - range.min);
    const centerX = width / 2;
    const centerY = height / 2;

    // Función para convertir coordenadas del mundo a canvas
    const worldToCanvas = (worldX: number, worldY: number): Point => ({
      x: centerX + worldX * scaleX,
      y: centerY - worldY * scaleY
    });

    // Dibujar grid
    if (showGrid) {
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--light-text') || '#757575';
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.3;

      // Líneas verticales
      for (let x = Math.ceil(range.min); x <= Math.floor(range.max); x++) {
        if (x === 0) continue;
        const canvasPoint = worldToCanvas(x, 0);
        ctx.beginPath();
        ctx.moveTo(canvasPoint.x, 0);
        ctx.lineTo(canvasPoint.x, height);
        ctx.stroke();
      }

      // Líneas horizontales
      for (let y = Math.ceil(range.min); y <= Math.floor(range.max); y++) {
        if (y === 0) continue;
        const canvasPoint = worldToCanvas(0, y);
        ctx.beginPath();
        ctx.moveTo(0, canvasPoint.y);
        ctx.lineTo(width, canvasPoint.y);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    }

    // Dibujar ejes
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#333333';
    ctx.lineWidth = 2;

    // Eje X
    const yAxisPoint = worldToCanvas(0, 0);
    ctx.beginPath();
    ctx.moveTo(0, yAxisPoint.y);
    ctx.lineTo(width, yAxisPoint.y);
    ctx.stroke();

    // Eje Y
    const xAxisPoint = worldToCanvas(0, 0);
    ctx.beginPath();
    ctx.moveTo(xAxisPoint.x, 0);
    ctx.lineTo(xAxisPoint.x, height);
    ctx.stroke();

    // Etiquetas de los ejes
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#333333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Números en el eje X
    for (let x = Math.ceil(range.min); x <= Math.floor(range.max); x++) {
      if (x === 0) continue;
      const point = worldToCanvas(x, 0);
      ctx.fillText(x.toString(), point.x, point.y + 5);
    }

    // Números en el eje Y
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let y = Math.ceil(range.min); y <= Math.floor(range.max); y++) {
      if (y === 0) continue;
      const point = worldToCanvas(0, y);
      ctx.fillText(y.toString(), point.x - 5, point.y);
    }

    // Dibujar función
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#2196f3';
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.8;

    const step = (range.max - range.min) / width;
    let started = false;

    ctx.beginPath();
    for (let x = range.min; x <= range.max; x += step) {
      try {
        const y = evaluatePolynomial(x);
        
        // Verificar si y es un número válido
        if (!isFinite(y)) continue;
        
        // Limitar y al rango visible para evitar problemas de renderizado
        const clampedY = Math.max(range.min * 2, Math.min(range.max * 2, y));
        
        const point = worldToCanvas(x, clampedY);
        
        if (!started) {
          ctx.moveTo(point.x, point.y);
          started = true;
        } else {
          ctx.lineTo(point.x, point.y);
        }
      } catch (error) {
        // Error de evaluación (e.g., división por cero), continuar con el siguiente punto
        continue;
      }
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Resaltar punto específico si está definido
    if (highlightValue !== null) {
      try {
        const y = evaluatePolynomial(highlightValue);
        if (isFinite(y)) {
          const point = worldToCanvas(highlightValue, y);
          
          // Círculo resaltado
          ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color') || '#ff9800';
          ctx.beginPath();
          ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
          ctx.fill();
          
          // Etiqueta del punto
          ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#333333';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'bottom';
          ctx.fillText(`(${highlightValue.toFixed(1)}, ${y.toFixed(2)})`, point.x + 10, point.y - 10);
        }
      } catch (error) {
        // Error al evaluar el punto resaltado
      }
    }
  };

  const handleZoomIn = () => {
    const newRange = (range.max - range.min) * 0.8;
    const center = (range.max + range.min) / 2;
    setRange({
      min: center - newRange / 2,
      max: center + newRange / 2
    });
  };

  const handleZoomOut = () => {
    const newRange = (range.max - range.min) * 1.25;
    const center = (range.max + range.min) / 2;
    setRange({
      min: center - newRange / 2,
      max: center + newRange / 2
    });
  };

  const handleReset = () => {
    setRange({ min: -10, max: 10 });
    setHighlightValue(null);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    
    // Convertir coordenada de canvas a coordenada del mundo
    const scaleX = canvas.width / (range.max - range.min);
    const centerX = canvas.width / 2;
    const worldX = (clickX - centerX) / scaleX;
    
    setHighlightValue(worldX);
  };

  return (
    <div className={`graph-visualizer ${className || ''}`}>
      <div className="graph-header">
        <h3>Gráfica de la Función</h3>
        <div className="graph-controls">
          <button 
            className="control-btn"
            onClick={handleZoomIn}
            title="Acercar"
            aria-label="Acercar gráfica"
          >
            🔍+
          </button>
          <button 
            className="control-btn"
            onClick={handleZoomOut}
            title="Alejar"
            aria-label="Alejar gráfica"
          >
            🔍-
          </button>
          <button 
            className="control-btn"
            onClick={handleReset}
            title="Restablecer vista"
            aria-label="Restablecer vista de la gráfica"
          >
            🏠
          </button>
          <label className="grid-toggle">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              aria-label="Mostrar/ocultar rejilla"
            />
            Rejilla
          </label>
        </div>
      </div>
      
      <div className="graph-container">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onClick={handleCanvasClick}
          className="graph-canvas"
          aria-label={`Gráfica de la función polinomial: ${polynomial}`}
          role="img"
        />
        
        <div className="graph-info">
          <div className="function-display">
            f(x) = {polynomial}
          </div>
          <div className="range-display">
            Rango: [{range.min.toFixed(1)}, {range.max.toFixed(1)}]
          </div>
          {highlightValue !== null && (
            <div className="point-info">
              x = {highlightValue.toFixed(2)}, f(x) = {evaluatePolynomial(highlightValue).toFixed(4)}
            </div>
          )}
          <div className="instructions">
            💡 Haz clic en la gráfica para evaluar un punto
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;