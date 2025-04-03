
/**
 * Utility functions for creating and manipulating learning paths
 */

interface Topic {
  id: string;
  title: string;
  description: string;
  moduleId: string;
  order: number;
  complexity: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
  order: number;
}

export const organizeTopicsByModule = (topics: Topic[]): Record<string, Topic[]> => {
  const moduleMap: Record<string, Topic[]> = {};
  
  for (const topic of topics) {
    if (!moduleMap[topic.moduleId]) {
      moduleMap[topic.moduleId] = [];
    }
    
    moduleMap[topic.moduleId].push(topic);
  }
  
  // Sort topics within each module
  for (const moduleId in moduleMap) {
    moduleMap[moduleId].sort((a, b) => a.order - b.order);
  }
  
  return moduleMap;
};

export const generateModulesFromTopics = (topics: Topic[], moduleData: Record<string, Partial<Module>>): Module[] => {
  const moduleMap = organizeTopicsByModule(topics);
  const modules: Module[] = [];
  
  for (const moduleId in moduleMap) {
    modules.push({
      id: moduleId,
      title: moduleData[moduleId]?.title || `Module ${moduleId}`,
      description: moduleData[moduleId]?.description || "No description available",
      topics: moduleMap[moduleId],
      order: moduleData[moduleId]?.order || 0
    });
  }
  
  // Sort modules by order
  modules.sort((a, b) => a.order - b.order);
  
  return modules;
};

export const calculateEstimatedTimeToComplete = (modules: Module[]): number => {
  let totalMinutes = 0;
  
  for (const module of modules) {
    // Each topic takes roughly 30-60 minutes depending on complexity
    for (const topic of module.topics) {
      const baseTime = 30;
      const complexityMultiplier = 1 + (topic.complexity || 0) / 2;
      
      totalMinutes += baseTime * complexityMultiplier;
    }
  }
  
  return Math.round(totalMinutes);
};
