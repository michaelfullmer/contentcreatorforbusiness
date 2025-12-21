import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, Mail, FileText, Presentation, Crown } from "lucide-react";
import type { TemplateCategory } from "@shared/schema";

interface TemplateItem {
  id: string;
  name: string;
  category: TemplateCategory;
  isPremium: boolean;
  gradient: string;
}

const templates: TemplateItem[] = [
  { id: "1", name: "Product Launch Post", category: "social", isPremium: false, gradient: "from-violet-500 to-purple-600" },
  { id: "2", name: "Weekly Newsletter", category: "email", isPremium: false, gradient: "from-blue-500 to-cyan-500" },
  { id: "3", name: "Blog Article", category: "blog", isPremium: false, gradient: "from-emerald-500 to-teal-500" },
  { id: "4", name: "Sales Pitch Deck", category: "presentation", isPremium: true, gradient: "from-orange-500 to-red-500" },
  { id: "5", name: "Instagram Story", category: "social", isPremium: false, gradient: "from-pink-500 to-rose-500" },
  { id: "6", name: "Promotional Email", category: "email", isPremium: false, gradient: "from-indigo-500 to-blue-500" },
  { id: "7", name: "Case Study", category: "blog", isPremium: true, gradient: "from-amber-500 to-orange-500" },
  { id: "8", name: "Company Overview", category: "presentation", isPremium: false, gradient: "from-cyan-500 to-blue-500" },
];

const categories: { value: TemplateCategory | "all"; label: string; icon: React.ElementType }[] = [
  { value: "all", label: "All Templates", icon: FileText },
  { value: "social", label: "Social Media", icon: Instagram },
  { value: "email", label: "Email", icon: Mail },
  { value: "blog", label: "Blog", icon: FileText },
  { value: "presentation", label: "Presentations", icon: Presentation },
];

export function Templates() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | "all">("all");
  
  const filteredTemplates = activeCategory === "all" 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  return (
    <section id="templates" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Start with{" "}
            <span className="text-primary">professional templates</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose from dozens of professionally designed templates and customize them to match your brand.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={activeCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category.value)}
              className="gap-2"
              data-testid={`button-category-${category.value}`}
            >
              <category.icon className="h-4 w-4" />
              {category.label}
            </Button>
          ))}
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="group overflow-hidden hover-elevate transition-all duration-300"
              data-testid={`card-template-${template.id}`}
            >
              <div className={`h-40 bg-gradient-to-br ${template.gradient} relative`}>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="secondary" size="sm" onClick={() => setLocation("/dashboard/create")}>
                    Use Template
                  </Button>
                </div>
                {template.isPremium && (
                  <Badge 
                    className="absolute top-3 right-3 gap-1" 
                    variant="secondary"
                  >
                    <Crown className="h-3 w-3" />
                    Pro
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium truncate">{template.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{template.category}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" onClick={() => setLocation("/dashboard/create")} data-testid="button-view-all-templates">
            View All Templates
          </Button>
        </div>
      </div>
    </section>
  );
}
