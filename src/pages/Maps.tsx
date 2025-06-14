import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation as NavigationIcon, Clock, Car, Route, Search, Compass } from "lucide-react";
import { motion } from "framer-motion";

const konkanPlaces = [
  { name: "Tarkarli Beach", lat: 16.0167, lng: 73.4667, type: "Beach", color: "konkan-turquoise" },
  { name: "Sindhudurg Fort", lat: 16.0333, lng: 73.5000, type: "Heritage", color: "konkan-orange" },
  { name: "Malvan Beach", lat: 16.0667, lng: 73.4667, type: "Beach", color: "konkan-turquoise" },
  { name: "Amboli Waterfalls", lat: 15.9500, lng: 74.0000, type: "Nature", color: "konkan-forest" },
  { name: "Vengurla Beach", lat: 15.8667, lng: 73.6333, type: "Beach", color: "konkan-turquoise" },
  { name: "Devbagh Beach", lat: 16.0000, lng: 73.4500, type: "Beach", color: "konkan-turquoise" },
  { name: "Sawantwadi Palace", lat: 15.9000, lng: 73.8167, type: "Heritage", color: "konkan-orange" },
  { name: "Redi Beach", lat: 15.7500, lng: 73.5833, type: "Beach", color: "konkan-turquoise" },
];

const Maps = () => {
  const [currentLocation, setCurrentLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);

  const handleGetDirections = () => {
    if (currentLocation && destination) {
      // Mock route calculation
      setRouteInfo({
        distance: "45.2 km",
        duration: "1h 15m",
        route: "Via NH-66 and coastal roads"
      });
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          setCurrentLocation("Mumbai, Maharashtra");
        }
      );
    } else {
      setCurrentLocation("Mumbai, Maharashtra");
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Beach": return "bg-konkan-turquoise-500";
      case "Heritage": return "bg-konkan-orange-500";
      case "Nature": return "bg-konkan-forest-500";
      default: return "bg-gray-500";
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
                Interactive Konkan Map
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Navigate the beautiful Konkan coast with live directions and discover hidden gems
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map Controls */}
            <div className="lg:col-span-1 space-y-6">
              {/* Route Planner */}
              <Card className="glass-card border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-konkan-turquoise-700">
                    <Route size={20} />
                    Route Planner
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">From</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter your location"
                        value={currentLocation}
                        onChange={(e) => setCurrentLocation(e.target.value)}
                        className="rounded-xl"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleGetCurrentLocation}
                        className="rounded-xl"
                      >
                        <Compass size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">To</label>
                    <Input
                      placeholder="Select destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleGetDirections}
                    className="w-full bg-gradient-to-r from-konkan-turquoise-500 to-konkan-orange-500 text-white rounded-xl hover-lift"
                  >
                    <NavigationIcon className="mr-2" size={16} />
                    Get Directions
                  </Button>
                  
                  {routeInfo && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-konkan-turquoise-50 p-4 rounded-xl"
                    >
                      <h3 className="font-semibold text-konkan-turquoise-800 mb-2">Route Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Car className="text-konkan-turquoise-600" size={14} />
                          <span>Distance: {routeInfo.distance}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="text-konkan-turquoise-600" size={14} />
                          <span>Duration: {routeInfo.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Route className="text-konkan-turquoise-600" size={14} />
                          <span>{routeInfo.route}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Popular Places */}
              <Card className="glass-card border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-konkan-orange-700">
                    <MapPin size={20} />
                    Popular Places
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {konkanPlaces.map((place, index) => (
                      <motion.div
                        key={place.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-3 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                          selectedPlace?.name === place.name 
                            ? 'bg-konkan-turquoise-100 border-2 border-konkan-turquoise-300' 
                            : 'bg-white/70 hover:bg-white'
                        }`}
                        onClick={() => setSelectedPlace(place)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getTypeColor(place.type)}`}></div>
                            <div>
                              <p className="font-medium">{place.name}</p>
                              <p className="text-sm text-gray-600">{place.type}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDestination(place.name);
                            }}
                            className="text-konkan-turquoise-600 hover:bg-konkan-turquoise-50"
                          >
                            <NavigationIcon size={14} />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Map Display */}
            <div className="lg:col-span-2">
              <Card className="glass-card border-0 shadow-xl h-[600px]">
                <CardContent className="p-0 h-full">
                  <div className="relative h-full bg-gradient-to-br from-konkan-turquoise-100 to-konkan-orange-100 rounded-xl overflow-hidden">
                    {/* Mock Map Interface */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-konkan-turquoise-400 to-konkan-orange-400 rounded-full flex items-center justify-center mb-6 mx-auto">
                          <MapPin className="text-white" size={48} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">Interactive Map</h3>
                        <p className="text-gray-600 mb-6 max-w-md">
                          This is a placeholder for the interactive map. In a real implementation, 
                          you would integrate Google Maps API or Mapbox to show actual locations and routes.
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {konkanPlaces.map((place) => (
                            <Badge 
                              key={place.name}
                              className={`${getTypeColor(place.type)} text-white cursor-pointer hover:scale-105 transition-transform`}
                              onClick={() => setSelectedPlace(place)}
                            >
                              {place.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Map Controls */}
                    <div className="absolute top-4 right-4 space-y-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-white/90 backdrop-blur-sm rounded-xl"
                      >
                        <Search size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-white/90 backdrop-blur-sm rounded-xl"
                      >
                        <Compass size={16} />
                      </Button>
                    </div>

                    {/* Selected Place Info */}
                    {selectedPlace && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${getTypeColor(selectedPlace.type)}`}></div>
                            <div>
                              <h4 className="font-semibold">{selectedPlace.name}</h4>
                              <p className="text-sm text-gray-600">{selectedPlace.type}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => setDestination(selectedPlace.name)}
                              className="bg-konkan-turquoise-500 hover:bg-konkan-turquoise-600 text-white rounded-xl"
                            >
                              <NavigationIcon className="mr-1" size={14} />
                              Navigate
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPlace(null)}
                              className="rounded-xl"
                            >
                              Close
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Map Integration Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-konkan-sand-50 border border-konkan-sand-200 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-konkan-sand-800 mb-2">
              🗺️ Map Integration
            </h3>
            <p className="text-konkan-sand-700">
              This is a UI mockup of the interactive map feature. In a production environment, 
              this would be integrated with Google Maps API or Mapbox to provide:
            </p>
            <ul className="mt-3 space-y-1 text-konkan-sand-700">
              <li>• Real-time GPS navigation</li>
              <li>• Live traffic updates</li>
              <li>• Satellite and street view</li>
              <li>• Turn-by-turn directions</li>
              <li>• Offline map support</li>
            </ul>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Maps;