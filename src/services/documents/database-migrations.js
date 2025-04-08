/**
 * Database migrations for the Document Analysis Service
 * This file contains the SQL queries to create the necessary tables
 * for the Document Analysis Service to function.
 */

export const documentsTable = `
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id TEXT NOT NULL UNIQUE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_path TEXT NOT NULL,
  public_url TEXT,
  status TEXT NOT NULL,
  options JSONB DEFAULT '{}'::jsonb,
  processing_started_at TIMESTAMP WITH TIME ZONE,
  processing_completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  text_content TEXT,
  structure JSONB,
  tables JSONB,
  formulas JSONB,
  references JSONB,
  analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS documents_user_id_idx ON documents(user_id);
CREATE INDEX IF NOT EXISTS documents_job_id_idx ON documents(job_id);
CREATE INDEX IF NOT EXISTS documents_status_idx ON documents(status);
CREATE INDEX IF NOT EXISTS documents_created_at_idx ON documents(created_at);
`;

export const documentNotesTable = `
CREATE TABLE IF NOT EXISTS document_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  page_number INTEGER,
  position JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS document_notes_document_id_idx ON document_notes(document_id);
CREATE INDEX IF NOT EXISTS document_notes_user_id_idx ON document_notes(user_id);
`;

export const documentHighlightsTable = `
CREATE TABLE IF NOT EXISTS document_highlights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  page_number INTEGER NOT NULL,
  position JSONB NOT NULL,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS document_highlights_document_id_idx ON document_highlights(document_id);
CREATE INDEX IF NOT EXISTS document_highlights_user_id_idx ON document_highlights(user_id);
`;

export const documentBookmarksTable = `
CREATE TABLE IF NOT EXISTS document_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  page_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS document_bookmarks_document_id_idx ON document_bookmarks(document_id);
CREATE INDEX IF NOT EXISTS document_bookmarks_user_id_idx ON document_bookmarks(user_id);
`;

export const documentFlashcardsTable = `
CREATE TABLE IF NOT EXISTS document_flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  source_page INTEGER,
  source_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS document_flashcards_document_id_idx ON document_flashcards(document_id);
CREATE INDEX IF NOT EXISTS document_flashcards_user_id_idx ON document_flashcards(user_id);
`;

/**
 * Run all migrations
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client
 * @returns {Promise<boolean>} Success status
 */
export async function runMigrations(supabase) {
  try {
    const migrations = [
      documentsTable,
      documentNotesTable,
      documentHighlightsTable,
      documentBookmarksTable,
      documentFlashcardsTable
    ];
    
    for (const migration of migrations) {
      const { error } = await supabase.rpc('run_sql', { sql: migration });
      
      if (error) {
        console.error('Migration error:', error);
        return false;
      }
    }
    
    // Create storage bucket for documents if it doesn't exist
    const { error: bucketError } = await supabase.storage.createBucket('user-documents', {
      public: false,
      fileSizeLimit: 20971520, // 20MB
      allowedMimeTypes: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/markdown',
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]
    });
    
    if (bucketError && bucketError.message !== 'Bucket already exists') {
      console.error('Error creating storage bucket:', bucketError);
      return false;
    }
    
    console.log('All document analysis migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Error running document analysis migrations:', error);
    return false;
  }
}
