import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Users, DollarSign, Calendar, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Destination {
  id: string;
  name: string;
  category: string;
  latitude?: number;
  longitude?: number;
}

interface Review {
  id: string;
  rating: number;
  review_text?: string;
  profiles?: {
    full_name?: string;
  };
}

interface EnhancedPackage {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  price?: number;
  duration?: string;
  category?: string;
  difficulty_level?: string;
  min_group_size?: number;
  max_group_size?: number;
  average_rating?: number;
  review_count?: number;
  highlights?: string[];
  tags?: string[];
  inclusions?: string[];
  package_destinations?: {
    destinations: Destination;
  }[];
  package_reviews?: Review[];
}

interface PackageCardProps {
  package: EnhancedPackage;
  onViewDetails: (id: string) => void;
  onBookNow?: (id: string) => void;
}

export const PackageCard = ({ package: pkg, onViewDetails, onBookNow }: PackageCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const { toast } = useToast();

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites",
      description: isFavorited ? 
        "Package removed from your favorites" : 
        "Package saved to your favorites",
    });
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'beach': return 'bg-konkan-turquoise-500';
      case 'heritage': return 'bg-konkan-orange-500';
      case 'nature': return 'bg-konkan-forest-500';
      case 'temple': return 'bg-purple-500';
      case 'waterfall': return 'bg-blue-500';
      case 'cultural': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'challenging': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const destinations = pkg.package_destinations?.map(pd => pd.destinations) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/90 backdrop-blur-lg rounded-2xl hover:scale-105">
        <div className="relative overflow-hidden">
          <img
            src={pkg.image_url || "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
            alt={pkg.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Rating Badge */}
          {pkg.average_rating && pkg.average_rating > 0 && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
              <Star className="text-yellow-500 fill-current" size={14} />
              <span className="text-sm font-medium">{pkg.average_rating.toFixed(1)}</span>
              {pkg.review_count && pkg.review_count > 0 && (
                <span className="text-xs text-gray-500">({pkg.review_count})</span>
              )}
            </div>
          )}

          {/* Price Badge */}
          {pkg.price && (
            <div className="absolute top-4 left-4 bg-konkan-orange-500 text-white rounded-full px-3 py-1 shadow-lg">
              <span className="text-sm font-bold">₹{pkg.price.toLocaleString()}</span>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
          >
            <Heart 
              size={16} 
              className={isFavorited ? "text-red-500 fill-current" : "text-gray-600"} 
            />
          </button>
        </div>

        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex gap-2">
              {pkg.category && (
                <Badge className={`${getCategoryColor(pkg.category)} text-white border-0 text-xs`}>
                  {pkg.category}
                </Badge>
              )}
              {pkg.difficulty_level && (
                <Badge className={`${getDifficultyColor(pkg.difficulty_level)} border-0 text-xs`}>
                  {pkg.difficulty_level}
                </Badge>
              )}
            </div>
          </div>
          
          <CardTitle className="text-lg text-gray-900 group-hover:text-konkan-turquoise-600 transition-colors">
            {pkg.title}
          </CardTitle>
          <CardDescription className="text-gray-600 line-clamp-2">
            {pkg.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Package Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {pkg.duration && (
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={14} />
                <span>{pkg.duration}</span>
              </div>
            )}
            {pkg.min_group_size && pkg.max_group_size && (
              <div className="flex items-center gap-2 text-gray-600">
                <Users size={14} />
                <span>{pkg.min_group_size}-{pkg.max_group_size} people</span>
              </div>
            )}
          </div>

          {/* Destinations */}
          {destinations.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Destinations:</p>
              <div className="flex flex-wrap gap-1">
                {destinations.slice(0, 3).map((dest, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    <MapPin size={10} className="mr-1" />
                    {dest.name}
                  </Badge>
                ))}
                {destinations.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{destinations.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Highlights */}
          {pkg.highlights && pkg.highlights.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {pkg.highlights.slice(0, 3).map((highlight, idx) => (
                <Badge 
                  key={idx} 
                  variant="secondary" 
                  className="text-xs bg-konkan-turquoise-100 text-konkan-turquoise-700 hover:bg-konkan-turquoise-200 transition-colors"
                >
                  {highlight}
                </Badge>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={() => onViewDetails(pkg.id)}
              className="flex-1 bg-gradient-to-r from-konkan-turquoise-500 to-konkan-orange-500 hover:from-konkan-turquoise-600 hover:to-konkan-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Calendar className="mr-2" size={16} />
              View Details
            </Button>
            
            {onBookNow && (
              <Button
                onClick={() => onBookNow(pkg.id)}
                variant="outline"
                className="border-konkan-turquoise-200 text-konkan-turquoise-600 hover:bg-konkan-turquoise-50 rounded-xl transition-all duration-300"
              >
                Book Now
              </Button>
            )}
          </div>

          {/* Inclusions Preview */}
          {pkg.inclusions && pkg.inclusions.length > 0 && (
            <div className="text-xs text-gray-500 border-t pt-3">
              <span className="font-medium">Includes:</span> {pkg.inclusions.slice(0, 2).join(', ')}
              {pkg.inclusions.length > 2 && '...'}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};