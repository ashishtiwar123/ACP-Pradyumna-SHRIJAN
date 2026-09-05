import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'founder' | 'investor';

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  userRole: UserRole | null;
  loading: boolean;
  isFounder: boolean;
  isInvestor: boolean;
  hasCompleteStartupProfile: boolean;
  signUp: (email: string, password: string, role: UserRole) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [hasCompleteStartupProfile, setHasCompleteStartupProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userRole = profile?.role || null;
  const isFounder = userRole === 'founder';
  const isInvestor = userRole === 'investor';

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(profileData);

      // Check if founder has complete startup profile
      if (profileData?.role === 'founder') {
        const { data: startupData } = await supabase
          .from('startup_profiles')
          .select('is_complete')
          .eq('user_id', userId)
          .single();
        
        setHasCompleteStartupProfile(startupData?.is_complete || false);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
      setHasCompleteStartupProfile(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state change:', event, session?.user?.email || 'No user');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setHasCompleteStartupProfile(false);
        }
        
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, role: UserRole) => {
    console.log(`🔐 Starting signup process for ${email} as ${role}`);
    
    const redirectUrl = `${window.location.origin}/`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      console.error('❌ Signup error:', error);
      return { error };
    }

    // Create profile with role after successful signup
    if (data.user) {
      console.log(`✅ User created: ${data.user.id}, creating profile with role: ${role}`);
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: email,
          role: role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      
      if (profileError) {
        console.error('❌ Error creating profile:', profileError);
        return { error: profileError };
      }
      
      console.log(`✅ Profile created successfully for ${role}`);
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log(`🔐 Starting signin process for ${email}`);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ Signin error:', error);
    } else {
      console.log('✅ Signin successful, user:', data.user?.email);
    }
    
    return { error };
  };

  const signOut = async () => {
    console.log('🔓 Starting logout process...');
    
    // Clear any demo data and analysis data from session storage
    try {
      sessionStorage.removeItem('demoAnalysisData');
      sessionStorage.removeItem('demoAnalysisHistory');
      sessionStorage.removeItem('latest_analysis');
      sessionStorage.removeItem('is_default_data');
      console.log('✅ Session storage cleared');
    } catch (storageError) {
      console.warn('⚠️ Error clearing session storage:', storageError);
    }
    
    // Clear dashboard caches (optional - don't let this block logout)
    try {
      const { DashboardCacheService } = await import('@/lib/dashboard-cache');
      const clearedCaches = DashboardCacheService.clearAllCaches();
      console.log(`✅ Cleared ${clearedCaches} dashboard caches`);
    } catch (cacheError) {
      console.warn('⚠️ Error clearing dashboard caches:', cacheError);
    }
    
    // Clear local state first (in case Supabase logout fails)
    setSession(null);
    setUser(null);
    setProfile(null);
    setHasCompleteStartupProfile(false);
    console.log('✅ Local state cleared');
    
    // Sign out from Supabase
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Error signing out from Supabase:', error.message);
        console.log('⚠️ Manual logout successful despite Supabase error');
      } else {
        console.log('✅ Signed out from Supabase');
      }
    } catch (supabaseError) {
      console.error('❌ Supabase signOut failed:', supabaseError);
      console.log('⚠️ Manual logout successful despite Supabase failure');
    }
    
    // Navigate to home page
    navigate('/');
    console.log('✅ Logout completed successfully');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      profile, 
      userRole, 
      loading, 
      isFounder, 
      isInvestor, 
      hasCompleteStartupProfile,
      signUp, 
      signIn, 
      signOut,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
