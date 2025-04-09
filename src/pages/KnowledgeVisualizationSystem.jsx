import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/auth';
import { useKnowledgeMap, useLearningPath } from '@/services/knowledge-visualization';
import { KnowledgeMapList, MapCreationForm, LearningPathList } from '@/components/knowledge-visualization';
import ExportImportTools from '@/components/knowledge-visualization/ExportImportTools';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Network, Route, ArrowLeft, Download, Upload } from 'lucide-react';

/**
 * Knowledge Visualization System Page
 * @returns {React.ReactElement} Knowledge visualization system page
 */
const KnowledgeVisualizationSystem = () => {
  const { user } = useAuth();
  const knowledgeMap = useKnowledgeMap();
  const learningPath = useLearningPath();

  const [showCreateMap, setShowCreateMap] = useState(false);
  const [showCreatePath, setShowCreatePath] = useState(false);
  const [activeTab, setActiveTab] = useState('maps');

  // Handle create map
  const handleCreateMap = () => {
    setShowCreateMap(true);
  };

  // Handle create map success
  const handleCreateMapSuccess = (map) => {
    setShowCreateMap(false);
    // Could navigate to the new map page here
  };

  // Handle cancel create map
  const handleCancelCreateMap = () => {
    setShowCreateMap(false);
  };

  // Handle create path
  const handleCreatePath = () => {
    setShowCreatePath(true);
  };

  // Handle create path success
  const handleCreatePathSuccess = (path) => {
    setShowCreatePath(false);
    // Could navigate to the new path page here
  };

  // Handle cancel create path
  const handleCancelCreatePath = () => {
    setShowCreatePath(false);
  };

  // Handle export knowledge maps
  const handleExport = async () => {
    try {
      // Get all knowledge maps
      const maps = await knowledgeMap.getUserMaps(user.id);

      if (!maps || maps.length === 0) {
        toast({
          title: 'No Maps to Export',
          description: 'You don\'t have any knowledge maps to export',
          variant: 'destructive',
        });
        return null;
      }

      // Return maps for export
      return maps;
    } catch (error) {
      console.error('Error exporting maps:', error);
      toast({
        title: 'Export Failed',
        description: error.message || 'Failed to export knowledge maps',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Handle import knowledge maps
  const handleImport = async (data) => {
    try {
      if (!Array.isArray(data)) {
        throw new Error('Invalid import data format');
      }

      // Import each map
      const importPromises = data.map(map => {
        // Create a new map with the imported data
        // Remove any existing IDs to avoid conflicts
        const { id, user_id, created_at, updated_at, ...mapData } = map;

        return knowledgeMap.createMap({
          ...mapData,
          title: `${mapData.title} (Imported)`,
          user_id: user.id,
        });
      });

      await Promise.all(importPromises);

      // Refresh the maps list
      await knowledgeMap.getUserMaps(user.id, true);

      toast({
        title: 'Import Successful',
        description: `Imported ${data.length} knowledge map${data.length === 1 ? '' : 's'}`,
      });
    } catch (error) {
      console.error('Error importing maps:', error);
      toast({
        title: 'Import Failed',
        description: error.message || 'Failed to import knowledge maps',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Knowledge Visualization System</h1>
              <p className="text-muted-foreground">
                Create, visualize, and navigate your knowledge
              </p>
            </div>
          </div>

          {/* Main Content */}
          {showCreateMap ? (
            <div>
              <Button
                variant="outline"
                className="mb-4"
                onClick={handleCancelCreateMap}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Maps
              </Button>
              <MapCreationForm
                onSuccess={handleCreateMapSuccess}
                onCancel={handleCancelCreateMap}
              />
            </div>
          ) : showCreatePath ? (
            <div>
              <Button
                variant="outline"
                className="mb-4"
                onClick={handleCancelCreatePath}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Paths
              </Button>
              <div className="text-center py-12">
                <Route className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Create Learning Path</h2>
                <p className="text-muted-foreground mb-4">
                  This feature is coming soon!
                </p>
              </div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="maps" className="flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  <span>Knowledge Maps</span>
                </TabsTrigger>
                <TabsTrigger value="paths" className="flex items-center gap-2">
                  <Route className="h-4 w-4" />
                  <span>Learning Paths</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="maps" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-3">
                    <KnowledgeMapList onCreateMap={handleCreateMap} />
                  </div>
                  <div>
                    <ExportImportTools
                      onExport={handleExport}
                      onImport={handleImport}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="paths">
                <LearningPathList onCreatePath={handleCreatePath} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default KnowledgeVisualizationSystem;
