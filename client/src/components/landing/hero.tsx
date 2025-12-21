import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRight, Play, Sparkles, Zap, Users, BarChart3, X } from "lucide-react";
import demoVideo from "@assets/generated_videos/ai_content_creation_demo_video.mp4";

export function Hero() {
  const [, setLocation] = useLocation();
  const [showDemo, setShowDemo] = useState(false);

  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Content Creation</span>
            </div>
            
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Create stunning content for your{" "}
              <span className="text-primary">small business</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl">
              Generate social media posts, emails, and ads from simple prompts. 
              AI-powered tools that maintain your brand voice while saving hours of work.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => setLocation("/dashboard")}
                data-testid="button-hero-get-started"
                className="gap-2"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={() => setShowDemo(true)}
                data-testid="button-hero-watch-demo"
              >
                <Play className="h-4 w-4" />
                Watch Demo
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center"
                    >
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">2,500+</strong> happy users
                </span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative bg-card rounded-xl border border-card-border shadow-2xl overflow-hidden">
              <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-chart-4/60" />
                  <div className="w-3 h-3 rounded-full bg-chart-2/60" />
                </div>
                <span className="text-xs text-muted-foreground ml-2">Content Dashboard</span>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-primary/10 space-y-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <p className="text-2xl font-bold">1,247</p>
                    <p className="text-xs text-muted-foreground">Posts Generated</p>
                  </div>
                  <div className="p-4 rounded-lg bg-chart-2/10 space-y-2">
                    <Users className="h-5 w-5 text-chart-2" />
                    <p className="text-2xl font-bold">52.4K</p>
                    <p className="text-xs text-muted-foreground">Engagement</p>
                  </div>
                  <div className="p-4 rounded-lg bg-chart-4/10 space-y-2">
                    <BarChart3 className="h-5 w-5 text-chart-4" />
                    <p className="text-2xl font-bold">89%</p>
                    <p className="text-xs text-muted-foreground">Time Saved</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Instagram Post - Product Launch</p>
                      <p className="text-xs text-muted-foreground">Generated 2 min ago</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-chart-2/20 text-chart-2">Published</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 rounded-lg bg-chart-4/20 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-chart-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Email Newsletter - Weekly Update</p>
                      <p className="text-xs text-muted-foreground">Generated 15 min ago</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">Draft</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-accent/30 rounded-full blur-2xl" />
          </div>
        </div>
      </div>

      <Dialog open={showDemo} onOpenChange={setShowDemo}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden">
          <div className="relative">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 z-10"
              onClick={() => setShowDemo(false)}
              data-testid="button-close-demo"
            >
              <X className="h-4 w-4" />
            </Button>
            <video
              src={demoVideo}
              controls
              autoPlay
              className="w-full aspect-video"
              data-testid="video-demo"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
