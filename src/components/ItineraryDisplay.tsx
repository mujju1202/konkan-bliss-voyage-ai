
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, DollarSign, Heart, Share2, Download, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ItineraryData } from "@/pages/AIPlanner";

interface ItineraryDisplayProps {
  itinerary: ItineraryData | null;
  isGenerating: boolean;
}

export const ItineraryDisplay = ({ itinerary, isGenerating }: ItineraryDisplayProps) => {
  const { toast } = useToast();

  const handleSaveItinerary = () => {
    toast({
      title: "Saved to Favorites",
      description: "Your itinerary has been saved to your favorites.",
    });
  };

  const handleShareItinerary = () => {
    toast({
      title: "Share Link Copied",
      description: "Itinerary share link copied to clipboard.",
    });
  };

  if (isGenerating) {
    return (
      <Card className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="animate-spin text-orange-500 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-semibold mb-2">Creating Your Perfect Itinerary</h3>
          <p className="text-gray-600">Our AI is crafting a personalized travel plan just for you...</p>
        </div>
      </Card>
    );
  }

  if (!itinerary) {
    return (
      <Card className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <MapPin className="text-gray-400 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Your Itinerary Will Appear Here</h3>
          <p className="text-gray-500">Fill out the form to generate your personalized Konkan travel plan</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Your Konkan Itinerary
              </CardTitle>
              <CardDescription className="mt-2">
                AI-generated travel plan tailored to your preferences
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSaveItinerary}>
                <Heart size={16} className="mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleShareItinerary}>
                <Share2 size={16} className="mr-1" />
                Share
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock size={12} />
              {itinerary.days} Days
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users size={12} />
              {itinerary.groupType}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin size={12} />
              {itinerary.exploreType}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <DollarSign size={12} />
              {itinerary.budgetRange}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          {itinerary.generatedPlan ? (
            <div className="space-y-6">
              {itinerary.generatedPlan.days?.map((day: any, index: number) => (
                <div key={index} className="border-l-4 border-orange-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Day {index + 1}: {day.title}
                  </h3>
                  <div className="space-y-3">
                    {day.activities?.map((activity: any, actIndex: number) => (
                      <div key={actIndex} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{activity.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                            {activity.time && (
                              <p className="text-sm text-orange-600 mt-1">
                                <Clock size={12} className="inline mr-1" />
                                {activity.time}
                              </p>
                            )}
                          </div>
                          {activity.cost && (
                            <Badge variant="outline">₹{activity.cost}</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {day.restaurants && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Recommended Restaurants:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {day.restaurants.map((restaurant: any, restIndex: number) => (
                          <div key={restIndex} className="bg-blue-50 p-3 rounded-lg text-sm">
                            <p className="font-medium">{restaurant.name}</p>
                            <p className="text-gray-600">{restaurant.cuisine}</p>
                            {restaurant.contact && (
                              <p className="text-blue-600">{restaurant.contact}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {day.tips && (
                    <div className="mt-4 bg-green-50 p-3 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-1">Local Tips:</h4>
                      <p className="text-green-700 text-sm">{day.tips}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Your detailed itinerary will be displayed here once generated.</p>
          )}
        </CardContent>
      </Card>

      {itinerary.generatedPlan && (
        <div className="text-center">
          <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
            <Download size={16} className="mr-2" />
            Download Itinerary PDF
          </Button>
        </div>
      )}
    </div>
  );
};
