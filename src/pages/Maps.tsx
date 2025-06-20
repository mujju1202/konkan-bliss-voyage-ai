import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation as NavigationIcon, Clock, Car, Route, Search, Compass, ExternalLink, Key } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

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

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const Maps = () => {
  const [currentLocation, setCurrentLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const directionsServiceRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Check if Google Maps API is loaded
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        setMapLoaded(true);
      } else {
        // Google Maps is not loaded - this is expected without a valid API key
        setMapLoaded(false);
      }
    };

    checkGoogleMaps();
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    // Initialize map centered on Konkan region
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 16.0167, lng: 73.4667 },
      zoom: 10,
      styles: [
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#14b8a6" }]
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [{ color: "#f0fdfa" }]
        }
      ]
    });

    // Initialize directions service and renderer
    directionsServiceRef.current = new window.google.maps.DirectionsService();
    directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
      draggable: true,
      panel: null
    });
    directionsRendererRef.current.setMap(mapInstanceRef.current);

    // Add markers for all Konkan places
    addPlaceMarkers();

    // Listen for directions changes
    directionsRendererRef.current.addListener('directions_changed', () => {
      const directions = directionsRendererRef.current.getDirections();
      const route = directions.routes[0];
      if (route) {
        setRouteInfo({
          distance: route.legs[0].distance.text,
          duration: route.legs[0].duration.text,
          route: `Via ${route.summary}`
        });
      }
    });
  };

  const addPlaceMarkers = () => {
    if (!mapInstanceRef.current || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    konkanPlaces.forEach(place => {
      const marker = new window.google.maps.Marker({
        position: { lat: place.lat, lng: place.lng },
        map: mapInstanceRef.current,
        title: place.name,
        icon: {
          url: place.type === 'Beach' 
            ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#14b8a6"/>
                <circle cx="12" cy="12" r="6" fill="white"/>
              </svg>
            `)
            : place.type === 'Heritage'
            ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#f97316"/>
                <circle cx="12" cy="12" r="6" fill="white"/>
              </svg>
            `)
            : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                <circle cx="12" cy="12" r="6" fill="white"/>
              </svg>
            `),
          scaledSize: new window.google.maps.Size(30, 30)
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px;">
            <h3 style="margin: 0 0 5px 0; color: #1f2937;">${place.name}</h3>
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">${place.type}</p>
            <button 
              onclick="window.navigateToPlace('${place.name}')" 
              style="background: linear-gradient(to right, #14b8a6, #f97316); color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 14px;"
            >
              Navigate Here
            </button>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
        setSelectedPlace(place);
      });

      markersRef.current.push(marker);
    });
  };

  const calculateRoute = (from: string, to: string) => {
    if (!directionsServiceRef.current || !from || !to) return;

    const request = {
      origin: from,
      destination: to,
      travelMode: window.google.maps.TravelMode.DRIVING,
    };

    directionsServiceRef.current.route(request, (result: any, status: any) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        directionsRendererRef.current.setDirections(result);
      } else {
        toast({
          title: "Route Error",
          description: `Directions request failed: ${status}`,
          variant: "destructive"
        });
      }
    });
  };

  const handleGetDirections = () => {
    if (currentLocation && destination) {
      calculateRoute(currentLocation, destination);
    } else {
      toast({
        title: "Missing Information",
        description: "Please enter both starting location and destination.",
        variant: "destructive"
      });
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCurrentLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          
          // Center map on user's location
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter({ lat, lng });
            mapInstanceRef.current.setZoom(12);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setCurrentLocation("Mumbai, Maharashtra");
          toast({
            title: "Location Error",
            description: "Could not get your current location. Using default location.",
            variant: "destructive"
          });
        }
      );
    } else {
      setCurrentLocation("Mumbai, Maharashtra");
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive"
      });
    }
  };

  // Global function for info window buttons
  useEffect(() => {
    window.navigateToPlace = (placeName: string) => {
      setDestination(placeName);
      if (currentLocation) {
        calculateRoute(currentLocation, placeName);
      }
    };

    return () => {
      delete window.navigateToPlace;
    };
  }, [currentLocation]);

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
                        id="from"
                        placeholder="Enter your location"
                        value={currentLocation}
                        onChange={(e) => setCurrentLocation(e.target.value)}
                        className="rounded-xl"
                        disabled={!window.google}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleGetCurrentLocation}
                        className="rounded-xl"
                        disabled={!window.google}
                      >
                        <Compass size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">To</label>
                    <Input
                      id="to"
                      placeholder="Select destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="rounded-xl"
                      disabled={!window.google}
                    />
                  </div>
                  
                  <Button 
                    id="get-directions"
                    onClick={handleGetDirections}
                    className="w-full bg-gradient-to-r from-konkan-turquoise-500 to-konkan-orange-500 text-white rounded-xl hover-lift"
                    disabled={!window.google}
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
                        onClick={() => {
                          setSelectedPlace(place);
                          if (mapInstanceRef.current) {
                            mapInstanceRef.current.setCenter({ lat: place.lat, lng: place.lng });
                            mapInstanceRef.current.setZoom(14);
                          }
                        }}
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
                            disabled={!window.google}
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

            {/* Google Maps Display */}
            <div className="lg:col-span-2">
              <Card className="glass-card border-0 shadow-xl h-[600px]">
                <CardContent className="p-0 h-full">
                  {!window.google ? (
                    <div className="h-full flex items-center justify-center bg-gradient-to-br from-konkan-turquoise-100 to-konkan-orange-100 rounded-xl">
                      <div className="text-center max-w-lg p-8">
                        <div className="w-32 h-32 bg-gradient-to-br from-konkan-turquoise-400 to-konkan-orange-400 rounded-full flex items-center justify-center mb-6 mx-auto">
                          <Key className="text-white" size={48} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-4">Google Maps Setup Required</h3>
                        <p className="text-gray-600 mb-6">
                          To enable the interactive map with live directions and navigation, you'll need to set up a Google Maps API key.
                        </p>
                        
                        <div className="bg-white/80 rounded-lg p-6 text-left space-y-4">
                          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                            <ExternalLink size={16} />
                            Setup Steps:
                          </h4>
                          <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                            <li>Visit the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-konkan-turquoise-600 hover:underline">Google Cloud Console</a></li>
                            <li>Create a new project or select an existing one</li>
                            <li>Enable the "Maps JavaScript API"</li>
                            <li>Create an API key in the Credentials section</li>
                            <li>Replace the commented script tag in index.html with your API key</li>
                          </ol>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Note:</strong> Once configured, you'll have access to interactive maps, real-time directions, place markers, and route planning features.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div 
                      ref={mapRef}
                      id="map"
                      className="w-full h-full rounded-xl"
                      style={{ minHeight: '600px' }}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Setup Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-gradient-to-r from-konkan-turquoise-50 to-konkan-orange-50 border border-konkan-turquoise-200 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-konkan-turquoise-800 mb-3 flex items-center gap-2">
              <Key size={20} />
              Google Maps Integration Setup
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-konkan-turquoise-700 mb-2">Features Available:</h4>
                <ul className="text-sm text-konkan-turquoise-600 space-y-1">
                  <li>• Interactive map with custom styling</li>
                  <li>• Real-time directions and routing</li>
                  <li>• Current location detection</li>
                  <li>• Place markers with info windows</li>
                  <li>• Route distance and duration display</li>
                  <li>• Draggable route planning</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-konkan-orange-700 mb-2">To Enable Maps:</h4>
                <div className="text-sm text-konkan-orange-600 space-y-2">
                  <p>1. Get your API key from Google Cloud Console</p>
                  <p>2. Uncomment the script tag in index.html</p>
                  <p>3. Replace "YOUR_API_KEY" with your actual key</p>
                  <p>4. Refresh the page to see the interactive map</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Maps;