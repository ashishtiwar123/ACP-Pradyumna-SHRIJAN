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
    
    console.log('🎯 Determining domain type for industry:', industry);
    
    let domainType: 'healthcare' | 'fintech' | 'food' | 'ecommerce' = 'fintech'; // default
    
    if (industry.includes('health') || industry.includes('medical') || industry.includes('biotech') || 
        industry.includes('pharma') || industry.includes('clinic') || industry.includes('hospital')) {
      domainType = 'healthcare';
    } else if (industry.includes('fintech') || industry.includes('finance') || industry.includes('banking') || 
               industry.includes('payment') || industry.includes('crypto') || industry.includes('blockchain')) {
      domainType = 'fintech';
    } else if (industry.includes('food') || industry.includes('restaurant') || industry.includes('culinary') || 
               industry.includes('beverage') || industry.includes('agriculture') || industry.includes('grocery')) {
      domainType = 'food';
    } else if (industry.includes('ecommerce') || industry.includes('retail') || industry.includes('marketplace') || 
               industry.includes('shopping') || industry.includes('e-commerce')) {
      domainType = 'ecommerce';
    }
    
    console.log('✅ Determined domain type:', domainType, 'for industry:', industry);
    return domainType;
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
      
      // First, let's check if the table exists and what records are available
      console.log(`📋 Checking ${tableName} table for startup_profile_id:`, startupProfileId);
      
      const { data, error, count } = await supabase
        .from(tableName as any)
        .select('*', { count: 'exact' })
        .eq('startup_profile_id', startupProfileId);

      console.log(`📊 Query result for ${tableName}:`, {
        recordCount: count,
        hasData: !!data && data.length > 0,
        error: error,
        startupProfileId: startupProfileId
      });

      if (error) {
        console.error(`❌ Database error for ${tableName}:`, error);
        if (error.code === 'PGRST116') {
          console.log(`📭 No ${domainType} details found for startup profile (PGRST116)`);
          return null;
        }
        
        // Log the full error for debugging
        console.error(`❌ Full error details for ${tableName}:`, {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        return null; // Don't throw, return null for optional data
      }

      if (!data || data.length === 0) {
        console.log(`📭 No ${domainType} details found - empty result set`);
        return null;
      }

      const result = data[0]; // Take first record
      console.log(`✅ ${domainType} details fetched successfully:`, {
        startupProfileId: (result as any)?.startup_profile_id || 'N/A',
        keys: result ? Object.keys(result) : [],
        hasRequiredFields: !!(result as any)?.startup_profile_id
      });
      
      return result;
    } catch (error) {
      console.error(`❌ Unexpected error fetching ${domainType} details:`, error);
      return null;
    }
  }

  /**
   * Debug helper to check domain details availability
   */
  static async debugDomainDetailsAvailability(startupProfileId: string, domainType: string) {
    try {
      console.log(`🔍 Debug: Checking domain details availability for ${domainType}`);
      
      // Check all domain detail tables to see what exists
      const tables = ['healthcare_details', 'fintech_details', 'food_details', 'ecommerce_details'];
      
      for (const table of tables) {
        const { data, error, count } = await supabase
          .from(table as any)
          .select('id, startup_profile_id', { count: 'exact' })
          .eq('startup_profile_id', startupProfileId);
          
        console.log(`📋 ${table} for startup ${startupProfileId}:`, {
          count,
          hasRecords: count && count > 0,
          error: error?.message || null
        });
      }
      
      // Also check if there are any records with different startup_profile_id values
      const targetTable = `${domainType}_details`;
      const { data: allRecords, error: allError } = await supabase
        .from(targetTable as any)
        .select('id, startup_profile_id')
        .limit(10);
        
      console.log(`📊 Sample records from ${targetTable}:`, {
        totalSample: allRecords?.length || 0,
        sampleIds: allRecords?.map(r => (r as any).startup_profile_id) || [],
        error: allError?.message || null
      });
      
    } catch (error) {
      console.error('🚨 Debug check failed:', error);
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

      console.log(`📋 Domain details fetch result for ${domainType}:`, {
        hasDomainDetails: !!domainDetails,
        domainDetailsKeys: domainDetails ? Object.keys(domainDetails) : null,
        startupProfileId: startupProfile.id
      });

      // If domain details are null, run debug check
      if (!domainDetails) {
        console.log(`🔍 Domain details are null, running debug check...`);
        await this.debugDomainDetailsAvailability(startupProfile.id, domainType);
      }

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