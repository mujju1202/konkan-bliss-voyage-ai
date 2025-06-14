
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, MessageCircle, Star, Calendar, Navigation, Heart } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "AI-Powered Itinerary",
    description: "Get personalized travel plans based on your preferences, budget, and group type",
    color: "text-blue-500"
  },
  {
    icon: Map,
    title: "Interactive Maps",
    description: "Explore destinations with detailed maps, navigation, and local insights",
    color: "text-green-500"
  },
  {
    icon: MessageCircle,
    title: "AI Travel Assistant",
    description: "Chat with our AI for instant travel advice and local recommendations",
    color: "text-purple-500"
  },
  {
    icon: Star,
    title: "Curated Experiences",
    description: "Discover hidden gems, local culture, and authentic Konkan experiences",
    color: "text-orange-500"
  },
  {
    icon: Navigation,
    title: "Smart Navigation",
    description: "Get real-time directions and transportation options for your journey",
    color: "text-cyan-500"
  },
  {
    icon: Heart,
    title: "Save Favorites",
    description: "Bookmark your favorite places and create personalized travel collections",
    color: "text-pink-500"
  }
];

export const Features = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose KonkanBliss?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We combine cutting-edge AI technology with local expertise to create unforgettable travel experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-105">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-white transition-colors`}>
                    <IconComponent className={`${feature.color} transition-colors`} size={24} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
