import { ExecutionMetrics, ModelEvaluation, TaskCategory } from './types';
import { modelOrchestration } from './modelOrchestration';

/**
 * Performance Monitoring Service
 * 
 * Tracks and analyzes model performance across various tasks.
 */
export class PerformanceMonitoringService {
  private static instance: PerformanceMonitoringService;
  private executionHistory: ExecutionMetrics[] = [];
  private evaluationHistory: Map<string, ModelEvaluation[]> = new Map();
  
  private constructor() {
    console.log('Performance Monitoring Service initialized');
  }
  
  /**
   * Get singleton instance of the PerformanceMonitoringService
   */
  public static getInstance(): PerformanceMonitoringService {
    if (!PerformanceMonitoringService.instance) {
      PerformanceMonitoringService.instance = new PerformanceMonitoringService();
    }
    return PerformanceMonitoringService.instance;
  }
  
  /**
   * Record metrics from a model execution
   */
  public recordExecution(metrics: ExecutionMetrics): void {
    this.executionHistory.push(metrics);
    
    // Keep history at a reasonable size
    if (this.executionHistory.length > 1000) {
      this.executionHistory = this.executionHistory.slice(-1000);
    }
    
    console.log(`Recorded execution metrics for model: ${metrics.modelId}`);
  }
  
  /**
   * Record a user evaluation of a model output
   */
  public recordEvaluation(
    modelId: string, 
    taskCategory: TaskCategory,
    evaluation: Partial<ModelEvaluation>
  ): void {
    const key = `${modelId}-${taskCategory}`;
    const evaluations = this.evaluationHistory.get(key) || [];
    
    const newEvaluation: ModelEvaluation = {
      accuracy: evaluation.accuracy || 0,
      latency: evaluation.latency || 0,
      f1Score: evaluation.f1Score || 0,
      resourceEfficiency: evaluation.resourceEfficiency || 0,
      userSatisfaction: evaluation.userSatisfaction || 0,
      evaluatedAt: new Date().toISOString()
    };
    
    evaluations.push(newEvaluation);
    this.evaluationHistory.set(key, evaluations);
    
    // Update the model orchestration with aggregated metrics
    this.updateAggregatedMetrics(modelId, taskCategory);
    
    console.log(`Recorded evaluation for model ${modelId} on task ${taskCategory}`);
  }
  
  /**
   * Update aggregated metrics for a model
   */
  private updateAggregatedMetrics(modelId: string, taskCategory: TaskCategory): void {
    const key = `${modelId}-${taskCategory}`;
    const evaluations = this.evaluationHistory.get(key) || [];
    
    if (evaluations.length === 0) {
      return;
    }
    
    // Calculate average metrics
    const aggregated: ModelEvaluation = {
      accuracy: this.average(evaluations.map(e => e.accuracy)),
      latency: this.average(evaluations.map(e => e.latency)),
      f1Score: this.average(evaluations.map(e => e.f1Score)),
      resourceEfficiency: this.average(evaluations.map(e => e.resourceEfficiency)),
      userSatisfaction: this.average(evaluations.map(e => e.userSatisfaction))
    };
    
    // Update model orchestration with aggregated metrics
    modelOrchestration.updateModelMetrics(modelId, aggregated);
  }
  
  /**
   * Calculate average of numbers
   */
  private average(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }
  
  /**
   * Get performance metrics for a specific model
   */
  public getModelPerformance(modelId: string): ModelEvaluation | undefined {
    // Get all evaluations for this model across all task categories
    const modelEvaluations: ModelEvaluation[] = [];
    
    for (const [key, evaluations] of this.evaluationHistory.entries()) {
      if (key.startsWith(`${modelId}-`)) {
        // Calculate average for this task category
        const taskAvg: ModelEvaluation = {
          accuracy: this.average(evaluations.map(e => e.accuracy)),
          latency: this.average(evaluations.map(e => e.latency)),
          f1Score: this.average(evaluations.map(e => e.f1Score)),
          resourceEfficiency: this.average(evaluations.map(e => e.resourceEfficiency)),
          userSatisfaction: this.average(evaluations.map(e => e.userSatisfaction))
        };
        
        modelEvaluations.push(taskAvg);
      }
    }
    
    if (modelEvaluations.length === 0) {
      return undefined;
    }
    
    // Aggregate across all task categories
    return {
      accuracy: this.average(modelEvaluations.map(e => e.accuracy)),
      latency: this.average(modelEvaluations.map(e => e.latency)),
      f1Score: this.average(modelEvaluations.map(e => e.f1Score)),
      resourceEfficiency: this.average(modelEvaluations.map(e => e.resourceEfficiency)),
      userSatisfaction: this.average(modelEvaluations.map(e => e.userSatisfaction))
    };
  }
  
  /**
   * Get performance comparison for all models on a specific task
   */
  public getTaskPerformanceComparison(taskCategory: TaskCategory): Record<string, ModelEvaluation> {
    const comparison: Record<string, ModelEvaluation> = {};
    
    for (const [key, evaluations] of this.evaluationHistory.entries()) {
      if (key.includes(`-${taskCategory}`)) {
        const modelId = key.split('-')[0];
        
        comparison[modelId] = {
          accuracy: this.average(evaluations.map(e => e.accuracy)),
          latency: this.average(evaluations.map(e => e.latency)),
          f1Score: this.average(evaluations.map(e => e.f1Score)),
          resourceEfficiency: this.average(evaluations.map(e => e.resourceEfficiency)),
          userSatisfaction: this.average(evaluations.map(e => e.userSatisfaction))
        };
      }
    }
    
    return comparison;
  }
  
  /**
   * Get recent execution history
   */
  public getRecentExecutions(limit: number = 100): ExecutionMetrics[] {
    return this.executionHistory.slice(-limit);
  }
}

// Export a singleton instance
export const performanceMonitoring = PerformanceMonitoringService.getInstance();
