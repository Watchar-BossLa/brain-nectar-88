# Investment Portfolio Simulator

The Investment Portfolio Simulator is a component that allows users to create, analyze, and optimize investment portfolios. It provides a user-friendly interface for selecting assets, setting allocations, and visualizing portfolio performance.

## Features

- **Portfolio Builder**: Create custom portfolios by selecting from various asset classes
- **Performance Analysis**: Visualize projected portfolio growth and analyze risk-return metrics
- **Portfolio Optimization**: Optimize asset allocation based on risk tolerance
- **Simulation Settings**: Adjust parameters like initial investment, time horizon, and rebalancing frequency
- **Interactive Charts**: View portfolio growth, annual returns, and asset allocation

## Components

The Investment Portfolio Simulator consists of several components:

1. **PortfolioSimulator**: The main component that integrates all functionality
2. **AssetSelector**: A component for browsing and selecting assets
3. **PortfolioAnalysis**: A component for analyzing portfolio performance and risk
4. **PortfolioOptimizer**: A component for optimizing asset allocation
5. **Utility Functions**: Helper functions for portfolio calculations

## Usage

```jsx
import PortfolioSimulator from '@/components/finance/portfolio-simulator/PortfolioSimulator';

// In your component
const MyComponent = () => {
  return (
    <div>
      <h1>Finance Tools</h1>
      <PortfolioSimulator />
    </div>
  );
};
```

## Props

The PortfolioSimulator component does not accept any props as it manages its own state internally.

## Dependencies

- **recharts**: Used for creating the visualizations

## Examples

### Basic Usage

```jsx
<PortfolioSimulator />
```

### Integration with Finance Page

```jsx
const [showPortfolioSimulator, setShowPortfolioSimulator] = useState(false);

const openPortfolioSimulator = () => {
  setShowPortfolioSimulator(true);
};

const closePortfolioSimulator = () => {
  setShowPortfolioSimulator(false);
};

// In your render function
{showPortfolioSimulator && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-background rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Investment Portfolio Simulator</h2>
          <Button variant="ghost" onClick={closePortfolioSimulator}>
            ✕
          </Button>
        </div>
        <PortfolioSimulator />
      </div>
    </div>
  </div>
)}
```

## Educational Value

The Investment Portfolio Simulator is a valuable educational tool that helps users:

- Learn about different asset classes and their risk-return characteristics
- Understand the principles of portfolio diversification and asset allocation
- Explore the relationship between risk and return in investment portfolios
- Practice making investment decisions without risking real money
- Visualize the long-term effects of different investment strategies

This component supports both casual exploration and serious investment planning, making it suitable for students, educators, and financial enthusiasts.
