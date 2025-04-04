
# Type Safety Guidelines

This document outlines the best practices for maintaining type safety throughout the Study Bee codebase.

## Core Principles

1. **Use Strong Typing**: Always define explicit types for variables, functions, and interfaces.
2. **Avoid `any`**: Use more specific types like `Record<string, unknown>` or create proper interfaces.
3. **Leverage Enums**: Use enums for values with a fixed set of options.
4. **Define Union Types**: When a variable can be one of several specific types.
5. **Create Type Guards**: Implement functions that check runtime types when needed.

## Enum Best Practices

Enums are used extensively throughout the application to ensure type safety for values with a limited set of options.

```typescript
// Define enums for concept grouping and better autocompletion
export enum TaskStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}

// Always use the enum value, not the string directly
function updateStatus(status: TaskStatus) {
  // ...
}

// Correct usage
updateStatus(TaskStatus.COMPLETED);

// Incorrect usage
updateStatus("COMPLETED");
```

## Interface Design

When designing interfaces:

1. **Document each property**: Add JSDoc comments explaining the purpose and constraints of each field.
2. **Be specific about optionality**: Use the `?` modifier only for truly optional fields.
3. **Define nested structures**: Create separate interfaces for complex nested objects.
4. **Use precise types**: For example, use `string[]` instead of `Array<any>`.

```typescript
/**
 * Represents a user's cognitive profile
 */
interface CognitiveProfile {
  /** Unique identifier for the user */
  userId: string;
  
  /** Speed at which the user learns different topics (0-1 scale) */
  learningSpeed: Record<string, number>;
  
  /** Content formats the user prefers (e.g., 'video', 'text', 'interactive') */
  preferredContentFormats?: string[];
  
  // More properties...
}
```

## Type Conversion

When converting between types:

1. Use explicit type conversion functions
2. Validate the value before casting
3. Handle edge cases and invalid values

See `src/services/agents/utils/typeConverters.ts` for examples.

## Generic Types

Use generic types to create reusable, type-safe components:

```typescript
interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

async function fetchData<T>(endpoint: string): Promise<ApiResponse<T>> {
  // Implementation...
}

// Usage with type safety
const result = await fetchData<UserProfile>('/api/profile');
const profile = result.data; // TypeScript knows this is UserProfile | null
```

## Type Guards

Implement type guards to safely narrow types at runtime:

```typescript
function isUserProfile(obj: unknown): obj is UserProfile {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'userId' in obj &&
    'learningPreferences' in obj
  );
}

// Usage
if (isUserProfile(data)) {
  // TypeScript now treats data as UserProfile
  console.log(data.userId);
}
```

## Testing Type Safety

For critical interfaces and type definitions:

1. Write tests that verify type compatibility
2. Test edge cases and boundaries
3. Ensure proper error handling for invalid types

## Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
