import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Edit, Trash2, Share2, Download, Plus, Star, Camera, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface SavedItinerary {
  id: string;
  title: string;
  duration: string;
  destinations: string[];
  budget: string;
  groupType: string;
  createdAt: Date;
  lastModified: Date;
  status: 'draft' | 'completed' | 'active';
}

interface Experience {
  id: string;
  title: string;
  location: string;
  date: Date;
  rating: number;
  photos: string[];
  description: string;
  tags: string[];
}

const Dashboard = () => {
  const [savedItineraries, setSavedItineraries] = useState<SavedItinerary[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [newExperience, setNewExperience] = useState({
    title: '',
    location: '',
    rating: 5,
    description: '',
    tags: ''
  });
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('konkanbliss-itineraries');
    if (savedData) {
      setSavedItineraries(JSON.parse(savedData));
    } else {
      // Mock data for demonstration
      setSavedItineraries([
        {
          id: '1',
          title: 'Konkan Beach Hopping',
          duration: '5 days',
          destinations: ['Tarkarli', 'Malvan', 'Vengurla'],
          budget: 'Moderate (₹5,000 - ₹10,000)',
          groupType: 'Friends',
          createdAt: new Date('2024-01-15'),
          lastModified: new Date('2024-01-20'),
          status: 'completed'
        },
        {
          id: '2',
          title: 'Heritage & Culture Tour',
          duration: '3 days',
          destinations: ['Sindhudurg Fort', 'Sawantwadi', 'Amboli'],
          budget: 'Budget (₹2,000 - ₹5,000)',
          groupType: 'Family',
          createdAt: new Date('2024-02-01'),
          lastModified: new Date('2024-02-01'),
          status: 'draft'
        },
        {
          id: '3',
          title: 'Adventure Weekend',
          duration: '2 days',
          destinations: ['Tarkarli', 'Devbagh'],
          budget: 'Premium (₹10,000 - ₹20,000)',
          groupType: 'Couple',
          createdAt: new Date('2024-02-10'),
          lastModified: new Date('2024-02-12'),
          status: 'active'
        }
      ]);
    }

    const savedExperiences = localStorage.getItem('konkanbliss-experiences');
    if (savedExperiences) {
      setExperiences(JSON.parse(savedExperiences));
    } else {
      // Mock experiences
      setExperiences([
        {
          id: '1',
          title: 'Amazing Scuba Diving at Tarkarli',
          location: 'Tarkarli Beach',
          date: new Date('2024-01-20'),
          rating: 5,
          photos: ['https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
          description: 'Had an incredible scuba diving experience! The water was crystal clear and we saw amazing marine life.',
          tags: ['scuba diving', 'water sports', 'adventure']
        },
        {
          id: '2',
          title: 'Sunset at Sindhudurg Fort',
          location: 'Sindhudurg Fort',
          date: new Date('2024-01-18'),
          rating: 4,
          photos: ['https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
          description: 'The fort looks magnificent during sunset. Rich history and beautiful architecture.',
          tags: ['heritage', 'photography', 'sunset']
        }
      ]);
    }
  }, []);

  const handleDeleteItinerary = (id: string) => {
    const updated = savedItineraries.filter(item => item.id !== id);
    setSavedItineraries(updated);
    localStorage.setItem('konkanbliss-itineraries', JSON.stringify(updated));
    toast({
      title: "Itinerary Deleted",
      description: "Your itinerary has been removed from saved items.",
    });
  };

  const handleShareItinerary = (itinerary: SavedItinerary) => {
    navigator.clipboard.writeText(`Check out my ${itinerary.title} itinerary on KonkanBliss!`);
    toast({
      title: "Link Copied",
      description: "Itinerary share link copied to clipboard.",
    });
  };

  const handleAddExperience = () => {
    if (!newExperience.title || !newExperience.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in the title and location.",
        variant: "destructive"
      });
      return;
    }

    const experience: Experience = {
      id: Date.now().toString(),
      title: newExperience.title,
      location: newExperience.location,
      date: new Date(),
      rating: newExperience.rating,
      photos: [],
      description: newExperience.description,
      tags: newExperience.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    const updated = [...experiences, experience];
    setExperiences(updated);
    localStorage.setItem('konkanbliss-experiences', JSON.stringify(updated));
    
    setNewExperience({
      title: '',
      location: '',
      rating: 5,
      description: '',
      tags: ''
    });

    toast({
      title: "Experience Added",
      description: "Your travel experience has been saved!",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-konkan-forest-500';
      case 'active': return 'bg-konkan-orange-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'active': return 'Active';
      case 'draft': return 'Draft';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-konkan-turquoise-50 via-white to-konkan-orange-50">
      <Navigation />
      
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-konkan-turquoise-600 via-konkan-orange-500 to-konkan-forest-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
                Your Travel Dashboard
              </h1>
              <p className="text-xl mb-6 max-w-2xl mx-auto">
                Manage your saved itineraries and share your amazing Konkan experiences
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Tabs defaultValue="itineraries" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mx-auto">
              <TabsTrigger value="itineraries" className="flex items-center gap-2">
                <Calendar size={16} />
                Saved Itineraries
              </TabsTrigger>
              <TabsTrigger value="experiences" className="flex items-center gap-2">
                <Camera size={16} />
                My Experiences
              </TabsTrigger>
            </TabsList>

            {/* Saved Itineraries Tab */}
            <TabsContent value="itineraries" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Saved Itineraries</h2>
                <Button className="bg-gradient-to-r from-konkan-turquoise-500 to-konkan-orange-500 text-white rounded-xl">
                  <Plus className="mr-2" size={16} />
                  Create New
                </Button>
              </div>

              {savedItineraries.length === 0 ? (
                <Card className="glass-card border-0 shadow-xl">
                  <CardContent className="text-center py-12">
                    <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Saved Itineraries</h3>
                    <p className="text-gray-500 mb-6">Start planning your Konkan adventure!</p>
                    <Button className="bg-gradient-to-r from-konkan-turquoise-500 to-konkan-orange-500 text-white rounded-xl">
                      Create Your First Itinerary
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedItineraries.map((itinerary, index) => (
                    <motion.div
                      key={itinerary.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 floating-card">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg font-semibold">{itinerary.title}</CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <Calendar size={14} />
                                {itinerary.duration}
                              </CardDescription>
                            </div>
                            <Badge className={`${getStatusColor(itinerary.status)} text-white border-0`}>
                              {getStatusText(itinerary.status)}
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Destinations:</p>
                            <div className="flex flex-wrap gap-1">
                              {itinerary.destinations.map((dest, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  <MapPin size={10} className="mr-1" />
                                  {dest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            <p><strong>Budget:</strong> {itinerary.budget}</p>
                            <p><strong>Group:</strong> {itinerary.groupType}</p>
                            <p><strong>Created:</strong> {itinerary.createdAt.toLocaleDateString()}</p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 rounded-xl">
                              <Edit size={14} className="mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleShareItinerary(itinerary)}
                              className="rounded-xl"
                            >
                              <Share2 size={14} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="rounded-xl"
                            >
                              <Download size={14} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteItinerary(itinerary.id)}
                              className="text-red-600 hover:bg-red-50 rounded-xl"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Experiences Tab */}
            <TabsContent value="experiences" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">My Travel Experiences</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-konkan-turquoise-500 to-konkan-orange-500 text-white rounded-xl">
                      <Plus className="mr-2" size={16} />
                      Share Experience
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Share Your Experience</DialogTitle>
                      <DialogDescription>
                        Tell others about your amazing Konkan adventure!
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Experience Title</Label>
                        <Input
                          id="title"
                          value={newExperience.title}
                          onChange={(e) => setNewExperience({...newExperience, title: e.target.value})}
                          placeholder="e.g., Amazing sunset at Tarkarli"
                          className="rounded-xl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={newExperience.location}
                          onChange={(e) => setNewExperience({...newExperience, location: e.target.value})}
                          placeholder="e.g., Tarkarli Beach"
                          className="rounded-xl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rating">Rating</Label>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setNewExperience({...newExperience, rating: star})}
                              className={`p-1 ${star <= newExperience.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                            >
                              <Star size={20} fill="currentColor" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newExperience.description}
                          onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                          placeholder="Share your experience..."
                          className="rounded-xl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input
                          id="tags"
                          value={newExperience.tags}
                          onChange={(e) => setNewExperience({...newExperience, tags: e.target.value})}
                          placeholder="e.g., beach, sunset, photography"
                          className="rounded-xl"
                        />
                      </div>
                      <Button 
                        onClick={handleAddExperience}
                        className="w-full bg-gradient-to-r from-konkan-turquoise-500 to-konkan-orange-500 text-white rounded-xl"
                      >
                        Share Experience
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {experiences.length === 0 ? (
                <Card className="glass-card border-0 shadow-xl">
                  <CardContent className="text-center py-12">
                    <Camera className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Experiences Shared</h3>
                    <p className="text-gray-500 mb-6">Share your amazing Konkan memories!</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-konkan-turquoise-500 to-konkan-orange-500 text-white rounded-xl">
                          Share Your First Experience
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {experiences.map((experience, index) => (
                    <motion.div
                      key={experience.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 floating-card">
                        {experience.photos.length > 0 && (
                          <div className="relative overflow-hidden">
                            <img 
                              src={experience.photos[0]} 
                              alt={experience.title}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                              <Star className="text-yellow-500 fill-current" size={14} />
                              <span className="text-sm font-medium">{experience.rating}</span>
                            </div>
                          </div>
                        )}
                        
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold">{experience.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <MapPin size={14} />
                            {experience.location}
                            <span className="ml-auto text-xs">
                              {experience.date.toLocaleDateString()}
                            </span>
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <p className="text-sm text-gray-700">{experience.description}</p>
                          
                          {experience.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {experience.tags.map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 rounded-xl">
                              <Edit size={14} className="mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-xl">
                              <Heart size={14} />
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-xl">
                              <Share2 size={14} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Dashboard Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-konkan-sand-50 border border-konkan-sand-200 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-konkan-sand-800 mb-2">
              📊 Dashboard Features
            </h3>
            <p className="text-konkan-sand-700 mb-3">
              This dashboard uses localStorage for data persistence. In a production environment with Supabase authentication:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-konkan-sand-700">
              <li>• Cloud sync across devices</li>
              <li>• Real-time collaboration</li>
              <li>• Advanced analytics</li>
              <li>• Social sharing features</li>
              <li>• Photo uploads to cloud storage</li>
              <li>• Community reviews and ratings</li>
            </ul>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;