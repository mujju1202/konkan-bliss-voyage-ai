
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";

const destinations = [
  {
    name: "Tarkarli Beach",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Crystal clear waters perfect for water sports and relaxation",
    highlights: ["Water Sports", "Clear Waters", "Beach Activities"],
    rating: 4.8
  },
  {
    name: "Sindhudurg Fort",
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Historic sea fort built by Chhatrapati Shivaji Maharaj",
    highlights: ["Historical", "Architecture", "Sea Views"],
    rating: 4.7
  },
  {
    name: "Amboli Waterfalls",
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Breathtaking waterfalls surrounded by lush greenery",
    highlights: ["Nature", "Waterfalls", "Trekking"],
    rating: 4.9
  },
  {
    name: "Malvan Beach",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Famous for scuba diving and authentic Malvani cuisine",
    highlights: ["Scuba Diving", "Seafood", "Local Culture"],
    rating: 4.6
  },
  {
    name: "Vengurla Beach",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Pristine beach with golden sand and coconut groves",
    highlights: ["Pristine Beach", "Coconut Groves", "Sunset Views"],
    rating: 4.5
  },
  {
    name: "Devbagh Beach",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Secluded beach perfect for peaceful getaways",
    highlights: ["Secluded", "Peace", "Natural Beauty"],
    rating: 4.4
  }
];

export const ExploreSection = () => {
  return (
    <section id="explore" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Explore Konkan's Best Destinations
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            From pristine beaches to historic forts, discover the diverse beauty of the Konkan coast
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <Card key={index} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md">
              <div className="relative overflow-hidden">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                  <Star className="text-yellow-500 fill-current" size={14} />
                  <span className="text-sm font-medium">{destination.rating}</span>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="text-orange-500" size={18} />
                  {destination.name}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {destination.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {destination.highlights.map((highlight, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="px-8 border-white text-white hover:bg-white hover:text-black">
            View All Destinations
          </Button>
        </div>
      </div>
    </section>
  );
};
