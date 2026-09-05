import { supabase } from '../integrations/supabase/client';
import { Database } from '../integrations/supabase/types';
import { StartupData } from './gemini-api';

type Tables = Database['public']['Tables'];
type StartupProfile = Tables['startup_profiles']['Row'];
type FounderAssets = Tables['founder_assets']['Row'];
type HealthcareDetails = Tables['healthcare_details']['Row'];
type FintechDetails = Tables['fintech_details']['Row'];
type FoodDetails = Tables['food_details']['Row'];
type EcommerceDetails = Tables['ecommerce_details']['Row'];

export interface DashboardData {
  startup_profile: StartupProfile;
  founder_assets: FounderAssets | null;
  domain_details: HealthcareDetails | FintechDetails | FoodDetails | EcommerceDetails | null;
  domain_type: 'healthcare' | 'fintech' | 'food' | 'ecommerce';
}

export class DataFetchingService {
  /**
   * Determine domain type from startup profile
   */
  private static determineDomainType(startupProfile: StartupProfile): 'healthcare' | 'fintech' | 'food' | 'ecommerce' {
    const industry = startupProfile.industry?.toLowerCase() || '';
    
    if (industry.includes('health') || industry.includes('medical') || industry.includes('biotech')) {
      return 'healthcare';
    } else if (industry.includes('fintech') || industry.includes('finance') || industry.includes('banking')) {
      return 'fintech';
    } else if (industry.includes('food') || industry.includes('restaurant') || industry.includes('culinary')) {
      return 'food';
    } else if (industry.includes('ecommerce') || industry.includes('retail') || industry.includes('marketplace')) {
      return 'ecommerce';
    }
    
    // Default fallback - could be improved with more sophisticated classification
    return 'fintech';
  }

  /**
   * Fetch startup profile data
   */
  private static async fetchStartupProfile(userId: string): Promise<StartupProfile | null> {
    try {
      console.log('📊 Fetching startup profile for user:', userId);
      
      const { data, error } = await supabase
        .from('startup_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('📭 No startup profile found for user');
          return null;
        }
        throw error;
      }

      console.log('✅ Startup profile fetched successfully');
      return data;
    } catch (error) {
      console.error('❌ Error fetching startup profile:', error);
      throw new Error('Failed to fetch startup profile');
    }
  }

  /**
   * Fetch founder assets data
   */
  private static async fetchFounderAssets(userId: string): Promise<FounderAssets | null> {
    try {
      console.log('💰 Fetching founder assets for user:', userId);
      
      const { data, error } = await supabase
        .from('founder_assets')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('📭 No founder assets found for user');
          return null;
        }
        throw error;
      }

      console.log('✅ Founder assets fetched successfully');
      return data;
    } catch (error) {
      console.error('❌ Error fetching founder assets:', error);
      // Don't throw error for founder assets as it's optional
      return null;
    }
  }

  /**
   * Fetch domain-specific details based on startup type
   */
  private static async fetchDomainDetails(
    startupProfileId: string, 
    domainType: 'healthcare' | 'fintech' | 'food' | 'ecommerce'
  ): Promise<any> {
    try {
      console.log(`🏢 Fetching ${domainType} details for startup profile:`, startupProfileId);
      
      const tableName = `${domainType}_details`;
      const { data, error } = await supabase
        .from(tableName as any)
        .select('*')
        .eq('startup_profile_id', startupProfileId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`📭 No ${domainType} details found for startup profile`);
          return null;
        }
        throw error;
      }

      console.log(`✅ ${domainType} details fetched successfully`);
      return data;
    } catch (error) {
      console.error(`❌ Error fetching ${domainType} details:`, error);
      // Don't throw error for domain details as it might be optional
      return null;
    }
  }

  /**
   * Fetch all dashboard data for a user
   */
  static async fetchDashboardData(userId: string): Promise<DashboardData> {
    try {
      console.log('🚀 Starting dashboard data fetch for user:', userId);
      
      // Fetch startup profile first (required)
      const startupProfile = await this.fetchStartupProfile(userId);
      
      if (!startupProfile) {
        throw new Error('Startup profile is required but not found');
      }

      // Determine domain type
      const domainType = this.determineDomainType(startupProfile);
      console.log('🎯 Determined domain type:', domainType);

      // Fetch remaining data in parallel
      const [founderAssets, domainDetails] = await Promise.all([
        this.fetchFounderAssets(userId),
        this.fetchDomainDetails(startupProfile.id, domainType)
      ]);

      const dashboardData: DashboardData = {
        startup_profile: startupProfile,
        founder_assets: founderAssets,
        domain_details: domainDetails,
        domain_type: domainType
      };

      console.log('✅ Dashboard data fetch completed successfully', {
        hasStartupProfile: !!dashboardData.startup_profile,
        hasFounderAssets: !!dashboardData.founder_assets,
        hasDomainDetails: !!dashboardData.domain_details,
        domainType: dashboardData.domain_type
      });

      return dashboardData;
    } catch (error) {
      console.error('❌ Dashboard data fetch failed:', error);
      throw error;
    }
  }

  /**
   * Convert dashboard data to startup data format for AI analysis
   */
  static convertToStartupData(dashboardData: DashboardData): StartupData {
    return {
      startup_profile: dashboardData.startup_profile,
      domain_details: dashboardData.domain_details,
      founder_assets: dashboardData.founder_assets,
      domain_type: dashboardData.domain_type
    };
  }

  /**
   * Check if user has complete profile data
   */
  static async checkProfileCompleteness(userId: string): Promise<{
    isComplete: boolean;
    missingData: string[];
    completionPercentage: number;
  }> {
    try {
      const dashboardData = await this.fetchDashboardData(userId);
      const missingData: string[] = [];
      let totalFields = 3; // startup_profile, founder_assets, domain_details
      let completedFields = 0;

      // Check startup profile (required)
      if (dashboardData.startup_profile) {
        completedFields++;
        
        // Check if profile is marked as complete
        if (!dashboardData.startup_profile.is_complete) {
          missingData.push('Startup profile incomplete');
        }
      } else {
        missingData.push('Startup profile missing');
      }

      // Check founder assets (optional but recommended)
      if (dashboardData.founder_assets) {
        completedFields++;
      } else {
        missingData.push('Founder assets missing');
      }

      // Check domain details (optional but recommended)
      if (dashboardData.domain_details) {
        completedFields++;
      } else {
        missingData.push(`${dashboardData.domain_type} details missing`);
      }

      const completionPercentage = Math.round((completedFields / totalFields) * 100);
      const isComplete = missingData.length === 0 && dashboardData.startup_profile.is_complete;

      return {
        isComplete,
        missingData,
        completionPercentage
      };
    } catch (error) {
      console.error('❌ Error checking profile completeness:', error);
      return {
        isComplete: false,
        missingData: ['Error checking profile data'],
        completionPercentage: 0
      };
    }
  }

  /**
   * Refresh specific data type
   */
  static async refreshData(userId: string, dataType: 'startup_profile' | 'founder_assets' | 'domain_details' | 'all') {
    try {
      console.log(`🔄 Refreshing ${dataType} for user:`, userId);

      switch (dataType) {
        case 'startup_profile':
          return await this.fetchStartupProfile(userId);
        
        case 'founder_assets':
          return await this.fetchFounderAssets(userId);
        
        case 'domain_details': {
          const startupProfile = await this.fetchStartupProfile(userId);
          if (startupProfile) {
            const domainType = this.determineDomainType(startupProfile);
            return await this.fetchDomainDetails(startupProfile.id, domainType);
          }
          throw new Error('Cannot determine domain type without startup profile');
        }
        
        case 'all':
        default:
          return await this.fetchDashboardData(userId);
      }
    } catch (error) {
      console.error(`❌ Error refreshing ${dataType}:`, error);
      throw error;
    }
  }
}

export default DataFetchingService;