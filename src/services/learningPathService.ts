
// Re-export all the learning path services from the new files
import { generateLearningPath } from './learningPath/learningPathGenerator';
import { updateLearningPath } from './learningPath/progressService';
import { getUserLearningPaths } from './learningPath/studyPlanService';

export {
  generateLearningPath,
  updateLearningPath,
  getUserLearningPaths
};
