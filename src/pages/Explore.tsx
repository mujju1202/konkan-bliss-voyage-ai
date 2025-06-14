import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Star, Clock, DollarSign, Phone, Camera, Waves, Mountain, Building, Heart } from "lucide-react";
import { motion } from "framer-motion";

const destinations = [
  {
    id: 1,
    name: "Tarkarli Beach",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Crystal clear waters perfect for water sports and relaxation",
    category: "Beach",
    rating: 4.8,
    estimatedCost: "₹2,000 - ₹5,000",
    bestTime: "Oct - Mar",
    highlights: ["Water Sports", "Scuba Diving", "Clear Waters", "Beach Activities"],
    attractions: [
      { name: "Scuba Diving Center", distance: "0.5 km", type: "Activity" },
      { name: "Tsunami Island", distance: "2 km", type: "Island" },
      { name: "Devbagh Beach", distance: "5 km", type: "Beach" }
    ],
    restaurants: [
      { name: "Athithi Bamboo", cuisine: "Malvani", contact: "+91 98765 43210", rating: 4.5 },
      { name: "Blue Sea Restaurant", cuisine: "Seafood", contact: "+91 98765 43211", rating: 4.3 },
      { name: "Tarkarli Beach Resort", cuisine: "Multi-cuisine", contact: "+91 98765 43212", rating: 4.2 }
    ],
    tips: "Best visited during early morning for water sports. Book scuba diving in advance during peak season.",
    coordinates: { lat: 16.0167, lng: 73.4667 }
  },
  {
    id: 2,
    name: "Sindhudurg Fort",
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Historic sea fort built by Chhatrapati Shivaji Maharaj",
    category: "Heritage",
    rating: 4.7,
    estimatedCost: "₹500 - ₹1,500",
    bestTime: "Nov - Feb",
    highlights: ["Historical", "Architecture", "Sea Views", "Photography"],
    attractions: [
      { name: "Shivaji Temple", distance: "0.1 km", type: "Temple" },
      { name: "Fort Museum", distance: "0.2 km", type: "Museum" },
      { name: "Malvan Beach", distance: "1 km", type: "Beach" }
    ],
    restaurants: [
      { name: "Malvan Kinara", cuisine: "Local", contact: "+91 98765 43213", rating: 4.4 },
      { name: "Fort View Restaurant", cuisine: "Traditional", contact: "+91 98765 43214", rating: 4.1 },
      { name: "Shivaji Bhavan", cuisine: "Maharashtrian", contact: "+91 98765 43215", rating: 4.0 }
    ],
    tips: "Carry water and wear comfortable shoes. Best photography time is during sunset.",
    coordinates: { lat: 16.0333, lng: 73.5000 }
  },
  {
    id: 3,
    name: "Amboli Waterfalls",
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Breathtaking waterfalls surrounded by lush greenery",
    category: "Nature",
    rating: 4.9,
    estimatedCost: "₹1,000 - ₹3,000",
    bestTime: "Jun - Sep",
    highlights: ["Waterfalls", "Trekking", "Nature Photography", "Monsoon Beauty"],
    attractions: [
      { name: "Hiranyakeshi Temple", distance: "2 km", type: "Temple" },
      { name: "Sunset Point", distance: "3 km", type: "Viewpoint" },
      { name: "Kawalesad Rapids", distance: "5 km", type: "Rapids" }
    ],
    restaurants: [
      { name: "Amboli Ghat Restaurant", cuisine: "Local", contact: "+91 98765 43216", rating: 4.2 },
      { name: "Waterfall View Cafe", cuisine: "Snacks", contact: "+91 98765 43217", rating: 4.0 },
      { name: "Hill Station Dhaba", cuisine: "North Indian", contact: "+91 98765 43218", rating: 3.9 }
    ],
    tips: "Visit during monsoon for best waterfall experience. Carry raincoat and non-slip shoes.",
    coordinates: { lat: 15.9500, lng: 74.0000 }
  },
  {
    id: 4,
    name: "Malvan Beach",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Famous for scuba diving and authentic Malvani cuisine",
    category: "Beach",
    rating: 4.6,
    estimatedCost: "₹2,500 - ₹6,000",
    bestTime: "Oct - Mar",
    highlights: ["Scuba Diving", "Seafood", "Local Culture", "Water Sports"],
    attractions: [
      { name: "Rock Garden", distance: "1 km", type: "Garden" },
      { name: "Chivla Beach", distance: "3 km", type: "Beach" },
      { name: "Rameshwar Temple", distance: "2 km", type: "Temple" }
    ],
    restaurants: [
      { name: "Chaitanya Restaurant", cuisine: "Malvani", contact: "+91 98765 43219", rating: 4.6 },
      { name: "Kokan Darbar", cuisine: "Seafood", contact: "+91 98765 43220", rating: 4.4 },
      { name: "Malvan Tadka", cuisine: "Traditional", contact: "+91 98765 43221", rating: 4.3 }
    ],
    tips: "Try the famous Malvani fish curry. Book scuba diving sessions in advance.",
    coordinates: { lat: 16.0667, lng: 73.4667 }
  },
  {
    id: 5,
    name: "Vengurla Beach",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Pristine beach with golden sand and coconut groves",
    category: "Beach",
    rating: 4.5,
    estimatedCost: "₹1,500 - ₹4,000",
    bestTime: "Nov - Mar",
    highlights: ["Pristine Beach", "Coconut Groves", "Sunset Views", "Peaceful"],
    attractions: [
      { name: "Sagareshwar Beach", distance: "2 km", type: "Beach" },
      { name: "Mochemad Beach", distance: "4 km", type: "Beach" },
      { name: "Vengurla Lighthouse", distance: "1 km", type: "Lighthouse" }
    ],
    restaurants: [
      { name: "Coconut Grove Restaurant", cuisine: "Coastal", contact: "+91 98765 43222", rating: 4.2 },
      { name: "Sunset Cafe", cuisine: "Continental", contact: "+91 98765 43223", rating: 4.0 },
      { name: "Beach Shack", cuisine: "Snacks", contact: "+91 98765 43224", rating: 3.8 }
    ],
    tips: "Perfect for sunset photography. Less crowded than other beaches.",
    coordinates: { lat: 15.8667, lng: 73.6333 }
  },
  {
    id: 6,
    name: "Devbagh Beach",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Secluded beach perfect for peaceful getaways",
    category: "Beach",
    rating: 4.4,
    estimatedCost: "₹1,000 - ₹3,500",
    bestTime: "Oct - Apr",
    highlights: ["Secluded", "Peace", "Natural Beauty", "Turtle Watching"],
    attractions: [
      { name: "Turtle Nesting Site", distance: "0.5 km", type: "Wildlife" },
      { name: "Devbagh Sangam", distance: "1 km", type: "Confluence" },
      { name: "Karli River", distance: "2 km", type: "River" }
    ],
    restaurants: [
      { name: "Devbagh Resort Restaurant", cuisine: "Multi-cuisine", contact: "+91 98765 43225", rating: 4.1 },
      { name: "Riverside Cafe", cuisine: "Local", contact: "+91 98765 43226", rating: 3.9 },
      { name: "Beach Hut Eatery", cuisine: "Seafood", contact: "+91 98765 43227", rating: 3.7 }
    ],
    tips: "Visit during turtle nesting season (Nov-Feb). Carry your own water and snacks.",
    coordinates: { lat: 16.0000, lng: 73.4500 }
  }
];

const categories = ["All", "Beach", "Heritage", "Nature"];

const Explore = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDestination, setSelectedDestination] = useState(null);

  const filteredDestinations = selectedCategory === "All" 
    ? destinations 
    : destinations.filter(dest => dest.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Beach": return <Waves className="w-4 h-4" />;
      case "Heritage": return <Building className="w-4 h-4" />;
      case "Nature": return <Mountain className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Beach": return "from-konkan-turquoise-500 to-blue-500";
      case "Heritage": return "from-konkan-orange-500 to-red-500";
      case "Nature": return "from-konkan-forest-500 to-green-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-konkan-turquoise-50 via-white to-konkan-orange-50">
      <Navigation />
      
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-konkan-turquoise-600 via-konkan-orange-500 to-konkan-forest-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">
                Explore Konkan's Best
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Discover pristine beaches, historic forts, and natural wonders across the beautiful Konkan coast
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-white/80 backdrop-blur-sm sticky top-16 z-40 border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === category
                      ? `bg-gradient-to-r ${getCategoryColor(category)} text-white shadow-lg`
                      : "bg-white/70 text-gray-700 hover:bg-white hover:shadow-md"
                  }`}
                >
                  {getCategoryIcon(category)}
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Destinations Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredDestinations.map((destination, index) => (
                <motion.div
                  key={destination.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm floating-card">
                    <div className="relative overflow-hidden">
                      <img 
                        src={destination.image} 
                        alt={destination.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                        <Star className="text-yellow-500 fill-current" size={14} />
                        <span className="text-sm font-medium">{destination.rating}</span>
                      </div>
                      <div className="absolute top-4 left-4">
                        <Badge className={`bg-gradient-to-r ${getCategoryColor(destination.category)} text-white border-0`}>
                          {getCategoryIcon(destination.category)}
                          <span className="ml-1">{destination.category}</span>
                        </Badge>
                      </div>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <MapPin className="text-konkan-orange-500" size={18} />
                        {destination.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {destination.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {destination.highlights.slice(0, 3).map((highlight, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 bg-konkan-turquoise-100 text-konkan-turquoise-700 text-xs rounded-full"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{destination.bestTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign size={14} />
                            <span className="font-medium">{destination.estimatedCost}</span>
                          </div>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              className="w-full bg-gradient-to-r from-konkan-turquoise-500 to-konkan-orange-500 hover:from-konkan-turquoise-600 hover:to-konkan-orange-600 text-white rounded-xl hover-lift"
                              onClick={() => setSelectedDestination(destination)}
                            >
                              <Camera className="mr-2" size={16} />
                              Explore Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-display flex items-center gap-2">
                                <MapPin className="text-konkan-orange-500" />
                                {destination.name}
                              </DialogTitle>
                              <DialogDescription className="text-lg">
                                {destination.description}
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedDestination && (
                              <div className="space-y-6">
                                <img 
                                  src={selectedDestination.image} 
                                  alt={selectedDestination.name}
                                  className="w-full h-64 object-cover rounded-xl"
                                />
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                      <MapPin className="text-konkan-turquoise-500" size={18} />
                                      Nearby Attractions
                                    </h3>
                                    <div className="space-y-2">
                                      {selectedDestination.attractions.map((attraction, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                          <div>
                                            <p className="font-medium">{attraction.name}</p>
                                            <p className="text-sm text-gray-600">{attraction.type}</p>
                                          </div>
                                          <span className="text-sm text-konkan-turquoise-600 font-medium">
                                            {attraction.distance}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                      <Phone className="text-konkan-orange-500" size={18} />
                                      Recommended Restaurants
                                    </h3>
                                    <div className="space-y-2">
                                      {selectedDestination.restaurants.map((restaurant, idx) => (
                                        <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                                          <div className="flex justify-between items-start mb-1">
                                            <p className="font-medium">{restaurant.name}</p>
                                            <div className="flex items-center gap-1">
                                              <Star className="text-yellow-500 fill-current" size={12} />
                                              <span className="text-sm">{restaurant.rating}</span>
                                            </div>
                                          </div>
                                          <p className="text-sm text-gray-600 mb-1">{restaurant.cuisine}</p>
                                          <p className="text-sm text-konkan-turquoise-600">{restaurant.contact}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="bg-konkan-turquoise-50 p-4 rounded-xl">
                                  <h3 className="text-lg font-semibold mb-2 text-konkan-turquoise-800">
                                    Local Tips
                                  </h3>
                                  <p className="text-konkan-turquoise-700">{selectedDestination.tips}</p>
                                </div>
                                
                                <div className="flex gap-4">
                                  <Button className="flex-1 bg-gradient-to-r from-konkan-turquoise-500 to-konkan-orange-500 text-white rounded-xl">
                                    <MapPin className="mr-2" size={16} />
                                    View on Map
                                  </Button>
                                  <Button variant="outline" className="flex-1 border-konkan-turquoise-300 text-konkan-turquoise-600 hover:bg-konkan-turquoise-50 rounded-xl">
                                    <Heart className="mr-2" size={16} />
                                    Save to Favorites
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Explore;