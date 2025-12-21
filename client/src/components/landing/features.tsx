import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  Palette, 
  Calendar, 
  BarChart3, 
  Zap, 
  Globe,
  FileText,
  Image,
  Mail
} from "lucide-react";
import type { Feature } from "@shared/schema";

const features: Feature[] = [
  {
    id: "1",
    icon: "Sparkles",
    title: "AI-Powered Generation",
    description: "Create compelling content in seconds with advanced AI that understands your brand voice and audience."
  },
  {
    id: "2",
    icon: "Palette",
    title: "Brand Consistency",
    description: "Upload your brand profile and maintain consistent tone, style, and messaging across all content."
  },
  {
    id: "3",
    icon: "Calendar",
    title: "Content Calendar",
    description: "Plan and schedule your content ahead of time with an intuitive drag-and-drop calendar."
  },
  {
    id: "4",
    icon: "BarChart3",
    title: "Performance Analytics",
    description: "Track engagement, reach, and conversions to optimize your content strategy over time."
  },
  {
    id: "5",
    icon: "Zap",
    title: "Instant Templates",
    description: "Start from professionally designed templates for social posts, emails, ads, and more."
  },
  {
    id: "6",
    icon: "Globe",
    title: "Multi-Platform Support",
    description: "Create content optimized for Instagram, Facebook, LinkedIn, Twitter, and email campaigns."
  }
];

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Palette,
  Calendar,
  BarChart3,
  Zap,
  Globe,
  FileText,
  Image,
  Mail
};

export function Features() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Everything you need to create{" "}
            <span className="text-primary">amazing content</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful AI tools designed specifically for small businesses. 
            No design skills required.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const IconComponent = iconMap[feature.icon] || Sparkles;
            return (
              <Card 
                key={feature.id} 
                className="group hover-elevate transition-all duration-300"
                data-testid={`card-feature-${feature.id}`}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
