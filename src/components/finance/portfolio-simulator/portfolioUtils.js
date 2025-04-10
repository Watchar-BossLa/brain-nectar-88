// Utility functions for portfolio calculations

// Calculate portfolio performance over time
export const calculatePortfolioPerformance = (
  portfolio, 
  initialInvestment, 
  timeHorizon, 
  rebalancingFrequency, 
  reinvestDividends
) => {
  if (portfolio.length === 0) return [];
  
  // Validate total allocation is 100%
  const totalAllocation = portfolio.reduce((sum, asset) => sum + asset.allocation, 0);
  if (Math.abs(totalAllocation - 100) > 0.01) {
    // Normalize allocations to 100%
    portfolio = portfolio.map(asset => ({
      ...asset,
      allocation: (asset.allocation / totalAllocation) * 100
    }));
  }
  
  // Convert time horizon to months
  const months = timeHorizon * 12;
  
  // Initialize performance data
  const performanceData = [{ month: 'Start', value: initialInvestment }];
  
  // Initialize portfolio value
  let currentValue = initialInvestment;
  
  // Initialize asset values
  let assetValues = portfolio.map(asset => ({
    id: asset.id,
    value: (asset.allocation / 100) * initialInvestment
  }));
  
  // Determine rebalancing frequency in months
  let rebalanceInterval;
  switch (rebalancingFrequency) {
    case 'monthly':
      rebalanceInterval = 1;
      break;
    case 'quarterly':
      rebalanceInterval = 3;
      break;
    case 'yearly':
      rebalanceInterval = 12;
      break;
    case 'never':
      rebalanceInterval = Infinity;
      break;
    default:
      rebalanceInterval = 12; // Default to yearly
  }
  
  // Simulate performance month by month
  for (let month = 1; month <= months; month++) {
    // Calculate monthly returns for each asset
    assetValues = assetValues.map(assetValue => {
      const asset = portfolio.find(a => a.id === assetValue.id);
      
      // Calculate monthly return (annual return divided by 12)
      const monthlyReturn = asset.expectedReturn / 12;
      
      // Calculate monthly dividend (annual dividend divided by 12)
      const monthlyDividend = (asset.dividendYield || 0) / 12;
      
      // Calculate new value with growth
      let newValue = assetValue.value * (1 + monthlyReturn);
      
      // Add dividends if applicable
      if (asset.dividendYield) {
        const dividend = assetValue.value * monthlyDividend;
        if (reinvestDividends) {
          newValue += dividend;
        }
      }
      
      return {
        id: assetValue.id,
        value: newValue
      };
    });
    
    // Calculate total portfolio value
    currentValue = assetValues.reduce((sum, asset) => sum + asset.value, 0);
    
    // Add to performance data
    performanceData.push({
      month: `Month ${month}`,
      value: currentValue
    });
    
    // Rebalance if needed
    if (month % rebalanceInterval === 0 && rebalanceInterval !== Infinity) {
      const targetValues = portfolio.map(asset => ({
        id: asset.id,
        value: (asset.allocation / 100) * currentValue
      }));
      
      assetValues = targetValues;
    }
  }
  
  return performanceData;
};

// Calculate portfolio risk and return metrics
export const calculateRiskReturn = (portfolio) => {
  if (portfolio.length === 0) return { expectedReturn: 0, risk: 0, sharpeRatio: 0 };
  
  // Validate total allocation is 100%
  const totalAllocation = portfolio.reduce((sum, asset) => sum + asset.allocation, 0);
  if (totalAllocation === 0) return { expectedReturn: 0, risk: 0, sharpeRatio: 0 };
  
  // Normalize allocations if needed
  const normalizedPortfolio = portfolio.map(asset => ({
    ...asset,
    allocation: totalAllocation !== 100 ? (asset.allocation / totalAllocation) * 100 : asset.allocation
  }));
  
  // Calculate expected return (weighted average)
  const expectedReturn = normalizedPortfolio.reduce(
    (sum, asset) => sum + (asset.expectedReturn * (asset.allocation / 100)), 
    0
  );
  
  // In a real application, we would use a covariance matrix for risk calculation
  // For simplicity, we'll use a weighted average of individual risks with a diversification benefit
  const weightedRisk = normalizedPortfolio.reduce(
    (sum, asset) => sum + (asset.risk * (asset.allocation / 100)), 
    0
  );
  
  // Apply a simple diversification benefit based on number of assets
  // More assets = more diversification = lower risk
  const diversificationFactor = Math.max(0.6, 1 - (normalizedPortfolio.length - 1) * 0.05);
  const risk = weightedRisk * diversificationFactor;
  
  // Calculate Sharpe ratio (assuming risk-free rate of 0.02 or 2%)
  const riskFreeRate = 0.02;
  const excessReturn = expectedReturn - riskFreeRate;
  const sharpeRatio = risk > 0 ? excessReturn / risk : 0;
  
  return { expectedReturn, risk, sharpeRatio };
};

// Optimize portfolio based on risk tolerance
export const optimizePortfolio = (assets, riskTolerance) => {
  if (assets.length === 0) return { portfolio: [], expectedReturn: 0, risk: 0, sharpeRatio: 0 };
  
  // In a real application, this would use mean-variance optimization or similar algorithms
  // For simplicity, we'll use a heuristic approach based on risk tolerance
  
  // Sort assets by Sharpe ratio (risk-adjusted return)
  const sortedAssets = [...assets].sort((a, b) => {
    const sharpeA = a.risk > 0 ? a.expectedReturn / a.risk : 0;
    const sharpeB = b.risk > 0 ? b.expectedReturn / b.risk : 0;
    return sharpeB - sharpeA; // Descending order
  });
  
  // Create portfolio based on risk tolerance
  // Higher risk tolerance = more weight to higher return assets
  const portfolio = [];
  let remainingAllocation = 100;
  
  // First, allocate to assets with highest Sharpe ratio
  const topAssets = sortedAssets.slice(0, Math.min(5, sortedAssets.length));
  
  // Allocate based on risk tolerance and Sharpe ratio
  topAssets.forEach((asset, index) => {
    // Calculate base allocation
    let allocation;
    
    if (index === 0) {
      // First asset gets more allocation
      allocation = 40 - (riskTolerance * 10);
    } else {
      // Remaining assets get less
      allocation = (60 / (topAssets.length - 1)) + (index * riskTolerance * 2);
    }
    
    // Ensure allocation is positive
    allocation = Math.max(5, allocation);
    
    // Ensure we don't exceed 100%
    allocation = Math.min(allocation, remainingAllocation);
    remainingAllocation -= allocation;
    
    portfolio.push({
      ...asset,
      allocation
    });
  });
  
  // If we have remaining allocation, distribute it proportionally
  if (remainingAllocation > 0 && portfolio.length > 0) {
    const totalCurrentAllocation = 100 - remainingAllocation;
    portfolio.forEach(asset => {
      const additionalAllocation = (asset.allocation / totalCurrentAllocation) * remainingAllocation;
      asset.allocation += additionalAllocation;
    });
  }
  
  // Calculate portfolio metrics
  const { expectedReturn, risk, sharpeRatio } = calculateRiskReturn(portfolio);
  
  return { portfolio, expectedReturn, risk, sharpeRatio };
};
