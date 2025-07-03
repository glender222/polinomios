import { useState, useEffect } from 'react';
import { type TreeNode } from './models/TreeNode';
import { PolynomialParser } from './services/PolynomialParser';
import { TreeTraversal, type TraversalStep } from './services/TreeTraversal';
import { PolynomialValidator, type ValidationResult } from './utils/validation';
import TreeVisualizer from './components/TreeVisualizer';
import PolynomialKeyboard from './components/PolynomialKeyboard';
import TraversalAnimation from './components/TraversalAnimation';
import ThemeToggle from './components/ThemeToggle';
import ExportPanel from './components/ExportPanel';
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
      <ThemeToggle />
      <header className="app-header">
        <h1>Mapeador de Polinomios a Árboles Binarios</h1>
        <p className="app-description">
          Esta aplicación convierte polinomios en árboles binarios y los evalúa 
          mediante recorridos pre-orden, in-orden y post-orden.
        </p>
      </header>
      
      <main className="app-main" role="main">
        <section className="input-section" aria-labelledby="input-heading">
          <h2 id="input-heading" className="sr-only">Entrada de Polinomio</h2>
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
                aria-describedby="polynomial-help polynomial-error polynomial-suggestions"
                aria-invalid={error || (validationResult && !validationResult.isValid) ? 'true' : 'false'}
                autoComplete="off"
                spellCheck="false"
              />
              
              {/* Texto de ayuda siempre visible para lectores de pantalla */}
              <div id="polynomial-help" className="sr-only">
                Ingrese un polinomio matemático usando números, variables como x, y operadores +, -, *, /, ^. 
                También puede usar paréntesis para agrupar términos.
              </div>
              
              {/* Mensajes de error */}
              {error && (
                <div id="polynomial-error" className="error-message" role="alert" aria-live="polite">
                  {error}
                </div>
              )}
              
              {/* Mensajes de validación en tiempo real */}
              {validationResult && !validationResult.isValid && !error && (
                <div className="validation-warning" role="alert" aria-live="polite">
                  {validationResult.error}
                </div>
              )}
              
              {/* Sugerencias de validación */}
              {validationResult?.suggestions && validationResult.suggestions.length > 0 && (
                <div id="polynomial-suggestions" className="validation-suggestions" aria-live="polite">
                  <ul aria-label="Sugerencias de validación">
                    {validationResult.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Sugerencias de corrección automática */}
              {suggestions.length > 0 && (
                <div className="input-suggestions" aria-live="polite">
                  <small>💡 Consejos:</small>
                  <ul aria-label="Consejos de entrada">
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
            <section className="visualization-section" aria-labelledby="tree-heading">
              <div className="section-header">
                <h2 id="tree-heading">Árbol Binario Generado</h2>
                <ExportPanel 
                  polynomial={polynomialInput}
                  tree={treeRoot}
                  evaluation={isEvaluating && result !== null ? {
                    xValue,
                    traversalType,
                    steps: traversalSteps,
                    result
                  } : undefined}
                />
              </div>
              <TreeVisualizer root={treeRoot} />
            </section>
            
            <section className="evaluation-section" aria-labelledby="evaluation-heading">
              <h2 id="evaluation-heading">Evaluación del Polinomio</h2>
              <div className="evaluation-controls">
                <div className="input-group">
                  <label htmlFor="x-value">Valor de x:</label>
                  <input
                    id="x-value"
                    type="number"
                    value={xValue}
                    onChange={(e) => setXValue(Number(e.target.value))}
                    className="x-input"
                    step="0.1"
                    aria-describedby="x-value-help"
                  />
                  <span id="x-value-help" className="sr-only">
                    Ingrese el valor numérico que será usado para evaluar la variable x en el polinomio
                  </span>
                </div>
                
                <fieldset className="radio-group">
                  <legend>Tipo de recorrido del árbol:</legend>
                  <label className={traversalType === 'pre' ? 'selected' : ''}>
                    <input
                      type="radio"
                      name="traversal"
                      value="pre"
                      checked={traversalType === 'pre'}
                      onChange={() => setTraversalType('pre')}
                      aria-describedby="pre-order-help"
                    />
                    Pre-orden
                    <span id="pre-order-help" className="sr-only">
                      Recorrido pre-orden: procesa primero la raíz, luego el subárbol izquierdo, y finalmente el subárbol derecho
                    </span>
                  </label>
                  <label className={traversalType === 'in' ? 'selected' : ''}>
                    <input
                      type="radio"
                      name="traversal"
                      value="in"
                      checked={traversalType === 'in'}
                      onChange={() => setTraversalType('in')}
                      aria-describedby="in-order-help"
                    />
                    In-orden
                    <span id="in-order-help" className="sr-only">
                      Recorrido in-orden: procesa primero el subárbol izquierdo, luego la raíz, y finalmente el subárbol derecho
                    </span>
                  </label>
                  <label className={traversalType === 'post' ? 'selected' : ''}>
                    <input
                      type="radio"
                      name="traversal"
                      value="post"
                      checked={traversalType === 'post'}
                      onChange={() => setTraversalType('post')}
                      aria-describedby="post-order-help"
                    />
                    Post-orden
                    <span id="post-order-help" className="sr-only">
                      Recorrido post-orden: procesa primero el subárbol izquierdo, luego el subárbol derecho, y finalmente la raíz
                    </span>
                  </label>
                </fieldset>
                
                <button 
                  className="evaluate-button" 
                  onClick={handleEvaluate}
                  aria-describedby="evaluate-help"
                >
                  Evaluar Polinomio
                </button>
                <span id="evaluate-help" className="sr-only">
                  Ejecuta la evaluación del polinomio usando el valor de x especificado y el tipo de recorrido seleccionado
                </span>
              </div>
            </section>
          </>
        )}
        
        {isEvaluating && traversalSteps.length > 0 && (
          <section className="animation-section" aria-labelledby="animation-heading">
            <h2 id="animation-heading">
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
              <div className="final-result" role="region" aria-labelledby="result-heading">
                <h3 id="result-heading">Resultado final: <span className="result-value">{result}</span></h3>
                <p>Para x = {xValue}</p>
              </div>
            )}
          </section>
        )}
      </main>
      
      <footer className="app-footer" role="contentinfo">
        <p>Proyecto de Matemática Discreta - Mapeador de Polinomios a Árboles Binarios</p>
      </footer>
    </div>
  );
}

export default App;