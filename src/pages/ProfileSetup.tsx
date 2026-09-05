import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Building2 } from 'lucide-react';

const ProfileSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    startupName: '',
    industry: '',
    stage: '',
    description: '',
    teamSize: '',
    foundedYear: '',
    website: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('startup_profiles')
        .upsert({
          user_id: user.id,
          startup_name: formData.startupName,
          industry: formData.industry,
          stage: formData.stage,
          description: formData.description,
          team_size: formData.teamSize ? parseInt(formData.teamSize) : null,
          founded_year: formData.foundedYear ? parseInt(formData.foundedYear) : null,
          website: formData.website,
          is_complete: true,
        });

      if (error) throw error;

      toast.success('Profile setup complete!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save profile');
      console.error('Profile setup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-4">
      <div className="max-w-2xl mx-auto pt-12 pb-24">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-elegant mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Complete Your Startup Profile</h1>
          <p className="text-muted-foreground">
            Help us understand your startup to provide better insights
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-2xl shadow-primary/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="startupName">Startup Name *</Label>
              <Input
                id="startupName"
                required
                value={formData.startupName}
                onChange={(e) => setFormData({ ...formData, startupName: e.target.value })}
                placeholder="Enter your startup name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Input
                id="industry"
                required
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g., FinTech, HealthTech, SaaS"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage">Stage *</Label>
              <Select required value={formData.stage} onValueChange={(value) => setFormData({ ...formData, stage: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">Idea</SelectItem>
                  <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                  <SelectItem value="seed">Seed</SelectItem>
                  <SelectItem value="series-a">Series A</SelectItem>
                  <SelectItem value="series-b">Series B</SelectItem>
                  <SelectItem value="series-c+">Series C+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of your startup"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teamSize">Team Size</Label>
                <Input
                  id="teamSize"
                  type="number"
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                  placeholder="e.g., 5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="foundedYear">Founded Year</Label>
                <Input
                  id="foundedYear"
                  type="number"
                  value={formData.foundedYear}
                  onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
                  placeholder="e.g., 2024"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://yourstartp.com"
              />
            </div>

            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Complete Setup'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
