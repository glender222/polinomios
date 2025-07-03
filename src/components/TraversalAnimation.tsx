import React, { useState, useEffect } from 'react';
import { type TraversalStep } from '../services/TreeTraversal';
import TreeVisualizer from './TreeVisualizer';
import { type TreeNode } from '../models/TreeNode';

interface TraversalAnimationProps {
  steps: TraversalStep[];
  traversalType: 'pre' | 'in' | 'post';
  root: TreeNode | null;
  onComplete?: () => void;
}

const TraversalAnimation: React.FC<TraversalAnimationProps> = ({
  steps,
  traversalType,
  root,
  onComplete
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1); // 1 segundo por defecto
  
  const currentStep = steps[currentStepIndex];
  
  useEffect(() => {
    // Cambiamos NodeJS.Timeout por number, que es el tipo correcto para setTimeout en el navegador
    let timer: number | undefined;
    
    if (isPlaying && currentStepIndex < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStepIndex(prevIndex => prevIndex + 1);
      }, 1000 / speed);
    } else if (isPlaying && currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      if (onComplete) onComplete();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentStepIndex, isPlaying, speed, steps.length, onComplete]);
  
  const handleStart = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(-1);
    }
    setIsPlaying(true);
  };
  
  const handlePause = () => {
    setIsPlaying(false);
  };
  
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
  };
  
  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prevIndex => prevIndex + 1);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prevIndex => prevIndex - 1);
    }
  };
  
  return (
    <div className="traversal-animation">
      <div className="traversal-controls">
        <button
          className="control-button"
          onClick={isPlaying ? handlePause : handleStart}
        >
          {isPlaying ? 'Pausar' : 'Iniciar'}
        </button>
        <button
          className="control-button"
          onClick={handleReset}
          disabled={currentStepIndex === -1}
        >
          Reiniciar
        </button>
        <button
          className="control-button"
          onClick={handlePrevStep}
          disabled={currentStepIndex <= 0}
        >
          Anterior
        </button>
        <button
          className="control-button"
          onClick={handleNextStep}
          disabled={currentStepIndex >= steps.length - 1}
        >
          Siguiente
        </button>
        
        <div className="speed-control">
          <label>Velocidad:</label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
          />
          <span>{speed}x</span>
        </div>
      </div>
      
      <div className="visualization-container">
        <TreeVisualizer
          root={root}
          highlightedNodes={currentStep?.highlightedNodes || []}
          traversalType={traversalType}
        />
      </div>
      
      {currentStep && (
        <div className="step-info">
          <p className="step-counter">
            Paso {currentStepIndex + 1} de {steps.length}
          </p>
          <p className="step-description">
            {currentStep.description}
          </p>
          <p className="step-result">
            Resultado: <strong>{currentStep.result}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default TraversalAnimation;