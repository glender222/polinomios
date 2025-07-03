import React, { useState, useEffect } from 'react';
import { type TreeNode, cloneTree } from './models/TreeNode';
import { PolynomialParser } from './services/PolynomialParser';
import { TreeTraversal } from './services/TreeTraversal';
import { TreeConverter } from './services/TreeConverter';
import TreeVisualizer from './components/TreeVisualizer';
import PolynomialKeyboard from './components/PolynomialKeyboard';
import TraversalAnimation from './components/TraversalAnimation';
import NotationDisplay from './components/NotationDisplay';
import './App.css';

// Tipo para la notación del árbol
type TreeNotation = 'infix' | 'prefix' | 'postfix';

function App() {
  // Estados
  const [polynomialInput, setPolynomialInput] = useState('');
  const [xValue, setXValue] = useState(0);
  const [treeRoot, setTreeRoot] = useState<TreeNode | null>(null);
  const [originalTree, setOriginalTree] = useState<TreeNode | null>(null);
  const [traversalSteps, setTraversalSteps] = useState<any[]>([]);
  const [traversalType, setTraversalType] = useState<'pre' | 'in' | 'post'>('in');
  const [treeNotation, setTreeNotation] = useState<TreeNotation>('infix');
  const [result, setResult] = useState<number | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Limpiar errores al cambiar la entrada
  useEffect(() => {
    setError(null);
  }, [polynomialInput]);
  
  // Actualizar el árbol cuando cambia la notación
  useEffect(() => {
    if (!originalTree) return;
    
    try {
      let newTree: TreeNode | null;
      
      if (treeNotation === 'prefix') {
        newTree = TreeConverter.toPrefix(cloneTree(originalTree));
      } else if (treeNotation === 'postfix') {
        newTree = TreeConverter.toPostfix(cloneTree(originalTree));
      } else {
        newTree = cloneTree(originalTree);
      }
      
      setTreeRoot(newTree);
    } catch (err) {
      console.error("Error al convertir el árbol:", err);
      setTreeRoot(cloneTree(originalTree)); // Usar original como fallback
    }
  }, [treeNotation, originalTree]);
  
  // Manejadores de eventos
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
    if (!polynomialInput.trim()) {
      setError('Por favor, ingrese un polinomio');
      return;
    }
    
    try {
      const root = PolynomialParser.parsePolynomial(polynomialInput);
      
      if (!root) {
        setError('No se pudo generar el árbol. Verifique el formato del polinomio');
        return;
      }
      
      // Guardar árbol original
      setOriginalTree(root);
      
      // El efecto se encargará de aplicar la notación
      setTreeRoot(root);
      setTraversalSteps([]);
      setResult(null);
      setIsEvaluating(false);
      setError(null);
    } catch (err) {
      console.error("Error al parsear:", err);
      setError('Error al parsear el polinomio. Verifique el formato.');
    }
  };
  
  const handleEvaluate = () => {
    if (!originalTree) return;
    
    try {
      let steps: any[] = [];
      
      if (traversalType === 'pre') {
        steps = TreeTraversal.preOrderTraversal(originalTree, xValue);
      } else if (traversalType === 'in') {
        steps = TreeTraversal.inOrderTraversal(originalTree, xValue);
      } else {
        steps = TreeTraversal.postOrderTraversal(originalTree, xValue);
      }
      
      setTraversalSteps(steps);
      setIsEvaluating(true);
      
      if (steps.length > 0) {
        setResult(steps[steps.length - 1].result);
      }
    } catch (err) {
      console.error("Error al evaluar:", err);
      setError('Error al evaluar el polinomio');
    }
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
                className={error ? 'input-error' : ''}
              />
              {error && <div className="error-message">{error}</div>}
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
              
              <div className="notation-selector">
                <p>Seleccione el tipo de notación:</p>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="tree-notation"
                      value="infix"
                      checked={treeNotation === 'infix'}
                      onChange={() => setTreeNotation('infix')}
                    />
                    Infija (natural)
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="tree-notation"
                      value="prefix"
                      checked={treeNotation === 'prefix'}
                      onChange={() => setTreeNotation('prefix')}
                    />
                    Prefija (polaca)
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="tree-notation"
                      value="postfix"
                      checked={treeNotation === 'postfix'}
                      onChange={() => setTreeNotation('postfix')}
                    />
                    Postfija (polaca inversa)
                  </label>
                </div>
              </div>
              
              <TreeVisualizer
                root={treeRoot}
                notationType={treeNotation}
              />
            <NotationDisplay root={originalTree} />

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
                  <label>
                    <input
                      type="radio"
                      name="traversal"
                      value="pre"
                      checked={traversalType === 'pre'}
                      onChange={() => setTraversalType('pre')}
                    />
                    Pre-orden
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="traversal"
                      value="in"
                      checked={traversalType === 'in'}
                      onChange={() => setTraversalType('in')}
                    />
                    In-orden
                  </label>
                  <label>
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
              root={originalTree}
              onComplete={() => {}}
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