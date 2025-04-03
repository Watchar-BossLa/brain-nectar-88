
/**
 * Agent component prop types
 */

export interface AgentCardProps {
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'processing';
  type: string;
  onActivate?: () => void;
  onDeactivate?: () => void;
}

export interface AgentMessageProps {
  message: {
    id: string;
    content: string;
    timestamp: string;
    sender: string;
    type: 'system' | 'user' | 'agent';
    isProcessing?: boolean;
  };
  isLast?: boolean;
}

export interface AgentTaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
    priority: 'low' | 'medium' | 'high' | 'critical';
    assignedAgent: string;
    createdAt: string;
    completedAt?: string;
  };
  onViewDetails: (taskId: string) => void;
}
