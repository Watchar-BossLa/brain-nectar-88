import { AgentTask, TaskPriority, TaskType } from '@/services/agents/types';
import { mcp } from '@/services/agents/mcp';

// Function to generate a learning path from quiz results
export async function generatePathFromQuizResults(results: any): Promise<any> {
  if (!results) {
    throw new Error('Quiz results are required to generate a learning path.');
  }

  try {
    // Add type checking for results properties
    const correctAnswers = typeof results.correct === 'number' ? results.correct : 0;
    const totalQuestions = typeof results.total === 'number' ? results.total : 1;
    
    // Calculate scores and path with verified numbers
    const score = (correctAnswers / totalQuestions) * 100;

    // Determine the task priority based on the quiz score
    let priority: TaskPriority = 'MEDIUM';
    if (score >= 80) {
      priority = 'LOW';
    } else if (score < 50) {
      priority = 'HIGH';
    }

    // Define the learning path generation task
    const learningPathTask: AgentTask = {
      id: `learning-path-task-${Date.now()}`,
      userId: 'user-quiz-results', // Replace with actual user ID
      taskType: 'LEARNING_PATH_GENERATION' as TaskType,
      description: `Generate a learning path based on quiz results with a score of ${score.toFixed(2)}%.`,
      priority: priority,
      targetAgentTypes: ['LEARNING_PATH'],
      context: ['quiz', 'assessment', 'learning_path'],
      data: {
        quizResults: results,
        score: score,
      },
      createdAt: new Date().toISOString(),
    };

    // Submit the learning path generation task to the MCP
    await mcp.getTaskProcessor().submitTask(learningPathTask);

    console.log('Learning path generation task submitted to MCP.');
    return { success: true, message: 'Learning path generation task submitted.' };
  } catch (error) {
    console.error('Error generating learning path from quiz results:', error);
    throw new Error('Failed to generate learning path from quiz results');
  }
}
