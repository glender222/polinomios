export interface TreeNode {
  id?: string;
  value: string;
  type: 'operator' | 'variable' | 'constant';
  left: TreeNode | null;
  right: TreeNode | null;
}

// Genera un ID único
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Crea un nuevo nodo de árbol
export const createNode = (
  value: string,
  type: 'operator' | 'variable' | 'constant',
  left: TreeNode | null = null,
  right: TreeNode | null = null
): TreeNode => {
  return {
    id: generateId(),
    value,
    type,
    left,
    right
  };
};

// Clona un árbol completo
export const cloneTree = (node: TreeNode | null): TreeNode | null => {
  if (!node) return null;
  
  return {
    id: node.id || generateId(),
    value: node.value,
    type: node.type,
    left: cloneTree(node.left),
    right: cloneTree(node.right)
  };
};