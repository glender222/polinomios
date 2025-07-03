import { type TreeNode, createNode } from '../models/TreeNode';

export class PolynomialParser {
  private static tokens: string[] = [];
  private static position: number = 0;

  /**
   * Parsea un polinomio en formato de texto y lo convierte en un árbol binario
   * Ejemplo: "3x^2 + 2x + 5" -> árbol correspondiente
   */
  static parsePolynomial(polynomialString: string): TreeNode | null {
    // Limpiamos espacios en blanco
    const normalized = polynomialString.replace(/\s+/g, '');
    
    if (!normalized) return null;

    // Tokenizamos la expresión
    this.tokenize(normalized);
    this.position = 0;
    
    // Parseamos la expresión
    return this.parseExpression();
  }

  private static tokenize(expression: string): void {
    this.tokens = [];
    let i = 0;
    
    while (i < expression.length) {
      const char = expression[i];
      
      // Números (incluyendo decimales)
      if (/[0-9]/.test(char)) {
        let number = '';
        while (i < expression.length && (/[0-9]/.test(expression[i]) || expression[i] === '.')) {
          number += expression[i];
          i++;
        }
        this.tokens.push(number);
        
        // Multiplicación implícita: número seguido de variable o paréntesis
        if (i < expression.length && (/[a-zA-Z]/.test(expression[i]) || expression[i] === '(')) {
          this.tokens.push('*');
        }
        continue;
      }
      
      // Variables
      if (/[a-zA-Z]/.test(char)) {
        this.tokens.push(char);
        i++;
        
        // Multiplicación implícita: variable seguida de variable o paréntesis
        if (i < expression.length && (/[a-zA-Z]/.test(expression[i]) || expression[i] === '(')) {
          this.tokens.push('*');
        }
        continue;
      }
      
      // Paréntesis de cierre seguido de número, variable o paréntesis de apertura
      if (char === ')') {
        this.tokens.push(char);
        i++;
        
        // Multiplicación implícita después de paréntesis de cierre
        if (i < expression.length && (/[0-9a-zA-Z]/.test(expression[i]) || expression[i] === '(')) {
          this.tokens.push('*');
        }
        continue;
      }
      
      // Otros operadores y paréntesis de apertura
      if (['+', '-', '*', '/', '^', '('].includes(char)) {
        this.tokens.push(char);
        i++;
        continue;
      }
      
      // Ignorar otros caracteres
      i++;
    }
    
    // Post-procesamiento para manejar casos especiales
    this.postProcessTokens();
  }
  
  private static postProcessTokens(): void {
    const processed: string[] = [];
    
    for (let i = 0; i < this.tokens.length; i++) {
      const token = this.tokens[i];
      const prevToken = processed[processed.length - 1];
      
      // Manejar signos negativos al inicio o después de operadores/paréntesis
      if (token === '-' && (i === 0 || ['+', '-', '*', '/', '^', '('].includes(prevToken))) {
        // Es un signo negativo, no una resta
        if (i + 1 < this.tokens.length) {
          const nextToken = this.tokens[i + 1];
          if (/[0-9]/.test(nextToken)) {
            // Número negativo
            processed.push('-' + nextToken);
            i++; // Saltar el siguiente token
          } else if (/[a-zA-Z]/.test(nextToken)) {
            // Variable negativa: -x se convierte en -1 * x
            processed.push('-1');
            processed.push('*');
          } else {
            processed.push(token);
          }
        } else {
          processed.push(token);
        }
      } else if (token === '+' && (i === 0 || ['+', '-', '*', '/', '^', '('].includes(prevToken))) {
        // Signo positivo redundante al inicio o después de operadores
        // Lo ignoramos si es al inicio, o lo tratamos como operador si no
        if (i > 0) {
          processed.push(token);
        }
      } else {
        processed.push(token);
      }
    }
    
    this.tokens = processed;
  }

  private static parseExpression(): TreeNode | null {
    // Suma o resta
    let left = this.parseTerm();
    
    while (this.position < this.tokens.length && 
           (this.tokens[this.position] === '+' || this.tokens[this.position] === '-')) {
      const operator = this.tokens[this.position];
      this.position++;
      const right = this.parseTerm();
      left = createNode(operator, 'operator', left, right);
    }
    
    return left;
  }

  private static parseTerm(): TreeNode | null {
    // Multiplicación o división
    let left = this.parseFactor();
    
    while (this.position < this.tokens.length && 
           (this.tokens[this.position] === '*' || this.tokens[this.position] === '/')) {
      const operator = this.tokens[this.position];
      this.position++;
      const right = this.parseFactor();
      left = createNode(operator, 'operator', left, right);
    }
    
    return left;
  }

  private static parseFactor(): TreeNode | null {
    // Potencia
    let left = this.parseUnary();
    
    while (this.position < this.tokens.length && this.tokens[this.position] === '^') {
      const operator = this.tokens[this.position];
      this.position++;
      // La potencia es asociativa por la derecha, por lo que llamamos a parseFactor en lugar de parseUnary
      const right = this.parseFactor();
      left = createNode(operator, 'operator', left, right);
    }
    
    return left;
  }

  private static parseUnary(): TreeNode | null {
    // Manejo de operadores unarios (+ o -)
    if (this.position < this.tokens.length && 
        (this.tokens[this.position] === '+' || this.tokens[this.position] === '-')) {
      const operator = this.tokens[this.position];
      this.position++;
      
      // Para operador unario positivo, simplemente devolvemos el valor
      if (operator === '+') {
        return this.parsePrimary();
      }
      
      // Para operador unario negativo, creamos un nodo de multiplicación por -1
      const right = this.parsePrimary();
      return createNode('*', 'operator', createNode('-1', 'constant'), right);
    }
    
    return this.parsePrimary();
  }

  private static parsePrimary(): TreeNode | null {
    // Paréntesis, números, variables
    if (this.position >= this.tokens.length) {
      return null;
    }
    
    const token = this.tokens[this.position];
    
    // Paréntesis
    if (token === '(') {
      this.position++;
      const result = this.parseExpression();
      
      // Verificar que hay un paréntesis de cierre
      if (this.position < this.tokens.length && this.tokens[this.position] === ')') {
        this.position++;
      } else {
        throw new Error("Se esperaba un paréntesis de cierre ')'");
      }
      
      return result;
    }
    
    // Números (incluyendo negativos)
    if (/^-?[0-9]+(\.[0-9]+)?$/.test(token)) {
      this.position++;
      return createNode(token, 'constant');
    }
    
    // Variables
    if (/^[a-zA-Z]$/.test(token)) {
      this.position++;
      return createNode(token, 'variable');
    }
    
    throw new Error(`Token inesperado: ${token}`);
  }
}