import { AIAnalysisResult } from './gemini-api';

export interface DashboardCacheData {
  analysisResult: AIAnalysisResult;
  rawData: {
    startup_profile: any;
    domain_details: any;
    founder_assets: any;
    domain_type: string;
  };
  createdAt: string;
  expiresAt: string;
  version: string;
}

export class DashboardCacheService {
  private static readonly CACHE_KEY_PREFIX = 'dashboard_cache_';
  private static readonly CACHE_VERSION = '1.0.0';
  private static readonly DEFAULT_EXPIRY_HOURS = 24;

  /**
   * Generate cache key for specific user and startup
   */
  private static getCacheKey(userId: string, startupId?: string): string {
    const key = startupId 
      ? `${this.CACHE_KEY_PREFIX}${userId}_${startupId}`
      : `${this.CACHE_KEY_PREFIX}${userId}`;
    return key;
  }

  /**
   * Check if cached data is still valid
   */
  private static isDataValid(cacheData: DashboardCacheData): boolean {
    const now = new Date();
    const expiresAt = new Date(cacheData.expiresAt);
    const isNotExpired = now < expiresAt;
    const isVersionValid = cacheData.version === this.CACHE_VERSION;
    
    return isNotExpired && isVersionValid;
  }

  /**
   * Save dashboard analysis to localStorage
   */
  static saveDashboardData(
    userId: string,
    analysisResult: AIAnalysisResult,
    rawData: any,
    startupId?: string,
    expiryHours: number = this.DEFAULT_EXPIRY_HOURS
  ): boolean {
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + (expiryHours * 60 * 60 * 1000));

      const cacheData: DashboardCacheData = {
        analysisResult,
        rawData,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        version: this.CACHE_VERSION
      };

      const cacheKey = this.getCacheKey(userId, startupId);
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));

      console.log(`💾 Dashboard data cached for user ${userId}`, {
        cacheKey,
        expiresAt: expiresAt.toISOString(),
        dataSize: JSON.stringify(cacheData).length
      });

      return true;
    } catch (error) {
      console.error('❌ Failed to save dashboard data to cache:', error);
      return false;
    }
  }

  /**
   * Retrieve dashboard analysis from localStorage
   */
  static getDashboardData(userId: string, startupId?: string): DashboardCacheData | null {
    try {
      const cacheKey = this.getCacheKey(userId, startupId);
      const cachedData = localStorage.getItem(cacheKey);

      if (!cachedData) {
        console.log(`📭 No cached data found for user ${userId}`);
        return null;
      }

      const parsedData: DashboardCacheData = JSON.parse(cachedData);

      if (!this.isDataValid(parsedData)) {
        console.log(`⏰ Cached data expired or invalid for user ${userId}`);
        this.clearDashboardData(userId, startupId);
        return null;
      }

      console.log(`📦 Retrieved valid cached data for user ${userId}`, {
        cacheKey,
        createdAt: parsedData.createdAt,
        expiresAt: parsedData.expiresAt
      });

      return parsedData;
    } catch (error) {
      console.error('❌ Failed to retrieve dashboard data from cache:', error);
      return null;
    }
  }

  /**
   * Clear dashboard data from localStorage
   */
  static clearDashboardData(userId: string, startupId?: string): boolean {
    try {
      const cacheKey = this.getCacheKey(userId, startupId);
      localStorage.removeItem(cacheKey);
      
      console.log(`🗑️ Cleared cached data for user ${userId}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to clear dashboard data from cache:', error);
      return false;
    }
  }

  /**
   * Check if cached data exists and is valid
   */
  static hasCachedData(userId: string, startupId?: string): boolean {
    const cachedData = this.getDashboardData(userId, startupId);
    return cachedData !== null;
  }

  /**
   * Get cache metadata without full data
   */
  static getCacheMetadata(userId: string, startupId?: string): {
    exists: boolean;
    createdAt?: string;
    expiresAt?: string;
    isValid?: boolean;
  } {
    try {
      const cacheKey = this.getCacheKey(userId, startupId);
      const cachedData = localStorage.getItem(cacheKey);

      if (!cachedData) {
        return { exists: false };
      }

      const parsedData: DashboardCacheData = JSON.parse(cachedData);
      const isValid = this.isDataValid(parsedData);

      return {
        exists: true,
        createdAt: parsedData.createdAt,
        expiresAt: parsedData.expiresAt,
        isValid
      };
    } catch (error) {
      console.error('❌ Failed to get cache metadata:', error);
      return { exists: false };
    }
  }

  /**
   * Clear all dashboard caches (useful for logout or reset)
   */
  static clearAllCaches(): number {
    try {
      const keys = Object.keys(localStorage);
      const dashboardKeys = keys.filter(key => key.startsWith(this.CACHE_KEY_PREFIX));
      
      dashboardKeys.forEach(key => localStorage.removeItem(key));
      
      console.log(`🧹 Cleared ${dashboardKeys.length} dashboard caches`);
      return dashboardKeys.length;
    } catch (error) {
      console.error('❌ Failed to clear all dashboard caches:', error);
      return 0;
    }
  }

  /**
   * Get storage usage statistics
   */
  static getStorageStats(): {
    totalCaches: number;
    totalSize: number;
    oldestCache?: string;
    newestCache?: string;
  } {
    try {
      const keys = Object.keys(localStorage);
      const dashboardKeys = keys.filter(key => key.startsWith(this.CACHE_KEY_PREFIX));
      
      let totalSize = 0;
      let oldestDate: Date | null = null;
      let newestDate: Date | null = null;
      let oldestCache = '';
      let newestCache = '';

      dashboardKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          totalSize += data.length;
          
          try {
            const parsedData: DashboardCacheData = JSON.parse(data);
            const createdAt = new Date(parsedData.createdAt);
            
            if (!oldestDate || createdAt < oldestDate) {
              oldestDate = createdAt;
              oldestCache = parsedData.createdAt;
            }
            
            if (!newestDate || createdAt > newestDate) {
              newestDate = createdAt;
              newestCache = parsedData.createdAt;
            }
          } catch (parseError) {
            // Ignore parsing errors for stats
          }
        }
      });

      return {
        totalCaches: dashboardKeys.length,
        totalSize,
        oldestCache: oldestCache || undefined,
        newestCache: newestCache || undefined
      };
    } catch (error) {
      console.error('❌ Failed to get storage stats:', error);
      return { totalCaches: 0, totalSize: 0 };
    }
  }

  /**
   * Force refresh - clear cache and return false to trigger new analysis
   */
  static forceRefresh(userId: string, startupId?: string): boolean {
    this.clearDashboardData(userId, startupId);
    console.log(`🔄 Forced refresh for user ${userId} - cache cleared`);
    return false;
  }
}

export default DashboardCacheService;