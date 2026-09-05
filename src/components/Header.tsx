import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  LogOut, 
  BarChart3, 
  Upload, 
  User, 
  Home,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';

const Header = () => {
  const { user, signOut, isFounder, isInvestor } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Dynamic navigation based on user role
  const getNavigationLinks = () => {
    const baseLinks = [
      {
        name: 'Home',
        href: '/',
        icon: Home,
      },
    ];

    if (user) {
      if (isFounder) {
        baseLinks.push({
          name: 'Dashboard',
          href: '/dashboard',
          icon: BarChart3,
        });
      }

      if (isInvestor) {
        baseLinks.push(
          {
            name: 'Upload',
            href: '/upload',
            icon: Upload,
          },
          {
            name: 'Analysis',
            href: '/analysis',
            icon: TrendingUp,
          }
        );
      }
    }

    return baseLinks;
  };

  const navigationLinks = getNavigationLinks();

  const filteredLinks = navigationLinks;

  const handleSignOut = async () => {
    if (isLoggingOut) return; // Prevent multiple logout attempts
    
    console.log('🔐 Header: Starting logout...');
    setIsLoggingOut(true);
    
    try {
      await signOut();
      console.log('🔐 Header: Logout successful');
      setIsOpen(false);
    } catch (error) {
      console.error('🔐 Header: Failed to sign out:', error);
      // Even if logout fails, close the menu
      setIsOpen(false);
      // You could show a toast notification here if needed
    } finally {
      setIsLoggingOut(false);
      console.log('🔐 Header: Logout process finished');
    }
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  const NavigationItems = () => (
    <>
      {filteredLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.name}
            to={link.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActiveRoute(link.href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
            onClick={() => setIsOpen(false)}
          >
            <Icon className="h-4 w-4" />
            {link.name}
          </Link>
        );
      })}
    </>
  );

  const AuthButtons = () => (
    <>
      {user ? (
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="max-w-[150px] truncate">
              {user.email}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="flex items-center gap-2"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </span>
          </Button>
        </div>
      ) : (
        <Link to="/auth">
          <Button variant="default" size="sm">
            Sign In
          </Button>
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand with Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                  <div className="flex flex-col gap-4 mt-8">
                    <div className="flex items-center gap-2 font-bold text-xl mb-6">
                      <TrendingUp className="h-6 w-6 text-primary" />
                      AI Analyst
                    </div>
                    
                    <nav className="flex flex-col gap-2">
                      <NavigationItems />
                    </nav>
                    
                    <div className="border-t pt-4 mt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Theme</span>
                        <ThemeToggle />
                      </div>
                      <AuthButtons />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 font-bold text-xl"
            >
              <TrendingUp className="h-6 w-6 text-primary" />
              AI Analyst
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-4">
              <NavigationItems />
            </div>
            <div className="flex items-center gap-3 border-l pl-4">
              <ThemeToggle />
              <AuthButtons />
            </div>
          </nav>

          {/* Mobile Auth Section */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            {user && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="max-w-[100px] truncate">
                  {user.email?.split('@')[0]}
                </span>
              </div>
            )}
            {!user && (
              <Link to="/auth">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;