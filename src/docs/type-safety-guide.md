# Type Safety Guide for Study Bee Application

This document provides guidelines and best practices for maintaining type safety in the Study Bee application.

## Enum Usage

### String vs Enum Values

When working with enums, always use the enum value instead of string literals. For example:

```typescript
// Incorrect
const agentType = "COGNITIVE_PROFILE";

// Correct
import { AgentTypeEnum } from '../types';
const agentType = AgentTypeEnum.COGNITIVE_PROFILE;
```

### Type Conversion

When dealing with data from external sources (like API responses), use the type conversion utilities:

```typescript
import { stringToAgentType } from '@/services/agents/utils/typeConverters';

// Convert a string to an enum value
const agentType = stringToAgentType(apiResponse.agentType);
```

### Type Guards

Use type guards to safely check if a value matches an expected enum type:

```typescript
import { isAgentType } from '@/services/agents/utils/typeConverters';

if (isAgentType(value)) {
  // value is now treated as AgentTypeEnum
  processAgentType(value);
}
```

## Interface Implementation

When implementing interfaces, ensure that all required properties are provided and match the expected types:

```typescript
interface AgentTask {
  id: string;
  userId: string;
  taskType: TaskType;
  // ... other properties
}

// Implementing the interface
const task: AgentTask = {
  id: 'task-1',
  userId: 'user-1',
  taskType: TaskTypeEnum.COGNITIVE_PROFILING,
  // ... provide all required properties
};
```

## Testing Type Safety

Use TypeScript's compiler to check for type errors:

```bash
tsc --noEmit
```

Also, include type checking in unit tests:

```typescript
it('should handle agent type correctly', () => {
  const agent = new BaseAgent(AgentTypeEnum.COGNITIVE_PROFILE);
  expect(agent.getType()).toBe(AgentTypeEnum.COGNITIVE_PROFILE);
});
```

## Common Errors and Solutions

### Type 'string' is not assignable to type 'Enum'

This occurs when using string literals instead of enum values. Fix by using the appropriate enum:

```typescript
// Error
const priority: TaskPriority = "HIGH";

// Fix
const priority: TaskPriority = TaskPriorityEnum.HIGH;
```

### Object literal may only specify known properties

This occurs when providing extra properties that aren't in the interface:

```typescript
// Error
const task: AgentTask = {
  id: 'task-1',
  extraProperty: 'value' // Not in the interface
};

// Fix: Remove extra properties
const task: AgentTask = {
  id: 'task-1'
  // Only include properties defined in the interface
};
```

## Best Practices

1. Use TypeScript's strict mode for maximum type safety
2. Document function parameter and return types
3. Use interfaces for object shapes
4. Use enums for finite sets of values
5. Use generics for reusable components
6. Avoid using `any` as much as possible
7. Use union types when a value can have multiple types
8. Use intersection types to combine multiple types
