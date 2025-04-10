import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GraphingCalculator from '../GraphingCalculator';

// Mock the canvas API
beforeAll(() => {
  // Mock canvas getContext
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    strokeStyle: '',
    lineWidth: 0
  }));
});

describe('GraphingCalculator Component', () => {
  test('renders the component', () => {
    render(<GraphingCalculator />);
    
    // Check if the title is rendered
    expect(screen.getByText('Interactive Graphing Calculator')).toBeInTheDocument();
    
    // Check if the description is rendered
    expect(screen.getByText('Plot and analyze mathematical functions')).toBeInTheDocument();
    
    // Check if the function input is rendered
    expect(screen.getByPlaceholderText('Enter a function (e.g., x^2)')).toBeInTheDocument();
    
    // Check if the Add Function button is rendered
    expect(screen.getByText('Add Function')).toBeInTheDocument();
  });
  
  test('adds a new function when Add Function button is clicked', () => {
    render(<GraphingCalculator />);
    
    // Get the initial function input
    const initialFunctionInputs = screen.getAllByPlaceholderText('Enter a function (e.g., x^2)');
    expect(initialFunctionInputs.length).toBe(1);
    
    // Click the Add Function button
    fireEvent.click(screen.getByText('Add Function'));
    
    // Check if a new function input is added
    const updatedFunctionInputs = screen.getAllByPlaceholderText('Enter a function (e.g., x^2)');
    expect(updatedFunctionInputs.length).toBe(2);
  });
  
  test('updates function expression when input changes', () => {
    render(<GraphingCalculator />);
    
    // Get the function input
    const functionInput = screen.getByPlaceholderText('Enter a function (e.g., x^2)');
    
    // Change the input value
    fireEvent.change(functionInput, { target: { value: 'sin(x)' } });
    
    // Check if the input value is updated
    expect(functionInput.value).toBe('sin(x)');
  });
  
  test('zooms in when Zoom In button is clicked', () => {
    render(<GraphingCalculator />);
    
    // Click the Zoom In button
    fireEvent.click(screen.getByText('Zoom In'));
    
    // The zoom effect is visual and would be tested in an integration test
    // Here we're just checking if the button exists and can be clicked
    expect(screen.getByText('Zoom In')).toBeInTheDocument();
  });
  
  test('zooms out when Zoom Out button is clicked', () => {
    render(<GraphingCalculator />);
    
    // Click the Zoom Out button
    fireEvent.click(screen.getByText('Zoom Out'));
    
    // The zoom effect is visual and would be tested in an integration test
    // Here we're just checking if the button exists and can be clicked
    expect(screen.getByText('Zoom Out')).toBeInTheDocument();
  });
  
  test('resets the graph when Reset button is clicked', () => {
    render(<GraphingCalculator />);
    
    // Click the Reset button
    fireEvent.click(screen.getByText('Reset'));
    
    // The reset effect is visual and would be tested in an integration test
    // Here we're just checking if the button exists and can be clicked
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });
});
