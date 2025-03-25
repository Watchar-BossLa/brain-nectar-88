
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TaskCategory } from '@/services/llm';

interface PanelTestTabProps {
  testPrompt: string;
  setTestPrompt: (prompt: string) => void;
  isGenerating: boolean;
  generatedText: string;
  handleTestGeneration: () => Promise<void>;
  TaskCategory: typeof TaskCategory;
}

export function PanelTestTab({
  testPrompt,
  setTestPrompt,
  isGenerating,
  generatedText,
  handleTestGeneration
}: PanelTestTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Test LLM Orchestration</h3>
      <p className="text-sm text-muted-foreground">
        Test the orchestration system by generating text with automatic model selection.
      </p>
      
      <div className="space-y-2">
        <Label htmlFor="test-prompt">Prompt</Label>
        <textarea
          id="test-prompt"
          className="w-full h-24 p-2 border rounded-md"
          value={testPrompt}
          onChange={(e) => setTestPrompt(e.target.value)}
          placeholder="Enter a prompt to test model selection..."
        />
      </div>
      
      <Button 
        onClick={handleTestGeneration} 
        disabled={isGenerating || !testPrompt.trim()}
      >
        {isGenerating ? "Generating..." : "Generate Text"}
      </Button>
      
      {generatedText && (
        <div className="mt-4 p-4 bg-muted rounded-md">
          <h4 className="font-medium mb-2">Generated Output:</h4>
          <p className="text-sm whitespace-pre-wrap">{generatedText}</p>
        </div>
      )}
    </div>
  );
}
