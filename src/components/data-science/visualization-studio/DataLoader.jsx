import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Database, FileText } from 'lucide-react';

export const DataLoader = ({ onDataLoaded }) => {
  const [activeTab, setActiveTab] = useState('file');
  const [fileData, setFileData] = useState(null);
  const [textData, setTextData] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [error, setError] = useState(null);
  
  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFileData(file);
    setError(null);
  };
  
  // Handle text input
  const handleTextChange = (e) => {
    setTextData(e.target.value);
    setError(null);
  };
  
  // Handle delimiter change
  const handleDelimiterChange = (e) => {
    setDelimiter(e.target.value);
  };
  
  // Parse CSV data
  const parseCSV = (text) => {
    try {
      const lines = text.split(/\\r?\\n/);
      const headers = lines[0].split(delimiter).map(header => header.trim());
      
      const data = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(delimiter);
        const row = {};
        
        headers.forEach((header, index) => {
          const value = values[index] ? values[index].trim() : '';
          
          // Try to convert to number if possible
          const numValue = Number(value);
          row[header] = isNaN(numValue) ? value : numValue;
        });
        
        data.push(row);
      }
      
      return data;
    } catch (err) {
      throw new Error('Failed to parse CSV data. Please check the format and delimiter.');
    }
  };
  
  // Load data from file
  const loadFileData = () => {
    if (!fileData) {
      setError('Please select a file to upload.');
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const data = parseCSV(text);
        onDataLoaded(data);
      } catch (err) {
        setError(err.message);
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read the file. Please try again.');
    };
    
    reader.readAsText(fileData);
  };
  
  // Load data from text input
  const loadTextData = () => {
    if (!textData.trim()) {
      setError('Please enter some data.');
      return;
    }
    
    try {
      const data = parseCSV(textData);
      onDataLoaded(data);
    } catch (err) {
      setError(err.message);
    }
  };
  
  // Load data based on active tab
  const loadData = () => {
    setError(null);
    
    if (activeTab === 'file') {
      loadFileData();
    } else if (activeTab === 'text') {
      loadTextData();
    }
  };
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="file">
            <Upload className="h-4 w-4 mr-2" />
            File Upload
          </TabsTrigger>
          <TabsTrigger value="text">
            <FileText className="h-4 w-4 mr-2" />
            Text Input
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="file" className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="file-upload">Upload CSV File</Label>
            <Input 
              id="file-upload" 
              type="file" 
              accept=".csv" 
              onChange={handleFileChange}
            />
          </div>
          
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="delimiter">Delimiter</Label>
            <Input 
              id="delimiter" 
              value={delimiter} 
              onChange={handleDelimiterChange}
              placeholder="Delimiter (e.g., comma, tab)"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Common delimiters: comma (,), tab (\\t), semicolon (;)
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="text" className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="csv-text">Paste CSV Data</Label>
            <Textarea 
              id="csv-text" 
              value={textData} 
              onChange={handleTextChange}
              placeholder="Paste your CSV data here..."
              className="min-h-[200px]"
            />
          </div>
          
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="text-delimiter">Delimiter</Label>
            <Input 
              id="text-delimiter" 
              value={delimiter} 
              onChange={handleDelimiterChange}
              placeholder="Delimiter (e.g., comma, tab)"
              className="w-full"
            />
          </div>
        </TabsContent>
      </Tabs>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Button onClick={loadData} className="w-full">
        <Database className="h-4 w-4 mr-2" />
        Load Data
      </Button>
    </div>
  );
};

export default DataLoader;
