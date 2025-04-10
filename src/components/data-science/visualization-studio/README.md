# Data Visualization Studio

The Data Visualization Studio is a component that allows users to create and customize various types of data visualizations. It provides a user-friendly interface for selecting datasets, choosing chart types, and adjusting visualization settings.

## Features

- **Multiple Chart Types**: Bar charts, line charts, pie charts, and scatter plots
- **Interactive Customization**: Adjust colors, axes, labels, and other chart properties
- **Sample Datasets**: Pre-loaded sample datasets for immediate visualization
- **Data Preview**: View the underlying data in a tabular format
- **Export Functionality**: Download visualizations as images

## Components

The Data Visualization Studio consists of several components:

1. **DataVisualizationStudio**: The main component that integrates all functionality
2. **Charts**: Individual chart components (BarChart, LineChart, PieChart, ScatterPlot)
3. **DataLoader**: A component for loading data from files or text input
4. **ChartCustomizer**: A component for customizing chart appearance and behavior
5. **SampleData**: Pre-loaded datasets for demonstration purposes

## Usage

```jsx
import DataVisualizationStudio from '@/components/data-science/visualization-studio/DataVisualizationStudio';

// In your component
const MyComponent = () => {
  return (
    <div>
      <h1>Data Science Tools</h1>
      <DataVisualizationStudio />
    </div>
  );
};
```

## Props

The DataVisualizationStudio component does not accept any props as it manages its own state internally.

## Dependencies

- **recharts**: Used for creating the visualizations
- **lucide-react**: Used for icons

## Examples

### Basic Usage

```jsx
<DataVisualizationStudio />
```

### Integration with Data Science Page

```jsx
const [showVisualizationStudio, setShowVisualizationStudio] = useState(false);

const openVisualizationStudio = () => {
  setShowVisualizationStudio(true);
};

const closeVisualizationStudio = () => {
  setShowVisualizationStudio(false);
};

// In your render function
{showVisualizationStudio && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-background rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Data Visualization Studio</h2>
          <Button variant="ghost" onClick={closeVisualizationStudio}>
            ✕
          </Button>
        </div>
        <DataVisualizationStudio />
      </div>
    </div>
  </div>
)}
```

## Educational Value

The Data Visualization Studio is a valuable educational tool that helps users:

- Learn about different types of data visualizations and their appropriate uses
- Understand how to represent data visually for effective communication
- Explore relationships and patterns in data through interactive visualization
- Practice data analysis skills by examining different aspects of datasets
- Develop an intuition for data interpretation and presentation

This component supports both casual exploration and serious data analysis, making it suitable for students, educators, and data enthusiasts.
