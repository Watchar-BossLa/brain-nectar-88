// Update the section with getSession call
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
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
  
  private async initializeTests(): Promise<void> {
    // Update this section to use the correct Supabase API
    try {
      // Replace getSession with the correct API call
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
