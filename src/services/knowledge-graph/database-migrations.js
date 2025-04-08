/**
 * Database migrations for the Knowledge Graph
 * This file contains the SQL queries to create the necessary tables
 * for the Knowledge Graph to function.
 */

export const knowledgeConceptsTable = `
CREATE TABLE IF NOT EXISTS knowledge_concepts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  source TEXT NOT NULL,
  source_id UUID,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS knowledge_concepts_user_id_idx ON knowledge_concepts(user_id);
CREATE INDEX IF NOT EXISTS knowledge_concepts_name_idx ON knowledge_concepts(name);
CREATE INDEX IF NOT EXISTS knowledge_concepts_source_idx ON knowledge_concepts(source, source_id);
CREATE INDEX IF NOT EXISTS knowledge_concepts_tags_idx ON knowledge_concepts USING GIN(tags);
`;

export const knowledgeRelationshipsTable = `
CREATE TABLE IF NOT EXISTS knowledge_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_concept_id UUID NOT NULL REFERENCES knowledge_concepts(id) ON DELETE CASCADE,
  target_concept_id UUID NOT NULL REFERENCES knowledge_concepts(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  strength FLOAT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, source_concept_id, target_concept_id)
);

CREATE INDEX IF NOT EXISTS knowledge_relationships_user_id_idx ON knowledge_relationships(user_id);
CREATE INDEX IF NOT EXISTS knowledge_relationships_source_concept_id_idx ON knowledge_relationships(source_concept_id);
CREATE INDEX IF NOT EXISTS knowledge_relationships_target_concept_id_idx ON knowledge_relationships(target_concept_id);
CREATE INDEX IF NOT EXISTS knowledge_relationships_type_idx ON knowledge_relationships(type);
CREATE INDEX IF NOT EXISTS knowledge_relationships_strength_idx ON knowledge_relationships(strength);
`;

export const knowledgeMapsTable = `
CREATE TABLE IF NOT EXISTS knowledge_maps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  layout_data JSONB DEFAULT '{}'::jsonb,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS knowledge_maps_user_id_idx ON knowledge_maps(user_id);
CREATE INDEX IF NOT EXISTS knowledge_maps_is_public_idx ON knowledge_maps(is_public);
`;

export const knowledgeMapConceptsTable = `
CREATE TABLE IF NOT EXISTS knowledge_map_concepts (
  map_id UUID NOT NULL REFERENCES knowledge_maps(id) ON DELETE CASCADE,
  concept_id UUID NOT NULL REFERENCES knowledge_concepts(id) ON DELETE CASCADE,
  position_x FLOAT,
  position_y FLOAT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (map_id, concept_id)
);

CREATE INDEX IF NOT EXISTS knowledge_map_concepts_map_id_idx ON knowledge_map_concepts(map_id);
CREATE INDEX IF NOT EXISTS knowledge_map_concepts_concept_id_idx ON knowledge_map_concepts(concept_id);
`;

export const knowledgeNotesTable = `
CREATE TABLE IF NOT EXISTS knowledge_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  concept_id UUID NOT NULL REFERENCES knowledge_concepts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS knowledge_notes_user_id_idx ON knowledge_notes(user_id);
CREATE INDEX IF NOT EXISTS knowledge_notes_concept_id_idx ON knowledge_notes(concept_id);
`;

export const learningPathsTable = `
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS learning_paths_user_id_idx ON learning_paths(user_id);
`;

export const learningPathStepsTable = `
CREATE TABLE IF NOT EXISTS learning_path_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  concept_id UUID NOT NULL REFERENCES knowledge_concepts(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(path_id, step_order)
);

CREATE INDEX IF NOT EXISTS learning_path_steps_path_id_idx ON learning_path_steps(path_id);
CREATE INDEX IF NOT EXISTS learning_path_steps_concept_id_idx ON learning_path_steps(concept_id);
`;

/**
 * Run all migrations
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client
 * @returns {Promise<boolean>} Success status
 */
export async function runMigrations(supabase) {
  try {
    const migrations = [
      knowledgeConceptsTable,
      knowledgeRelationshipsTable,
      knowledgeMapsTable,
      knowledgeMapConceptsTable,
      knowledgeNotesTable,
      learningPathsTable,
      learningPathStepsTable
    ];
    
    for (const migration of migrations) {
      const { error } = await supabase.rpc('run_sql', { sql: migration });
      
      if (error) {
        console.error('Migration error:', error);
        return false;
      }
    }
    
    console.log('All knowledge graph migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Error running knowledge graph migrations:', error);
    return false;
  }
}
