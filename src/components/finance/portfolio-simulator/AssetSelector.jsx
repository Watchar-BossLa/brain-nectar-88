import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, TrendingUp, TrendingDown } from 'lucide-react';

const AssetSelector = ({ assets, onAddAsset, portfolio }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter assets based on search query and active tab
  const filteredAssets = assets.filter(asset => {
    // Filter by search query
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.ticker.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by asset type
    const matchesType = activeTab === 'all' || asset.type.toLowerCase() === activeTab.toLowerCase();
    
    return matchesSearch && matchesType;
  });
  
  // Check if asset is already in portfolio
  const isInPortfolio = (assetId) => {
    return portfolio.some(item => item.id === assetId);
  };
  
  // Get unique asset types
  const assetTypes = ['all', ...new Set(assets.map(asset => asset.type.toLowerCase()))];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Asset Selector</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        {/* Asset Type Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full flex overflow-auto">
            {assetTypes.map(type => (
              <TabsTrigger 
                key={type} 
                value={type}
                className="flex-1 capitalize"
              >
                {type}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        {/* Asset List */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          {filteredAssets.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <p>No assets found matching your criteria.</p>
            </div>
          ) : (
            filteredAssets.map(asset => (
              <div 
                key={asset.id} 
                className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 transition-colors"
              >
                <div>
                  <div className="font-medium">{asset.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>{asset.ticker}</span>
                    <Badge variant="outline" className="capitalize">{asset.type}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={asset.expectedReturn >= 0 ? 'text-green-600' : 'text-red-600'}>
                    <div className="flex items-center text-sm">
                      {asset.expectedReturn >= 0 ? 
                        <TrendingUp className="h-3 w-3 mr-1" /> : 
                        <TrendingDown className="h-3 w-3 mr-1" />
                      }
                      {(asset.expectedReturn * 100).toFixed(2)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Risk: {(asset.risk * 100).toFixed(2)}%
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onAddAsset(asset)}
                    disabled={isInPortfolio(asset.id)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetSelector;
