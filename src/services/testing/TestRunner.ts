
import { supabase } from '@/integrations/supabase/client';

export interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

export interface TestSuite {
  name: string;
  description?: string;
  tests: {
    [testName: string]: () => Promise<TestResult>;
  };
}

export interface TestIssue {
  component: string;
  description: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  recommendation: string;
}

export interface TestSummary {
  totalTests: number;
  passedTests: number;
  duration: number;
  timestamp: string;
  issues: TestIssue[];
  results: Record<string, any>;
}

export class TestRunner {
  private testSuites: TestSuite[] = [];
  private session: any;
  private isAuthenticated: boolean = false;
  
  constructor() {}

  registerTestSuite(testSuite: TestSuite) {
    this.testSuites.push(testSuite);
  }

  async runAllTests(): Promise<{ [suiteName: string]: { [testName: string]: TestResult } }> {
    await this.initializeTests();
    
    if (!this.isAuthenticated) {
      throw new Error('Tests cannot be run without authentication.');
    }

    const results: { [suiteName: string]: { [testName: string]: TestResult } } = {};

    for (const suite of this.testSuites) {
      results[suite.name] = {};
      for (const testName in suite.tests) {
        try {
          const result = await suite.tests[testName]();
          results[suite.name][testName] = result;
        } catch (error: any) {
          results[suite.name][testName] = {
            success: false,
            message: `Test failed due to an error: ${error.message}`,
            details: error,
          };
        }
      }
    }

    return results;
  }
  
  async runAll(): Promise<TestSummary> {
    const startTime = Date.now();
    const results = await this.runAllTests();
    const endTime = Date.now();
    
    let totalTests = 0;
    let passedTests = 0;
    const issues: TestIssue[] = [];
    
    // Process results to generate summary
    Object.entries(results).forEach(([suiteName, suiteResults]) => {
      Object.entries(suiteResults).forEach(([testName, result]) => {
        totalTests++;
        if (result.success) {
          passedTests++;
        } else {
          // Create an issue for each failed test
          issues.push({
            component: suiteName,
            description: `Test "${testName}" failed: ${result.message}`,
            severity: result.details?.severity || 'moderate',
            recommendation: result.details?.recommendation || 'Review the test output and fix the underlying issue.'
          });
        }
      });
    });
    
    return {
      totalTests,
      passedTests,
      duration: endTime - startTime,
      timestamp: new Date().toISOString(),
      issues,
      results
    };
  }
  
  private async initializeTests(): Promise<void> {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw new Error(`Authentication error: ${error.message}`);
      }
      
      this.session = data.session;
      this.isAuthenticated = !!data.session;
      
      if (this.isAuthenticated) {
        console.log('Test environment initialized for user:', this.session.user.id);
      } else {
        console.warn('Test environment not initialized: No active session.');
      }
    } catch (error) {
      console.error('Failed to initialize test environment:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const testRunner = new TestRunner();
