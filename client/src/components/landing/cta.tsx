import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTA() {
  const [, setLocation] = useLocation();

  return (
    <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">Start creating today</span>
        </div>
        
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          Ready to transform your content strategy?
        </h2>
        
        <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
          Join thousands of small businesses creating professional content in minutes. 
          Start free, no credit card required.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => setLocation("/dashboard")}
            className="gap-2"
            data-testid="button-cta-get-started"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="bg-transparent border-white/30 text-primary-foreground hover:bg-white/10"
            data-testid="button-cta-contact"
          >
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
}
