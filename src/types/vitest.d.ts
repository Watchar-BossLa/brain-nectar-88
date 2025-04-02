
declare module 'vitest' {
  import { TestFunction, TestOptions } from 'node:test';
  
  export interface ExpectStatic {
    <T = any>(actual: T): Assertions<T>;
    extend(matchers: any): void;
    assertions(count: number): void;
    hasAssertions(): void;
    soft: ExpectStatic;
    not: ExpectStatic;
  }

  export interface Assertions<T> {
    toBe(expected: any): void;
    toBeCloseTo(expected: number, precision?: number): void;
    toBeDefined(): void;
    toBeFalsy(): void;
    toBeGreaterThan(expected: number): void;
    toBeGreaterThanOrEqual(expected: number): void;
    toBeLessThan(expected: number): void;
    toBeLessThanOrEqual(expected: number): void;
    toBeInstanceOf(expected: any): void;
    toBeNull(): void;
    toBeTruthy(): void;
    toBeUndefined(): void;
    toContain(expected: any): void;
    toContainEqual(expected: any): void;
    toEqual(expected: any): void;
    toHaveLength(expected: number): void;
    toHaveProperty(property: string, value?: any): void;
    toMatch(expected: string | RegExp): void;
    toMatchObject(expected: object): void;
    toMatchSnapshot(name?: string): void;
    toStrictEqual(expected: any): void;
    toThrow(expected?: string | RegExp | Error | ErrorConstructor): void;
    toThrowError(expected?: string | RegExp | Error | ErrorConstructor): void;
  }

  export const expect: ExpectStatic;

  export function describe(name: string, handler: () => void): void;
  export function it(name: string, handler: () => void | Promise<void>, timeout?: number): void;
  export function test(name: string, handler: () => void | Promise<void>, timeout?: number): void;
  export function beforeAll(handler: () => void | Promise<void>, timeout?: number): void;
  export function afterAll(handler: () => void | Promise<void>, timeout?: number): void;
  export function beforeEach(handler: () => void | Promise<void>, timeout?: number): void;
  export function afterEach(handler: () => void | Promise<void>, timeout?: number): void;
}
