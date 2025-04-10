// Sample datasets for the Data Visualization Studio

export const sampleDatasets = {
  sales: {
    name: 'Monthly Sales Data',
    description: 'Sales data by product category over 12 months',
    defaultAxes: {
      x: 'month',
      y: 'electronics'
    },
    data: [
      { month: 'Jan', electronics: 42000, clothing: 29000, food: 31000, home: 18000 },
      { month: 'Feb', electronics: 38000, clothing: 32000, food: 28000, home: 21000 },
      { month: 'Mar', electronics: 45000, clothing: 35000, food: 33000, home: 23000 },
      { month: 'Apr', electronics: 50000, clothing: 38000, food: 32000, home: 25000 },
      { month: 'May', electronics: 48000, clothing: 40000, food: 35000, home: 28000 },
      { month: 'Jun', electronics: 52000, clothing: 42000, food: 36000, home: 30000 },
      { month: 'Jul', electronics: 58000, clothing: 45000, food: 38000, home: 32000 },
      { month: 'Aug', electronics: 62000, clothing: 48000, food: 40000, home: 36000 },
      { month: 'Sep', electronics: 55000, clothing: 44000, food: 37000, home: 33000 },
      { month: 'Oct', electronics: 60000, clothing: 46000, food: 39000, home: 35000 },
      { month: 'Nov', electronics: 70000, clothing: 52000, food: 41000, home: 38000 },
      { month: 'Dec', electronics: 85000, clothing: 68000, food: 45000, home: 42000 }
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
      { ageGroup: '10-19', population: 13800, male: 7000, female: 6800 },
      { ageGroup: '20-29', population: 16200, male: 8100, female: 8100 },
      { ageGroup: '30-39', population: 15400, male: 7600, female: 7800 },
      { ageGroup: '40-49', population: 14200, male: 7000, female: 7200 },
      { ageGroup: '50-59', population: 13100, male: 6400, female: 6700 },
      { ageGroup: '60-69', population: 10800, male: 5200, female: 5600 },
      { ageGroup: '70-79', population: 7500, male: 3500, female: 4000 },
      { ageGroup: '80+', population: 4500, male: 1800, female: 2700 }
    ]
  },
  
  expenses: {
    name: 'Household Expenses',
    description: 'Breakdown of average household expenses by category',
    defaultAxes: {
      x: 'category',
      y: 'percentage'
    },
    data: [
      { category: 'Housing', percentage: 33, amount: 1980 },
      { category: 'Transportation', percentage: 16, amount: 960 },
      { category: 'Food', percentage: 13, amount: 780 },
      { category: 'Utilities', percentage: 9, amount: 540 },
      { category: 'Healthcare', percentage: 8, amount: 480 },
      { category: 'Entertainment', percentage: 6, amount: 360 },
      { category: 'Clothing', percentage: 4, amount: 240 },
      { category: 'Education', percentage: 3, amount: 180 },
      { category: 'Savings', percentage: 5, amount: 300 },
      { category: 'Other', percentage: 3, amount: 180 }
    ]
  },
  
  temperature: {
    name: 'Average Monthly Temperatures',
    description: 'Average temperatures for different cities throughout the year',
    defaultAxes: {
      x: 'month',
      y: 'newYork'
    },
    data: [
      { month: 'Jan', newYork: 0.3, london: 4.9, tokyo: 6.1, sydney: 23.0 },
      { month: 'Feb', newYork: 1.5, london: 5.2, tokyo: 6.5, sydney: 22.8 },
      { month: 'Mar', newYork: 5.7, london: 7.6, tokyo: 9.6, sydney: 21.4 },
      { month: 'Apr', newYork: 11.3, london: 9.9, tokyo: 14.1, sydney: 19.0 },
      { month: 'May', newYork: 17.0, london: 13.3, tokyo: 18.2, sydney: 16.3 },
      { month: 'Jun', newYork: 22.0, london: 16.3, tokyo: 21.4, sydney: 14.1 },
      { month: 'Jul', newYork: 24.8, london: 18.2, tokyo: 25.0, sydney: 13.4 },
      { month: 'Aug', newYork: 24.1, london: 17.9, tokyo: 26.4, sydney: 14.5 },
      { month: 'Sep', newYork: 20.1, london: 15.0, tokyo: 22.8, sydney: 16.6 },
      { month: 'Oct', newYork: 14.1, london: 11.8, tokyo: 17.5, sydney: 18.2 },
      { month: 'Nov', newYork: 8.6, london: 7.9, tokyo: 12.1, sydney: 20.0 },
      { month: 'Dec', newYork: 2.7, london: 5.6, tokyo: 8.0, sydney: 21.8 }
    ]
  },
  
  scatter: {
    name: 'Height vs. Weight',
    description: 'Relationship between height and weight with gender grouping',
    defaultAxes: {
      x: 'height',
      y: 'weight'
    },
    data: [
      { id: 1, height: 170, weight: 65, gender: 'Male', age: 25 },
      { id: 2, height: 175, weight: 72, gender: 'Male', age: 30 },
      { id: 3, height: 182, weight: 78, gender: 'Male', age: 35 },
      { id: 4, height: 165, weight: 62, gender: 'Male', age: 28 },
      { id: 5, height: 178, weight: 75, gender: 'Male', age: 32 },
      { id: 6, height: 180, weight: 80, gender: 'Male', age: 40 },
      { id: 7, height: 173, weight: 68, gender: 'Male', age: 27 },
      { id: 8, height: 168, weight: 65, gender: 'Male', age: 22 },
      { id: 9, height: 185, weight: 85, gender: 'Male', age: 33 },
      { id: 10, height: 175, weight: 70, gender: 'Male', age: 29 },
      { id: 11, height: 160, weight: 55, gender: 'Female', age: 24 },
      { id: 12, height: 165, weight: 58, gender: 'Female', age: 31 },
      { id: 13, height: 158, weight: 52, gender: 'Female', age: 26 },
      { id: 14, height: 172, weight: 63, gender: 'Female', age: 35 },
      { id: 15, height: 168, weight: 60, gender: 'Female', age: 30 },
      { id: 16, height: 175, weight: 65, gender: 'Female', age: 28 },
      { id: 17, height: 163, weight: 57, gender: 'Female', age: 23 },
      { id: 18, height: 170, weight: 62, gender: 'Female', age: 32 },
      { id: 19, height: 155, weight: 50, gender: 'Female', age: 25 },
      { id: 20, height: 167, weight: 59, gender: 'Female', age: 29 }
    ]
  }
};
