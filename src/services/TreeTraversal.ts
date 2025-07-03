import { type TreeNode } from '../models/TreeNode';

export interface TraversalStep {
  node: TreeNode;
  result: number;
  description: string;
  highlightedNodes: TreeNode[];
}

export class TreeTraversal {
  /**
   * Recorre el árbol en pre-orden: raíz, izquierda, derecha
   */
  static preOrderTraversal(root: TreeNode | null, xValue: number): TraversalStep[] {
    const steps: TraversalStep[] = [];
    
    function traverse(node: TreeNode | null): number {
      if (!node) return 0;
      
      let result = 0;
      let description = '';
      
      // Procesar nodo actual primero (Pre-orden)
      if (node.type === 'constant') {
        result = parseFloat(node.value);
        description = `Visitando constante: ${node.value} = ${result}`;
      } else if (node.type === 'variable') {
        result = xValue;
        description = `Visitando variable: x = ${xValue}`;
      } else if (node.type === 'operator') {
        const leftValue = node.left ? traverse(node.left) : 0;
        const rightValue = node.right ? traverse(node.right) : 0;
        
        switch (node.value) {
          case '+': 
            result = leftValue + rightValue; 
            description = `Operación: ${leftValue} + ${rightValue} = ${result}`;
            break;
          case '-': 
            result = leftValue - rightValue; 
            description = `Operación: ${leftValue} - ${rightValue} = ${result}`;
            break;
          case '*': 
            result = leftValue * rightValue; 
            description = `Operación: ${leftValue} * ${rightValue} = ${result}`;
            break;
          case '/': 
            result = leftValue / rightValue; 
            description = `Operación: ${leftValue} / ${rightValue} = ${result}`;
            break;
          case '^': 
            result = Math.pow(leftValue, rightValue); 
            description = `Operación: ${leftValue} ^ ${rightValue} = ${result}`;
            break;
          default: 
            result = 0;
            description = "Operador desconocido";
        }
      }
      
      // Añadir el paso actual
      steps.push({ 
        node, 
        result, 
        description,
        highlightedNodes: [node]
      });
      
      return result;
    }
    
    if (root) traverse(root);
    return steps;
  }
  
  /**
   * Recorre el árbol en in-orden: izquierda, raíz, derecha
   */
  static inOrderTraversal(root: TreeNode | null, xValue: number): TraversalStep[] {
    const steps: TraversalStep[] = [];
    
    function traverse(node: TreeNode | null): number {
      if (!node) return 0;
      
      let result = 0;
      let description = '';
      let leftValue = 0;
      let rightValue = 0;
      
      // Recorrer subárbol izquierdo primero (In-orden)
      if (node.left) {
        leftValue = traverse(node.left);
      }
      
      // Procesar nodo actual
      if (node.type === 'constant') {
        result = parseFloat(node.value);
        description = `Visitando constante: ${node.value} = ${result}`;
      } else if (node.type === 'variable') {
        result = xValue;
        description = `Visitando variable: x = ${xValue}`;
      } else if (node.type === 'operator') {
        // Recorrer subárbol derecho
        if (node.right) {
          rightValue = traverse(node.right);
        }
        
        switch (node.value) {
          case '+': 
            result = leftValue + rightValue; 
            description = `Operación: ${leftValue} + ${rightValue} = ${result}`;
            break;
          case '-': 
            result = leftValue - rightValue; 
            description = `Operación: ${leftValue} - ${rightValue} = ${result}`;
            break;
          case '*': 
            result = leftValue * rightValue; 
            description = `Operación: ${leftValue} * ${rightValue} = ${result}`;
            break;
          case '/': 
            result = leftValue / rightValue; 
            description = `Operación: ${leftValue} / ${rightValue} = ${result}`;
            break;
          case '^': 
            result = Math.pow(leftValue, rightValue); 
            description = `Operación: ${leftValue} ^ ${rightValue} = ${result}`;
            break;
          default: 
            result = 0;
            description = "Operador desconocido";
        }
      }
      
      // Añadir el paso actual
      steps.push({ 
        node, 
        result, 
        description,
        highlightedNodes: [node]
      });
      
      return result;
    }
    
    if (root) traverse(root);
    return steps;
  }
  
  /**
   * Recorre el árbol en post-orden: izquierda, derecha, raíz
   */
  static postOrderTraversal(root: TreeNode | null, xValue: number): TraversalStep[] {
    const steps: TraversalStep[] = [];
    
    function traverse(node: TreeNode | null): number {
      if (!node) return 0;
      
      let result = 0;
      let description = '';
      let leftValue = 0;
      let rightValue = 0;
      
      // Recorrer subárbol izquierdo primero (Post-orden)
      if (node.left) {
        leftValue = traverse(node.left);
      }
      
      // Recorrer subárbol derecho
      if (node.right) {
        rightValue = traverse(node.right);
      }
      
      // Procesar nodo actual después de los subárboles
      if (node.type === 'constant') {
        result = parseFloat(node.value);
        description = `Visitando constante: ${node.value} = ${result}`;
      } else if (node.type === 'variable') {
        result = xValue;
        description = `Visitando variable: x = ${xValue}`;
      } else if (node.type === 'operator') {
        switch (node.value) {
          case '+': 
            result = leftValue + rightValue; 
            description = `Operación: ${leftValue} + ${rightValue} = ${result}`;
            break;
          case '-': 
            result = leftValue - rightValue; 
            description = `Operación: ${leftValue} - ${rightValue} = ${result}`;
            break;
          case '*': 
            result = leftValue * rightValue; 
            description = `Operación: ${leftValue} * ${rightValue} = ${result}`;
            break;
          case '/': 
            result = leftValue / rightValue; 
            description = `Operación: ${leftValue} / ${rightValue} = ${result}`;
            break;
          case '^': 
            result = Math.pow(leftValue, rightValue); 
            description = `Operación: ${leftValue} ^ ${rightValue} = ${result}`;
            break;
          default: 
            result = 0;
            description = "Operador desconocido";
        }
      }
      
      // Añadir el paso actual
      steps.push({ 
        node, 
        result, 
        description,
        highlightedNodes: [node]
      });
      
      return result;
    }
    
    if (root) traverse(root);
    return steps;
  }
}