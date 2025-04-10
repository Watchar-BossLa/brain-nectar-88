/**
 * Data Science Service
 * Provides functionality for data science learning features
 */

/**
 * Fetch data science topics
 * @returns {Promise<Array>} Array of data science topics
 */
export const getDataScienceTopics = async () => {
  // This would typically be a fetch call to an API
  return [
    {
      id: 'foundations',
      name: 'Foundations',
      description: 'Core concepts and skills in data science',
      subtopics: [
        { id: 'intro-data-science', name: 'Introduction to Data Science' },
        { id: 'data-collection', name: 'Data Collection & Cleaning' },
        { id: 'exploratory-analysis', name: 'Exploratory Data Analysis' },
        { id: 'data-visualization', name: 'Data Visualization' },
        { id: 'statistical-thinking', name: 'Statistical Thinking' }
      ]
    },
    {
      id: 'statistics',
      name: 'Statistics',
      description: 'Statistical methods and inference',
      subtopics: [
        { id: 'descriptive-statistics', name: 'Descriptive Statistics' },
        { id: 'probability-distributions', name: 'Probability Distributions' },
        { id: 'hypothesis-testing', name: 'Hypothesis Testing' },
        { id: 'regression-analysis', name: 'Regression Analysis' },
        { id: 'bayesian-statistics', name: 'Bayesian Statistics' }
      ]
    },
    {
      id: 'machine-learning',
      name: 'Machine Learning',
      description: 'Algorithms and techniques for predictive modeling',
      subtopics: [
        { id: 'supervised-learning', name: 'Supervised Learning' },
        { id: 'unsupervised-learning', name: 'Unsupervised Learning' },
        { id: 'feature-engineering', name: 'Feature Engineering' },
        { id: 'model-evaluation', name: 'Model Evaluation' },
        { id: 'ensemble-methods', name: 'Ensemble Methods' }
      ]
    },
    {
      id: 'deep-learning',
      name: 'Deep Learning',
      description: 'Neural networks and advanced techniques',
      subtopics: [
        { id: 'neural-networks', name: 'Neural Network Fundamentals' },
        { id: 'convolutional-networks', name: 'Convolutional Neural Networks' },
        { id: 'recurrent-networks', name: 'Recurrent Neural Networks' },
        { id: 'transformers', name: 'Transformers' },
        { id: 'generative-models', name: 'Generative Models' }
      ]
    },
    {
      id: 'data-engineering',
      name: 'Data Engineering',
      description: 'Managing and processing data at scale',
      subtopics: [
        { id: 'data-storage', name: 'Data Storage Systems' },
        { id: 'etl-processes', name: 'ETL Processes' },
        { id: 'big-data', name: 'Big Data Technologies' },
        { id: 'data-pipelines', name: 'Data Pipelines' },
        { id: 'cloud-computing', name: 'Cloud Computing' }
      ]
    }
  ];
};

/**
 * Fetch datasets for data science practice
 * @param {string} category - Dataset category
 * @returns {Promise<Array>} Array of datasets
 */
export const getDatasets = async (category = '') => {
  // This would typically be a fetch call to an API
  const datasets = [
    {
      id: 'iris',
      name: 'Iris Flower Dataset',
      category: 'classification',
      description: 'Classic dataset for classification tasks with measurements of iris flowers',
      size: '150 samples, 4 features',
      target: 'Species (3 classes)',
      sampleFeatures: ['sepal_length', 'sepal_width', 'petal_length', 'petal_width'],
      url: '/datasets/iris.csv'
    },
    {
      id: 'boston-housing',
      name: 'Boston Housing Dataset',
      category: 'regression',
      description: 'Dataset for regression tasks with housing prices in Boston suburbs',
      size: '506 samples, 13 features',
      target: 'Median home value',
      sampleFeatures: ['CRIM', 'ZN', 'INDUS', 'CHAS', 'NOX', 'RM'],
      url: '/datasets/boston_housing.csv'
    },
    {
      id: 'mnist',
      name: 'MNIST Handwritten Digits',
      category: 'image',
      description: 'Dataset of handwritten digits for image classification',
      size: '70,000 samples, 28x28 pixels',
      target: 'Digit (0-9)',
      sampleFeatures: ['pixel values (784 features)'],
      url: '/datasets/mnist.npz'
    },
    {
      id: 'imdb-reviews',
      name: 'IMDB Movie Reviews',
      category: 'text',
      description: 'Dataset of movie reviews for sentiment analysis',
      size: '50,000 reviews',
      target: 'Sentiment (positive/negative)',
      sampleFeatures: ['review_text'],
      url: '/datasets/imdb_reviews.csv'
    },
    {
      id: 'time-series-stock',
      name: 'Stock Market Data',
      category: 'time-series',
      description: 'Historical stock market data for time series analysis',
      size: '5 years of daily data',
      target: 'Closing price',
      sampleFeatures: ['open', 'high', 'low', 'close', 'volume'],
      url: '/datasets/stock_data.csv'
    }
  ];
  
  if (!category) return datasets;
  
  return datasets.filter(dataset => 
    dataset.category.toLowerCase() === category.toLowerCase()
  );
};

/**
 * Fetch data science projects
 * @param {string} difficulty - Project difficulty level
 * @returns {Promise<Array>} Array of projects
 */
export const getDataScienceProjects = async (difficulty = '') => {
  // This would typically be a fetch call to an API
  const projects = [
    {
      id: 'eda-ecommerce',
      name: 'Exploratory Data Analysis of E-commerce Sales',
      difficulty: 'beginner',
      description: 'Analyze sales data to identify trends and patterns',
      skills: ['Data cleaning', 'Visualization', 'Statistical analysis'],
      tools: ['Python', 'Pandas', 'Matplotlib'],
      estimatedTime: '4-6 hours',
      dataset: 'ecommerce_sales.csv'
    },
    {
      id: 'housing-price-prediction',
      name: 'Predicting Housing Prices with Regression',
      difficulty: 'beginner',
      description: 'Build a regression model to predict housing prices',
      skills: ['Feature engineering', 'Regression modeling', 'Model evaluation'],
      tools: ['Python', 'Scikit-learn', 'Pandas'],
      estimatedTime: '6-8 hours',
      dataset: 'housing_data.csv'
    },
    {
      id: 'customer-segmentation',
      name: 'Customer Segmentation with Clustering',
      difficulty: 'intermediate',
      description: 'Segment customers based on purchasing behavior',
      skills: ['Clustering', 'Feature selection', 'Business interpretation'],
      tools: ['Python', 'Scikit-learn', 'Seaborn'],
      estimatedTime: '8-10 hours',
      dataset: 'customer_data.csv'
    },
    {
      id: 'sentiment-analysis',
      name: 'Sentiment Analysis of Product Reviews',
      difficulty: 'intermediate',
      description: 'Analyze product reviews to determine sentiment',
      skills: ['Text preprocessing', 'NLP', 'Classification'],
      tools: ['Python', 'NLTK', 'Scikit-learn'],
      estimatedTime: '10-12 hours',
      dataset: 'product_reviews.csv'
    },
    {
      id: 'stock-prediction',
      name: 'Time Series Forecasting for Stock Prices',
      difficulty: 'advanced',
      description: 'Predict stock prices using time series models',
      skills: ['Time series analysis', 'Feature engineering', 'Model evaluation'],
      tools: ['Python', 'Pandas', 'Statsmodels', 'Prophet'],
      estimatedTime: '12-15 hours',
      dataset: 'stock_prices.csv'
    },
    {
      id: 'image-classification',
      name: 'Image Classification with CNNs',
      difficulty: 'advanced',
      description: 'Build a convolutional neural network for image classification',
      skills: ['Deep learning', 'CNN architecture', 'Hyperparameter tuning'],
      tools: ['Python', 'TensorFlow', 'Keras'],
      estimatedTime: '15-20 hours',
      dataset: 'image_dataset.zip'
    }
  ];
  
  if (!difficulty) return projects;
  
  return projects.filter(project => 
    project.difficulty.toLowerCase() === difficulty.toLowerCase()
  );
};

/**
 * Fetch code snippets for data science tutorials
 * @param {string} topic - Topic for code snippets
 * @returns {Promise<Array>} Array of code snippets
 */
export const getCodeSnippets = async (topic) => {
  // This would typically be a fetch call to an API
  const snippets = {
    'data-cleaning': [
      {
        title: 'Handling Missing Values',
        language: 'python',
        code: `import pandas as pd
import numpy as np

# Load the dataset
df = pd.read_csv('data.csv')

# Check for missing values
print(df.isnull().sum())

# Fill missing values with mean for numerical columns
df['age'].fillna(df['age'].mean(), inplace=True)

# Fill missing values with mode for categorical columns
df['category'].fillna(df['category'].mode()[0], inplace=True)

# Drop rows with any remaining missing values
df.dropna(inplace=True)

# Verify no missing values remain
print(df.isnull().sum())`
      }
    ],
    'data-visualization': [
      {
        title: 'Creating a Scatter Plot with Seaborn',
        language: 'python',
        code: `import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load the dataset
df = pd.read_csv('data.csv')

# Set the style
sns.set(style="whitegrid")

# Create a scatter plot
plt.figure(figsize=(10, 6))
sns.scatterplot(x='feature1', y='feature2', hue='category', data=df)

# Add title and labels
plt.title('Relationship between Feature 1 and Feature 2')
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')

# Show the plot
plt.show()`
      }
    ],
    'machine-learning': [
      {
        title: 'Training a Random Forest Classifier',
        language: 'python',
        code: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# Load the dataset
df = pd.read_csv('data.csv')

# Separate features and target
X = df.drop('target', axis=1)
y = df['target']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create and train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
print(f'Accuracy: {accuracy:.2f}')
print(classification_report(y_test, y_pred))`
      }
    ]
  };
  
  return snippets[topic] || [];
};

/**
 * Submit a data science project for evaluation
 * @param {string} projectId - ID of the project
 * @param {Object} submission - Project submission data
 * @returns {Promise<Object>} Evaluation results
 */
export const submitDataScienceProject = async (projectId, submission) => {
  // This would typically be a POST request to an API
  return {
    score: 85,
    feedback: 'Good work on the data preprocessing and model selection. Your analysis is thorough and well-documented.',
    strengths: [
      'Excellent data cleaning approach',
      'Good choice of visualization techniques',
      'Clear explanation of methodology'
    ],
    areasForImprovement: [
      'Consider using more advanced feature engineering techniques',
      'Try different model hyperparameters to improve performance',
      'Add more business context to your conclusions'
    ],
    nextSteps: [
      'Explore ensemble methods to improve model performance',
      'Try implementing cross-validation for more robust evaluation',
      'Consider feature importance analysis to gain more insights'
    ]
  };
};
