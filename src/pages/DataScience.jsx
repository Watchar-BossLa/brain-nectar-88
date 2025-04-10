import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, LineChart, PieChart, Database, Code, BrainCircuit, Network } from 'lucide-react';
import DataVisualizationStudio from '@/components/data-science/visualization-studio/DataVisualizationStudio';

const DataScience = () => {
  const [showVisualizationStudio, setShowVisualizationStudio] = useState(false);

  const openVisualizationStudio = () => {
    setShowVisualizationStudio(true);
  };

  const closeVisualizationStudio = () => {
    setShowVisualizationStudio(false);
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center gap-3 mb-6">
          <BarChart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Data Science Learning Center</h1>
        </div>

        <p className="text-muted-foreground mb-8 max-w-3xl">
          Master the art and science of extracting insights from data. From statistical analysis
          to machine learning, develop the skills to transform raw data into valuable knowledge
          and predictions through interactive tutorials and hands-on projects.
        </p>

        <Tabs defaultValue="topics" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="tools">Interactive Tools</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="datasets">Datasets</TabsTrigger>
          </TabsList>

          <TabsContent value="topics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Foundations */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Foundations
                  </CardTitle>
                  <CardDescription>Core concepts and skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Introduction to Data Science</li>
                    <li>Data Collection & Cleaning</li>
                    <li>Exploratory Data Analysis</li>
                    <li>Data Visualization</li>
                    <li>Statistical Thinking</li>
                    <li>Programming for Data Science</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Statistics
                  </CardTitle>
                  <CardDescription>Statistical methods and inference</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Descriptive Statistics</li>
                    <li>Probability Distributions</li>
                    <li>Hypothesis Testing</li>
                    <li>Regression Analysis</li>
                    <li>Experimental Design</li>
                    <li>Bayesian Statistics</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Machine Learning */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5" />
                    Machine Learning
                  </CardTitle>
                  <CardDescription>Algorithms and techniques</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Supervised Learning</li>
                    <li>Unsupervised Learning</li>
                    <li>Feature Engineering</li>
                    <li>Model Evaluation</li>
                    <li>Ensemble Methods</li>
                    <li>Time Series Analysis</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Deep Learning */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    Deep Learning
                  </CardTitle>
                  <CardDescription>Neural networks and applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Neural Network Fundamentals</li>
                    <li>Convolutional Neural Networks</li>
                    <li>Recurrent Neural Networks</li>
                    <li>Transformers</li>
                    <li>Generative Models</li>
                    <li>Transfer Learning</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Data Engineering */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Data Engineering
                  </CardTitle>
                  <CardDescription>Managing and processing data</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Data Storage Systems</li>
                    <li>ETL Processes</li>
                    <li>Big Data Technologies</li>
                    <li>Data Pipelines</li>
                    <li>Cloud Computing</li>
                    <li>Data Governance</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Applied Data Science */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Applied Data Science
                  </CardTitle>
                  <CardDescription>Domain-specific applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Natural Language Processing</li>
                    <li>Computer Vision</li>
                    <li>Recommender Systems</li>
                    <li>Time Series Forecasting</li>
                    <li>Anomaly Detection</li>
                    <li>Causal Inference</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tools">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Interactive Notebooks</CardTitle>
                  <CardDescription>Code, visualize, and analyze data in your browser</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Our interactive notebooks allow you to write and execute Python code,
                    create visualizations, and analyze data directly in your browser.
                    No installation required!
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <Code className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Supports Python, R, and SQL</span>
                  </div>
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                    Launch Notebook
                  </button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Visualization Studio</CardTitle>
                  <CardDescription>Create interactive visualizations</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Explore data through interactive visualizations. Create charts, graphs,
                    and dashboards to communicate insights effectively.
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Supports various chart types and customizations</span>
                  </div>
                  <Button
                    onClick={openVisualizationStudio}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Launch Visualization Studio
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Machine Learning Playground</CardTitle>
                  <CardDescription>Train and evaluate ML models interactively</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Experiment with different machine learning algorithms, tune hyperparameters,
                    and evaluate model performance without writing code.
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <BrainCircuit className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Supports classification, regression, and clustering</span>
                  </div>
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                    Launch ML Playground
                  </button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistical Analysis Tool</CardTitle>
                  <CardDescription>Perform statistical tests and analyses</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Conduct statistical tests, analyze distributions, and perform
                    regression analyses with an intuitive interface.
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <LineChart className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Includes hypothesis testing and confidence intervals</span>
                  </div>
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                    Launch Statistics Tool
                  </button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Hands-on Data Science Projects</CardTitle>
                <CardDescription>
                  Apply your skills to real-world problems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Our project-based learning approach helps you build a portfolio of data science projects
                  that demonstrate your skills to potential employers. Each project includes datasets,
                  guided instructions, and opportunities for creative exploration.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Beginner Projects</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <BarChart className="h-4 w-4 text-primary" />
                        <span>Exploratory Data Analysis of E-commerce Sales</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <LineChart className="h-4 w-4 text-primary" />
                        <span>Predicting Housing Prices with Regression</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <PieChart className="h-4 w-4 text-primary" />
                        <span>Customer Segmentation with Clustering</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Intermediate Projects</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <BrainCircuit className="h-4 w-4 text-primary" />
                        <span>Sentiment Analysis of Product Reviews</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <LineChart className="h-4 w-4 text-primary" />
                        <span>Time Series Forecasting for Stock Prices</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Network className="h-4 w-4 text-primary" />
                        <span>Image Classification with CNNs</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border rounded-lg p-4 mb-6">
                  <h3 className="font-medium mb-2">Advanced Projects</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Network className="h-4 w-4 text-primary" />
                      <span>Natural Language Processing for Text Summarization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BrainCircuit className="h-4 w-4 text-primary" />
                      <span>Recommender System for Personalized Content</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-primary" />
                      <span>Fraud Detection in Financial Transactions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Network className="h-4 w-4 text-primary" />
                      <span>Building a Chatbot with Transformer Models</span>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-center">
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md">
                    Browse All Projects
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="datasets">
            <Card>
              <CardHeader>
                <CardTitle>Dataset Library</CardTitle>
                <CardDescription>
                  Explore and analyze curated datasets for learning and practice
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search datasets by name, category, or tags..."
                      className="w-full px-4 py-2 border rounded-md pr-10"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Categories</h3>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        <span>Business & Finance</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        <span>Healthcare & Life Sciences</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        <span>Social Sciences</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        <span>Technology & Engineering</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        <span>Environment & Climate</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Data Types</h3>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <BarChart className="h-4 w-4" />
                        <span>Tabular Data</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <LineChart className="h-4 w-4" />
                        <span>Time Series</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        <span>Text Data</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Network className="h-4 w-4" />
                        <span>Image Data</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Network className="h-4 w-4" />
                        <span>Network/Graph Data</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Featured Datasets</h3>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        <span>Customer Purchase History</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        <span>Medical Diagnosis Records</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        <span>Stock Market Historical Data</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        <span>Social Media Sentiment</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        <span>Climate Change Indicators</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Dataset Explorer</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our Dataset Explorer allows you to preview datasets, explore their structure,
                    and perform basic analyses before downloading or using them in your projects.
                  </p>
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                    Open Dataset Explorer
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Data Visualization Studio Modal */}
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
      </div>
    </MainLayout>
  );
};

export default DataScience;
