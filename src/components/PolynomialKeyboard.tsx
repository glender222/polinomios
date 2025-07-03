import React from 'react';
import './polynomialKeyboard.css';

interface PolynomialKeyboardProps {
  onKeyPress: (key: string) => void;
  onClear: () => void;
  onSubmit: () => void;
}

const PolynomialKeyboard: React.FC<PolynomialKeyboardProps> = ({ 
  onKeyPress, 
  onClear, 
  onSubmit 
}) => {
  const digits = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'];
  const operators = ['+', '-', '*', '/', '^'];
  const specials = ['x', '(', ')', '⌫'];
  
  const handleDigitClick = (digit: string) => {
    onKeyPress(digit);
  };
  
  const handleOperatorClick = (operator: string) => {
    onKeyPress(operator);
  };
  
  const handleSpecialClick = (special: string) => {
    if (special === '⌫') {
      // Implementar borrado (se manejará en el componente padre)
      onKeyPress('BACKSPACE');
    } else {
      onKeyPress(special);
    }
  };
  
  const getAriaLabel = (key: string) => {
    switch (key) {
      case '⌫': return 'Borrar último carácter';
      case '^': return 'Potencia';
      case '*': return 'Multiplicación';
      case '/': return 'División';
      case '+': return 'Suma';
      case '-': return 'Resta';
      case '(': return 'Abrir paréntesis';
      case ')': return 'Cerrar paréntesis';
      case 'x': return 'Variable x';
      case '.': return 'Punto decimal';
      default: return `Dígito ${key}`;
    }
  };
  
  return (
    <div className="polynomial-keyboard" role="group" aria-label="Teclado virtual para polinomios">
      <div className="keyboard-row action-row">
        <button 
          className="key clear-key" 
          onClick={onClear}
          aria-label="Limpiar todo el contenido del campo de entrada"
        >
          Limpiar
        </button>
        <button 
          className="key submit-key" 
          onClick={onSubmit}
          aria-label="Generar árbol binario del polinomio ingresado"
        >
          Generar Árbol
        </button>
      </div>
      
      <div className="keyboard-section">
        <div className="keyboard-column digits-column" role="group" aria-label="Dígitos y punto decimal">
          <div className="keyboard-grid">
            {digits.map((digit) => (
              <button
                key={`digit-${digit}`}
                className="key digit-key"
                onClick={() => handleDigitClick(digit)}
                aria-label={getAriaLabel(digit)}
              >
                {digit}
              </button>
            ))}
          </div>
        </div>
        
        <div className="keyboard-column operators-column" role="group" aria-label="Operadores matemáticos">
          {operators.map((operator) => (
            <button
              key={`op-${operator}`}
              className="key operator-key"
              onClick={() => handleOperatorClick(operator)}
              aria-label={getAriaLabel(operator)}
            >
              {operator}
            </button>
          ))}
        </div>
        
        <div className="keyboard-column specials-column" role="group" aria-label="Caracteres especiales y funciones">
          {specials.map((special) => (
            <button
              key={`special-${special}`}
              className="key special-key"
              onClick={() => handleSpecialClick(special)}
              aria-label={getAriaLabel(special)}
            >
              {special}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PolynomialKeyboard;