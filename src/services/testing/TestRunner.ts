
import { appTester, TestResult } from '@/services/testing/AppTester';
import { supabase } from '@/integrations/supabase/client';
import { useFlashcardReview } from '@/hooks/useFlashcardReview';
import { spacedRepetitionService } from '@/services/flashcards/spaced-repetition/index';

/**
 * Test Runner - Executes comprehensive test suites to identify bugs
 */
export class TestRunner {
  /**
   * Run all tests
   */
  public async runAll(): Promise<TestSummary> {
    const startTime = performance.now();
    console.log('[TestRunner] Starting comprehensive test suite');
    
    const results: Record<string, TestResult> = {};
    let totalTests = 0;
    let passedTests = 0;
    let foundIssues: TestIssue[] = [];
    
    try {
      // System tests
      const systemTests = await this.runSystemTests();
      results.system = systemTests.result;
      totalTests += systemTests.total;
      passedTests += systemTests.passed;
      foundIssues = [...foundIssues, ...systemTests.issues];
      
      // Auth tests
      const authTests = await this.runAuthTests();
      results.auth = authTests.result;
      totalTests += authTests.total;
      passedTests += authTests.passed;
      foundIssues = [...foundIssues, ...authTests.issues];
      
      // Flashcard tests
      const flashcardTests = await this.runFlashcardTests();
      results.flashcards = flashcardTests.result;
      totalTests += flashcardTests.total;
      passedTests += flashcardTests.passed;
      foundIssues = [...foundIssues, ...flashcardTests.issues];
    } catch (error) {
      console.error('[TestRunner] Error running tests:', error);
      foundIssues.push({
        severity: 'critical',
        component: 'test-runner',
        description: `Test runner crashed: ${error instanceof Error ? error.message : String(error)}`,
        recommendation: 'Check console logs for detailed error information.'
      });
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    return {
      results,
      totalTests,
      passedTests,
      issues: foundIssues,
      duration,
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * Run system-related tests
   */
  private async runSystemTests(): Promise<TestRunResult> {
    const issues: TestIssue[] = [];
    let totalTests = 0;
    let passedTests = 0;
    
    try {
      // Run agent system tests
      const result = await appTester.testAgentSystem();
      
      totalTests += result.results.length;
      passedTests += result.results.filter(r => r.success).length;
      
      // Extract issues from results
      result.results.forEach(testResult => {
        if (!testResult.success) {
          issues.push({
            severity: 'moderate',
            component: 'agent-system',
            description: `Test "${testResult.name}" failed: ${testResult.message}`,
            recommendation: 'Check agent configuration and connectivity.'
          });
        }
      });
      
      return { result, total: totalTests, passed: passedTests, issues };
    } catch (error) {
      console.error('[TestRunner] Error in system tests:', error);
      issues.push({
        severity: 'high',
        component: 'system',
        description: `System test execution failed: ${error instanceof Error ? error.message : String(error)}`,
        recommendation: 'Check system initialization and agent status.'
      });
      
      return {
        result: {
          success: false,
          duration: 0,
          timestamp: new Date().toISOString(),
          results: []
        },
        total: 1,
        passed: 0,
        issues
      };
    }
  }
  
  /**
   * Run authentication-related tests
   */
  private async runAuthTests(): Promise<TestRunResult> {
    const issues: TestIssue[] = [];
    let totalTests = 0;
    let passedTests = 0;
    
    try {
      totalTests += 1; // Session check
      
      // Check if the session is properly saved and retrieved
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        issues.push({
          severity: 'high',
          component: 'authentication',
          description: `Failed to retrieve session: ${error.message}`,
          recommendation: 'Check Supabase configuration and authentication setup.'
        });
      } else {
        passedTests += 1;
      }
      
      return {
        result: {
          success: !error,
          duration: 0,
          timestamp: new Date().toISOString(),
          results: [
            {
              name: 'Session retrieval',
              success: !error,
              message: error ? error.message : 'Session retrieved successfully',
              data: data.session ? { user: data.session.user.email } : null
            }
          ]
        },
        total: totalTests,
        passed: passedTests,
        issues
      };
    } catch (error) {
      console.error('[TestRunner] Error in auth tests:', error);
      issues.push({
        severity: 'high',
        component: 'authentication',
        description: `Auth test execution failed: ${error instanceof Error ? error.message : String(error)}`,
        recommendation: 'Check authentication configuration and Supabase setup.'
      });
      
      return {
        result: {
          success: false,
          duration: 0,
          timestamp: new Date().toISOString(),
          results: []
        },
        total: 1,
        passed: 0,
        issues
      };
    }
  }
  
  /**
   * Run flashcard-related tests
   */
  private async runFlashcardTests(): Promise<TestRunResult> {
    const issues: TestIssue[] = [];
    let totalTests = 0;
    let passedTests = 0;
    const testResults = [];
    
    try {
      // Test FlashcardReview hook existence
      totalTests += 1;
      try {
        const hookExists = typeof useFlashcardReview === 'function';
        passedTests += hookExists ? 1 : 0;
        
        testResults.push({
          name: 'Flashcard review hook',
          success: hookExists,
          message: hookExists ? 'Flashcard review hook exists' : 'Flashcard review hook is missing',
        });
        
        if (!hookExists) {
          issues.push({
            severity: 'high',
            component: 'flashcards',
            description: 'useFlashcardReview hook is missing or not exported correctly',
            recommendation: 'Check the hook implementation and exports.'
          });
        }
      } catch (error) {
        testResults.push({
          name: 'Flashcard review hook',
          success: false,
          message: `Error checking hook: ${error instanceof Error ? error.message : String(error)}`,
        });
        
        issues.push({
          severity: 'moderate',
          component: 'flashcards',
          description: `Error testing flashcard review hook: ${error instanceof Error ? error.message : String(error)}`,
          recommendation: 'Check hook implementation for errors.'
        });
      }
      
      // Test spaced repetition service
      totalTests += 1;
      try {
        const serviceExists = typeof spacedRepetitionService === 'object' && spacedRepetitionService !== null;
        passedTests += serviceExists ? 1 : 0;
        
        testResults.push({
          name: 'Spaced repetition service',
          success: serviceExists,
          message: serviceExists ? 'Spaced repetition service exists' : 'Spaced repetition service is missing',
        });
        
        if (!serviceExists) {
          issues.push({
            severity: 'high',
            component: 'flashcards',
            description: 'Spaced repetition service is missing or not exported correctly',
            recommendation: 'Check the service implementation and exports.'
          });
        }
      } catch (error) {
        testResults.push({
          name: 'Spaced repetition service',
          success: false,
          message: `Error checking service: ${error instanceof Error ? error.message : String(error)}`,
        });
        
        issues.push({
          severity: 'moderate',
          component: 'flashcards',
          description: `Error testing spaced repetition service: ${error instanceof Error ? error.message : String(error)}`,
          recommendation: 'Check service implementation for errors.'
        });
      }
      
      return {
        result: {
          success: passedTests === totalTests,
          duration: 0,
          timestamp: new Date().toISOString(),
          results: testResults
        },
        total: totalTests,
        passed: passedTests,
        issues
      };
    } catch (error) {
      console.error('[TestRunner] Error in flashcard tests:', error);
      issues.push({
        severity: 'high',
        component: 'flashcards',
        description: `Flashcard test execution failed: ${error instanceof Error ? error.message : String(error)}`,
        recommendation: 'Check flashcard implementation and related components.'
      });
      
      return {
        result: {
          success: false,
          duration: 0,
          timestamp: new Date().toISOString(),
          results: []
        },
        total: 1,
        passed: 0,
        issues
      };
    }
  }
}

export interface TestSummary {
  results: Record<string, TestResult>;
  totalTests: number;
  passedTests: number;
  issues: TestIssue[];
  duration: number;
  timestamp: string;
}

export interface TestRunResult {
  result: TestResult;
  total: number;
  passed: number;
  issues: TestIssue[];
}

export interface TestIssue {
  severity: 'low' | 'moderate' | 'high' | 'critical';
  component: string;
  description: string;
  recommendation: string;
}

// Export singleton instance
export const testRunner = new TestRunner();
