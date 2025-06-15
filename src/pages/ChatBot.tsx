import { useState, useRef, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Mic, MicOff, Bot, User, Volume2, VolumeX, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Namaste! 🙏 I'm your AI travel guide for the beautiful Konkan coast. I can help you with travel planning, local information, historical facts, and recommendations. What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const quickQuestions = [
    "Best time to visit Konkan?",
    "Top beaches in Sindhudurg",
    "Local Malvani cuisine",
    "Historical places to visit",
    "Water sports activities",
    "Budget travel tips"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('beach') || lowerMessage.includes('tarkarli') || lowerMessage.includes('malvan')) {
      return "🏖️ The Konkan coast has some of India's most pristine beaches! Tarkarli Beach is famous for its crystal-clear waters and water sports. Malvan Beach offers excellent scuba diving opportunities. For a peaceful experience, try Vengurla or Devbagh beaches. The best time to visit is October to March when the weather is pleasant.";
    }
    
    if (lowerMessage.includes('food') || lowerMessage.includes('cuisine') || lowerMessage.includes('malvani')) {
      return "🍽️ Malvani cuisine is a treat for seafood lovers! Must-try dishes include Koliwada prawns, fish curry with coconut, sol kadhi (kokum drink), and modak. Don't miss the famous Malvani fish thali. Popular restaurants include Chaitanya Restaurant in Malvan and Athithi Bamboo in Tarkarli.";
    }
    
    if (lowerMessage.includes('fort') || lowerMessage.includes('sindhudurg') || lowerMessage.includes('history')) {
      return "🏰 Sindhudurg Fort is a magnificent sea fort built by Chhatrapati Shivaji Maharaj in 1664. It's located on a rocky island and showcases brilliant Maratha architecture. The fort has temples, freshwater wells, and offers stunning sea views. Entry fee is ₹25 for Indians. Best visited during early morning or evening.";
    }
    
    if (lowerMessage.includes('time') || lowerMessage.includes('when') || lowerMessage.includes('season')) {
      return "🌤️ The best time to visit Konkan is from October to March when the weather is pleasant and ideal for beach activities. Monsoon season (June-September) offers lush greenery and waterfalls but heavy rains. Summer (April-May) can be hot and humid. Winter months are perfect for water sports and sightseeing.";
    }
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
      return "💰 Konkan can be budget-friendly! Accommodation ranges from ₹800-3000 per night. Local food costs ₹200-500 per meal. Transportation by bus is economical (₹100-300). Water sports cost ₹500-2000. A 3-day trip can cost ₹5000-15000 per person depending on your choices. Homestays are great budget options!";
    }
    
    if (lowerMessage.includes('activity') || lowerMessage.includes('sports') || lowerMessage.includes('adventure')) {
      return "🏄‍♂️ Konkan offers amazing water activities! Scuba diving at Tarkarli (₹2500-4000), parasailing, jet skiing, banana boat rides, and dolphin watching. You can also try backwater cruises, fort trekking, waterfall rappelling at Amboli, and fishing with local fishermen. Book water sports in advance during peak season!";
    }
    
    // Default response
    return "🤔 That's an interesting question! I'd love to help you explore the Konkan coast. Could you be more specific about what you'd like to know? I can provide information about beaches, food, historical places, activities, travel tips, or anything else about the beautiful Konkan region!";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);

      // Speak the response if voice is enabled
      if (voiceEnabled) {
        speakText(botResponse.text);
      }
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive"
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Remove emojis and clean text for better speech
      const cleanText = text.replace(/[^\w\s.,!?-]/g, '');
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-konkan-turquoise-50 via-white to-konkan-orange-50">
      <Navigation />
      
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-konkan-turquoise-600 via-konkan-orange-500 to-konkan-forest-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
                AI Travel Assistant
              </h1>
              <p className="text-xl mb-6 max-w-2xl mx-auto">
                Get instant answers about Konkan travel, local culture, and hidden gems
              </p>
              <div className="flex justify-center gap-4">
                <Badge className="bg-white/20 text-white border-0 px-4 py-2">
                  <Sparkles className="mr-2" size={16} />
                  Powered by AI
                </Badge>
                <Badge className="bg-white/20 text-white border-0 px-4 py-2">
                  <Volume2 className="mr-2" size={16} />
                  Voice Enabled
                </Badge>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Chat Interface */}
          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-2xl h-[600px] flex flex-col rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-white/20 bg-gradient-to-r from-konkan-turquoise-50 to-konkan-orange-50">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-konkan-turquoise-500 to-konkan-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Bot className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Konkan AI Guide</h3>
                    <p className="text-sm text-gray-600">Your personal travel assistant</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={`rounded-xl transition-all duration-200 ${voiceEnabled ? 'bg-konkan-turquoise-50 text-konkan-turquoise-600 border-konkan-turquoise-200' : ''}`}
                  >
                    {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </Button>
                  {isSpeaking && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={stopSpeaking}
                      className="rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Stop
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white/50 to-white/30">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                          message.sender === 'user' 
                            ? 'bg-gradient-to-r from-konkan-orange-500 to-konkan-orange-600' 
                            : 'bg-gradient-to-r from-konkan-turquoise-500 to-konkan-turquoise-600'
                        }`}>
                          {message.sender === 'user' ? 
                            <User className="text-white" size={16} /> : 
                            <Bot className="text-white" size={16} />
                          }
                        </div>
                        <div className={`p-4 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-konkan-orange-500 to-konkan-orange-600 text-white'
                            : 'bg-white/90 backdrop-blur-md border border-white/30 text-gray-800'
                        }`}>
                          <p className="text-sm leading-relaxed break-words">{message.text}</p>
                          <p className={`text-xs mt-2 opacity-70 ${
                            message.sender === 'user' ? 'text-orange-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-konkan-turquoise-500 to-konkan-turquoise-600 flex items-center justify-center shadow-lg">
                        <Bot className="text-white" size={16} />
                      </div>
                      <div className="bg-white/90 backdrop-blur-md border border-white/30 p-4 rounded-2xl shadow-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-konkan-turquoise-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-konkan-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-konkan-forest-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              <div className="px-6 py-4 border-t border-white/20 bg-white/80 backdrop-blur-sm">
                <p className="text-sm text-gray-600 mb-3">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <motion.button
                      key={question}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleQuickQuestion(question)}
                      className="px-3 py-1 bg-konkan-turquoise-100 text-konkan-turquoise-700 text-xs rounded-full hover:bg-konkan-turquoise-200 transition-all duration-200 hover:scale-105"
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-6 border-t border-white/20 bg-white/90 backdrop-blur-sm">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask me anything about Konkan..."
                      className="pr-12 rounded-2xl border-konkan-turquoise-200 focus:border-konkan-turquoise-400 bg-white/90 backdrop-blur-sm focus:bg-white transition-all duration-200"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={startListening}
                      disabled={isListening}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl transition-all duration-200 ${
                        isListening ? 'text-red-500 bg-red-50' : 'text-konkan-turquoise-600 hover:bg-konkan-turquoise-50'
                      }`}
                    >
                      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-gradient-to-r from-konkan-turquoise-500 to-konkan-orange-500 hover:from-konkan-turquoise-600 hover:to-konkan-orange-600 text-white rounded-2xl px-6 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Features Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-konkan-sand-50 border border-konkan-sand-200 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-konkan-sand-800 mb-2">
              🤖 AI Assistant Features
            </h3>
            <p className="text-konkan-sand-700 mb-3">
              This AI chatbot provides instant answers about Konkan travel. In a production environment, 
              this would be powered by Google Gemini 1.5 Flash or similar AI models for:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-konkan-sand-700">
              <li>• Real-time travel information</li>
              <li>• Personalized recommendations</li>
              <li>• Historical and cultural insights</li>
              <li>• Weather and seasonal advice</li>
              <li>• Local cuisine suggestions</li>
              <li>• Activity and attraction details</li>
            </ul>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ChatBot;