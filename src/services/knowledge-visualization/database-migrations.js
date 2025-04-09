/**
 * Database migrations for the Knowledge Visualization feature
 * This file contains the SQL queries to create the necessary tables
 * for the knowledge visualization system to function.
 */

import { supabase } from '@/integrations/supabase/client';

export const knowledgeMapsTable = `
CREATE TABLE IF NOT EXISTS knowledge_maps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  layout_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS knowledge_maps_user_id_idx ON knowledge_maps(user_id);
CREATE INDEX IF NOT EXISTS knowledge_maps_is_public_idx ON knowledge_maps(is_public);
`;

export const conceptsTable = `
CREATE TABLE IF NOT EXISTS concepts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  map_id UUID NOT NULL REFERENCES knowledge_maps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  position_x FLOAT,
  position_y FLOAT,
  color TEXT,
  icon TEXT,
  concept_type TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS concepts_map_id_idx ON concepts(map_id);
`;

export const relationshipsTable = `
CREATE TABLE IF NOT EXISTS relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  map_id UUID NOT NULL REFERENCES knowledge_maps(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL,
  label TEXT,
  strength FLOAT,
  bidirectional BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(map_id, source_id, target_id, relationship_type)
);

CREATE INDEX IF NOT EXISTS relationships_map_id_idx ON relationships(map_id);
CREATE INDEX IF NOT EXISTS relationships_source_id_idx ON relationships(source_id);
CREATE INDEX IF NOT EXISTS relationships_target_id_idx ON relationships(target_id);
`;

export const learningPathsTable = `
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  map_id UUID REFERENCES knowledge_maps(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  difficulty_level TEXT,
  estimated_duration INTEGER,
  path_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS learning_paths_user_id_idx ON learning_paths(user_id);
CREATE INDEX IF NOT EXISTS learning_paths_map_id_idx ON learning_paths(map_id);
CREATE INDEX IF NOT EXISTS learning_paths_is_public_idx ON learning_paths(is_public);
`;

export const pathNodesTable = `
CREATE TABLE IF NOT EXISTS path_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  concept_id UUID REFERENCES concepts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  position INTEGER NOT NULL,
  completion_criteria JSONB,
  resources JSONB,
  node_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS path_nodes_path_id_idx ON path_nodes(path_id);
CREATE INDEX IF NOT EXISTS path_nodes_concept_id_idx ON path_nodes(concept_id);
CREATE INDEX IF NOT EXISTS path_nodes_position_idx ON path_nodes(position);
`;

export const userProgressTable = `
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  map_id UUID REFERENCES knowledge_maps(id) ON DELETE SET NULL,
  path_id UUID REFERENCES learning_paths(id) ON DELETE SET NULL,
  concept_id UUID REFERENCES concepts(id) ON DELETE SET NULL,
  node_id UUID REFERENCES path_nodes(id) ON DELETE SET NULL,
  progress_type TEXT NOT NULL,
  status TEXT NOT NULL,
  completion_percentage FLOAT,
  last_activity TIMESTAMP WITH TIME ZONE,
  progress_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, progress_type, map_id, path_id, concept_id, node_id)
);

CREATE INDEX IF NOT EXISTS user_progress_user_id_idx ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS user_progress_map_id_idx ON user_progress(map_id);
CREATE INDEX IF NOT EXISTS user_progress_path_id_idx ON user_progress(path_id);
CREATE INDEX IF NOT EXISTS user_progress_concept_id_idx ON user_progress(concept_id);
CREATE INDEX IF NOT EXISTS user_progress_node_id_idx ON user_progress(node_id);
CREATE INDEX IF NOT EXISTS user_progress_status_idx ON user_progress(status);
`;

export const mapTagsTable = `
CREATE TABLE IF NOT EXISTS map_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  map_id UUID NOT NULL REFERENCES knowledge_maps(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(map_id, tag)
);

CREATE INDEX IF NOT EXISTS map_tags_map_id_idx ON map_tags(map_id);
CREATE INDEX IF NOT EXISTS map_tags_tag_idx ON map_tags(tag);
`;

export const mapCollaboratorsTable = `
CREATE TABLE IF NOT EXISTS map_collaborators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  map_id UUID NOT NULL REFERENCES knowledge_maps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(map_id, user_id)
);

CREATE INDEX IF NOT EXISTS map_collaborators_map_id_idx ON map_collaborators(map_id);
CREATE INDEX IF NOT EXISTS map_collaborators_user_id_idx ON map_collaborators(user_id);
CREATE INDEX IF NOT EXISTS map_collaborators_role_idx ON map_collaborators(role);
`;

/**
 * Run all migrations
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client
 * @returns {Promise<boolean>} Success status
 */
export async function runMigrations(supabase) {
  try {
    const migrations = [
      knowledgeMapsTable,
      conceptsTable,
      relationshipsTable,
      learningPathsTable,
      pathNodesTable,
      userProgressTable,
      mapTagsTable,
      mapCollaboratorsTable
    ];
    
    for (const migration of migrations) {
      const { error } = await supabase.rpc('run_sql', { sql: migration });
      
      if (error) {
        console.error('Migration error:', error);
        return false;
      }
    }
    
    console.log('All knowledge visualization migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Error running knowledge visualization migrations:', error);
    return false;
  }
}
