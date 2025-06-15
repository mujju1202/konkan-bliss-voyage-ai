import { Hero } from "@/components/Hero";
import { Navigation } from "@/components/Navigation";
import { Features } from "@/components/Features";
import { ExploreSection } from "@/components/ExploreSection";
import { Footer } from "@/components/Footer";
import { ChatBotWidget } from "@/components/ChatBotWidget";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Features />
      <ExploreSection title="Explore Konkan" limit={4} showMoreButton />
      <Footer />
      <ChatBotWidget />
    </div>
  );
};

export default Index;
