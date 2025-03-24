
import { Module, Topic } from '@/types/supabase';

/**
 * Creates an adaptive learning path based on modules, topics and mastery levels
 */
export const createAdaptivePath = (
  modules: Module[] | null,
  topics: Topic[] | null,
  topicMastery: Record<string, number>
) => {
  if (!modules || !topics) return [];
  
  const result = [];
  
  // Group topics by module
  const topicsByModule: Record<string, Topic[]> = {};
  topics.forEach(topic => {
    if (!topicsByModule[topic.module_id]) {
      topicsByModule[topic.module_id] = [];
    }
    topicsByModule[topic.module_id].push(topic);
  });
  
  // Create learning path with modules and their topics
  modules.forEach(module => {
    const moduleTopics = topicsByModule[module.id] || [];
    
    // Sort topics by mastery (less mastery first)
    const sortedTopics = [...moduleTopics].sort((a, b) => {
      return (topicMastery[a.id] || 0) - (topicMastery[b.id] || 0);
    });
    
    result.push({
      module,
      topics: sortedTopics.map(topic => ({
        topic,
        mastery: topicMastery[topic.id] || 0
      }))
    });
  });
  
  return result;
};
