
import React from 'react';
import { ChevronDown } from 'lucide-react';

// Make sure to export all components for external use
export { default as TopicItem } from './topic-item';
export { default as ModuleHeader } from './module-header';
export { default as ModuleContent } from './module-content';
export type { TopicItemProps } from './topic-item';
export type { ModuleHeaderProps } from './module-header';
export type { ModuleContentProps } from './module-content';

// This is a convenience re-export so that importing from this folder works
export { default } from './learning-module';
