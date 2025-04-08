export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      assessments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          module_id: string | null
          passing_score: number | null
          time_limit_minutes: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          module_id?: string | null
          passing_score?: number | null
          time_limit_minutes?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          module_id?: string | null
          passing_score?: number | null
          time_limit_minutes?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      collaborative_questions: {
        Row: {
          created_at: string | null
          id: string
          question: string
          session_id: string
          status: string
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          question: string
          session_id: string
          status: string
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          question?: string
          session_id?: string
          status?: string
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaborative_questions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "collaborative_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      collaborative_sessions: {
        Row: {
          created_at: string | null
          description: string | null
          end_time: string | null
          group_id: string
          id: string
          participants: string[] | null
          start_time: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          group_id: string
          id?: string
          participants?: string[] | null
          start_time?: string | null
          status: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          group_id?: string
          id?: string
          participants?: string[] | null
          start_time?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collaborative_sessions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      content: {
        Row: {
          content_data: Json
          content_type: string
          created_at: string
          id: string
          is_active: boolean
          order_index: number
          title: string
          topic_id: string
          updated_at: string
        }
        Insert: {
          content_data: Json
          content_type: string
          created_at?: string
          id?: string
          is_active?: boolean
          order_index: number
          title: string
          topic_id: string
          updated_at?: string
        }
        Update: {
          content_data?: Json
          content_type?: string
          created_at?: string
          id?: string
          is_active?: boolean
          order_index?: number
          title?: string
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      contribution_feedback: {
        Row: {
          comment: string | null
          contribution_id: string
          created_at: string | null
          id: string
          rating: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          contribution_id: string
          created_at?: string | null
          id?: string
          rating?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          contribution_id?: string
          created_at?: string | null
          id?: string
          rating?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contribution_feedback_contribution_id_fkey"
            columns: ["contribution_id"]
            isOneToOne: false
            referencedRelation: "contributions"
            referencedColumns: ["id"]
          },
        ]
      }
      contributions: {
        Row: {
          content_id: string
          created_at: string | null
          id: string
          points_earned: number | null
          type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content_id: string
          created_at?: string | null
          id?: string
          points_earned?: number | null
          type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content_id?: string
          created_at?: string | null
          id?: string
          points_earned?: number | null
          type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      flashcard_reviews: {
        Row: {
          created_at: string
          difficulty_rating: number
          flashcard_id: string
          id: string
          retention_estimate: number | null
          reviewed_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          difficulty_rating: number
          flashcard_id: string
          id?: string
          retention_estimate?: number | null
          reviewed_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          difficulty_rating?: number
          flashcard_id?: string
          id?: string
          retention_estimate?: number | null
          reviewed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcard_reviews_flashcard_id_fkey"
            columns: ["flashcard_id"]
            isOneToOne: false
            referencedRelation: "flashcards"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcards: {
        Row: {
          back_content: string
          created_at: string
          difficulty: number | null
          easiness_factor: number | null
          front_content: string
          id: string
          last_retention: number | null
          last_reviewed_at: string | null
          mastery_level: number | null
          next_review_date: string | null
          repetition_count: number
          topic_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          back_content: string
          created_at?: string
          difficulty?: number | null
          easiness_factor?: number | null
          front_content: string
          id?: string
          last_retention?: number | null
          last_reviewed_at?: string | null
          mastery_level?: number | null
          next_review_date?: string | null
          repetition_count?: number
          topic_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          back_content?: string
          created_at?: string
          difficulty?: number | null
          easiness_factor?: number | null
          front_content?: string
          id?: string
          last_retention?: number | null
          last_reviewed_at?: string | null
          mastery_level?: number | null
          next_review_date?: string | null
          repetition_count?: number
          topic_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_profiles: {
        Row: {
          contribution_points: number | null
          created_at: string | null
          helpfulness_rating: number | null
          interests: string[] | null
          last_active: string | null
          strengths: string[] | null
          teaching_score: number | null
          updated_at: string | null
          user_id: string
          weaknesses: string[] | null
        }
        Insert: {
          contribution_points?: number | null
          created_at?: string | null
          helpfulness_rating?: number | null
          interests?: string[] | null
          last_active?: string | null
          strengths?: string[] | null
          teaching_score?: number | null
          updated_at?: string | null
          user_id: string
          weaknesses?: string[] | null
        }
        Update: {
          contribution_points?: number | null
          created_at?: string | null
          helpfulness_rating?: number | null
          interests?: string[] | null
          last_active?: string | null
          strengths?: string[] | null
          teaching_score?: number | null
          updated_at?: string | null
          user_id?: string
          weaknesses?: string[] | null
        }
        Relationships: []
      }
      learning_path_modules: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_required: boolean
          learning_path_id: string
          mastery_percentage: number
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_required?: boolean
          learning_path_id: string
          mastery_percentage?: number
          order_index: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_required?: boolean
          learning_path_id?: string
          mastery_percentage?: number
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_path_modules_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_path_topics: {
        Row: {
          complexity: number
          created_at: string
          description: string | null
          estimated_minutes: number | null
          id: string
          is_required: boolean
          mastery_percentage: number
          module_id: string
          order_index: number
          prerequisites: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          complexity?: number
          created_at?: string
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          is_required?: boolean
          mastery_percentage?: number
          module_id: string
          order_index: number
          prerequisites?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          complexity?: number
          created_at?: string
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          is_required?: boolean
          mastery_percentage?: number
          module_id?: string
          order_index?: number
          prerequisites?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_path_topics_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_path_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_paths: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          qualification_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          qualification_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          qualification_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_paths_qualification_id_fkey"
            columns: ["qualification_id"]
            isOneToOne: false
            referencedRelation: "qualifications"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          order_index: number
          qualification_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          order_index: number
          qualification_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          order_index?: number
          qualification_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_qualification_id_fkey"
            columns: ["qualification_id"]
            isOneToOne: false
            referencedRelation: "qualifications"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      qualifications: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      question_answers: {
        Row: {
          ai_enhanced: boolean | null
          content: string
          created_at: string | null
          id: string
          is_accepted: boolean | null
          question_id: string
          updated_at: string | null
          upvotes: number | null
          user_id: string
        }
        Insert: {
          ai_enhanced?: boolean | null
          content: string
          created_at?: string | null
          id?: string
          is_accepted?: boolean | null
          question_id: string
          updated_at?: string | null
          upvotes?: number | null
          user_id: string
        }
        Update: {
          ai_enhanced?: boolean | null
          content?: string
          created_at?: string | null
          id?: string
          is_accepted?: boolean | null
          question_id?: string
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "collaborative_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          assessment_id: string
          correct_answer: Json | null
          created_at: string
          difficulty: number | null
          id: string
          options: Json | null
          points: number
          question_text: string
          question_type: string
          updated_at: string
        }
        Insert: {
          assessment_id: string
          correct_answer?: Json | null
          created_at?: string
          difficulty?: number | null
          id?: string
          options?: Json | null
          points?: number
          question_text: string
          question_type: string
          updated_at?: string
        }
        Update: {
          assessment_id?: string
          correct_answer?: Json | null
          created_at?: string
          difficulty?: number | null
          id?: string
          options?: Json | null
          points?: number
          question_text?: string
          question_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_answered_questions: {
        Row: {
          confidence_level: number | null
          created_at: string
          difficulty: number | null
          id: string
          is_correct: boolean
          question_id: string
          session_id: string
          time_taken: number
          topic: string | null
          user_answer: string
        }
        Insert: {
          confidence_level?: number | null
          created_at?: string
          difficulty?: number | null
          id?: string
          is_correct: boolean
          question_id: string
          session_id: string
          time_taken: number
          topic?: string | null
          user_answer: string
        }
        Update: {
          confidence_level?: number | null
          created_at?: string
          difficulty?: number | null
          id?: string
          is_correct?: boolean
          question_id?: string
          session_id?: string
          time_taken?: number
          topic?: string | null
          user_answer?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_answered_questions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "quiz_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_performance_metrics: {
        Row: {
          average_confidence: number | null
          average_time: number | null
          correct_count: number
          created_at: string
          id: string
          last_attempt_at: string | null
          topic: string
          total_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          average_confidence?: number | null
          average_time?: number | null
          correct_count?: number
          created_at?: string
          id?: string
          last_attempt_at?: string | null
          topic: string
          total_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          average_confidence?: number | null
          average_time?: number | null
          correct_count?: number
          created_at?: string
          id?: string
          last_attempt_at?: string | null
          topic?: string
          total_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_sessions: {
        Row: {
          correct_answers: number
          created_at: string
          date: string
          difficulty: number
          id: string
          initial_difficulty: number
          score_percentage: number
          selected_topics: string[] | null
          time_spent: number
          topics: Json | null
          total_questions: number
          updated_at: string
          user_id: string
        }
        Insert: {
          correct_answers: number
          created_at?: string
          date?: string
          difficulty: number
          id?: string
          initial_difficulty: number
          score_percentage: number
          selected_topics?: string[] | null
          time_spent: number
          topics?: Json | null
          total_questions: number
          updated_at?: string
          user_id: string
        }
        Update: {
          correct_answers?: number
          created_at?: string
          date?: string
          difficulty?: number
          id?: string
          initial_difficulty?: number
          score_percentage?: number
          selected_topics?: string[] | null
          time_spent?: number
          topics?: Json | null
          total_questions?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      resource_links: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          session_id: string
          title: string
          type: string | null
          updated_at: string | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          session_id: string
          title: string
          type?: string | null
          updated_at?: string | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          session_id?: string
          title?: string
          type?: string | null
          updated_at?: string | null
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_links_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "collaborative_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          session_id: string
          tags: string[] | null
          updated_at: string | null
          upvotes: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          session_id: string
          tags?: string[] | null
          updated_at?: string | null
          upvotes?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          session_id?: string
          tags?: string[] | null
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_notes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "collaborative_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      study_group_members: {
        Row: {
          contribution_score: number | null
          group_id: string
          id: string
          joined_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          contribution_score?: number | null
          group_id: string
          id?: string
          joined_at?: string | null
          role: string
          user_id: string
        }
        Update: {
          contribution_score?: number | null
          group_id?: string
          id?: string
          joined_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      study_groups: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          join_code: string | null
          name: string
          topics: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          join_code?: string | null
          name: string
          topics?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          join_code?: string | null
          name?: string
          topics?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      study_plans: {
        Row: {
          created_at: string
          daily_goal_minutes: number | null
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean
          qualification_id: string | null
          start_date: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_goal_minutes?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          qualification_id?: string | null
          start_date?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_goal_minutes?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          qualification_id?: string | null
          start_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_plans_qualification_id_fkey"
            columns: ["qualification_id"]
            isOneToOne: false
            referencedRelation: "qualifications"
            referencedColumns: ["id"]
          },
        ]
      }
      timer_sessions: {
        Row: {
          completed: boolean
          created_at: string
          duration_minutes: number
          end_time: string | null
          id: string
          start_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          duration_minutes: number
          end_time?: string | null
          id?: string
          start_time?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          duration_minutes?: number
          end_time?: string | null
          id?: string
          start_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      topics: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          module_id: string
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          module_id: string
          order_index: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          module_id?: string
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_cards: {
        Row: {
          card_count: number
          created_at: string
          description: string | null
          difficulty: number
          id: string
          image_url: string | null
          is_public: boolean
          owner_name: string
          price: number
          rating: number
          rating_count: number
          status: string
          subject: string
          tags: string[] | null
          title: string
          topic: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          card_count?: number
          created_at?: string
          description?: string | null
          difficulty?: number
          id?: string
          image_url?: string | null
          is_public?: boolean
          owner_name: string
          price?: number
          rating?: number
          rating_count?: number
          status?: string
          subject: string
          tags?: string[] | null
          title: string
          topic?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          card_count?: number
          created_at?: string
          description?: string | null
          difficulty?: number
          id?: string
          image_url?: string | null
          is_public?: boolean
          owner_name?: string
          price?: number
          rating?: number
          rating_count?: number
          status?: string
          subject?: string
          tags?: string[] | null
          title?: string
          topic?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trading_flashcards: {
        Row: {
          back_content: string
          created_at: string
          front_content: string
          id: string
          sample_content: boolean
          trading_card_id: string | null
        }
        Insert: {
          back_content: string
          created_at?: string
          front_content: string
          id?: string
          sample_content?: boolean
          trading_card_id?: string | null
        }
        Update: {
          back_content?: string
          created_at?: string
          front_content?: string
          id?: string
          sample_content?: boolean
          trading_card_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trading_flashcards_trading_card_id_fkey"
            columns: ["trading_card_id"]
            isOneToOne: false
            referencedRelation: "trading_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_transactions: {
        Row: {
          buyer_id: string
          buyer_name: string
          created_at: string
          id: string
          price: number
          seller_id: string
          seller_name: string
          status: string
          trading_card_id: string | null
          trading_card_title: string
          updated_at: string
        }
        Insert: {
          buyer_id: string
          buyer_name: string
          created_at?: string
          id?: string
          price?: number
          seller_id: string
          seller_name: string
          status?: string
          trading_card_id?: string | null
          trading_card_title: string
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          buyer_name?: string
          created_at?: string
          id?: string
          price?: number
          seller_id?: string
          seller_name?: string
          status?: string
          trading_card_id?: string | null
          trading_card_title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trading_transactions_trading_card_id_fkey"
            columns: ["trading_card_id"]
            isOneToOne: false
            referencedRelation: "trading_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      user_assessments: {
        Row: {
          assessment_id: string
          created_at: string
          end_time: string | null
          feedback: string | null
          id: string
          score: number | null
          start_time: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_id: string
          created_at?: string
          end_time?: string | null
          feedback?: string | null
          id?: string
          score?: number | null
          start_time?: string | null
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_id?: string
          created_at?: string
          end_time?: string | null
          feedback?: string | null
          id?: string
          score?: number | null
          start_time?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_assessments_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notes: {
        Row: {
          content: string | null
          content_id: string | null
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          content_id?: string | null
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          content_id?: string | null
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notes_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          content_id: string
          created_at: string
          id: string
          last_accessed_at: string
          progress_percentage: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content_id: string
          created_at?: string
          id?: string
          last_accessed_at?: string
          progress_percentage?: number
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content_id?: string
          created_at?: string
          id?: string
          last_accessed_at?: string
          progress_percentage?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
        ]
      }
      user_topic_progress: {
        Row: {
          created_at: string
          id: string
          last_studied_at: string | null
          mastery_percentage: number
          next_review_at: string | null
          times_reviewed: number
          topic_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_studied_at?: string | null
          mastery_percentage?: number
          next_review_at?: string | null
          times_reviewed?: number
          topic_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_studied_at?: string | null
          mastery_percentage?: number
          next_review_at?: string | null
          times_reviewed?: number
          topic_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_topic_progress_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "learning_path_topics"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      find_compatible_study_partners: {
        Args: {
          p_user_id: string
          p_topics: string[]
          p_strengths_needed: string[]
        }
        Returns: {
          contribution_points: number | null
          created_at: string | null
          helpfulness_rating: number | null
          interests: string[] | null
          last_active: string | null
          strengths: string[] | null
          teaching_score: number | null
          updated_at: string | null
          user_id: string
          weaknesses: string[] | null
        }[]
      }
      get_learning_recommendations: {
        Args: {
          p_user_id: string
          p_qualification_id: string
          p_limit?: number
        }
        Returns: {
          topic_id: string
          topic_title: string
          module_title: string
          priority: number
          reason: string
        }[]
      }
      increment_contribution_points: {
        Args: { user_id: string; points: number }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
