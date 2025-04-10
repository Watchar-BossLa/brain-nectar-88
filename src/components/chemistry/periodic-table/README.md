# Interactive Periodic Table

The Interactive Periodic Table is a component that allows users to explore the elements of the periodic table, view detailed information about each element, and visualize periodic trends.

## Features

- **Complete Periodic Table**: Displays all elements in their correct positions
- **Element Details**: Shows comprehensive information about each element when clicked
- **Search and Filter**: Allows users to search for elements by name, symbol, or atomic number, and filter by category
- **Periodic Trends**: Visualizes trends such as atomic radius, electronegativity, and ionization energy
- **Responsive Design**: Adapts to different screen sizes

## Components

The Interactive Periodic Table consists of four main components:

1. **PeriodicTable**: The main component that integrates all functionality
2. **ElementCard**: Displays basic information about an element in the table
3. **ElementDetails**: Shows detailed information about a selected element
4. **PeriodicTrends**: Visualizes periodic trends across the table

## Usage

```jsx
import PeriodicTable from '@/components/chemistry/periodic-table/PeriodicTable';

// In your component
const MyComponent = () => {
  return (
    <div>
      <h1>Chemistry Tools</h1>
      <PeriodicTable />
    </div>
  );
};
```

## Props

The PeriodicTable component does not accept any props as it manages its own state internally.

## Dependencies

- **lucide-react**: Used for icons

## Data Structure

The component uses a data file (`periodicTableData.js`) that contains information about each element, including:

- Basic properties (name, symbol, atomic number, atomic mass)
- Physical properties (phase, density, melting point, boiling point)
- Electronic properties (electronegativity, electron configuration, ionization energy)
- Historical information (discovery, named after)
- Applications and interesting facts

## Examples

### Basic Usage

```jsx
<PeriodicTable />
```

### Integration with Chemistry Page

```jsx
const [showPeriodicTable, setShowPeriodicTable] = useState(false);

const openPeriodicTable = () => {
  setShowPeriodicTable(true);
};

const closePeriodicTable = () => {
  setShowPeriodicTable(false);
};

// In your render function
{showPeriodicTable && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-background rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Interactive Periodic Table</h2>
          <Button variant="ghost" onClick={closePeriodicTable}>
            ✕
          </Button>
        </div>
        <PeriodicTable />
      </div>
    </div>
  </div>
)}
```

## Educational Value

The Interactive Periodic Table is a valuable educational tool that helps users:

- Learn about the properties and characteristics of elements
- Understand the organization of the periodic table
- Visualize and comprehend periodic trends
- Explore the relationships between elements
- Discover the applications and importance of different elements

This component supports both casual exploration and serious study of chemistry, making it suitable for students, educators, and chemistry enthusiasts.
