import React, { useEffect, useRef } from 'react';
import { type TreeNode } from '../models/TreeNode';
import './TreeVisualizer.css';

interface TreeVisualizerProps {
  root: TreeNode | null;
  highlightedNodes?: TreeNode[];
  traversalType?: 'pre' | 'in' | 'post' | null;
}

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ 
  root, 
  highlightedNodes = [],
  traversalType = null
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || !root) return;
    
    // Ajustar el zoom para que quepa todo el árbol
    const container = containerRef.current;
    const treeHeight = getTreeHeight(root);
    const treeWidth = getTreeWidth(root);
    
    // Escalar según el tamaño del árbol
    const scale = Math.min(
      container.clientWidth / (treeWidth * 80),
      container.clientHeight / (treeHeight * 80)
    );
    
    // Aplicar escala si es necesario
    if (scale < 1) {
      const treeContainer = container.querySelector('.tree-container') as HTMLElement;
      if (treeContainer) {
        treeContainer.style.transform = `scale(${scale})`;
      }
    }
  }, [root]);
  
  if (!root) return <div className="empty-tree">No hay árbol para mostrar</div>;
  
  // Funciones auxiliares para calcular dimensiones del árbol
  function getTreeHeight(node: TreeNode | null): number {
    if (!node) return 0;
    return 1 + Math.max(getTreeHeight(node.left), getTreeHeight(node.right));
  }
  
  function getTreeWidth(node: TreeNode | null): number {
    if (!node) return 0;
    if (!node.left && !node.right) return 1;
    return getTreeWidth(node.left) + getTreeWidth(node.right);
  }
  
  const renderNode = (node: TreeNode | null) => {
    if (!node) return null;
    
    const isHighlighted = highlightedNodes.some(n => n.id === node.id);
    const nodeClass = `tree-node ${node.type} ${isHighlighted ? 'highlighted' : ''}`;
    
    return (
      <div key={node.id} className="node-wrapper">
        <div className={nodeClass}>{node.value}</div>
        {(node.left || node.right) && (
          <div className="children-wrapper">
            <div className="child-wrapper">
              {node.left && <div className="branch left-branch"></div>}
              {renderNode(node.left)}
            </div>
            <div className="child-wrapper">
              {node.right && <div className="branch right-branch"></div>}
              {renderNode(node.right)}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div ref={containerRef} className="tree-visualizer">
      <div className="tree-title">
        {traversalType && (
          <span className="traversal-type">
            Recorrido en {
              traversalType === 'pre' ? 'Pre-Orden' : 
              traversalType === 'in' ? 'In-Orden' : 'Post-Orden'
            }
          </span>
        )}
      </div>
      <div className="tree-container">
        {renderNode(root)}
      </div>
    </div>
  );
};

export default TreeVisualizer;