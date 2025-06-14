
import { MapPin, MessageCircle, Heart, Calendar } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent mb-4">
              KonkanBliss
            </h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Your AI-powered companion for exploring the breathtaking Sindhudurg-Konkan region. 
              Discover hidden gems, plan perfect itineraries, and create unforgettable memories.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                <MessageCircle size={20} />
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Heart size={20} />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#home" className="hover:text-orange-400 transition-colors">Home</a></li>
              <li><a href="#explore" className="hover:text-orange-400 transition-colors">Explore</a></li>
              <li><a href="#itinerary" className="hover:text-orange-400 transition-colors">AI Planner</a></li>
              <li><a href="#map" className="hover:text-orange-400 transition-colors">Maps</a></li>
              <li><a href="#about" className="hover:text-orange-400 transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <Calendar size={16} />
                <span>AI Itinerary Planner</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Interactive Maps</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle size={16} />
                <span>AI Travel Assistant</span>
              </li>
              <li className="flex items-center gap-2">
                <Heart size={16} />
                <span>Save Favorites</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 KonkanBliss. Made with ❤️ for promoting Konkan tourism.</p>
        </div>
      </div>
    </footer>
  );
};
