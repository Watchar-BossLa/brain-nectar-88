/**
 * @typedef {Object} TimerSession
 * @property {string} id - Session ID
 * @property {string} userId - User ID
 * @property {number} durationMinutes - Duration in minutes
 * @property {boolean} completed - Whether the session is completed
 * @property {Date} startTime - Start time
 * @property {Date} [endTime] - End time
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Update timestamp
 */

/**
 * @typedef {Object} TimerContextType
 * @property {number} duration - Timer duration in minutes
 * @property {boolean} isRunning - Whether the timer is running
 * @property {boolean} isPaused - Whether the timer is paused
 * @property {number} timeRemaining - Time remaining in seconds
 * @property {number} sessionsToday - Number of sessions today
 * @property {number} totalMinutesToday - Total minutes today
 * @property {number} sessionsThisWeek - Number of sessions this week
 * @property {number} totalMinutesThisWeek - Total minutes this week
 * @property {number} sessionsThisMonth - Number of sessions this month
 * @property {number} totalMinutesThisMonth - Total minutes this month
 * @property {Function} setDuration - Function to set duration
 * @property {Function} startTimer - Function to start timer
 * @property {Function} pauseTimer - Function to pause timer
 * @property {Function} resumeTimer - Function to resume timer
 * @property {Function} resetTimer - Function to reset timer
 * @property {Function} completeSession - Function to complete session
 * @property {boolean} isLoading - Whether data is loading
 * @property {Error|null} error - Error if any
 * @property {TimerSession[]} recentSessions - Recent sessions
 */

/**
 * @typedef {Object} TimerDisplayProps
 * @property {number} timeRemaining - Time remaining in seconds
 * @property {number} duration - Timer duration in minutes
 */

/**
 * @typedef {Object} TimerControlsProps
 * @property {boolean} isRunning - Whether the timer is running
 * @property {boolean} isPaused - Whether the timer is paused
 * @property {Function} onStart - Start callback
 * @property {Function} onPause - Pause callback
 * @property {Function} onResume - Resume callback
 * @property {Function} onReset - Reset callback
 */

/**
 * @typedef {Object} TimerDurationSelectorProps
 * @property {number} duration - Timer duration in minutes
 * @property {Function} onDurationChange - Duration change callback
 * @property {boolean} disabled - Whether the selector is disabled
 */

/**
 * @typedef {Object} TimerStatsProps
 * @property {boolean} isLoading - Whether data is loading
 * @property {number} sessionsToday - Number of sessions today
 * @property {number} totalMinutesToday - Total minutes today
 * @property {number} sessionsThisWeek - Number of sessions this week
 * @property {number} totalMinutesThisWeek - Total minutes this week
 * @property {number} sessionsThisMonth - Number of sessions this month
 * @property {number} totalMinutesThisMonth - Total minutes this month
 */

/**
 * @typedef {Object} TimerSessionHistoryProps
 * @property {boolean} isLoading - Whether data is loading
 * @property {TimerSession[]} sessions - Timer sessions
 */

export {};
