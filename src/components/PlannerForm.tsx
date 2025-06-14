
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MapPin, Users, Calendar, DollarSign, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { ItineraryData } from "@/pages/AIPlanner";

interface PlannerFormProps {
  onPlanGenerated: (planData: ItineraryData) => void;
  onGenerating: (generating: boolean) => void;
}

const exploreOptions = [
  { value: "adventure", label: "Adventure & Water Sports" },
  { value: "nature", label: "Nature & Wildlife" },
  { value: "heritage", label: "Heritage & Culture" },
  { value: "beaches", label: "Beach Relaxation" },
  { value: "food", label: "Food & Local Cuisine" },
  { value: "hidden-gems", label: "Hidden Gems" },
  { value: "photography", label: "Photography & Scenic" },
  { value: "spiritual", label: "Spiritual & Temples" }
];

export const PlannerForm = ({ onPlanGenerated, onGenerating }: PlannerFormProps) => {
  const [formData, setFormData] = useState({
    days: "",
    groupType: "",
    exploreType: [] as string[],
    budgetRange: "",
    specialRequests: ""
  });
  
  const { toast } = useToast();

  const handleExploreTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      exploreType: prev.exploreType.includes(value)
        ? prev.exploreType.filter(item => item !== value)
        : [...prev.exploreType, value]
    }));
  };

  const removeExploreType = (valueToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      exploreType: prev.exploreType.filter(item => item !== valueToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.days || !formData.groupType || formData.exploreType.length === 0 || !formData.budgetRange) {
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
        exploreType: formData.exploreType.join(", "),
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
              Exploration Style * (Select multiple)
            </Label>
            <Select onValueChange={handleExploreTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="What interests you most?" />
              </SelectTrigger>
              <SelectContent>
                {exploreOptions.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className={formData.exploreType.includes(option.value) ? "bg-orange-50" : ""}
                  >
                    {option.label}
                    {formData.exploreType.includes(option.value) && (
                      <span className="ml-2 text-orange-600">✓</span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {formData.exploreType.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.exploreType.map((type) => {
                  const option = exploreOptions.find(opt => opt.value === type);
                  return (
                    <Badge key={type} variant="secondary" className="flex items-center gap-1">
                      {option?.label}
                      <button
                        type="button"
                        onClick={() => removeExploreType(type)}
                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
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
