# 🧮 Mapeador de Polinomios a Árboles Binarios

Una aplicación web interactiva y moderna que convierte polinomios matemáticos en árboles binarios y los evalúa mediante diferentes tipos de recorrido. Perfecta para estudiantes y profesores de matemáticas discretas, algoritmos y estructuras de datos.

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)
![Vite](https://img.shields.io/badge/Vite-7+-green.svg)

## ✨ Características Principales

### 🎯 Funcionalidades Core
- **Parser Avanzado**: Análisis sintáctico robusto con soporte para multiplicación implícita
- **Visualización de Árboles**: Representación gráfica interactiva de la estructura del árbol
- **Gráfica de Funciones**: Visualización matemática de la función polinomial
- **Recorridos Animados**: Pre-orden, In-orden y Post-orden con animaciones paso a paso
- **Evaluación Interactiva**: Calcular valores específicos con visualización del proceso

### 🚀 Características Avanzadas
- **🌓 Modo Oscuro**: Interfaz adaptativa con detección automática de preferencias del sistema
- **📱 Diseño Responsive**: Optimizado para dispositivos móviles y tablets
- **♿ Accesibilidad**: Completo soporte para lectores de pantalla y navegación por teclado
- **📚 Historial Inteligente**: Sistema de favoritos y búsqueda en historial de polinomios
- **💾 Exportación Multi-formato**: JSON, CSV, TXT y SVG para diferentes necesidades
- **🔍 Validación en Tiempo Real**: Retroalimentación inmediata con sugerencias inteligentes

### 🎮 Teclado Virtual
- Interfaz intuitiva para ingreso de polinomios
- Soporte completo para operadores matemáticos
- Diseño optimizado para dispositivos táctiles

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19+ con TypeScript 5+
- **Build Tool**: Vite 7+ para desarrollo rápido
- **Styling**: CSS moderno con variables CSS y grid layout
- **Canvas**: HTML5 Canvas para visualización de gráficas
- **Accessibility**: ARIA labels y soporte completo para lectores de pantalla
- **PWA Ready**: Preparado para funcionar como Progressive Web App

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm 8+ o yarn 1.22+

### Instalación Rápida
```bash
# Clonar el repositorio
git clone https://github.com/glender222/polinomios.git

# Navegar al directorio
cd polinomios

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Construir para producción
npm run preview  # Previsualizar build de producción
npm run lint     # Ejecutar ESLint
```

## 📖 Guía de Uso

### 1. Ingreso de Polinomios
La aplicación acepta múltiples formatos de entrada:

**Formatos Soportados:**
```
• Multiplicación explícita: 3*x^2 + 2*x + 5
• Multiplicación implícita: 3x^2 + 2x + 5
• Coeficientes implícitos: x^2 + x + 1
• Números negativos: -2x^2 + x - 3
• Paréntesis: (x + 1)^2 + 2*(x - 1)
• Decimales: 1.5x^2 + 0.5x + 2.3
```

### 2. Validación Inteligente
- ✅ **Validación en tiempo real** con mensajes descriptivos
- 🔧 **Corrección automática** de errores comunes
- 💡 **Sugerencias contextuales** para mejorar la entrada
- 🚫 **Prevención de errores** antes del procesamiento

### 3. Visualizaciones Disponibles

#### Árbol Binario
- Representación visual de la estructura del polinomio
- Nodos coloreados por tipo (operador, variable, constante)
- Zoom automático para árboles grandes
- Navegación por teclado accesible

#### Gráfica de la Función
- Representación gráfica de f(x) = polinomio
- Zoom y pan interactivos
- Evaluación de puntos mediante clic
- Rejilla opcional para mejor lectura

### 4. Tipos de Recorrido

#### Pre-orden (Raíz → Izquierda → Derecha)
- Útil para copiar o serializar el árbol
- Procesa operadores antes que operandos

#### In-orden (Izquierda → Raíz → Derecha)
- Produce la expresión en notación infija
- Orden natural de lectura matemática

#### Post-orden (Izquierda → Derecha → Raíz)
- Ideal para evaluación de expresiones
- Procesa operandos antes que operadores

### 5. Sistema de Historial
- **Historial Reciente**: Últimos 20 polinomios utilizados
- **Favoritos**: Hasta 20 polinomios marcados como favoritos
- **Búsqueda**: Encuentra polinomios por contenido
- **Persistencia**: Guardado automático en localStorage

### 6. Exportación de Datos

#### Formatos Disponibles:
- **JSON**: Datos completos incluyendo evaluaciones
- **CSV**: Pasos de evaluación para análisis
- **TXT**: Estructura del árbol en formato texto
- **SVG**: Imagen vectorial del árbol para documentos

## 🎨 Personalización

### Temas
La aplicación soporta dos temas principales:
- **Modo Claro**: Interfaz tradicional con colores claros
- **Modo Oscuro**: Interfaz moderna con menor fatiga visual

El tema se selecciona automáticamente basado en las preferencias del sistema, pero puede cambiarse manualmente.

### Responsive Design
- **Desktop**: Experiencia completa con todas las características
- **Tablet**: Interfaz adaptada con navegación optimizada
- **Mobile**: Teclado virtual mejorado y controles táctiles

## ♿ Accesibilidad

Esta aplicación ha sido desarrollada siguiendo las mejores prácticas de accesibilidad:

### Características de Accesibilidad:
- **WCAG 2.1 AA Compliant**: Cumple estándares internacionales
- **Navegación por Teclado**: Todas las funciones accesibles sin mouse
- **Lectores de Pantalla**: Soporte completo para NVDA, JAWS, VoiceOver
- **Alto Contraste**: Colores optimizados para visibilidad
- **Texto Escalable**: Respeta configuraciones de zoom del navegador
- **Indicadores de Foco**: Clara indicación visual del elemento activo

### Atajos de Teclado:
- `Tab`: Navegar entre elementos
- `Enter/Space`: Activar botones y controles
- `Escape`: Cerrar paneles modales
- `Arrow Keys`: Navegar en componentes complejos

## 🔧 Desarrollo y Contribución

### Estructura del Proyecto
```
src/
├── components/          # Componentes React reutilizables
├── contexts/           # Contextos de React (Theme, etc.)
├── models/             # Interfaces y tipos TypeScript
├── services/           # Lógica de negocio (Parser, Traversal)
├── utils/              # Utilidades (Export, History, Validation)
└── assets/            # Recursos estáticos
```

### Principios de Desarrollo:
1. **Código TypeScript estricto** para mejor mantenibilidad
2. **Componentes funcionales** con hooks de React
3. **CSS moderno** con variables CSS y grid/flexbox
4. **Accesibilidad first** en cada componente
5. **Mobile first** en el diseño responsive

### Contribuir
1. Fork el repositorio
2. Crear una rama feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit los cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abrir un Pull Request

## 📋 Roadmap

### Próximas Características
- [ ] **Operaciones Avanzadas**: Derivadas e integrales automáticas
- [ ] **Múltiples Variables**: Soporte para polinomios multivariables
- [ ] **Comparación**: Visualización lado a lado de múltiples polinomios
- [ ] **Exportación Avanzada**: LaTeX y MathML
- [ ] **Tutoriales Interactivos**: Guías paso a paso integradas
- [ ] **Colaboración**: Compartir polinomios via URL
- [ ] **Análisis de Complejidad**: Métricas de eficiencia de algoritmos

### Mejoras Técnicas
- [ ] **Service Workers**: Funcionalidad offline completa
- [ ] **Testing**: Cobertura de pruebas al 90%+
- [ ] **Performance**: Optimización para árboles muy grandes
- [ ] **Internacionalización**: Soporte multiidioma
- [ ] **API Integration**: Backend para persistencia en la nube

## 🐛 Reporte de Errores

Si encuentras un error o tienes una sugerencia:

1. Verifica que no exista un issue similar
2. Crea un nuevo issue con:
   - Descripción detallada del problema
   - Pasos para reproducir
   - Capturas de pantalla si aplica
   - Información del navegador y sistema operativo

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- Comunidad de React por las excelentes herramientas
- Contribuidores de TypeScript por el tipado estático
- Equipo de Vite por la experiencia de desarrollo ultrarrápida
- Estudiantes y profesores que inspiraron este proyecto

## 🤝 Soporte

¿Necesitas ayuda? Puedes:
- Abrir un issue en GitHub
- Contactar al equipo de desarrollo
- Consultar la documentación en la aplicación

---

**Desarrollado con ❤️ para la comunidad educativa**

*Facilitar el aprendizaje de estructuras de datos y algoritmos a través de visualizaciones interactivas.*
