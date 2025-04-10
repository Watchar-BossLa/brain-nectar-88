import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { BarChart, LineChart, PieChart, ScatterPlot } from './charts';
import { DataLoader } from './DataLoader';
import { ChartCustomizer } from './ChartCustomizer';
import { sampleDatasets } from './sampleData';
import { Download, Share, Settings, Info } from 'lucide-react';

const DataVisualizationStudio = () => {
  const [activeDataset, setActiveDataset] = useState('sales');
  const [activeChart, setActiveChart] = useState('bar');
  const [data, setData] = useState([]);
  const [chartConfig, setChartConfig] = useState({
    title: '',
    xAxis: '',
    yAxis: '',
    color: '#3b82f6',
    showGrid: true,
    showLegend: true,
    stacked: false,
    normalized: false,
    animation: true
  });
  const [showSettings, setShowSettings] = useState(true);
  
  // Load dataset when activeDataset changes
  useEffect(() => {
    const dataset = sampleDatasets[activeDataset];
    if (dataset) {
      setData(dataset.data);
      
      // Set default axes based on dataset
      setChartConfig(prev => ({
        ...prev,
        title: dataset.name,
        xAxis: dataset.defaultAxes.x,
        yAxis: dataset.defaultAxes.y
      }));
    }
  }, [activeDataset]);
  
  // Handle chart configuration changes
  const updateChartConfig = (key, value) => {
    setChartConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Toggle settings panel
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  // Download chart as image
  const downloadChart = () => {
    const chartElement = document.querySelector('#chart-container svg');
    if (!chartElement) return;
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    const svgRect = chartElement.getBoundingClientRect();
    canvas.width = svgRect.width;
    canvas.height = svgRect.height;
    
    // Create an image from the SVG
    const svgData = new XMLSerializer().serializeToString(chartElement);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${chartConfig.title || 'chart'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };
  
  // Get available columns for the current dataset
  const getColumns = () => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  };
  
  // Render the appropriate chart component
  const renderChart = () => {
    const chartProps = {
      data,
      config: chartConfig
    };
    
    switch (activeChart) {
      case 'bar':
        return <BarChart {...chartProps} />;
      case 'line':
        return <LineChart {...chartProps} />;
      case 'pie':
        return <PieChart {...chartProps} />;
      case 'scatter':
        return <ScatterPlot {...chartProps} />;
      default:
        return <div>Select a chart type</div>;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Data Visualization Studio</CardTitle>
        <CardDescription>
          Create and customize various types of data visualizations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          {/* Dataset and Chart Type Selection */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <Label htmlFor="dataset-select">Dataset</Label>
              <Select 
                value={activeDataset} 
                onValueChange={setActiveDataset}
              >
                <SelectTrigger id="dataset-select">
                  <SelectValue placeholder="Select a dataset" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(sampleDatasets).map(key => (
                    <SelectItem key={key} value={key}>
                      {sampleDatasets[key].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-1/2">
              <Label htmlFor="chart-select">Chart Type</Label>
              <Select 
                value={activeChart} 
                onValueChange={setActiveChart}
              >
                <SelectTrigger id="chart-select">
                  <SelectValue placeholder="Select a chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                  <SelectItem value="scatter">Scatter Plot</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Chart Area */}
            <div className={`${showSettings ? 'lg:w-2/3' : 'w-full'}`}>
              <div className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">
                    {chartConfig.title || 'Chart Preview'}
                  </h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={toggleSettings}
                      title={showSettings ? "Hide Settings" : "Show Settings"}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={downloadChart}
                      title="Download Chart"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div id="chart-container" className="w-full h-[400px]">
                  {renderChart()}
                </div>
              </div>
            </div>
            
            {/* Settings Panel */}
            {showSettings && (
              <div className="lg:w-1/3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Chart Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Chart Title */}
                    <div className="space-y-2">
                      <Label htmlFor="chart-title">Chart Title</Label>
                      <Input 
                        id="chart-title" 
                        value={chartConfig.title} 
                        onChange={(e) => updateChartConfig('title', e.target.value)}
                        placeholder="Enter chart title"
                      />
                    </div>
                    
                    {/* Axes Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="x-axis">X Axis</Label>
                      <Select 
                        value={chartConfig.xAxis} 
                        onValueChange={(value) => updateChartConfig('xAxis', value)}
                        disabled={activeChart === 'pie'}
                      >
                        <SelectTrigger id="x-axis">
                          <SelectValue placeholder="Select X axis" />
                        </SelectTrigger>
                        <SelectContent>
                          {getColumns().map(column => (
                            <SelectItem key={column} value={column}>
                              {column}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="y-axis">Y Axis</Label>
                      <Select 
                        value={chartConfig.yAxis} 
                        onValueChange={(value) => updateChartConfig('yAxis', value)}
                        disabled={activeChart === 'pie'}
                      >
                        <SelectTrigger id="y-axis">
                          <SelectValue placeholder="Select Y axis" />
                        </SelectTrigger>
                        <SelectContent>
                          {getColumns().map(column => (
                            <SelectItem key={column} value={column}>
                              {column}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Color Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="chart-color">Chart Color</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="chart-color" 
                          type="color" 
                          value={chartConfig.color} 
                          onChange={(e) => updateChartConfig('color', e.target.value)}
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input 
                          value={chartConfig.color} 
                          onChange={(e) => updateChartConfig('color', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    {/* Display Options */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Display Options</h4>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-grid" className="cursor-pointer">Show Grid</Label>
                        <Switch 
                          id="show-grid" 
                          checked={chartConfig.showGrid} 
                          onCheckedChange={(checked) => updateChartConfig('showGrid', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-legend" className="cursor-pointer">Show Legend</Label>
                        <Switch 
                          id="show-legend" 
                          checked={chartConfig.showLegend} 
                          onCheckedChange={(checked) => updateChartConfig('showLegend', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="animation" className="cursor-pointer">Animation</Label>
                        <Switch 
                          id="animation" 
                          checked={chartConfig.animation} 
                          onCheckedChange={(checked) => updateChartConfig('animation', checked)}
                        />
                      </div>
                    </div>
                    
                    {/* Chart-specific Options */}
                    {activeChart === 'bar' && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Bar Chart Options</h4>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="stacked" className="cursor-pointer">Stacked</Label>
                          <Switch 
                            id="stacked" 
                            checked={chartConfig.stacked} 
                            onCheckedChange={(checked) => updateChartConfig('stacked', checked)}
                          />
                        </div>
                      </div>
                    )}
                    
                    {activeChart === 'line' && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Line Chart Options</h4>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="curve-type" className="cursor-pointer">Curve Type</Label>
                          <Select 
                            value={chartConfig.curveType || 'linear'} 
                            onValueChange={(value) => updateChartConfig('curveType', value)}
                          >
                            <SelectTrigger id="curve-type" className="w-[180px]">
                              <SelectValue placeholder="Select curve type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="linear">Linear</SelectItem>
                              <SelectItem value="natural">Natural</SelectItem>
                              <SelectItem value="step">Step</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          
          {/* Data Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      {data.length > 0 && Object.keys(data[0]).map(key => (
                        <th key={key} className="p-2 text-left text-xs font-medium text-muted-foreground">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(0, 5).map((row, i) => (
                      <tr key={i} className="border-b">
                        {Object.values(row).map((value, j) => (
                          <td key={j} className="p-2 text-xs">
                            {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.length > 5 && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Showing 5 of {data.length} rows
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Tips */}
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4 mt-0.5" />
            <p>
              Tip: Select a dataset and chart type, then customize the axes and appearance. 
              You can download your visualization as an image using the download button.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataVisualizationStudio;
