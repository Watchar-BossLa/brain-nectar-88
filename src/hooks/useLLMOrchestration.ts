
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { mcp } from '@/services/agents/mcp';
import { TaskCategory } from '@/types/index';
import { 
  modelOrchestration, 
  modelExecution, 
  performanceMonitoring 
} from '@/services/llm';

/**
 * Hook to use the LLM orchestration system in components
 */
export const useLLMOrchestration = () => {
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [modelMetrics, setModelMetrics] = useState<Record<string, any>>({});

  // Initialize the LLM orchestration system when the user is authenticated
  useEffect(() => {
    if (user) {
      // Check if the LLM system is already initialized
      const systemState = mcp.getSystemState();
      const llmAvailable = systemState.globalVariables?.llmSystemAvailable || false;
      
      setIsInitialized(llmAvailable);
      
      if (llmAvailable) {
        // Load available models
        const models = modelOrchestration.getAllModels();
        setAvailableModels(models.map(model => model.id));
        
        // Get metrics for each model
        const metrics: Record<string, any> = {};
        for (const model of models) {
          const modelPerformance = performanceMonitoring.getModelPerformance(model.id);
          if (modelPerformance) {
            metrics[model.id] = modelPerformance;
          }
        }
        
        setModelMetrics(metrics);
      }
    } else {
      setIsInitialized(false);
      setAvailableModels([]);
      setModelMetrics({});
    }
  }, [user]);

  /**
   * Execute a text generation task with the optimal model
   */
  const generateText = async (
    prompt: string, 
    taskCategory: TaskCategory = TaskCategory.TEXT_GENERATION,
    complexity: number = 0.5,
    domainContext: string[] = []
  ) => {
    if (!isInitialized || !user) {
      throw new Error('LLM system is not initialized or user is not authenticated');
    }
    
    try {
      // Execute with optimal model selection
      const result = await modelExecution.executeWithOptimalModel(
        prompt,
        taskCategory,
        complexity,
        domainContext
      );
      
      return {
        text: result.text,
        modelId: result.modelId,
        executionTime: result.executionTime
      };
    } catch (error) {
      console.error('Error generating text:', error);
      throw error;
    }
  };

  /**
   * Execute a text generation task with a specific model
   */
  const generateTextWithModel = async (
    modelId: string,
    prompt: string,
    taskCategory: TaskCategory = TaskCategory.TEXT_GENERATION,
    parameters?: Record<string, any>
  ) => {
    if (!isInitialized || !user) {
      throw new Error('LLM system is not initialized or user is not authenticated');
    }
    
    // Validate model exists
    const model = modelOrchestration.getModel(modelId);
    if (!model) {
      throw new Error(`Model not found: ${modelId}`);
    }
    
    try {
      // Execute with the specified model
      const result = await modelExecution.executeTask({
        modelId,
        prompt,
        taskCategory,
        parameters
      });
      
      return {
        text: result.text,
        modelId: result.modelId,
        executionTime: result.executionTime
      };
    } catch (error) {
      console.error(`Error generating text with model ${modelId}:`, error);
      throw error;
    }
  };

  /**
   * Provide feedback on a model's output
   */
  const provideModelFeedback = (
    modelId: string,
    taskCategory: TaskCategory,
    satisfaction: number, // 0-1 scale
    accuracy: number // 0-1 scale
  ) => {
    if (!isInitialized || !user) {
      console.warn('LLM system is not initialized or user is not authenticated');
      return false;
    }
    
    try {
      // Record evaluation
      performanceMonitoring.recordEvaluation(modelId, taskCategory, {
        userSatisfaction: satisfaction,
        accuracy: accuracy,
        // Other metrics would be calculated internally
      });
      
      // Update model metrics state
      setModelMetrics(prev => ({
        ...prev,
        [modelId]: performanceMonitoring.getModelPerformance(modelId)
      }));
      
      return true;
    } catch (error) {
      console.error('Error providing model feedback:', error);
      return false;
    }
  };

  /**
   * Enable or disable LLM orchestration in the MCP
   */
  const setOrchestrationEnabled = (enabled: boolean) => {
    if (user) {
      mcp.setLLMOrchestrationEnabled(enabled);
    }
  };

  /**
   * Check if LLM orchestration is enabled
   */
  const isOrchestrationEnabled = () => {
    return mcp.isLLMOrchestrationEnabled();
  };

  return {
    isInitialized,
    availableModels,
    modelMetrics,
    generateText,
    generateTextWithModel,
    provideModelFeedback,
    setOrchestrationEnabled,
    isOrchestrationEnabled,
    TaskCategory // Re-export TaskCategory enum
  };
};
