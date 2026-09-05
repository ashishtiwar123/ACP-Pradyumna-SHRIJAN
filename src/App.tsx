import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import Auth from "./pages/Auth";
import CompleteProfile from "./pages/CompleteProfile";
import Upload from "./pages/Upload";
import AnalysisDashboard from "./pages/AnalysisDashboard";
import AnalysisResults from "./pages/AnalysisResults";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={
                  <Layout>
                    <Index />
                  </Layout>
                } 
              />
              <Route 
                path="/auth" 
                element={
                  <Layout>
                    <Auth />
                  </Layout>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <Layout>
                    <Auth />
                  </Layout>
                } 
              />
              
              {/* Founder Routes */}
              <Route 
                path="/complete-profile" 
                element={
                  <Layout>
                    <ProtectedRoute>
                      <CompleteProfile />
                    </ProtectedRoute>
                  </Layout>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <Layout>
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  </Layout>
                } 
              />
              
              {/* Investor Routes */}
              <Route 
                path="/upload" 
                element={
                  <Layout>
                    <ProtectedRoute>
                      <Upload />
                    </ProtectedRoute>
                  </Layout>
                } 
              />
              <Route 
                path="/analysis" 
                element={
                  <Layout>
                    <ProtectedRoute>
                      <AnalysisResults />
                    </ProtectedRoute>
                  </Layout>
                } 
              />
              <Route 
                path="/analysis-dashboard" 
                element={
                  <Layout>
                    <ProtectedRoute>
                      <AnalysisDashboard />
                    </ProtectedRoute>
                  </Layout>
                } 
              />
              <Route 
                path="/analysis-dashboard/:analysisId" 
                element={
                  <Layout>
                    <ProtectedRoute>
                      <AnalysisDashboard />
                    </ProtectedRoute>
                  </Layout>
                } 
              />
              
              {/* Fallback Routes */}
              <Route 
                path="*" 
                element={
                  <Layout>
                    <Index />
                  </Layout>
                } 
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
