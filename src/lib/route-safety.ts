// Route navigation safety utilities
let lastRedirectTime = 0;
let redirectCount = 0;
const MAX_REDIRECTS = 3;
const REDIRECT_TIMEOUT = 5000; // 5 seconds

export const canRedirect = (path: string): boolean => {
  const now = Date.now();
  
  // Reset counter if enough time has passed
  if (now - lastRedirectTime > REDIRECT_TIMEOUT) {
    redirectCount = 0;
  }
  
  // Check if we've exceeded max redirects
  if (redirectCount >= MAX_REDIRECTS) {
    console.warn(`🚫 Too many redirects detected, blocking redirect to ${path}`);
    return false;
  }
  
  // Update tracking
  lastRedirectTime = now;
  redirectCount++;
  
  console.log(`✅ Allowing redirect to ${path} (${redirectCount}/${MAX_REDIRECTS})`);
  return true;
};

export const resetRedirectCount = () => {
  redirectCount = 0;
  lastRedirectTime = 0;
  console.log('🔄 Redirect count reset');
};

export const getDefaultRouteForUser = (userRole: string | null, hasCompleteProfile: boolean): string => {
  if (!userRole) return '/';
  
  if (userRole === 'founder') {
    return hasCompleteProfile ? '/dashboard' : '/complete-profile';
  }
  
  if (userRole === 'investor') {
    return '/upload';
  }
  
  return '/';
};