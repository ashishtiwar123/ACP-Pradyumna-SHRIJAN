import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Database } from '../integrations/supabase/types';

type UserRole = 'founder' | 'investor';

interface ProfileData {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = (profileId?: string) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use current user's ID if no profileId provided
  const targetProfileId = profileId || user?.id;

  const fetchProfile = async () => {
    if (!targetProfileId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch profile data from profiles table (Smart AI Investor uses single database)
      console.log('Fetching profile for ID:', targetProfileId);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetProfileId)
        .single();

      console.log('Profile fetch result:', { profileData, profileError });

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw profileError;
      }

      if (!profileData) {
        throw new Error('No profile data found');
      }

      setProfile(profileData);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<ProfileData>) => {
    if (!targetProfileId || !user || targetProfileId !== user.id) {
      throw new Error('Unauthorized to update this profile');
    }

    try {
      // Clean updates object for profiles
      const cleanUpdates: any = {};
      
      for (const [key, value] of Object.entries(updates)) {
        // Skip undefined values
        if (value === undefined) continue;
        
        // Handle different types of values
        if (typeof value === 'string') {
          cleanUpdates[key] = value;
        } else {
          cleanUpdates[key] = value;
        }
      }
      
      // Always update the updated_at timestamp
      cleanUpdates.updated_at = new Date().toISOString();

      console.log('Updating profile with:', cleanUpdates);

      const { error } = await supabase
        .from('profiles')
        .update(cleanUpdates)
        .eq('id', targetProfileId);

      if (error) throw error;

      // Optimistically update local state
      setProfile(prev => prev ? { ...prev, ...cleanUpdates } : null);
      
      // Refetch to ensure consistency
      await fetchProfile();
    } catch (err: any) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [targetProfileId]);

  // Set up real-time subscription for profile updates
  useEffect(() => {
    if (!targetProfileId) return;

    const channel = supabase
      .channel(`profile_${targetProfileId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${targetProfileId}`,
        },
        () => {
          fetchProfile();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [targetProfileId]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
    isOwnProfile: targetProfileId === user?.id,
  };
};