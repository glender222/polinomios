import React, { useRef, useEffect } from 'react';
import { type TreeNode } from '../models/TreeNode';
import './TreeVisualizer.css';

interface TreeVisualizerProps {
  root: TreeNode | null;
  highlightedNodes?: TreeNode[];
  traversalType?: 'pre' | 'in' | 'post' | null;
  notationType?: 'infix' | 'prefix' | 'postfix';
}

// Interfaces para cálculos de posicionamiento
interface NodePosition {
  x: number;
  y: number;
  width: number;
}

interface PositionedNode {
  node: TreeNode;
  position: NodePosition;
  isHighlighted: boolean;
}

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({
  root,
  highlightedNodes = [],
  traversalType = null,
  notationType = 'infix'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Definir tamaños y espaciados constantes
  const NODE_DIAMETER = 50;
  const LEVEL_HEIGHT = 80;
  const MIN_NODE_SEPARATION = 60;
  
  // Calcular el ancho total que necesitará cada subárbol
  const calculateTreeWidth = (node: TreeNode | null): number => {
    if (!node) return 0;
    
    // Caso base: nodo hoja
    if (!node.left && !node.right) {
      return NODE_DIAMETER;
    }
    
    // Caso recursivo: nodo interno
    const leftWidth = calculateTreeWidth(node.left);
    const rightWidth = calculateTreeWidth(node.right);
    
    // El ancho es la suma de los anchos de los subárboles más un espacio mínimo
    return leftWidth + rightWidth + MIN_NODE_SEPARATION;
  };
  
  // Posicionar los nodos recursivamente
  const positionNodes = (
    node: TreeNode | null, 
    level: number, 
    xOffset: number, 
    positions: Map<string, NodePosition>
  ): number => {
    if (!node) return xOffset;
    
    // Calcular posiciones para subárbol izquierdo
    let leftWidth = 0;
    if (node.left) {
      leftWidth = calculateTreeWidth(node.left);
      positionNodes(node.left, level + 1, xOffset, positions);
    }
    
    // Posicionar este nodo
    const nodeX = xOffset + leftWidth + MIN_NODE_SEPARATION/2;
    positions.set(node.id || '', { 
      x: nodeX, 
      y: level * LEVEL_HEIGHT, 
      width: NODE_DIAMETER 
    });
    
    // Calcular posiciones para subárbol derecho
    if (node.right) {
      return positionNodes(node.right, level + 1, nodeX + NODE_DIAMETER, positions);
    }
    
    return nodeX + NODE_DIAMETER;
  };
  
  // Preparar datos para renderizado
  const prepareRenderData = (rootNode: TreeNode | null): {
    nodes: PositionedNode[],
    edges: {from: string, to: string, fromX: number, fromY: number, toX: number, toY: number}[]
  } => {
    if (!rootNode) return { nodes: [], edges: [] };
    
    // Mapa para almacenar las posiciones de cada nodo
    const positions = new Map<string, NodePosition>();
    
    // Calcular el ancho total del árbol
    const totalWidth = calculateTreeWidth(rootNode);
    
    // Calcular posiciones para todos los nodos
    positionNodes(rootNode, 0, 0, positions);
    
    // Lista para almacenar nodos y conexiones preparados para renderizar
    const nodes: PositionedNode[] = [];
    const edges: {from: string, to: string, fromX: number, fromY: number, toX: number, toY: number}[] = [];
    
    // Función para recorrer el árbol y preparar los datos
    const traverseForRender = (node: TreeNode | null): void => {
      if (!node) return;
      
      // Obtener posición calculada
      const position = positions.get(node.id || '');
      
      if (position) {
        // Verificar si el nodo debe resaltarse
        const isHighlighted = highlightedNodes.some(n => n.id === node.id);
        
        // Añadir nodo a la lista
        nodes.push({ node, position, isHighlighted });
        
        // Añadir conexiones si existen hijos
        if (node.left && node.left.id) {
          const leftPos = positions.get(node.left.id);
          if (leftPos) {
            edges.push({
              from: node.id || '',
              to: node.left.id,
              fromX: position.x + NODE_DIAMETER/2,
              fromY: position.y + NODE_DIAMETER/2,
              toX: leftPos.x + NODE_DIAMETER/2,
              toY: leftPos.y + NODE_DIAMETER/2
            });
          }
        }
        
        if (node.right && node.right.id) {
          const rightPos = positions.get(node.right.id);
          if (rightPos) {
            edges.push({
              from: node.id || '',
              to: node.right.id,
              fromX: position.x + NODE_DIAMETER/2,
              fromY: position.y + NODE_DIAMETER/2,
              toX: rightPos.x + NODE_DIAMETER/2,
              toY: rightPos.y + NODE_DIAMETER/2
            });
          }
        }
      }
      
      // Procesar hijos recursivamente
      traverseForRender(node.left);
      traverseForRender(node.right);
    };
    
    // Iniciar el recorrido desde la raíz
    traverseForRender(rootNode);
    
    return { nodes, edges };
  };
  
  // Renderizar el árbol
  const renderTree = () => {
    if (!root) return <div className="empty-tree">No hay árbol para mostrar</div>;
    
    // Preparar datos para renderizado
    const { nodes, edges } = prepareRenderData(root);
    
    // Calcular dimensiones del contenedor del árbol
    const maxX = Math.max(...nodes.map(n => n.position.x)) + NODE_DIAMETER;
    const maxY = Math.max(...nodes.map(n => n.position.y)) + NODE_DIAMETER;
    
    return (
      <div 
        className="tree-container" 
        style={{ 
          width: `${maxX + 40}px`, 
          height: `${maxY + 40}px`, 
          position: 'relative'
        }}
      >
        {/* Renderizar conexiones entre nodos */}
        <svg className="connections-layer" width="100%" height="100%" style={{position: 'absolute', top: 0, left: 0}}>
          {edges.map((edge, idx) => (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={edge.fromX}
              y1={edge.fromY}
              x2={edge.toX}
              y2={edge.toY}
              stroke="#555"
              strokeWidth="2"
            />
          ))}
        </svg>
        
        {/* Renderizar nodos */}
        {nodes.map(({ node, position, isHighlighted }) => (
          <div
            key={node.id}
            className={`tree-node ${node.type} ${isHighlighted ? 'highlighted' : ''}`}
            style={{
              position: 'absolute',
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: `${NODE_DIAMETER}px`,
              height: `${NODE_DIAMETER}px`,
              lineHeight: `${NODE_DIAMETER}px`,
            }}
          >
            {node.value}
          </div>
        ))}
      </div>
    );
  };
  
  // Ajustar zoom para que el árbol quepa en el visualizador
  useEffect(() => {
    if (!containerRef.current || !root) return;
    
    const container = containerRef.current;
    const treeContainer = container.querySelector('.tree-container') as HTMLElement;
    
    if (treeContainer) {
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const treeWidth = treeContainer.clientWidth;
      const treeHeight = treeContainer.clientHeight;
      
      // Calcular factor de escala necesario
      const scale = Math.min(
        (containerWidth - 40) / treeWidth,
        (containerHeight - 60) / treeHeight,
        1
      );
      
      // Aplicar zoom
      treeContainer.style.transform = `scale(${scale})`;
      treeContainer.style.transformOrigin = 'top center';
    }
  }, [root]);
  
  return (
    <div 
      ref={containerRef} 
      className={`tree-visualizer tree-notation-${notationType}`}
    >
      <div className="tree-title">
        {traversalType && (
          <span className="traversal-type">
            Recorrido en {
              traversalType === 'pre' ? 'Pre-Orden' : 
              traversalType === 'in' ? 'In-Orden' : 'Post-Orden'
            }
          </span>
        )}
        {!traversalType && notationType && (
          <span className="notation-type">
            Notación {
              notationType === 'infix' ? 'Infija' : 
              notationType === 'prefix' ? 'Prefija' : 'Postfija'
            }
          </span>
        )}
      </div>
      <div className="tree-scroll-container">
        {renderTree()}
      </div>
    </div>
  );
};

export default TreeVisualizer;