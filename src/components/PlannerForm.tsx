
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, MapPin, Users, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { ItineraryData } from "@/pages/AIPlanner";

interface PlannerFormProps {
  onPlanGenerated: (planData: ItineraryData) => void;
  onGenerating: (generating: boolean) => void;
}

export const PlannerForm = ({ onPlanGenerated, onGenerating }: PlannerFormProps) => {
  const [formData, setFormData] = useState({
    days: "",
    groupType: "",
    exploreType: "",
    budgetRange: "",
    specialRequests: ""
  });
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.days || !formData.groupType || !formData.exploreType || !formData.budgetRange) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate your itinerary.",
        variant: "destructive"
      });
      return;
    }

    onGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-itinerary', {
        body: {
          days: parseInt(formData.days),
          groupType: formData.groupType,
          exploreType: formData.exploreType,
          budgetRange: formData.budgetRange,
          specialRequests: formData.specialRequests
        }
      });

      if (error) throw error;

      const planData: ItineraryData = {
        days: parseInt(formData.days),
        groupType: formData.groupType,
        exploreType: formData.exploreType,
        budgetRange: formData.budgetRange,
        generatedPlan: data.itinerary
      };

      onPlanGenerated(planData);
      
      toast({
        title: "Itinerary Generated!",
        description: "Your personalized Konkan travel plan is ready.",
      });
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate itinerary. Please try again.",
        variant: "destructive"
      });
    } finally {
      onGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-orange-500" size={24} />
          Plan Your Perfect Trip
        </CardTitle>
        <CardDescription>
          Tell us about your travel preferences and let AI create your ideal Konkan itinerary
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="days" className="flex items-center gap-2">
              <Calendar size={16} />
              Number of Days *
            </Label>
            <Select onValueChange={(value) => setFormData({...formData, days: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Day</SelectItem>
                <SelectItem value="2">2 Days</SelectItem>
                <SelectItem value="3">3 Days</SelectItem>
                <SelectItem value="4">4 Days</SelectItem>
                <SelectItem value="5">5 Days</SelectItem>
                <SelectItem value="7">1 Week</SelectItem>
                <SelectItem value="10">10 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="groupType" className="flex items-center gap-2">
              <Users size={16} />
              Group Type *
            </Label>
            <Select onValueChange={(value) => setFormData({...formData, groupType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select group type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solo">Solo Traveler</SelectItem>
                <SelectItem value="couple">Couple</SelectItem>
                <SelectItem value="friends">Friends Group</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="large-group">Large Group</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exploreType" className="flex items-center gap-2">
              <MapPin size={16} />
              Exploration Style *
            </Label>
            <Select onValueChange={(value) => setFormData({...formData, exploreType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="What interests you most?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adventure">Adventure & Water Sports</SelectItem>
                <SelectItem value="nature">Nature & Wildlife</SelectItem>
                <SelectItem value="heritage">Heritage & Culture</SelectItem>
                <SelectItem value="beaches">Beach Relaxation</SelectItem>
                <SelectItem value="food">Food & Local Cuisine</SelectItem>
                <SelectItem value="hidden-gems">Hidden Gems</SelectItem>
                <SelectItem value="photography">Photography & Scenic</SelectItem>
                <SelectItem value="spiritual">Spiritual & Temples</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetRange" className="flex items-center gap-2">
              <DollarSign size={16} />
              Budget Range (per person) *
            </Label>
            <Select onValueChange={(value) => setFormData({...formData, budgetRange: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Budget (₹2,000 - ₹5,000)</SelectItem>
                <SelectItem value="moderate">Moderate (₹5,000 - ₹10,000)</SelectItem>
                <SelectItem value="premium">Premium (₹10,000 - ₹20,000)</SelectItem>
                <SelectItem value="luxury">Luxury (₹20,000+)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
            <Textarea
              id="specialRequests"
              placeholder="Any specific places you want to visit, dietary restrictions, accessibility needs, etc."
              value={formData.specialRequests}
              onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            size="lg"
          >
            <Sparkles className="mr-2" size={20} />
            Generate My Itinerary
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
