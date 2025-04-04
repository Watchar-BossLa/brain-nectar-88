
import { ReactNode } from 'react';

export interface TimerSession {
  id: string;
  userId: string;
  durationMinutes: number;
  completed: boolean;
  startTime: Date;
  endTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimerContextType {
  duration: number;
  isRunning: boolean;
  isPaused: boolean;
  timeRemaining: number;
  sessionsToday: number;
  totalMinutesToday: number;
  sessionsThisWeek: number;
  totalMinutesThisWeek: number;
  sessionsThisMonth: number; 
  totalMinutesThisMonth: number;
  setDuration: (minutes: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  completeSession: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  recentSessions: TimerSession[];
}

export interface TimerDisplayProps {
  timeRemaining: number;
  duration: number;
}

export interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export interface TimerDurationSelectorProps {
  duration: number;
  onDurationChange: (duration: number) => void;
  disabled: boolean;
}

export interface TimerStatsProps {
  isLoading: boolean;
  sessionsToday: number;
  totalMinutesToday: number;
  sessionsThisWeek: number;
  totalMinutesThisWeek: number;
  sessionsThisMonth: number;
  totalMinutesThisMonth: number;
}

export interface TimerSessionHistoryProps {
  isLoading: boolean;
  sessions: TimerSession[];
}
