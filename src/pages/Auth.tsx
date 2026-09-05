import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Building2, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import type { UserRole } from '@/contexts/AuthContext';

const authSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(100),
});

const signUpSchema = authSchema.extend({
  role: z.enum(['founder', 'investor'], { message: "Please select your role" }),
});

const Auth = () => {
  const { user, loading, signUp, signIn, profile, isFounder, isInvestor } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    role: '' as UserRole | '' 
  });

  useEffect(() => {
    if (user && !loading && profile) {
      // Redirect based on user role
      if (isFounder) {
        navigate('/dashboard');
      } else if (isInvestor) {
        navigate('/upload');
      } else {
        // Fallback to home
        navigate('/');
      }
    }
  }, [user, loading, profile, isFounder, isInvestor, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        authSchema.parse(formData);
      } else {
        signUpSchema.parse(formData);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation Error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      const { error } = isLogin 
        ? await signIn(formData.email, formData.password)
        : await signUp(formData.email, formData.password, formData.role as UserRole);

      if (error) {
        const isEmailNotConfirmed = error.message?.includes('Email not confirmed') || error.message?.includes('email_not_confirmed');
        
        toast({
          title: 'Authentication Error',
          description: isEmailNotConfirmed 
            ? 'Please check your email and click the confirmation link before logging in. Check your spam folder if needed.'
            : error.message || `Failed to ${isLogin ? 'sign in' : 'sign up'}. Please try again.`,
          variant: 'destructive',
        });
        return;
      }

      if (!isLogin) {
        toast({
          title: 'Success!',
          description: 'Please check your email to confirm your account.',
        });
      } else {
        // Login successful - user will be redirected by the useEffect hook
        toast({
          title: 'Welcome back!',
          description: 'Successfully signed in.',
        });
      }
    } catch (error) {
      toast({
        title: 'Authentication Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md border-primary/20 shadow-glow-sm">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-base">
            AI-powered pitch deck analysis and investor insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isSubmitting}
              />
              {!isLogin && (
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters
                </p>
              )}
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="role">I am a</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="founder">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-500" />
                        <div>
                          <div className="font-medium">Founder</div>
                          <div className="text-xs text-muted-foreground">I'm building a startup</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="investor">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-green-500" />
                        <div>
                          <div className="font-medium">Investor</div>
                          <div className="text-xs text-muted-foreground">I want to analyze pitch decks</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Sign Up'
              )}
            </Button>
          </form>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ email: '', password: '', role: '' });
              }}
              className="text-sm text-primary hover:underline"
              disabled={isSubmitting}
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
          
          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
