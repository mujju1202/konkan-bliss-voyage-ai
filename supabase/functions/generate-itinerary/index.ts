
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { days, groupType, exploreType, budgetRange, specialRequests } = await req.json();

    // For now, we'll create a mock itinerary. In a real implementation, you would:
    // 1. Call an AI service like OpenAI, Google Gemini, or Claude
    // 2. Use the user's preferences to generate a personalized itinerary
    
    const mockItinerary = generateMockItinerary(days, groupType, exploreType, budgetRange, specialRequests);

    return new Response(
      JSON.stringify({ itinerary: mockItinerary }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate itinerary' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

function generateMockItinerary(days: number, groupType: string, exploreType: string, budgetRange: string, specialRequests: string) {
  const konkanPlaces = [
    { name: "Tarkarli Beach", type: "beach", activities: ["water sports", "scuba diving", "beach relaxation"] },
    { name: "Sindhudurg Fort", type: "heritage", activities: ["fort exploration", "history tour", "photography"] },
    { name: "Malvan", type: "food", activities: ["Malvani cuisine", "seafood", "local markets"] },
    { name: "Amboli Waterfalls", type: "nature", activities: ["trekking", "waterfall viewing", "nature photography"] },
    { name: "Vengurla Beach", type: "beach", activities: ["sunset viewing", "coconut groves", "peaceful walks"] },
    { name: "Devbagh Beach", type: "beach", activities: ["secluded beach", "turtle watching", "peaceful getaway"] },
  ];

  const restaurants = [
    { name: "Athithi Bamboo", cuisine: "Malvani", contact: "+91 98765 43210" },
    { name: "Chaitanya Restaurant", cuisine: "Seafood", contact: "+91 98765 43211" },
    { name: "Malvan Kinara", cuisine: "Local", contact: "+91 98765 43212" },
    { name: "Kokan Darbar", cuisine: "Traditional", contact: "+91 98765 43213" },
  ];

  const itineraryDays = [];
  
  for (let i = 0; i < days; i++) {
    const dayPlaces = konkanPlaces.slice(i % konkanPlaces.length, (i % konkanPlaces.length) + 2);
    const dayRestaurants = restaurants.slice(i % restaurants.length, (i % restaurants.length) + 2);
    
    itineraryDays.push({
      title: `Exploring ${dayPlaces[0]?.name || 'Konkan Coast'}`,
      activities: dayPlaces.map(place => ({
        name: place.name,
        description: `Visit ${place.name} and enjoy ${place.activities.join(', ')}`,
        time: i === 0 ? "9:00 AM - 12:00 PM" : "10:00 AM - 1:00 PM",
        cost: budgetRange === "budget" ? "500" : budgetRange === "moderate" ? "1000" : "2000"
      })),
      restaurants: dayRestaurants,
      tips: `Best time to visit is early morning. ${specialRequests ? 'Note: ' + specialRequests : 'Don\'t forget to try the local Solkadhi drink!'}`
    });
  }

  return {
    days: itineraryDays,
    totalEstimatedCost: budgetRange === "budget" ? days * 2000 : budgetRange === "moderate" ? days * 5000 : days * 10000,
    bestTimeToVisit: "October to March",
    summary: `A ${days}-day ${exploreType} focused trip perfect for ${groupType} travelers within ${budgetRange} budget.`
  };
}
