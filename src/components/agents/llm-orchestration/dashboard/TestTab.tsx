
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TaskCategory } from '@/types/enums';

interface TestTabProps {
  testPrompt: string;
  setTestPrompt: (prompt: string) => void;
  isGenerating: boolean;
  testResult: string;
  handleTestGeneration: () => Promise<void>;
  handleTestWithModel: () => Promise<void>;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedTaskCategory: TaskCategory;
  setSelectedTaskCategory: (category: TaskCategory) => void;
  TaskCategory: typeof TaskCategory;
}

export function TestTab({
  testPrompt,
  setTestPrompt,
  isGenerating,
  testResult,
  handleTestGeneration,
  handleTestWithModel,
  selectedModel,
  setSelectedModel,
  selectedTaskCategory,
  setSelectedTaskCategory,
  TaskCategory
}: TestTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Test LLM Orchestration</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="task-category">Task Category</Label>
            <select 
              id="task-category"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedTaskCategory}
              onChange={(e) => setSelectedTaskCategory(e.target.value as TaskCategory)}
            >
              {Object.values(TaskCategory).map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <Label htmlFor="test-prompt">Test Prompt</Label>
            <textarea 
              id="test-prompt"
              className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter a prompt to test the LLM orchestration system"
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={handleTestGeneration} 
              disabled={isGenerating || !testPrompt}
            >
              {isGenerating ? 'Generating...' : 'Test with Optimal Model'}
            </Button>
            
            <div className="flex-1"></div>
            
            <select
              className="flex h-9 w-48 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="">Select specific model</option>
              {Object.values(TaskCategory).map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <Button
              variant="outline"
              onClick={handleTestWithModel}
              disabled={isGenerating || !testPrompt || !selectedModel}
            >
              Test Selected Model
            </Button>
          </div>
          
          {testResult && (
            <div>
              <Label>Result</Label>
              <div className="bg-muted rounded-md p-3 text-xs font-mono whitespace-pre-wrap">
                {testResult}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
