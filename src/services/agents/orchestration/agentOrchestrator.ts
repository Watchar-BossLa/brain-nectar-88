
import { masterControlProgram } from "../mcp/MasterControlProgram";
import { TaskCategory, TaskPriority } from "../types/taskTypes";
import { createLearningPathAgent } from "../learning-path";
import { agentRegistry } from "../mcp/agentRegistry";
import { useAuth } from "@/context/auth";

// Initialize agents
export const initializeAgents = () => {
  try {
    console.log("Initializing agents...");
    
    // Register the learning path agent
    const learningPathAgent = createLearningPathAgent();
    agentRegistry.registerAgent(learningPathAgent);
    
    // Initialize the MasterControlProgram
    masterControlProgram.initialize().then(() => {
      console.log("MasterControlProgram initialized");
    });
    
    console.log("Agent initialization complete");
    return true;
  } catch (error) {
    console.error("Error initializing agents:", error);
    return false;
  }
};

// Orchestration functions for different tasks
export const orchestrateFlashcardGeneration = async (
  userId: string,
  topics: string[],
  count: number,
  options?: Record<string, any>
): Promise<string | null> => {
  try {
    console.log(`Orchestrating flashcard generation for user ${userId} on topics:`, topics);
    
    if (!masterControlProgram.isLLMOrchestrationEnabled()) {
      console.log("LLM Orchestration is not enabled");
      return null;
    }
    
    const taskId = await masterControlProgram.submitTask(
      TaskCategory.FLASHCARD_GENERATION,
      `Generate ${count} flashcards for topics: ${topics.join(', ')}`,
      {
        userId,
        topics,
        count,
        options
      },
      TaskPriority.MEDIUM
    );
    
    return taskId;
  } catch (error) {
    console.error("Error orchestrating flashcard generation:", error);
    return null;
  }
};

export const orchestrateLearningPath = async (
  userId: string,
  options?: Record<string, any>
): Promise<string | null> => {
  try {
    console.log(`Orchestrating learning path generation for user ${userId}`);
    
    if (!masterControlProgram.isLLMOrchestrationEnabled()) {
      console.log("LLM Orchestration is not enabled");
      return null;
    }
    
    const taskId = await masterControlProgram.submitTask(
      TaskCategory.LEARNING_PATH,
      `Generate personalized learning path for user ${userId}`,
      {
        userId,
        options
      },
      TaskPriority.MEDIUM
    );
    
    return taskId;
  } catch (error) {
    console.error("Error orchestrating learning path generation:", error);
    return null;
  }
};

export const orchestrateContentReview = async (
  userId: string,
  contentId: string,
  contentText: string,
  options?: Record<string, any>
): Promise<string | null> => {
  try {
    console.log(`Orchestrating content review for user ${userId} on content ${contentId}`);
    
    if (!masterControlProgram.isLLMOrchestrationEnabled()) {
      console.log("LLM Orchestration is not enabled");
      return null;
    }
    
    const taskId = await masterControlProgram.submitTask(
      TaskCategory.CONTENT_REVIEW,
      `Review content ${contentId} for user ${userId}`,
      {
        userId,
        contentId,
        contentText,
        options
      },
      TaskPriority.MEDIUM
    );
    
    return taskId;
  } catch (error) {
    console.error("Error orchestrating content review:", error);
    return null;
  }
};

export const orchestrateStudyPlan = async (
  userId: string,
  goalId: string,
  daysToGoal: number,
  options?: Record<string, any>
): Promise<string | null> => {
  try {
    console.log(`Orchestrating study plan for user ${userId} with goal ${goalId} in ${daysToGoal} days`);
    
    if (!masterControlProgram.isLLMOrchestrationEnabled()) {
      console.log("LLM Orchestration is not enabled");
      return null;
    }
    
    const taskId = await masterControlProgram.submitTask(
      TaskCategory.SYSTEM,  // Use SYSTEM for now until we have a dedicated category
      `Generate study plan for user ${userId} to achieve ${goalId} in ${daysToGoal} days`,
      {
        userId,
        goalId,
        daysToGoal,
        options
      },
      TaskPriority.MEDIUM
    );
    
    return taskId;
  } catch (error) {
    console.error("Error orchestrating study plan:", error);
    return null;
  }
};

export const orchestrateQuizGeneration = async (
  userId: string,
  topics: string[],
  difficulty: number,
  questionCount: number,
  options?: Record<string, any>
): Promise<string | null> => {
  try {
    console.log(`Orchestrating quiz generation for user ${userId} on topics:`, topics);
    
    if (!masterControlProgram.isLLMOrchestrationEnabled()) {
      console.log("LLM Orchestration is not enabled");
      return null;
    }
    
    const taskId = await masterControlProgram.submitTask(
      TaskCategory.ASSESSMENT,
      `Generate quiz with ${questionCount} questions on topics: ${topics.join(', ')}`,
      {
        userId,
        topics,
        difficulty,
        questionCount,
        options
      },
      TaskPriority.MEDIUM
    );
    
    return taskId;
  } catch (error) {
    console.error("Error orchestrating quiz generation:", error);
    return null;
  }
};

export const orchestrateTutoring = async (
  userId: string,
  query: string,
  context: Record<string, any>,
  options?: Record<string, any>
): Promise<string | null> => {
  try {
    console.log(`Orchestrating tutoring for user ${userId} with query: ${query}`);
    
    if (!masterControlProgram.isLLMOrchestrationEnabled()) {
      console.log("LLM Orchestration is not enabled");
      return null;
    }
    
    const taskId = await masterControlProgram.submitTask(
      TaskCategory.TUTORING,
      `Provide tutoring assistance for query: ${query}`,
      {
        userId,
        query,
        context,
        options
      },
      TaskPriority.MEDIUM
    );
    
    return taskId;
  } catch (error) {
    console.error("Error orchestrating tutoring:", error);
    return null;
  }
};
