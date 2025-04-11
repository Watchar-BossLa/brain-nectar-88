import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, LineChart, PieChart, Database, Code, BrainCircuit, Network } from 'lucide-react';
import { SubjectIntegration, SubjectDashboard } from '@/components/subjects';
import DataVisualizationStudio from '@/components/data-science/visualization-studio/DataVisualizationStudio';

/**
 * DataScience page component
 * @returns {React.ReactElement} DataScience page component
 */
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Data Science</h1>
            <p className="text-muted-foreground">
              Analyze and interpret complex data using statistical methods
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <SubjectDashboard 
              subject="Data Science" 
              description="Analyze and interpret complex data using statistical methods"
              progress={25}
              topics={[
                {
                  title: "Data Analysis",
                  description: "Techniques for analyzing and interpreting data",
                  status: "completed",
                  subtopics: [
                    { title: "Descriptive Statistics", completed: true },
                    { title: "Data Cleaning", completed: true },
                    { title: "Exploratory Data Analysis", completed: true },
                    { title: "Data Visualization", completed: true }
                  ]
                },
                {
                  title: "Machine Learning",
                  description: "Algorithms that learn from data",
                  status: "in_progress",
                  subtopics: [
                    { title: "Supervised Learning", completed: true },
                    { title: "Unsupervised Learning", completed: true },
                    { title: "Model Evaluation", completed: false },
                    { title: "Deep Learning", completed: false }
                  ]
                },
                {
                  title: "Big Data",
                  description: "Processing and analyzing large datasets",
                  status: "not_started",
                  subtopics: [
                    { title: "Distributed Computing", completed: false },
                    { title: "Data Storage", completed: false },
                    { title: "Data Processing", completed: false },
                    { title: "Data Pipelines", completed: false }
                  ]
                }
              ]}
            />
          </TabsContent>
          
          <TabsContent value="topics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-primary" />
                    <CardTitle>Data Analysis</CardTitle>
                  </div>
                  <CardDescription>
                    Techniques for analyzing and interpreting data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Descriptive Statistics</li>
                    <li>Data Cleaning and Preprocessing</li>
                    <li>Exploratory Data Analysis</li>
                    <li>
                      Data Visualization
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-xs text-primary ml-2"
                        onClick={openVisualizationStudio}
                      >
                        Try It
                      </Button>
                    </li>
                    <li>Statistical Inference</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    <CardTitle>Machine Learning</CardTitle>
                  </div>
                  <CardDescription>
                    Algorithms that learn from data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Supervised Learning</li>
                    <li>Unsupervised Learning</li>
                    <li>Model Evaluation and Validation</li>
                    <li>Feature Engineering</li>
                    <li>Deep Learning</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    <CardTitle>Big Data</CardTitle>
                  </div>
                  <CardDescription>
                    Processing and analyzing large datasets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Distributed Computing</li>
                    <li>Data Storage Solutions</li>
                    <li>Batch Processing</li>
                    <li>Stream Processing</li>
                    <li>Data Pipelines</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    <CardTitle>Programming for Data Science</CardTitle>
                  </div>
                  <CardDescription>
                    Programming languages and tools for data science
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Python for Data Science</li>
                    <li>R Programming</li>
                    <li>SQL for Data Analysis</li>
                    <li>Data Science Libraries</li>
                    <li>Version Control and Collaboration</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Network className="h-5 w-5 text-primary" />
                    <CardTitle>Data Science Applications</CardTitle>
                  </div>
                  <CardDescription>
                    Real-world applications of data science
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Business Intelligence</li>
                    <li>Predictive Analytics</li>
                    <li>Natural Language Processing</li>
                    <li>Computer Vision</li>
                    <li>Recommender Systems</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-primary" />
                    <CardTitle>Time Series Analysis</CardTitle>
                  </div>
                  <CardDescription>
                    Analyzing time-dependent data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Time Series Components</li>
                    <li>Forecasting Methods</li>
                    <li>ARIMA Models</li>
                    <li>Seasonal Decomposition</li>
                    <li>Time Series Visualization</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tools">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Visualization Studio</CardTitle>
                  <CardDescription>
                    Create interactive data visualizations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <BarChart className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Create bar charts, line charts, scatter plots, and more with our interactive data visualization studio.
                  </p>
                  <Button 
                    onClick={openVisualizationStudio}
                    className="w-full"
                  >
                    Launch Visualization Studio
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Machine Learning Lab</CardTitle>
                  <CardDescription>
                    Train and evaluate machine learning models
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <BrainCircuit className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Train classification, regression, and clustering models, evaluate performance, and make predictions.
                  </p>
                  <Button className="w-full">Launch ML Lab</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Data Explorer</CardTitle>
                  <CardDescription>
                    Explore and analyze datasets
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Database className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Load datasets, perform exploratory data analysis, and generate statistical summaries.
                  </p>
                  <Button className="w-full">Launch Data Explorer</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="resources">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Textbooks</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Python for Data Analysis (Wes McKinney)</li>
                      <li>Introduction to Statistical Learning (James, Witten, Hastie, Tibshirani)</li>
                      <li>Deep Learning (Goodfellow, Bengio, Courville)</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Online Courses</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Coursera: Data Science Specialization (Johns Hopkins)</li>
                      <li>edX: Data Science MicroMasters (UC San Diego)</li>
                      <li>DataCamp: Data Scientist with Python Career Track</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Video Tutorials</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>StatQuest with Josh Starmer</li>
                      <li>Krish Naik's Data Science Tutorials</li>
                      <li>3Blue1Brown: Neural Networks</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Practice Materials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Datasets</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Kaggle Datasets</li>
                      <li>UCI Machine Learning Repository</li>
                      <li>Google Dataset Search</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Competitions</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Kaggle Competitions</li>
                      <li>DrivenData Challenges</li>
                      <li>AIcrowd Challenges</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Projects</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Exploratory Data Analysis Projects</li>
                      <li>Machine Learning Model Building</li>
                      <li>Data Visualization Portfolio</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Cross-Subject Connections</h2>
          <SubjectIntegration currentSubject="Data Science" />
        </div>
        
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
