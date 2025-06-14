import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ChatBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! 👋 I'm your Konkan travel assistant. Ask me anything about beaches, food, or places to visit!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const generateQuickResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('beach')) {
      return "🏖️ Tarkarli and Malvan beaches are must-visits! Crystal clear waters perfect for water sports. Would you like specific recommendations?";
    }
    
    if (lowerMessage.includes('food')) {
      return "🍽️ Try the famous Malvani fish curry, koliwada prawns, and sol kadhi! I can suggest great restaurants too.";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! 😊 I'm here to help you explore Konkan. What would you like to know about?";
    }
    
    return "That's interesting! For detailed information, check out our full AI chat assistant. I can help with quick questions about Konkan travel! 🌊";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    // Quick bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateQuickResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  return (
    <>
      {/* Chat Widget Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-konkan-turquoise-500 to-konkan-orange-500 hover:from-konkan-turquoise-600 hover:to-konkan-orange-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
        >
          <MessageCircle size={24} />
        </Button>
      </motion.div>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 z-50 w-80 h-96"
          >
            <Card className="glass-card border-0 shadow-2xl h-full flex flex-col">
              <CardHeader className="border-b border-white/20 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 bg-gradient-to-r from-konkan-turquoise-500 to-konkan-orange-500 rounded-full flex items-center justify-center">
                      <Bot className="text-white" size={16} />
                    </div>
                    <div>
                      <p className="font-semibold">Konkan Assistant</p>
                      <p className="text-xs text-gray-500">Quick help</p>
                    </div>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          message.sender === 'user' 
                            ? 'bg-konkan-orange-500' 
                            : 'bg-gradient-to-r from-konkan-turquoise-500 to-konkan-orange-500'
                        }`}>
                          {message.sender === 'user' ? 
                            <User className="text-white" size={12} /> : 
                            <Bot className="text-white" size={12} />
                          }
                        </div>
                        <div className={`p-2 rounded-lg text-xs ${
                          message.sender === 'user'
                            ? 'bg-konkan-orange-500 text-white'
                            : 'bg-white/80 backdrop-blur-sm border border-white/20'
                        }`}>
                          <p>{message.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-3 border-t border-white/20">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask about Konkan..."
                      className="text-xs rounded-xl border-konkan-turquoise-200"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button
                      onClick={handleSendMessage}
                      size="sm"
                      className="bg-gradient-to-r from-konkan-turquoise-500 to-konkan-orange-500 text-white rounded-xl px-3"
                    >
                      <Send size={12} />
                    </Button>
                  </div>
                  <div className="mt-2 text-center">
                    <Link to="/chat">
                      <Button variant="ghost" size="sm" className="text-xs text-konkan-turquoise-600 hover:bg-konkan-turquoise-50">
                        Open Full Chat Assistant →
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};