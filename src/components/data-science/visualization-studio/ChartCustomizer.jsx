import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const ChartCustomizer = ({ data, config, updateConfig }) => {
  // Get available columns from data
  const getColumns = () => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  };
  
  // Get numerical columns from data
  const getNumericalColumns = () => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).filter(key => typeof data[0][key] === 'number');
  };
  
  // Get categorical columns from data
  const getCategoricalColumns = () => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).filter(key => typeof data[0][key] === 'string');
  };
  
  const columns = getColumns();
  const numericalColumns = getNumericalColumns();
  const categoricalColumns = getCategoricalColumns();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chart Customization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="data">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="data" className="space-y-4 pt-4">
            {/* Chart Title */}
            <div className="space-y-2">
              <Label htmlFor="chart-title">Chart Title</Label>
              <Input 
                id="chart-title" 
                value={config.title} 
                onChange={(e) => updateConfig('title', e.target.value)}
                placeholder="Enter chart title"
              />
            </div>
            
            {/* X Axis Selection */}
            <div className="space-y-2">
              <Label htmlFor="x-axis">X Axis</Label>
              <Select 
                value={config.xAxis} 
                onValueChange={(value) => updateConfig('xAxis', value)}
              >
                <SelectTrigger id="x-axis">
                  <SelectValue placeholder="Select X axis" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map(column => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Y Axis Selection */}
            <div className="space-y-2">
              <Label htmlFor="y-axis">Y Axis</Label>
              <Select 
                value={config.yAxis} 
                onValueChange={(value) => updateConfig('yAxis', value)}
              >
                <SelectTrigger id="y-axis">
                  <SelectValue placeholder="Select Y axis" />
                </SelectTrigger>
                <SelectContent>
                  {numericalColumns.map(column => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Group By (for certain chart types) */}
            {(config.chartType === 'bar' || config.chartType === 'line') && (
              <div className="space-y-2">
                <Label htmlFor="group-by">Group By (Optional)</Label>
                <Select 
                  value={config.groupBy} 
                  onValueChange={(value) => updateConfig('groupBy', value)}
                >
                  <SelectTrigger id="group-by">
                    <SelectValue placeholder="Select grouping column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {categoricalColumns.map(column => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4 pt-4">
            {/* Color Selection */}
            <div className="space-y-2">
              <Label htmlFor="chart-color">Chart Color</Label>
              <div className="flex gap-2">
                <Input 
                  id="chart-color" 
                  type="color" 
                  value={config.color} 
                  onChange={(e) => updateConfig('color', e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input 
                  value={config.color} 
                  onChange={(e) => updateConfig('color', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            {/* Font Size */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="font-size">Font Size</Label>
                <span>{config.fontSize || 12}px</span>
              </div>
              <Slider
                id="font-size"
                min={8}
                max={24}
                step={1}
                value={[config.fontSize || 12]}
                onValueChange={(value) => updateConfig('fontSize', value[0])}
              />
            </div>
            
            {/* Display Options */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Display Options</h4>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-grid" className="cursor-pointer">Show Grid</Label>
                <Switch 
                  id="show-grid" 
                  checked={config.showGrid} 
                  onCheckedChange={(checked) => updateConfig('showGrid', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-legend" className="cursor-pointer">Show Legend</Label>
                <Switch 
                  id="show-legend" 
                  checked={config.showLegend} 
                  onCheckedChange={(checked) => updateConfig('showLegend', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="animation" className="cursor-pointer">Animation</Label>
                <Switch 
                  id="animation" 
                  checked={config.animation} 
                  onCheckedChange={(checked) => updateConfig('animation', checked)}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 pt-4">
            {/* Chart-specific Options */}
            {config.chartType === 'bar' && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Bar Chart Options</h4>
                <div className="flex items-center justify-between">
                  <Label htmlFor="stacked" className="cursor-pointer">Stacked</Label>
                  <Switch 
                    id="stacked" 
                    checked={config.stacked} 
                    onCheckedChange={(checked) => updateConfig('stacked', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="horizontal" className="cursor-pointer">Horizontal</Label>
                  <Switch 
                    id="horizontal" 
                    checked={config.horizontal} 
                    onCheckedChange={(checked) => updateConfig('horizontal', checked)}
                  />
                </div>
              </div>
            )}
            
            {config.chartType === 'line' && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Line Chart Options</h4>
                <div className="space-y-2">
                  <Label htmlFor="curve-type">Curve Type</Label>
                  <Select 
                    value={config.curveType || 'linear'} 
                    onValueChange={(value) => updateConfig('curveType', value)}
                  >
                    <SelectTrigger id="curve-type">
                      <SelectValue placeholder="Select curve type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">Linear</SelectItem>
                      <SelectItem value="natural">Natural</SelectItem>
                      <SelectItem value="step">Step</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-points" className="cursor-pointer">Show Points</Label>
                  <Switch 
                    id="show-points" 
                    checked={config.showPoints} 
                    onCheckedChange={(checked) => updateConfig('showPoints', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="fill-area" className="cursor-pointer">Fill Area</Label>
                  <Switch 
                    id="fill-area" 
                    checked={config.fillArea} 
                    onCheckedChange={(checked) => updateConfig('fillArea', checked)}
                  />
                </div>
              </div>
            )}
            
            {config.chartType === 'pie' && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Pie Chart Options</h4>
                <div className="flex items-center justify-between">
                  <Label htmlFor="donut" className="cursor-pointer">Donut Chart</Label>
                  <Switch 
                    id="donut" 
                    checked={config.donut} 
                    onCheckedChange={(checked) => updateConfig('donut', checked)}
                  />
                </div>
                {config.donut && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="inner-radius">Inner Radius</Label>
                      <span>{config.innerRadius || 40}%</span>
                    </div>
                    <Slider
                      id="inner-radius"
                      min={10}
                      max={90}
                      step={5}
                      value={[config.innerRadius || 40]}
                      onValueChange={(value) => updateConfig('innerRadius', value[0])}
                    />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-labels" className="cursor-pointer">Show Labels</Label>
                  <Switch 
                    id="show-labels" 
                    checked={config.showLabels} 
                    onCheckedChange={(checked) => updateConfig('showLabels', checked)}
                  />
                </div>
              </div>
            )}
            
            {config.chartType === 'scatter' && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Scatter Plot Options</h4>
                <div className="space-y-2">
                  <Label htmlFor="point-size">Point Size</Label>
                  <Slider
                    id="point-size"
                    min={2}
                    max={20}
                    step={1}
                    value={[config.pointSize || 5]}
                    onValueChange={(value) => updateConfig('pointSize', value[0])}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="z-axis">Z Axis (Size, Optional)</Label>
                  <Select 
                    value={config.zAxis} 
                    onValueChange={(value) => updateConfig('zAxis', value)}
                  >
                    <SelectTrigger id="z-axis">
                      <SelectValue placeholder="Select Z axis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {numericalColumns.map(column => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ChartCustomizer;
