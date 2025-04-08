/**
 * Visual recognition services index
 * This file exports all visual recognition-related services and utilities
 */

import { VisualRecognitionService, useVisualRecognition } from './VisualRecognitionService';
import { ImageAnalysisService, useImageAnalysis } from './ImageAnalysisService';
import { StudyMaterialGeneratorService, useStudyMaterialGenerator } from './StudyMaterialGeneratorService';
import { runMigrations } from './database-migrations';

export {
  VisualRecognitionService,
  useVisualRecognition,
  ImageAnalysisService,
  useImageAnalysis,
  StudyMaterialGeneratorService,
  useStudyMaterialGenerator,
  runMigrations
};
