import { type TreeNode } from '../models/TreeNode';
import { type TraversalStep } from '../services/TreeTraversal';

export interface ExportData {
  polynomial: string;
  tree: TreeNode;
  evaluation?: {
    xValue: number;
    traversalType: 'pre' | 'in' | 'post';
    steps: TraversalStep[];
    result: number;
  };
  timestamp: string;
}

export class ExportManager {
  /**
   * Exporta los datos como JSON
   */
  static exportAsJSON(data: ExportData): void {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `polinomio-${this.getTimestampString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Exporta el árbol como texto estructurado
   */
  static exportTreeAsText(tree: TreeNode): void {
    const treeText = this.treeToString(tree);
    const content = `Representación del Árbol Binario\n${'='.repeat(35)}\n\n${treeText}`;
    
    const blob = new Blob([content], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `arbol-${this.getTimestampString()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Exporta los pasos de evaluación como CSV
   */
  static exportStepsAsCSV(steps: TraversalStep[], polynomial: string, xValue: number): void {
    const headers = 'Paso,Nodo,Tipo,Valor,Resultado,Descripción\n';
    const rows = steps.map((step, index) => {
      const nodeValue = step.node.value.replace(/,/g, ';'); // Escapar comas
      const description = step.description.replace(/,/g, ';');
      return `${index + 1},"${nodeValue}","${step.node.type}","${step.node.value}",${step.result},"${description}"`;
    }).join('\n');
    
    const content = `Evaluación del Polinomio: ${polynomial}\nValor de x: ${xValue}\nFecha: ${new Date().toLocaleString()}\n\n${headers}${rows}`;
    
    const blob = new Blob([content], { type: 'text/csv; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `evaluacion-${this.getTimestampString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Exporta el árbol como imagen SVG
   */
  static exportTreeAsSVG(tree: TreeNode, polynomial: string): void {
    const svg = this.generateTreeSVG(tree, polynomial);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `arbol-${this.getTimestampString()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Convierte el árbol a representación textual
   */
  private static treeToString(node: TreeNode | null, prefix: string = '', isLast: boolean = true): string {
    if (!node) return '';
    
    let result = prefix + (isLast ? '└── ' : '├── ') + `${node.value} (${node.type})\n`;
    
    const children = [node.left, node.right].filter(child => child !== null);
    children.forEach((child, index) => {
      const isLastChild = index === children.length - 1;
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      result += this.treeToString(child, newPrefix, isLastChild);
    });
    
    return result;
  }

  /**
   * Genera SVG del árbol
   */
  private static generateTreeSVG(tree: TreeNode, polynomial: string): string {
    const nodeRadius = 25;
    const nodeSpacing = 60;
    
    const positions = this.calculateNodePositions(tree, 0, 0, nodeSpacing);
    const { minX, maxX, maxY } = this.getBounds(positions);
    
    const width = Math.max(400, maxX - minX + 100);
    const height = Math.max(300, maxY + 100);
    
    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<defs><style>
      .node-circle { fill: #bbdefb; stroke: #0d47a1; stroke-width: 2; }
      .operator { fill: #ffcc80; stroke: #e65100; }
      .variable { fill: #80cbc4; stroke: #00695c; }
      .constant { fill: #9fa8da; stroke: #283593; }
      .node-text { font-family: Arial, sans-serif; font-size: 14px; text-anchor: middle; dominant-baseline: central; }
      .edge { stroke: #666; stroke-width: 2; }
      .title { font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; text-anchor: middle; }
    </style></defs>`;
    
    // Título
    svg += `<text x="${width/2}" y="20" class="title">Árbol del Polinomio: ${polynomial}</text>`;
    
    // Dibujar conexiones
    positions.forEach(pos => {
      if (pos.node.left) {
        const leftPos = positions.find(p => p.node.id === pos.node.left!.id);
        if (leftPos) {
          svg += `<line x1="${pos.x}" y1="${pos.y}" x2="${leftPos.x}" y2="${leftPos.y}" class="edge"/>`;
        }
      }
      if (pos.node.right) {
        const rightPos = positions.find(p => p.node.id === pos.node.right!.id);
        if (rightPos) {
          svg += `<line x1="${pos.x}" y1="${pos.y}" x2="${rightPos.x}" y2="${rightPos.y}" class="edge"/>`;
        }
      }
    });
    
    // Dibujar nodos
    positions.forEach(pos => {
      svg += `<circle cx="${pos.x}" cy="${pos.y}" r="${nodeRadius}" class="node-circle ${pos.node.type}"/>`;
      svg += `<text x="${pos.x}" y="${pos.y}" class="node-text">${pos.node.value}</text>`;
    });
    
    svg += '</svg>';
    return svg;
  }

  /**
   * Calcula las posiciones de los nodos para el SVG
   */
  private static calculateNodePositions(node: TreeNode | null, x: number, y: number, spacing: number): Array<{node: TreeNode, x: number, y: number}> {
    if (!node) return [];
    
    const positions: Array<{node: TreeNode, x: number, y: number}> = [{node, x, y}];
    
    if (node.left) {
      positions.push(...this.calculateNodePositions(node.left, x - spacing, y + 80, spacing * 0.7));
    }
    
    if (node.right) {
      positions.push(...this.calculateNodePositions(node.right, x + spacing, y + 80, spacing * 0.7));
    }
    
    return positions;
  }

  /**
   * Calcula los límites del árbol
   */
  private static getBounds(positions: Array<{node: TreeNode, x: number, y: number}>) {
    const xs = positions.map(p => p.x);
    const ys = positions.map(p => p.y);
    
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys)
    };
  }

  /**
   * Genera string de timestamp para nombres de archivo
   */
  private static getTimestampString(): string {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
  }
}