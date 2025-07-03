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
  
  return (
    <div className="polynomial-keyboard">
      <div className="keyboard-row action-row">
        <button className="key clear-key" onClick={onClear}>Limpiar</button>
        <button className="key submit-key" onClick={onSubmit}>Generar Árbol</button>
      </div>
      
      <div className="keyboard-section">
        <div className="keyboard-column digits-column">
          <div className="keyboard-grid">
            {digits.map((digit) => (
              <button
                key={`digit-${digit}`}
                className="key digit-key"
                onClick={() => handleDigitClick(digit)}
              >
                {digit}
              </button>
            ))}
          </div>
        </div>
        
        <div className="keyboard-column operators-column">
          {operators.map((operator) => (
            <button
              key={`op-${operator}`}
              className="key operator-key"
              onClick={() => handleOperatorClick(operator)}
            >
              {operator}
            </button>
          ))}
        </div>
        
        <div className="keyboard-column specials-column">
          {specials.map((special) => (
            <button
              key={`special-${special}`}
              className="key special-key"
              onClick={() => handleSpecialClick(special)}
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