
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProfileData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
}

export interface LearningStats {
  totalFlashcards: number;
  reviewedFlashcards: number;
  masteredFlashcards: number;
  totalStudyTime: number; // in minutes
  averageRetention: number; // percentage
}

const useUserProfileData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [learningStats, setLearningStats] = useState<LearningStats>({
    totalFlashcards: 0,
    reviewedFlashcards: 0,
    masteredFlashcards: 0,
    totalStudyTime: 0,
    averageRetention: 0,
  });

  useEffect(() => {
    if (!user) return;

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setProfileData(data);
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
        }
        
        // Fetch learning statistics
        await fetchLearningStats();
        
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast({
          title: "Error",
          description: "Failed to load your profile data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, toast]);

  const fetchLearningStats = async () => {
    if (!user) return;
    
    try {
      // Count total flashcards
      const { data: flashcardsData, error: flashcardsError } = await supabase
        .from('flashcards')
        .select('id, mastery_level')
        .eq('user_id', user.id);
      
      if (flashcardsError) throw flashcardsError;
      
      // Count reviewed flashcards
      const { count: reviewedCount, error: reviewedError } = await supabase
        .from('flashcard_reviews')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      if (reviewedError) throw reviewedError;
      
      // Get average retention
      const { data: retentionData, error: retentionError } = await supabase
        .from('flashcard_reviews')
        .select('retention_estimate')
        .eq('user_id', user.id);
      
      if (retentionError) throw retentionError;
      
      // Calculate statistics
      const totalFlashcards = flashcardsData?.length || 0;
      const masteredFlashcards = flashcardsData?.filter(card => card.mastery_level >= 0.7).length || 0;
      const totalReviews = reviewedCount || 0;
      
      let averageRetention = 0;
      if (retentionData && retentionData.length > 0) {
        const sum = retentionData.reduce((acc, review) => acc + (review.retention_estimate || 0), 0);
        averageRetention = Math.round((sum / retentionData.length) * 100);
      }
      
      // Update learning stats
      setLearningStats({
        totalFlashcards,
        reviewedFlashcards: totalReviews,
        masteredFlashcards,
        totalStudyTime: totalReviews * 2, // Estimate: 2 minutes per review
        averageRetention,
      });
      
    } catch (error) {
      console.error('Error fetching learning stats:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
      
      // Update local state
      if (profileData) {
        setProfileData({
          ...profileData,
          first_name: firstName,
          last_name: lastName,
        });
      }
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update your profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    profileData,
    loading,
    saving,
    firstName,
    lastName,
    learningStats,
    setFirstName,
    setLastName,
    handleSaveProfile
  };
};

export default useUserProfileData;
