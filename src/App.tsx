import { useState, useEffect } from 'react';
import { type TreeNode } from './models/TreeNode';
import { PolynomialParser } from './services/PolynomialParser';
import { TreeTraversal, type TraversalStep } from './services/TreeTraversal';
import { PolynomialValidator, type ValidationResult } from './utils/validation';
import TreeVisualizer from './components/TreeVisualizer';
import PolynomialKeyboard from './components/PolynomialKeyboard';
import TraversalAnimation from './components/TraversalAnimation';
import './App.css';

function App() {
  const [polynomialInput, setPolynomialInput] = useState<string>('');
  const [xValue, setXValue] = useState<number>(0);
  const [treeRoot, setTreeRoot] = useState<TreeNode | null>(null);
  const [traversalSteps, setTraversalSteps] = useState<TraversalStep[]>([]);
  const [traversalType, setTraversalType] = useState<'pre' | 'in' | 'post'>('in');
  const [result, setResult] = useState<number | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // Limpiar errores al cambiar la entrada
  useEffect(() => {
    setError(null);
    setValidationResult(null);
    setSuggestions([]);
    
    if (polynomialInput.trim()) {
      // Validación en tiempo real
      const validation = PolynomialValidator.validatePolynomial(polynomialInput);
      setValidationResult(validation);
      
      // Obtener sugerencias
      const inputSuggestions = PolynomialValidator.suggestCorrections(polynomialInput);
      setSuggestions(inputSuggestions);
    }
  }, [polynomialInput]);
  
  const handleKeyPress = (key: string) => {
    if (key === 'BACKSPACE') {
      setPolynomialInput(prev => prev.slice(0, -1));
    } else {
      setPolynomialInput(prev => prev + key);
    }
  };
  
  const handleClear = () => {
    setPolynomialInput('');
  };
  
  const handleParsePolynomial = () => {
    try {
      // Validar entrada
      const validation = PolynomialValidator.validatePolynomial(polynomialInput);
      if (!validation.isValid) {
        setError(validation.error || 'Error de validación');
        return;
      }
      
      // Normalizar entrada
      const normalizedInput = PolynomialValidator.normalizeInput(polynomialInput);
      
      const root = PolynomialParser.parsePolynomial(normalizedInput);
      
      if (!root) {
        setError('No se pudo generar el árbol. Verifique el formato del polinomio');
        return;
      }
      
      setTreeRoot(root);
      setTraversalSteps([]);
      setResult(null);
      setIsEvaluating(false);
      setError(null);
      setValidationResult(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al parsear el polinomio';
      setError(errorMessage);
      console.error(err);
    }
  };
  
  const handleEvaluate = () => {
    if (!treeRoot) return;
    
    try {
      let steps: TraversalStep[] = [];
      
      switch (traversalType) {
        case 'pre':
          steps = TreeTraversal.preOrderTraversal(treeRoot, xValue);
          break;
        case 'in':
          steps = TreeTraversal.inOrderTraversal(treeRoot, xValue);
          break;
        case 'post':
          steps = TreeTraversal.postOrderTraversal(treeRoot, xValue);
          break;
      }
      
      setTraversalSteps(steps);
      setIsEvaluating(true);
      
      // El resultado final será el del último paso
      if (steps.length > 0) {
        setResult(steps[steps.length - 1].result);
      }
    } catch (err) {
      setError('Error al evaluar el polinomio');
      console.error(err);
    }
  };
  
  const handleAnimationComplete = () => {
    // Podría realizar alguna acción cuando la animación termine
  };
  
  return (
    <div className="app">
      <header className="app-header">
        <h1>Mapeador de Polinomios a Árboles Binarios</h1>
        <p className="app-description">
          Esta aplicación convierte polinomios en árboles binarios y los evalúa 
          mediante recorridos pre-orden, in-orden y post-orden.
        </p>
      </header>
      
      <main className="app-main">
        <section className="input-section">
          <div className="input-container">
            <label htmlFor="polynomial">Polinomio:</label>
            <div className="input-with-keyboard">
              <input
                id="polynomial"
                type="text"
                value={polynomialInput}
                onChange={(e) => setPolynomialInput(e.target.value)}
                placeholder="Ejemplo: 3x^2 + 2x + 5"
                className={error || (validationResult && !validationResult.isValid) ? 'input-error' : ''}
                aria-describedby="polynomial-help"
              />
              
              {/* Mensajes de error */}
              {error && <div className="error-message" role="alert">{error}</div>}
              
              {/* Mensajes de validación en tiempo real */}
              {validationResult && !validationResult.isValid && !error && (
                <div className="validation-warning" role="alert">
                  {validationResult.error}
                </div>
              )}
              
              {/* Sugerencias de validación */}
              {validationResult?.suggestions && validationResult.suggestions.length > 0 && (
                <div className="validation-suggestions">
                  <ul>
                    {validationResult.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Sugerencias de corrección automática */}
              {suggestions.length > 0 && (
                <div className="input-suggestions">
                  <small>💡 Consejos:</small>
                  <ul>
                    {suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <PolynomialKeyboard
              onKeyPress={handleKeyPress}
              onClear={handleClear}
              onSubmit={handleParsePolynomial}
            />
          </div>
        </section>
        
        {treeRoot && !isEvaluating && (
          <>
            <section className="visualization-section">
              <h2>Árbol Binario Generado</h2>
              <TreeVisualizer root={treeRoot} />
            </section>
            
            <section className="evaluation-section">
              <h2>Evaluación del Polinomio</h2>
              <div className="evaluation-controls">
                <div className="input-group">
                  <label htmlFor="x-value">Valor de x:</label>
                  <input
                    id="x-value"
                    type="number"
                    value={xValue}
                    onChange={(e) => setXValue(Number(e.target.value))}
                    className="x-input"
                  />
                </div>
                
                <div className="radio-group">
                  <label className={traversalType === 'pre' ? 'selected' : ''}>
                    <input
                      type="radio"
                      name="traversal"
                      value="pre"
                      checked={traversalType === 'pre'}
                      onChange={() => setTraversalType('pre')}
                    />
                    Pre-orden
                  </label>
                  <label className={traversalType === 'in' ? 'selected' : ''}>
                    <input
                      type="radio"
                      name="traversal"
                      value="in"
                      checked={traversalType === 'in'}
                      onChange={() => setTraversalType('in')}
                    />
                    In-orden
                  </label>
                  <label className={traversalType === 'post' ? 'selected' : ''}>
                    <input
                      type="radio"
                      name="traversal"
                      value="post"
                      checked={traversalType === 'post'}
                      onChange={() => setTraversalType('post')}
                    />
                    Post-orden
                  </label>
                </div>
                
                <button className="evaluate-button" onClick={handleEvaluate}>
                  Evaluar Polinomio
                </button>
              </div>
            </section>
          </>
        )}
        
        {isEvaluating && traversalSteps.length > 0 && (
          <section className="animation-section">
            <h2>
              Evaluación en {
                traversalType === 'pre' ? 'Pre-orden' :
                traversalType === 'in' ? 'In-orden' : 'Post-orden'
              }
            </h2>
            <TraversalAnimation
              steps={traversalSteps}
              traversalType={traversalType}
              root={treeRoot}
              onComplete={handleAnimationComplete}
            />
            
            {result !== null && (
              <div className="final-result">
                <h3>Resultado final: <span className="result-value">{result}</span></h3>
                <p>Para x = {xValue}</p>
              </div>
            )}
          </section>
        )}
      </main>
      
      <footer className="app-footer">
        <p>Proyecto de Matemática Discreta - Mapeador de Polinomios a Árboles Binarios</p>
      </footer>
    </div>
  );
}

export default App;