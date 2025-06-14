
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PlannerForm } from "@/components/PlannerForm";
import { ItineraryDisplay } from "@/components/ItineraryDisplay";

export interface ItineraryData {
  days: number;
  groupType: string;
  exploreType: string;
  budgetRange: string;
  generatedPlan?: any;
}

const AIPlanner = () => {
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePlanGenerated = (planData: ItineraryData) => {
    setItinerary(planData);
  };

  const handleGenerating = (generating: boolean) => {
    setIsGenerating(generating);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <section className="py-20 bg-gradient-to-br from-orange-50 to-pink-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                AI Travel Planner
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Let our AI create the perfect Konkan itinerary tailored to your preferences, budget, and travel style
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <PlannerForm 
                onPlanGenerated={handlePlanGenerated}
                onGenerating={handleGenerating}
              />
              <ItineraryDisplay 
                itinerary={itinerary}
                isGenerating={isGenerating}
              />
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default AIPlanner;
