
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Map, Heart, MessageCircle, User, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                KonkanBliss
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="text-gray-900 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">
                Home
              </Link>
              <a href="#explore" className="text-gray-900 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">
                Explore
              </a>
              <Link to="/ai-planner" className="text-gray-900 hover:text-orange-500 px-3 py-2 text-sm font-medium flex items-center gap-1">
                <Sparkles size={16} />
                AI Planner
              </Link>
              <a href="#map" className="text-gray-900 hover:text-orange-500 px-3 py-2 text-sm font-medium flex items-center gap-1">
                <Map size={16} />
                Maps
              </a>
              <a href="#about" className="text-gray-900 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">
                About
              </a>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <MessageCircle size={16} className="mr-2" />
              Chat AI
            </Button>
            <Button variant="ghost" size="sm">
              <Heart size={16} className="mr-2" />
              Favorites
            </Button>
            <Button size="sm">
              <User size={16} className="mr-2" />
              Login
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-900 hover:text-orange-500 p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
            <Link to="/" className="block px-3 py-2 text-gray-900 hover:text-orange-500 text-sm font-medium">
              Home
            </Link>
            <a href="#explore" className="block px-3 py-2 text-gray-900 hover:text-orange-500 text-sm font-medium">
              Explore
            </a>
            <Link to="/ai-planner" className="block px-3 py-2 text-gray-900 hover:text-orange-500 text-sm font-medium">
              AI Planner
            </Link>
            <a href="#map" className="block px-3 py-2 text-gray-900 hover:text-orange-500 text-sm font-medium">
              Maps
            </a>
            <a href="#about" className="block px-3 py-2 text-gray-900 hover:text-orange-500 text-sm font-medium">
              About
            </a>
            <div className="pt-4 border-t border-gray-200">
              <Button variant="ghost" size="sm" className="w-full justify-start mb-2">
                <MessageCircle size={16} className="mr-2" />
                Chat AI
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start mb-2">
                <Heart size={16} className="mr-2" />
                Favorites
              </Button>
              <Button size="sm" className="w-full">
                <User size={16} className="mr-2" />
                Login
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
