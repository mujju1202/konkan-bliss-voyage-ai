
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ExploreSectionProps {
  title?: string;
  showMoreButton?: boolean;
  limit?: number;
}

type Destination = {
  id?: string;
  name: string;
  image: string;
  description: string;
  rating?: number;
  latitude?: number;
  longitude?: number;
};

type Package = {
  id: string;
  title: string;
  image_url?: string | null;
  description: string;
  highlights?: string[];
  // Optionally allow coordinates in a package for this button (extendable in future)
  latitude?: number;
  longitude?: number;
};

const staticDestinations: Destination[] = [
  {
    name: "Tarkarli Beach",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Crystal clear waters perfect for water sports and relaxation",
    rating: 4.8,
    latitude: 16.0167,
    longitude: 73.4667
  },
  {
    name: "Sindhudurg Fort",
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Historic sea fort built by Chhatrapati Shivaji Maharaj",
    rating: 4.7,
    latitude: 16.0333,
    longitude: 73.5000
  },
  {
    name: "Amboli Waterfalls",
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Breathtaking waterfalls surrounded by lush greenery",
    rating: 4.9,
    latitude: 15.9500,
    longitude: 74.0000
  },
  {
    name: "Malvan Beach",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Famous for scuba diving and authentic Malvani cuisine",
    rating: 4.6,
    latitude: 16.0594,
    longitude: 73.4707
  },
  {
    name: "Vengurla Beach",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Pristine beach with golden sand and coconut groves",
    rating: 4.5,
    latitude: 15.8667,
    longitude: 73.6333
  }
];

export const ExploreSection = ({
  title = "Explore",
  showMoreButton = false,
  limit
}: ExploreSectionProps) => {
  const [items, setItems] = useState<Package[] | Destination[]>([]);
  const [loading, setLoading] = useState(true);

  // Reusable function for Google Maps directions
  const handleNavigate = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    // Try to fetch data from Supabase 'packages' table; fallback to static destinations
    // It is assumed that if "packages" have coordinates, they're included in the JSON shape;
    // For now, coordinates are provided for static destinations.
    const fetchFromSupabase = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("packages")
        .select("id,title,description,image_url,highlights");
      if (error || !data || data.length === 0) {
        setItems(limit ? staticDestinations.slice(0, limit) : staticDestinations);
        setLoading(false);
        return;
      }
      setItems(limit ? data.slice(0, limit) : data);
      setLoading(false);
    };
    fetchFromSupabase();
  }, [limit]);

  return (
    <section id="explore-section" className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From pristine beaches to adventures, discover the best of Konkan!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: limit || 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse h-80 bg-gray-900/30" />
              ))
            : items.map((item, idx) => {
                // Determine if card has coordinates available
                const lat =
                  "latitude" in item
                    ? item.latitude
                    : (staticDestinations[idx % staticDestinations.length].latitude);
                const lng =
                  "longitude" in item
                    ? item.longitude
                    : (staticDestinations[idx % staticDestinations.length].longitude);

                const hasCoords = typeof lat === "number" && typeof lng === "number";

                return (
                  <Card key={item.id || idx} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-lg">
                    <div className="relative overflow-hidden">
                      <img
                        src={
                          "image_url" in item
                            ? item.image_url || staticDestinations[idx % staticDestinations.length].image
                            : (item as Destination).image
                        }
                        alt={
                          "title" in item
                            ? item.title
                            : (item as Destination).name
                        }
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {"rating" in item && (
                        <div className="absolute top-4 right-4 bg-white/90 rounded-full px-2 py-1 flex items-center gap-1">
                          <Star className="text-yellow-500 fill-current" size={14} />
                          <span className="text-sm font-medium">{(item as Destination).rating}</span>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg text-black">
                        {"title" in item ? item.title : (item as Destination).name}
                      </CardTitle>
                      <CardDescription className="text-gray-700">
                        {"description" in item ? item.description : (item as Destination).description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {Array.isArray((item as Package).highlights) && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {(item as Package).highlights
                            ?.slice(0, 3)
                            .map((highlight, hIdx) => (
                              <span key={hIdx} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                                {highlight}
                              </span>
                            ))}
                        </div>
                      )}
                      <div className="flex flex-col gap-2 mt-2">
                        <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white">
                          More Details
                        </Button>
                        {hasCoords && (
                          <Button
                            className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white"
                            variant="secondary"
                            onClick={() => lat && lng && handleNavigate(lat, lng)}
                          >
                            Navigate
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
        </div>
        {showMoreButton && (
          <div className="text-center mt-10">
            <Link to="/explore">
              <Button size="lg" variant="outline" className="px-8 border-white text-white hover:bg-white hover:text-black">
                View All Destinations
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
