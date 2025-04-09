/**
 * Database migrations for the Visual Recognition System
 * This file contains the SQL queries to create the necessary tables
 * for the Visual Recognition System to function.
 */

export const visualRecognitionImagesTable = `
CREATE TABLE IF NOT EXISTS visual_recognition_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  recognition_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS visual_recognition_images_user_id_idx ON visual_recognition_images(user_id);
CREATE INDEX IF NOT EXISTS visual_recognition_images_recognition_status_idx ON visual_recognition_images(recognition_status);
`;

export const visualRecognitionResultsTable = `
CREATE TABLE IF NOT EXISTS visual_recognition_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_id UUID NOT NULL REFERENCES visual_recognition_images(id) ON DELETE CASCADE,
  result_type TEXT NOT NULL,
  result_data JSONB NOT NULL,
  confidence FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS visual_recognition_results_image_id_idx ON visual_recognition_results(image_id);
CREATE INDEX IF NOT EXISTS visual_recognition_results_result_type_idx ON visual_recognition_results(result_type);
`;

export const visualRecognitionAnnotationsTable = `
CREATE TABLE IF NOT EXISTS visual_recognition_annotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_id UUID NOT NULL REFERENCES visual_recognition_images(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  annotation_type TEXT NOT NULL,
  content TEXT NOT NULL,
  bounding_box JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS visual_recognition_annotations_image_id_idx ON visual_recognition_annotations(image_id);
CREATE INDEX IF NOT EXISTS visual_recognition_annotations_user_id_idx ON visual_recognition_annotations(user_id);
`;

export const visualRecognitionTagsTable = `
CREATE TABLE IF NOT EXISTS visual_recognition_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_id UUID NOT NULL REFERENCES visual_recognition_images(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  confidence FLOAT,
  source TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS visual_recognition_tags_image_id_idx ON visual_recognition_tags(image_id);
CREATE INDEX IF NOT EXISTS visual_recognition_tags_tag_idx ON visual_recognition_tags(tag);
`;

export const visualRecognitionObjectsTable = `
CREATE TABLE IF NOT EXISTS visual_recognition_objects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_id UUID NOT NULL REFERENCES visual_recognition_images(id) ON DELETE CASCADE,
  object_class TEXT NOT NULL,
  confidence FLOAT NOT NULL,
  bounding_box JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS visual_recognition_objects_image_id_idx ON visual_recognition_objects(image_id);
`;

export const visualRecognitionTextTable = `
CREATE TABLE IF NOT EXISTS visual_recognition_text (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_id UUID NOT NULL REFERENCES visual_recognition_images(id) ON DELETE CASCADE,
  text_content TEXT NOT NULL,
  confidence FLOAT,
  bounding_box JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS visual_recognition_text_image_id_idx ON visual_recognition_text(image_id);
`;

export const visualRecognitionFormulasTable = `
CREATE TABLE IF NOT EXISTS visual_recognition_formulas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_id UUID NOT NULL REFERENCES visual_recognition_images(id) ON DELETE CASCADE,
  latex TEXT NOT NULL,
  rendered_image_url TEXT,
  explanation TEXT,
  confidence FLOAT,
  bounding_box JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS visual_recognition_formulas_image_id_idx ON visual_recognition_formulas(image_id);
`;

export const visualRecognitionChartsTable = `
CREATE TABLE IF NOT EXISTS visual_recognition_charts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_id UUID NOT NULL REFERENCES visual_recognition_images(id) ON DELETE CASCADE,
  chart_type TEXT NOT NULL,
  chart_data JSONB NOT NULL,
  confidence FLOAT,
  bounding_box JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS visual_recognition_charts_image_id_idx ON visual_recognition_charts(image_id);
CREATE INDEX IF NOT EXISTS visual_recognition_charts_chart_type_idx ON visual_recognition_charts(chart_type);
`;

/**
 * Run all migrations
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client
 * @returns {Promise<boolean>} Success status
 */
export async function runMigrations(supabase) {
  try {
    const migrations = [
      visualRecognitionImagesTable,
      visualRecognitionResultsTable,
      visualRecognitionAnnotationsTable,
      visualRecognitionTagsTable,
      visualRecognitionObjectsTable,
      visualRecognitionTextTable,
      visualRecognitionFormulasTable,
      visualRecognitionChartsTable
    ];

    for (const migration of migrations) {
      const { error } = await supabase.rpc('run_sql', { sql: migration });

      if (error) {
        console.error('Migration error:', error);
        return false;
      }
    }

    console.log('All visual recognition migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Error running visual recognition migrations:', error);
    return false;
  }
}
