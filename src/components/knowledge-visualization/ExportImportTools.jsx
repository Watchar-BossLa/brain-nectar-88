import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { Download, Upload, FileJson, FileText, Check, AlertCircle } from 'lucide-react';

/**
 * Export/Import Tools Component
 * Allows users to export and import knowledge maps and data
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onExport - Function to call when exporting data
 * @param {Function} props.onImport - Function to call when importing data
 * @returns {React.ReactElement} Export/Import tools component
 */
const ExportImportTools = ({ onExport, onImport }) => {
  const [activeTab, setActiveTab] = useState('export');
  const [exportFormat, setExportFormat] = useState('json');
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importValidation, setImportValidation] = useState(null);
  const fileInputRef = useRef(null);
  
  // Handle export
  const handleExport = async () => {
    setExportLoading(true);
    
    try {
      // Get data from parent component
      const data = await onExport();
      
      if (!data) {
        throw new Error('No data to export');
      }
      
      // Format data based on selected format
      let exportData;
      let mimeType;
      let fileExtension;
      
      if (exportFormat === 'json') {
        exportData = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        fileExtension = 'json';
      } else if (exportFormat === 'csv') {
        // Simple CSV conversion (in a real app, this would be more sophisticated)
        const headers = Object.keys(data[0] || {}).join(',');
        const rows = data.map(item => Object.values(item).join(','));
        exportData = [headers, ...rows].join('\n');
        mimeType = 'text/csv';
        fileExtension = 'csv';
      } else if (exportFormat === 'txt') {
        // Simple text export
        exportData = JSON.stringify(data, null, 2);
        mimeType = 'text/plain';
        fileExtension = 'txt';
      }
      
      // Create a downloadable file
      const blob = new Blob([exportData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().split('T')[0];
      
      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `knowledge-map-export-${timestamp}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Export Successful',
        description: `Your knowledge map has been exported as ${fileExtension.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: error.message || 'Failed to export knowledge map',
        variant: 'destructive',
      });
    } finally {
      setExportLoading(false);
    }
  };
  
  // Handle file selection for import
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const content = event.target.result;
        let data;
        
        // Parse file based on type
        if (file.type === 'application/json' || file.name.endsWith('.json')) {
          data = JSON.parse(content);
        } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          // Simple CSV parsing (in a real app, this would be more sophisticated)
          const lines = content.split('\n');
          const headers = lines[0].split(',');
          data = lines.slice(1).map(line => {
            const values = line.split(',');
            return headers.reduce((obj, header, index) => {
              obj[header] = values[index];
              return obj;
            }, {});
          });
        } else {
          throw new Error('Unsupported file format');
        }
        
        // Validate data structure
        if (!Array.isArray(data) && !data.nodes) {
          throw new Error('Invalid data format');
        }
        
        // Set validation status
        setImportValidation({
          valid: true,
          message: 'File validated successfully',
          data
        });
      } catch (error) {
        console.error('Import validation error:', error);
        setImportValidation({
          valid: false,
          message: error.message || 'Invalid file format'
        });
      }
    };
    
    reader.onerror = () => {
      setImportValidation({
        valid: false,
        message: 'Error reading file'
      });
    };
    
    if (file.type === 'application/json' || file.name.endsWith('.json') || 
        file.type === 'text/csv' || file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      setImportValidation({
        valid: false,
        message: 'Unsupported file format'
      });
    }
  };
  
  // Handle import
  const handleImport = async () => {
    if (!importValidation || !importValidation.valid || !importValidation.data) {
      toast({
        title: 'Import Failed',
        description: 'Please select a valid file to import',
        variant: 'destructive',
      });
      return;
    }
    
    setImportLoading(true);
    
    try {
      // Pass data to parent component
      await onImport(importValidation.data);
      
      toast({
        title: 'Import Successful',
        description: 'Your knowledge map has been imported',
      });
      
      // Reset form
      setImportValidation(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: 'Import Failed',
        description: error.message || 'Failed to import knowledge map',
        variant: 'destructive',
      });
    } finally {
      setImportLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export & Import</CardTitle>
        <CardDescription>
          Export your knowledge maps or import from external sources
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>Import</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="export" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="exportFormat">Export Format</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={exportFormat === 'json' ? 'default' : 'outline'}
                  className="flex items-center justify-center"
                  onClick={() => setExportFormat('json')}
                >
                  <FileJson className="h-4 w-4 mr-2" />
                  JSON
                </Button>
                <Button
                  variant={exportFormat === 'csv' ? 'default' : 'outline'}
                  className="flex items-center justify-center"
                  onClick={() => setExportFormat('csv')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button
                  variant={exportFormat === 'txt' ? 'default' : 'outline'}
                  className="flex items-center justify-center"
                  onClick={() => setExportFormat('txt')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  TXT
                </Button>
              </div>
            </div>
            
            <div className="pt-2">
              <Button
                onClick={handleExport}
                disabled={exportLoading}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                {exportLoading ? 'Exporting...' : 'Export Knowledge Map'}
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Export your knowledge map to share with others or use in other applications.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="import" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="importFile">Import File</Label>
              <Input
                id="importFile"
                type="file"
                accept=".json,.csv"
                onChange={handleFileSelect}
                ref={fileInputRef}
              />
            </div>
            
            {importValidation && (
              <div className={`p-3 rounded-md ${
                importValidation.valid 
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                  : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                <div className="flex items-start">
                  {importValidation.valid ? (
                    <Check className="h-5 w-5 mr-2 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">{importValidation.valid ? 'Valid File' : 'Invalid File'}</p>
                    <p className="text-sm">{importValidation.message}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="pt-2">
              <Button
                onClick={handleImport}
                disabled={importLoading || !importValidation || !importValidation.valid}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {importLoading ? 'Importing...' : 'Import Knowledge Map'}
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Import knowledge maps from JSON or CSV files. The file must contain valid knowledge map data.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ExportImportTools;
