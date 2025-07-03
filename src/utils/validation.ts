export interface ValidationResult {
  isValid: boolean;
  error?: string;
  suggestions?: string[];
}

export class PolynomialValidator {
  private static readonly VALID_CHARS = /^[0-9a-zA-Z+\-*/^().\s]*$/;
  
  /**
   * Valida un polinomio antes del parsing
   */
  static validatePolynomial(input: string): ValidationResult {
    if (!input || input.trim().length === 0) {
      return {
        isValid: false,
        error: 'Por favor, ingrese un polinomio',
        suggestions: ['Ejemplo: 3x^2 + 2x + 5', 'Ejemplo: x^3 - 2x + 1']
      };
    }

    const trimmed = input.trim();

    // Verificar caracteres válidos
    if (!this.VALID_CHARS.test(trimmed)) {
      const invalidChars = trimmed.match(/[^0-9a-zA-Z+\-*/^().\s]/g);
      return {
        isValid: false,
        error: `Caracteres no válidos encontrados: ${invalidChars?.join(', ')}`,
        suggestions: ['Use solo números, variables (a-z), y operadores (+, -, *, /, ^, paréntesis)']
      };
    }

    // Verificar paréntesis balanceados
    const parenthesesResult = this.validateParentheses(trimmed);
    if (!parenthesesResult.isValid) {
      return parenthesesResult;
    }

    // Verificar operadores válidos
    const operatorResult = this.validateOperators(trimmed);
    if (!operatorResult.isValid) {
      return operatorResult;
    }

    // Verificar que no termine en operador
    if (/[+\-*/^]$/.test(trimmed)) {
      return {
        isValid: false,
        error: 'El polinomio no puede terminar en un operador',
        suggestions: ['Agregue un término después del operador']
      };
    }

    // Verificar que no empiece en operador (excepto +/-)
    if (/^[*/^]/.test(trimmed)) {
      return {
        isValid: false,
        error: 'El polinomio no puede empezar con *, / o ^',
        suggestions: ['Use + o - al inicio, o empiece directamente con un término']
      };
    }

    return { isValid: true };
  }

  private static validateParentheses(input: string): ValidationResult {
    let count = 0;
    let position = 0;

    for (const char of input) {
      if (char === '(') {
        count++;
      } else if (char === ')') {
        count--;
        if (count < 0) {
          return {
            isValid: false,
            error: `Paréntesis de cierre sin apertura en posición ${position}`,
            suggestions: ['Verifique que cada ")" tenga su correspondiente "("']
          };
        }
      }
      position++;
    }

    if (count > 0) {
      return {
        isValid: false,
        error: `${count} paréntesis de apertura sin cerrar`,
        suggestions: [`Agregue ${count} paréntesis de cierre ")"`]
      };
    }

    return { isValid: true };
  }

  private static validateOperators(input: string): ValidationResult {
    // Verificar operadores consecutivos (excepto casos válidos como +-, -+)
    if (/(\*\*|\+\+|--|\^\^|\/\/|\*\/|\/\*|\*\^|\^\*|\/\^|\^\/|\+\*|\*\+|\+\/|\/\+|\+\^|\^\+)/.test(input)) {
      return {
        isValid: false,
        error: 'Operadores consecutivos no válidos detectados',
        suggestions: ['Verifique que no haya operadores duplicados o en secuencias inválidas']
      };
    }

    // Verificar puntos decimales múltiples en números
    const numberMatches = input.match(/[0-9]*\.[0-9]*(\.[0-9]*)*/g);
    if (numberMatches) {
      for (const match of numberMatches) {
        if ((match.match(/\./g) || []).length > 1) {
          return {
            isValid: false,
            error: `Número con múltiples puntos decimales: ${match}`,
            suggestions: ['Use solo un punto decimal por número']
          };
        }
      }
    }

    return { isValid: true };
  }

  /**
   * Sugiere correcciones automáticas para errores comunes
   */
  static suggestCorrections(input: string): string[] {
    const suggestions: string[] = [];
    
    // Sugerir multiplicación implícita
    if (/[0-9][a-zA-Z]/.test(input)) {
      suggestions.push('Se detectó multiplicación implícita. Ejemplo: "2x" se interpretará como "2*x"');
    }

    // Sugerir coeficientes implícitos
    if (/^[a-zA-Z]/.test(input.trim()) || /[+\-][a-zA-Z]/.test(input)) {
      suggestions.push('Variables sin coeficiente se interpretarán con coeficiente 1. Ejemplo: "x" se interpretará como "1*x"');
    }

    // Sugerir paréntesis para claridad
    if (/\^.+[+\-]/.test(input)) {
      suggestions.push('Considere usar paréntesis para aclarar el orden de operaciones en potencias');
    }

    return suggestions;
  }

  /**
   * Normaliza la entrada para casos comunes
   */
  static normalizeInput(input: string): string {
    let normalized = input.trim();
    
    // Remover espacios múltiples
    normalized = normalized.replace(/\s+/g, '');
    
    // Normalizar signos dobles (ej: +- a -, -+ a -)
    normalized = normalized.replace(/\+\-/g, '-');
    normalized = normalized.replace(/\-\+/g, '-');
    
    return normalized;
  }
}