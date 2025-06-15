import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Star, Clock, DollarSign, Phone, Camera, Waves, Mountain, Building, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { ExploreSection } from "@/components/ExploreSection";

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-konkan-turquoise-50 via-white to-konkan-orange-50">
      <Navigation />
      <div className="pt-16">
        <section className="py-20 bg-gradient-to-br from-konkan-turquoise-600 via-konkan-orange-500 to-konkan-forest-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">
              Explore Konkan's Best
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Discover pristine beaches, historic forts, and natural wonders across the beautiful Konkan coast
            </p>
          </div>
        </section>
        {/* Reusable ExploreSection below */}
        <ExploreSection title="All Places to Explore" />
      </div>
      <Footer />
    </div>
  );
};

export default Explore;
