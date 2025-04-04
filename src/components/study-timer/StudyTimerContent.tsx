
import React from 'react';
import { useTimer } from '@/context/timer/TimerContext';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import TimerDurationSelector from './TimerDurationSelector';
import TimerStats from './TimerStats';
import TimerSessionHistory from './TimerSessionHistory';

export const StudyTimerContent = () => {
  const { 
    duration, 
    isRunning, 
    isPaused, 
    timeRemaining, 
    startTimer, 
    pauseTimer, 
    resumeTimer, 
    resetTimer, 
    setDuration,
    isLoading,
    sessionsToday,
    totalMinutesToday,
    sessionsThisWeek,
    totalMinutesThisWeek,
    sessionsThisMonth,
    totalMinutesThisMonth,
    recentSessions
  } = useTimer();
  
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Study Timer</h1>
          <p className="text-muted-foreground">
            Focus on your studies with timed sessions and track your progress
          </p>
        </div>
        
        <div className="grid gap-6">
          {/* Timer Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <TimerDisplay 
                timeRemaining={timeRemaining} 
                duration={duration} 
              />
            </div>
            <div className="space-y-6">
              <TimerDurationSelector 
                duration={duration} 
                onDurationChange={setDuration} 
                disabled={isRunning || isPaused} 
              />
              <TimerControls 
                isRunning={isRunning} 
                isPaused={isPaused} 
                onStart={startTimer} 
                onPause={pauseTimer} 
                onResume={resumeTimer} 
                onReset={resetTimer} 
              />
            </div>
          </div>
          
          {/* Statistics Section */}
          <div className="grid gap-6 md:grid-cols-1">
            <TimerStats 
              isLoading={isLoading}
              sessionsToday={sessionsToday}
              totalMinutesToday={totalMinutesToday}
              sessionsThisWeek={sessionsThisWeek}
              totalMinutesThisWeek={totalMinutesThisWeek}
              sessionsThisMonth={sessionsThisMonth}
              totalMinutesThisMonth={totalMinutesThisMonth}
            />
            <TimerSessionHistory 
              isLoading={isLoading} 
              sessions={recentSessions} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
