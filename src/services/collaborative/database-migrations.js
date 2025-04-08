/**
 * Database migrations for the Collaborative Knowledge Network
 * This file contains the SQL queries to create the necessary tables
 * for the Collaborative Knowledge Network to function.
 */

export const knowledgeNodesTable = `
CREATE TABLE IF NOT EXISTS knowledge_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tags TEXT[] DEFAULT '{}',
  related_nodes UUID[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS knowledge_nodes_creator_id_idx ON knowledge_nodes(creator_id);
CREATE INDEX IF NOT EXISTS knowledge_nodes_type_idx ON knowledge_nodes(type);
CREATE INDEX IF NOT EXISTS knowledge_nodes_tags_idx ON knowledge_nodes USING GIN(tags);
`;

export const collaborationsTable = `
CREATE TABLE IF NOT EXISTS collaborations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_ids UUID[] DEFAULT '{}',
  node_ids UUID[] DEFAULT '{}',
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS collaborations_creator_id_idx ON collaborations(creator_id);
CREATE INDEX IF NOT EXISTS collaborations_participant_ids_idx ON collaborations USING GIN(participant_ids);
`;

export const contributionsTable = `
CREATE TABLE IF NOT EXISTS contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  node_id UUID NOT NULL REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS contributions_user_id_idx ON contributions(user_id);
CREATE INDEX IF NOT EXISTS contributions_node_id_idx ON contributions(node_id);
CREATE INDEX IF NOT EXISTS contributions_type_idx ON contributions(type);
`;

export const knowledgeGraphTable = `
CREATE TABLE IF NOT EXISTS knowledge_graph (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_node_id UUID NOT NULL REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
  target_node_id UUID NOT NULL REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL,
  strength FLOAT DEFAULT 1.0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(source_node_id, target_node_id, relationship_type)
);

CREATE INDEX IF NOT EXISTS knowledge_graph_source_node_id_idx ON knowledge_graph(source_node_id);
CREATE INDEX IF NOT EXISTS knowledge_graph_target_node_id_idx ON knowledge_graph(target_node_id);
CREATE INDEX IF NOT EXISTS knowledge_graph_relationship_type_idx ON knowledge_graph(relationship_type);
`;

export const collaborationInvitesTable = `
CREATE TABLE IF NOT EXISTS collaboration_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collaboration_id UUID NOT NULL REFERENCES collaborations(id) ON DELETE CASCADE,
  inviter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collaboration_id, invitee_id)
);

CREATE INDEX IF NOT EXISTS collaboration_invites_collaboration_id_idx ON collaboration_invites(collaboration_id);
CREATE INDEX IF NOT EXISTS collaboration_invites_invitee_id_idx ON collaboration_invites(invitee_id);
CREATE INDEX IF NOT EXISTS collaboration_invites_status_idx ON collaboration_invites(status);
`;

/**
 * Run all migrations
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client
 * @returns {Promise<boolean>} Success status
 */
export async function runMigrations(supabase) {
  try {
    const migrations = [
      knowledgeNodesTable,
      collaborationsTable,
      contributionsTable,
      knowledgeGraphTable,
      collaborationInvitesTable
    ];
    
    for (const migration of migrations) {
      const { error } = await supabase.rpc('run_sql', { sql: migration });
      
      if (error) {
        console.error('Migration error:', error);
        return false;
      }
    }
    
    console.log('All collaborative knowledge migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Error running collaborative knowledge migrations:', error);
    return false;
  }
}
