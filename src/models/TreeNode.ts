export interface TreeNode {
  value: string;
  left: TreeNode | null;
  right: TreeNode | null;
  type: 'operator' | 'variable' | 'constant';
  id?: string; // Para identificación única en la visualización
}

// Función de utilidad para crear un nuevo nodo
export function createNode(
  value: string,
  type: 'operator' | 'variable' | 'constant',
  left: TreeNode | null = null,
  right: TreeNode | null = null
): TreeNode {
  return {
    value,
    left,
    right,
    type,
    id: Math.random().toString(36).substring(2, 9) // Genera un ID único
  };
}

// Función para clonar un árbol
export function cloneTree(node: TreeNode | null): TreeNode | null {
  if (!node) return null;
  
  return {
    ...node,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}