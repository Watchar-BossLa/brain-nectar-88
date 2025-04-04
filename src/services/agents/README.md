
# Multi-Agent Learning System

This directory contains the implementation of the Study Bee multi-agent learning system, which orchestrates specialized AI agents to deliver personalized learning experiences.

## Core Components

### Types (`types.ts`)

The following key types define the structure of the agent system:

- `AgentType`: Enum defining the different specialized agents in the system
- `TaskType`: Enum for the various task categories agents can perform
- `TaskPriority`: Enum for task prioritization levels
- `TaskStatus`: Enum for tracking task completion state
- `MessageType`: Enum for inter-agent communication message categories
- `AgentTask`: Interface for work items to be processed by agents
- `AgentMessage`: Interface for messages exchanged between agents
- `SystemState`: Interface for global system state tracking
- `CognitiveProfile`: Interface for user learning characteristics

### Master Control Program (MCP)

The MCP (`mcp/index.ts`) serves as the central coordinator for the multi-agent system:

- Coordinates task distribution to appropriate agents
- Maintains system state and agent activation status
- Manages inter-agent communication
- Integrates with LLM orchestration for enhanced capabilities

### Agent Registry

The Agent Registry (`mcp/agentRegistry.ts`) manages agent instantiation and access:

- Creates and stores agent instances
- Provides access to agents by type
- Handles agent lifecycle and reset operations

### Type Conversion Utilities (`utils/typeConverters.ts`)

Utilities for type safety and conversion:

- Converts string values to strongly-typed enums
- Provides type guards for runtime type checking
- Ensures consistent handling of enum values

## Specialized Agents

Each specialized agent focuses on a specific aspect of the learning experience:

1. `CognitiveProfileAgent`: Models learner characteristics and preferences
2. `LearningPathAgent`: Plans personalized learning sequences
3. `ContentAdaptationAgent`: Adjusts learning materials to match learner needs
4. `AssessmentAgent`: Creates and evaluates knowledge assessments
5. `EngagementAgent`: Optimizes motivation and learning retention
6. `FeedbackAgent`: Provides constructive guidance and improvement suggestions
7. `UiUxAgent`: Adapts interface presentation for optimal learning
8. `SchedulingAgent`: Optimizes timing of learning activities

## Implementation Guidelines

When extending or modifying the agent system:

1. Maintain strict type safety by using the defined enums and interfaces
2. Follow the single responsibility principle for specialized agents
3. Use the MCP for coordination rather than direct agent-to-agent communication
4. Document all new agent capabilities and task types
