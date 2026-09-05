import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CompleteProfile from "./pages/CompleteProfile";
import Upload from "./pages/Upload";
import AnalysisDashboard from "./pages/AnalysisDashboard";
import AnalysisResults from "./pages/AnalysisResults";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
          <Routes>
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
            {/* Founder Routes */}
            <Route 
              path="/complete-profile" 
              element={
                <Layout>
                  <ProtectedRoute requiredRole="founder">
                    <CompleteProfile />
                  </ProtectedRoute>
                </Layout>
              } 
            />
            {/* Investor Routes */}
            <Route 
              path="/upload" 
              element={
                <Layout>
                  <ProtectedRoute requiredRole="investor">
                    <Upload />
                  </ProtectedRoute>
                </Layout>
              } 
            />
            <Route 
              path="/analysis" 
              element={
                <Layout>
                  <ProtectedRoute requiredRole="investor">
                    <AnalysisResults />
                  </ProtectedRoute>
                </Layout>
              } 
            />
            <Route 
              path="/analysis-dashboard" 
              element={
                <Layout>
                  <ProtectedRoute requiredRole="investor">
                    <AnalysisDashboard />
                  </ProtectedRoute>
                </Layout>
              } 
            />
            <Route 
              path="/analysis-dashboard/:analysisId" 
              element={
                <Layout>
                  <ProtectedRoute requiredRole="investor">
                    <AnalysisDashboard />
                  </ProtectedRoute>
                </Layout>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <Layout>
                  <ProtectedRoute requiredRole="founder">
                    <Dashboard />
                  </ProtectedRoute>
                </Layout>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route 
              path="*" 
              element={
                <Layout>
                  <NotFound />
                </Layout>
              } 
            />
          </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
