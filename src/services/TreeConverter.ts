import { type TreeNode, createNode } from '../models/TreeNode';

export class TreeConverter {
  /**
   * Convierte un árbol de expresión a notación prefija (operadores primero)
   * Para visualización, no modifica la estructura, solo cambia el estilo visual
   */
  static toPrefix(tree: TreeNode | null): TreeNode | null {
    if (!tree) return null;
    
    // Clonamos el nodo actual
    const clonedNode: TreeNode = {
      id: tree.id,
      value: tree.value,
      type: tree.type,
      left: null,
      right: null
    };
    
    // Procesamos recursivamente los hijos
    if (tree.left) {
      clonedNode.left = this.toPrefix(tree.left);
    }
    
    if (tree.right) {
      clonedNode.right = this.toPrefix(tree.right);
    }
    
    return clonedNode;
  }
  
  /**
   * Convierte un árbol de expresión a notación postfija (operadores después)
   * Para visualización, intercambia la posición de operadores y operandos
   */
  static toPostfix(tree: TreeNode | null): TreeNode | null {
    if (!tree) return null;
    
    // Para nodos operadores, invertimos la estructura
    if (tree.type === 'operator') {
      // Creamos un nuevo nodo con la misma información pero intercambiando izquierda y derecha
      return {
        id: tree.id,
        value: tree.value,
        type: tree.type,
        left: this.toPostfix(tree.right),  // Derecho va a la izquierda
        right: this.toPostfix(tree.left)   // Izquierdo va a la derecha
      };
    } else {
      // Para nodos hoja (variables, constantes) no cambiamos la estructura
      return {
        id: tree.id,
        value: tree.value,
        type: tree.type,
        left: null,
        right: null
      };
    }
  }
  
  /**
   * Genera una cadena de texto con la expresión en notación prefija
   */
  static toPrefixString(tree: TreeNode | null): string {
    if (!tree) return '';
    
    if (tree.type === 'operator') {
      const leftStr = this.toPrefixString(tree.left);
      const rightStr = this.toPrefixString(tree.right);
      return `${tree.value} ${leftStr} ${rightStr}`.trim();
    } else {
      return tree.value;
    }
  }
  
  /**
   * Genera una cadena de texto con la expresión en notación postfija
   */
  static toPostfixString(tree: TreeNode | null): string {
    if (!tree) return '';
    
    if (tree.type === 'operator') {
      const leftStr = this.toPostfixString(tree.left);
      const rightStr = this.toPostfixString(tree.right);
      return `${leftStr} ${rightStr} ${tree.value}`.trim();
    } else {
      return tree.value;
    }
  }
}