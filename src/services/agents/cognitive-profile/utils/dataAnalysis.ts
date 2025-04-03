
/**
 * Data Analysis utilities for the cognitive profile agent
 */

/**
 * Analyzes a batch of learning data to extract patterns
 */
export function analyzeLearningData(
  learningEvents: Array<{
    type: string;
    timestamp: string;
    data: {
      contentType?: string;
      topicId?: string;
      moduleId?: string;
    };
  }>
): any {
  // Group events by content type
  const contentTypeGroups = new Map<string, any[]>();
  
  for (const event of learningEvents) {
    const contentType = event.data.contentType || 'unknown';
    
    if (!contentTypeGroups.has(contentType)) {
      contentTypeGroups.set(contentType, []);
    }
    
    contentTypeGroups.get(contentType)!.push(event);
  }
  
  // Calculate time spent per content type
  const timePerContentType = new Map<string, number>();
  
  for (const [contentType, events] of contentTypeGroups.entries()) {
    // Sort events by timestamp
    events.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    let totalTimeSpent = 0;
    for (let i = 1; i < events.length; i++) {
      const timeDiff = new Date(events[i].timestamp).getTime() - 
                       new Date(events[i-1].timestamp).getTime();
      
      // Only count if difference is less than 30 minutes (likely same session)
      if (timeDiff < 30 * 60 * 1000) {
        totalTimeSpent += timeDiff;
      }
    }
    
    timePerContentType.set(contentType, totalTimeSpent);
  }
  
  // Group events by topic
  const topicGroups = new Map<string, any[]>();
  
  for (const event of learningEvents) {
    const topicId = event.data.topicId || 'unknown';
    
    if (!topicGroups.has(topicId)) {
      topicGroups.set(topicId, []);
    }
    
    topicGroups.get(topicId)!.push(event);
  }
  
  // Calculate success rates per topic
  const successRatesByTopic = new Map<string, number>();
  
  for (const [topicId, events] of topicGroups.entries()) {
    const assessmentEvents = events.filter(e => e.type === 'assessment');
    if (assessmentEvents.length === 0) continue;
    
    const successfulEvents = assessmentEvents.filter(
      e => e.data && e.data.result && e.data.result.success
    );
    
    successRatesByTopic.set(
      topicId, 
      successfulEvents.length / assessmentEvents.length
    );
  }
  
  // Group events by module
  const moduleGroups = new Map<string, any[]>();
  
  for (const event of learningEvents) {
    const moduleId = event.data.moduleId || 'unknown';
    
    if (!moduleGroups.has(moduleId)) {
      moduleGroups.set(moduleId, []);
    }
    
    moduleGroups.get(moduleId)!.push(event);
  }
  
  // Identify learning patterns
  const patterns: Record<string, any> = {
    preferredTimeOfDay: detectPreferredTimeOfDay(learningEvents),
    averageSessionDuration: calculateAverageSessionDuration(learningEvents),
    contentTypePreferences: calculateContentTypePreferences([...timePerContentType.entries()]),
    mostChallenging: identifyMostChallengingTopics([...successRatesByTopic.entries()]),
  };
  
  return {
    timePerContentType: Object.fromEntries(timePerContentType),
    successRatesByTopic: Object.fromEntries(successRatesByTopic),
    patterns
  };
}

/**
 * Helper functions
 */

function detectPreferredTimeOfDay(events: any[]): string {
  // Logic to detect when user typically studies
  const hours = events.map(e => new Date(e.timestamp).getHours());
  
  let morning = 0, afternoon = 0, evening = 0, night = 0;
  
  for (const hour of hours) {
    if (hour >= 5 && hour < 12) morning++;
    else if (hour >= 12 && hour < 17) afternoon++;
    else if (hour >= 17 && hour < 22) evening++;
    else night++;
  }
  
  const max = Math.max(morning, afternoon, evening, night);
  
  if (max === morning) return 'morning';
  if (max === afternoon) return 'afternoon';
  if (max === evening) return 'evening';
  return 'night';
}

function calculateAverageSessionDuration(events: any[]): number {
  // Logic to calculate average study session length
  // For simplicity, just return a mock value
  return 35; // minutes
}

function calculateContentTypePreferences(timePerType: [string, number][]): Record<string, number> {
  // Calculate preferences based on time spent
  const totalTime = timePerType.reduce((sum, [_, time]) => sum + time, 0);
  
  if (totalTime === 0) return {};
  
  return Object.fromEntries(
    timePerType.map(([type, time]) => [type, time / totalTime])
  );
}

function identifyMostChallengingTopics(successRates: [string, number][]): string[] {
  // Return topics with success rates below 70%
  return successRates
    .filter(([_, rate]) => rate < 0.7)
    .map(([topicId]) => topicId);
}
