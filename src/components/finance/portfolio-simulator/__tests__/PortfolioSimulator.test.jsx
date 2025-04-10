import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PortfolioSimulator from '../PortfolioSimulator';

// Mock the child components
jest.mock('../AssetSelector', () => {
  return function MockAssetSelector({ assets, onAddAsset }) {
    return (
      <div data-testid="asset-selector">
        <button 
          data-testid="add-asset-button" 
          onClick={() => onAddAsset(assets[0])}
        >
          Add Asset
        </button>
      </div>
    );
  };
});

jest.mock('../PortfolioAnalysis', () => {
  return function MockPortfolioAnalysis({ portfolio }) {
    return (
      <div data-testid="portfolio-analysis">
        Portfolio Analysis ({portfolio.length} assets)
      </div>
    );
  };
});

jest.mock('../PortfolioOptimizer', () => {
  return function MockPortfolioOptimizer({ assets, currentPortfolio, onApplyOptimizedPortfolio }) {
    return (
      <div data-testid="portfolio-optimizer">
        <button 
          data-testid="optimize-button" 
          onClick={() => onApplyOptimizedPortfolio([
            { ...assets[0], allocation: 50 },
            { ...assets[1], allocation: 50 }
          ])}
        >
          Apply Optimized Portfolio
        </button>
      </div>
    );
  };
});

// Mock the sample data
jest.mock('../sampleData', () => ({
  sampleAssets: [
    {
      id: 1,
      name: "S&P 500 Index Fund",
      ticker: "SPY",
      type: "stock",
      expectedReturn: 0.10,
      risk: 0.15,
      dividendYield: 0.015
    },
    {
      id: 2,
      name: "Total Bond Market ETF",
      ticker: "BND",
      type: "bond",
      expectedReturn: 0.04,
      risk: 0.05,
      dividendYield: 0.025
    }
  ]
}));

// Mock the utility functions
jest.mock('../portfolioUtils', () => ({
  calculatePortfolioPerformance: () => [
    { month: 'Start', value: 10000 },
    { month: 'Month 1', value: 10100 },
    { month: 'Month 2', value: 10200 }
  ],
  calculateRiskReturn: () => ({
    expectedReturn: 0.08,
    risk: 0.12,
    sharpeRatio: 0.5
  }),
  optimizePortfolio: () => ({
    portfolio: [
      { id: 1, allocation: 60 },
      { id: 2, allocation: 40 }
    ],
    expectedReturn: 0.08,
    risk: 0.12,
    sharpeRatio: 0.5
  })
}));

describe('PortfolioSimulator Component', () => {
  test('renders the component', () => {
    render(<PortfolioSimulator />);
    
    // Check if the title is rendered
    expect(screen.getByText('Investment Portfolio Simulator')).toBeInTheDocument();
    
    // Check if the description is rendered
    expect(screen.getByText('Create, analyze, and optimize your investment portfolio')).toBeInTheDocument();
    
    // Check if the tabs are rendered
    expect(screen.getByText('Portfolio Builder')).toBeInTheDocument();
    expect(screen.getByText('Performance Analysis')).toBeInTheDocument();
    expect(screen.getByText('Portfolio Optimizer')).toBeInTheDocument();
  });
  
  test('adds an asset to the portfolio', () => {
    render(<PortfolioSimulator />);
    
    // Initially, portfolio should be empty
    expect(screen.getByText('Your portfolio is empty. Add assets from the selector.')).toBeInTheDocument();
    
    // Add an asset
    fireEvent.click(screen.getByTestId('add-asset-button'));
    
    // Now the portfolio should have an asset
    expect(screen.queryByText('Your portfolio is empty. Add assets from the selector.')).not.toBeInTheDocument();
    expect(screen.getByText('S&P 500 Index Fund (SPY)')).toBeInTheDocument();
  });
  
  test('switches between tabs', () => {
    render(<PortfolioSimulator />);
    
    // Initially, portfolio builder should be active
    expect(screen.getByText('Your Portfolio')).toBeInTheDocument();
    
    // Switch to Performance Analysis tab
    fireEvent.click(screen.getByText('Performance Analysis'));
    
    // Now Performance Analysis should be visible
    expect(screen.getByTestId('portfolio-analysis')).toBeInTheDocument();
    
    // Switch to Portfolio Optimizer tab
    fireEvent.click(screen.getByText('Portfolio Optimizer'));
    
    // Now Portfolio Optimizer should be visible
    expect(screen.getByTestId('portfolio-optimizer')).toBeInTheDocument();
  });
  
  test('applies optimized portfolio', () => {
    render(<PortfolioSimulator />);
    
    // Switch to Portfolio Optimizer tab
    fireEvent.click(screen.getByText('Portfolio Optimizer'));
    
    // Apply optimized portfolio
    fireEvent.click(screen.getByTestId('optimize-button'));
    
    // Switch back to Portfolio Builder tab
    fireEvent.click(screen.getByText('Portfolio Builder'));
    
    // Now the portfolio should have two assets
    expect(screen.getAllByRole('row')).toHaveLength(3); // Header row + 2 asset rows
  });
  
  test('toggles settings panel', () => {
    render(<PortfolioSimulator />);
    
    // Initially, settings panel should be visible
    expect(screen.getByText('Asset Selector')).toBeInTheDocument();
    expect(screen.getByText('Simulation Settings')).toBeInTheDocument();
    
    // Click the settings button to hide the panel
    fireEvent.click(screen.getByTitle('Hide Settings'));
    
    // Now settings panel should be hidden
    expect(screen.queryByText('Asset Selector')).not.toBeInTheDocument();
    expect(screen.queryByText('Simulation Settings')).not.toBeInTheDocument();
    
    // Click the settings button again to show the panel
    fireEvent.click(screen.getByTitle('Show Settings'));
    
    // Settings panel should be visible again
    expect(screen.getByText('Asset Selector')).toBeInTheDocument();
    expect(screen.getByText('Simulation Settings')).toBeInTheDocument();
  });
});
