import React from 'react';
import { type TreeNode } from '../models/TreeNode';
import { TreeConverter } from '../services/TreeConverter';
import './NotationDisplay.css';

interface NotationDisplayProps {
  root: TreeNode | null;
}

const NotationDisplay: React.FC<NotationDisplayProps> = ({ root }) => {
  if (!root) {
    return null;
  }

  // Generar las tres representaciones
  const infixNotation = TreeConverter.toInfixString(root);
  const prefixNotation = TreeConverter.toPrefixString(root);
  const postfixNotation = TreeConverter.toPostfixString(root);

  return (
    <div className="notation-display">
      <h3>Representación en diferentes notaciones</h3>
      <div className="notation-container">
        <div className="notation-item">
          <div className="notation-label">Notación Infija (In-orden):</div>
          <div className="notation-text infix">{infixNotation}</div>
        </div>
        <div className="notation-item">
          <div className="notation-label">Notación Prefija (Pre-orden):</div>
          <div className="notation-text prefix">{prefixNotation}</div>
        </div>
        <div className="notation-item">
          <div className="notation-label">Notación Postfija (Post-orden):</div>
          <div className="notation-text postfix">{postfixNotation}</div>
        </div>
      </div>
    </div>
  );
};

export default NotationDisplay;