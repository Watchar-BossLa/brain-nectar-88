# Interactive Graphing Calculator

The Interactive Graphing Calculator is a component that allows users to plot and analyze mathematical functions. It provides a user-friendly interface for entering functions, adjusting graph settings, and visualizing mathematical relationships.

## Features

- Plot multiple functions with different colors
- Zoom in and out of the graph
- Adjust X and Y ranges
- Change grid size
- Toggle function visibility
- Download the graph as an image

## Components

The Interactive Graphing Calculator consists of three main components:

1. **GraphingCalculator**: The main component that integrates all functionality
2. **FunctionInput**: A component for entering and managing function expressions
3. **GraphControls**: A component for adjusting graph settings

## Usage

```jsx
import GraphingCalculator from '@/components/mathematics/graphing-calculator/GraphingCalculator';

// In your component
const MyComponent = () => {
  return (
    <div>
      <h1>Mathematics Tools</h1>
      <GraphingCalculator />
    </div>
  );
};
```

## Props

The GraphingCalculator component does not accept any props as it manages its own state internally.

## State

The GraphingCalculator component manages the following state:

- `functions`: An array of function objects with properties:
  - `id`: A unique identifier for the function
  - `expression`: The mathematical expression to plot
  - `color`: The color to use for plotting the function
  - `visible`: Whether the function is visible on the graph
  - `error`: Any error message associated with the function
- `xRange`: The range of x values to display on the graph
- `yRange`: The range of y values to display on the graph
- `gridSize`: The size of the grid lines on the graph

## Dependencies

- **mathjs**: Used for parsing and evaluating mathematical expressions
- **lucide-react**: Used for icons

## Examples

### Basic Usage

```jsx
<GraphingCalculator />
```

### Integration with Mathematics Page

```jsx
const [activeCalculator, setActiveCalculator] = useState(null);

const openCalculator = (calculator) => {
  setActiveCalculator(calculator);
};

const closeCalculator = () => {
  setActiveCalculator(null);
};

// In your render function
{activeCalculator === 'graphing' && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-background rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Interactive Graphing Calculator</h2>
          <Button variant="ghost" onClick={closeCalculator}>
            ✕
          </Button>
        </div>
        <GraphingCalculator />
      </div>
    </div>
  </div>
)}
```

## Testing

The GraphingCalculator component has unit tests that verify its basic functionality. To run the tests:

```bash
npm test
```

For more detailed testing, refer to the [Graphing Calculator Test Plan](../../../../test-plans/graphing-calculator-test-plan.md).
