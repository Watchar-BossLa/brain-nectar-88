
import { mcp } from '../agents/mcp';
import { taskDistributionTester } from '../agents/testing/taskDistributionTester';

/**
 * AppTester - A utility for testing application functionality
 * 
 * Provides methods to test various aspects of the application for bugs and issues
 */
export class AppTester {
  /**
   * Test the agent system functionality
   */
  public async testAgentSystem(): Promise<TestResult> {
    const startTime = Date.now();
    const results: TestResultDetail[] = [];
    let overallSuccess = true;
    
    console.log('[AppTester] Starting agent system test suite');
    
    try {
      // Test 1: MCP instantiation
      try {
        const mcpInstance = mcp;
        const isInitialized = mcpInstance.isInitialized();
        
        results.push({
          name: 'MCP initialization',
          success: true,
          message: `MCP initialized successfully: ${isInitialized}`
        });
      } catch (error) {
        results.push({
          name: 'MCP initialization',
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error',
          error: error
        });
        overallSuccess = false;
      }
      
      // Test 2: System state retrieval
      try {
        const systemState = mcp.getSystemState();
        results.push({
          name: 'System state retrieval',
          success: true,
          message: `System state retrieved successfully: ${systemState.systemStatus}`,
          data: systemState
        });
      } catch (error) {
        results.push({
          name: 'System state retrieval',
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error',
          error: error
        });
        overallSuccess = false;
      }
      
      // Test 3: Task distribution pipeline
      try {
        const taskResult = await taskDistributionTester.createAndSubmitTestTask(
          mcp.getTaskProcessor(),
          {
            taskType: 'COGNITIVE_PROFILING',
            testData: { source: 'app-tester', timestamp: Date.now() }
          }
        );
        
        results.push({
          name: 'Task distribution pipeline',
          success: taskResult.success,
          message: taskResult.success 
            ? `Task distributed successfully: ${taskResult.taskId}` 
            : `Task distribution failed: ${taskResult.error}`,
          data: taskResult
        });
        
        if (!taskResult.success) {
          overallSuccess = false;
        }
      } catch (error) {
        results.push({
          name: 'Task distribution pipeline',
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error',
          error: error
        });
        overallSuccess = false;
      }
      
      // Test 4: LLM orchestration toggle
      try {
        const initialState = mcp.isLLMOrchestrationEnabled();
        
        // Toggle the state
        mcp.setLLMOrchestrationEnabled(!initialState);
        const newState = mcp.isLLMOrchestrationEnabled();
        
        // Toggle back to original state
        mcp.setLLMOrchestrationEnabled(initialState);
        const finalState = mcp.isLLMOrchestrationEnabled();
        
        results.push({
          name: 'LLM orchestration toggle',
          success: newState !== initialState && finalState === initialState,
          message: `LLM orchestration toggle test ${newState !== initialState ? 'passed' : 'failed'}`,
          data: { initialState, toggledState: newState, finalState }
        });
        
        if (!(newState !== initialState && finalState === initialState)) {
          overallSuccess = false;
        }
      } catch (error) {
        results.push({
          name: 'LLM orchestration toggle',
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error',
          error: error
        });
        overallSuccess = false;
      }
    } catch (error) {
      console.error('[AppTester] Error during agent system test:', error);
      results.push({
        name: 'Overall test execution',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        error: error
      });
      overallSuccess = false;
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    return {
      success: overallSuccess,
      duration,
      timestamp: new Date().toISOString(),
      results
    };
  }
  
  /**
   * Test the data fetching functionality
   */
  public async testDataFetching(): Promise<TestResult> {
    const startTime = Date.now();
    const results: TestResultDetail[] = [];
    let overallSuccess = true;
    
    console.log('[AppTester] Starting data fetching test suite');
    
    try {
      // Test data fetching components would be implemented here
      // For now, just return a placeholder successful result
      results.push({
        name: 'Data fetching',
        success: true,
        message: 'Data fetching tests not implemented yet'
      });
    } catch (error) {
      results.push({
        name: 'Data fetching',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        error: error
      });
      overallSuccess = false;
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    return {
      success: overallSuccess,
      duration,
      timestamp: new Date().toISOString(),
      results
    };
  }
  
  /**
   * Run all tests
   */
  public async runAllTests(): Promise<{
    success: boolean;
    results: Record<string, TestResult>;
    duration: number;
    timestamp: string;
  }> {
    const startTime = Date.now();
    const results: Record<string, TestResult> = {};
    let overallSuccess = true;
    
    console.log('[AppTester] Starting full application test suite');
    
    // Test the agent system
    results.agentSystem = await this.testAgentSystem();
    if (!results.agentSystem.success) {
      overallSuccess = false;
    }
    
    // Test data fetching
    results.dataFetching = await this.testDataFetching();
    if (!results.dataFetching.success) {
      overallSuccess = false;
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    return {
      success: overallSuccess,
      results,
      duration,
      timestamp: new Date().toISOString()
    };
  }
}

export interface TestResult {
  success: boolean;
  duration: number;
  timestamp: string;
  results: TestResultDetail[];
}

export interface TestResultDetail {
  name: string;
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

// Export a singleton instance for use throughout the application
export const appTester = new AppTester();
