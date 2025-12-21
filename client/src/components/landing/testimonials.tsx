import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote } from "lucide-react";
import type { Testimonial } from "@shared/schema";

const testimonials: Testimonial[] = [
  {
    id: "1",
    quote: "ContentCreator has saved me hours every week. The AI understands exactly what my brand needs and generates content that feels authentic.",
    author: "Sarah Chen",
    role: "Owner",
    company: "Bloom Boutique"
  },
  {
    id: "2",
    quote: "I was skeptical about AI-generated content, but this tool blew me away. Our social engagement has increased by 150% since we started using it.",
    author: "Marcus Johnson",
    role: "Marketing Director",
    company: "TechStart Labs"
  },
  {
    id: "3",
    quote: "The content calendar feature alone is worth the subscription. Planning a month of content now takes me 30 minutes instead of all day.",
    author: "Emily Rodriguez",
    role: "Founder",
    company: "Artisan Coffee Co"
  }
];

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Loved by{" "}
            <span className="text-primary">small business owners</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See how businesses like yours are growing with ContentCreator.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id}
              className="relative"
              data-testid={`card-testimonial-${testimonial.id}`}
            >
              <CardContent className="pt-8 pb-6">
                <Quote className="h-8 w-8 text-primary/20 absolute top-4 left-4" />
                <p className="text-muted-foreground mb-6 relative z-10">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.author.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
