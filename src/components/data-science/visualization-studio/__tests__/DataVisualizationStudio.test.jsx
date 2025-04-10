import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DataVisualizationStudio from '../DataVisualizationStudio';

// Mock the chart components
jest.mock('../charts', () => ({
  BarChart: () => <div data-testid="bar-chart">Bar Chart</div>,
  LineChart: () => <div data-testid="line-chart">Line Chart</div>,
  PieChart: () => <div data-testid="pie-chart">Pie Chart</div>,
  ScatterPlot: () => <div data-testid="scatter-plot">Scatter Plot</div>
}));

// Mock the sample data
jest.mock('../sampleData', () => ({
  sampleDatasets: {
    sales: {
      name: 'Monthly Sales Data',
      description: 'Sales data by product category over 12 months',
      defaultAxes: {
        x: 'month',
        y: 'electronics'
      },
      data: [
        { month: 'Jan', electronics: 42000, clothing: 29000 },
        { month: 'Feb', electronics: 38000, clothing: 32000 }
      ]
    },
    population: {
      name: 'Population by Age Group',
      description: 'Population distribution across different age groups',
      defaultAxes: {
        x: 'ageGroup',
        y: 'population'
      },
      data: [
        { ageGroup: '0-9', population: 12500, male: 6400, female: 6100 },
        { ageGroup: '10-19', population: 13800, male: 7000, female: 6800 }
      ]
    }
  }
}));

describe('DataVisualizationStudio Component', () => {
  test('renders the component', () => {
    render(<DataVisualizationStudio />);
    
    // Check if the title is rendered
    expect(screen.getByText('Data Visualization Studio')).toBeInTheDocument();
    
    // Check if the description is rendered
    expect(screen.getByText('Create and customize various types of data visualizations')).toBeInTheDocument();
    
    // Check if the dataset selector is rendered
    expect(screen.getByText('Dataset')).toBeInTheDocument();
    
    // Check if the chart type selector is rendered
    expect(screen.getByText('Chart Type')).toBeInTheDocument();
  });
  
  test('displays bar chart by default', () => {
    render(<DataVisualizationStudio />);
    
    // Check if the bar chart is rendered
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    
    // Check that other charts are not rendered
    expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pie-chart')).not.toBeInTheDocument();
    expect(screen.queryByTestId('scatter-plot')).not.toBeInTheDocument();
  });
  
  test('switches between chart types', () => {
    render(<DataVisualizationStudio />);
    
    // Initially, bar chart should be visible
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    
    // Select line chart
    fireEvent.click(screen.getByText('Chart Type'));
    fireEvent.click(screen.getByText('Line Chart'));
    
    // Now line chart should be visible and others hidden
    expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.queryByTestId('pie-chart')).not.toBeInTheDocument();
    expect(screen.queryByTestId('scatter-plot')).not.toBeInTheDocument();
    
    // Select pie chart
    fireEvent.click(screen.getByText('Chart Type'));
    fireEvent.click(screen.getByText('Pie Chart'));
    
    // Now pie chart should be visible and others hidden
    expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
    expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.queryByTestId('scatter-plot')).not.toBeInTheDocument();
    
    // Select scatter plot
    fireEvent.click(screen.getByText('Chart Type'));
    fireEvent.click(screen.getByText('Scatter Plot'));
    
    // Now scatter plot should be visible and others hidden
    expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
    expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pie-chart')).not.toBeInTheDocument();
    expect(screen.getByTestId('scatter-plot')).toBeInTheDocument();
  });
  
  test('toggles settings panel visibility', () => {
    render(<DataVisualizationStudio />);
    
    // Initially, settings panel should be visible
    expect(screen.getByText('Chart Settings')).toBeInTheDocument();
    
    // Click the settings button to hide the panel
    fireEvent.click(screen.getByTitle('Hide Settings'));
    
    // Now settings panel should be hidden
    expect(screen.queryByText('Chart Settings')).not.toBeInTheDocument();
    
    // Click the settings button again to show the panel
    fireEvent.click(screen.getByTitle('Show Settings'));
    
    // Settings panel should be visible again
    expect(screen.getByText('Chart Settings')).toBeInTheDocument();
  });
  
  test('displays data preview', () => {
    render(<DataVisualizationStudio />);
    
    // Check if the data preview section is rendered
    expect(screen.getByText('Data Preview')).toBeInTheDocument();
    
    // Check if the table headers are rendered
    expect(screen.getByText('month')).toBeInTheDocument();
    expect(screen.getByText('electronics')).toBeInTheDocument();
    expect(screen.getByText('clothing')).toBeInTheDocument();
  });
});
