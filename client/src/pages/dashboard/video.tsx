import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Video, 
  Wand2,
  Loader2,
  Lock,
  Play,
  Download,
  Film,
  Smartphone,
  Monitor,
  Sparkles,
  FileText
} from "lucide-react";
import type { TemplateCategory, Template } from "@shared/schema";

interface SubscriptionData {
  plan: string;
  limits: {
    contentGenerationsPerMonth: number;
    templatesAccess: string;
  };
  usage: {
    contentGenerationsUsed: number;
  };
}

const aspectRatios = [
  { value: "16:9", label: "Landscape (16:9)", icon: Monitor, description: "YouTube, presentations" },
  { value: "9:16", label: "Portrait (9:16)", icon: Smartphone, description: "TikTok, Reels, Stories" },
  { value: "1:1", label: "Square (1:1)", icon: Film, description: "Instagram feed" },
];

const durations = [
  { value: "4", label: "4 seconds" },
  { value: "6", label: "6 seconds" },
  { value: "8", label: "8 seconds" },
];

const videoIconMap: Record<string, { icon: React.ElementType; color: string }> = {
  promo_video: { icon: Film, color: "text-violet-500" },
  reel: { icon: Smartphone, color: "text-pink-500" },
  explainer: { icon: Play, color: "text-blue-500" },
  testimonial: { icon: Video, color: "text-green-500" },
  brand_story: { icon: Sparkles, color: "text-amber-500" },
};

export default function VideoGeneration() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"ai" | "template">("ai");
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [duration, setDuration] = useState("6");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [textOverlay, setTextOverlay] = useState("");

  const { data: templates = [] } = useQuery<Template[]>({
    queryKey: ["/api/templates"]
  });

  const { data: subscription } = useQuery<SubscriptionData>({
    queryKey: ["/api/subscription"]
  });

  const canAccessPremium = subscription?.plan === 'pro' || subscription?.plan === 'enterprise' || subscription?.plan === 'enterprise_plus';
  const videoTemplates = templates.filter(t => t.category === "video");

  const handleAIGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Describe the video you want to create.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedVideoUrl(null);

    try {
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          duration: parseInt(duration),
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          toast({
            title: "Login required",
            description: "Please log in to generate videos.",
            variant: "destructive"
          });
          return;
        }
        if (response.status === 403) {
          toast({
            title: "Upgrade required",
            description: errorData.error || "Video generation requires a paid plan.",
            variant: "destructive"
          });
          return;
        }
        throw new Error(errorData.error || "Failed to generate video");
      }

      const data = await response.json();
      setGeneratedVideoUrl(data.videoUrl);
      
      toast({
        title: "Video generated!",
        description: "Your video is ready to preview and download."
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateGenerate = async () => {
    if (!selectedTemplate) {
      toast({
        title: "Select a template",
        description: "Please choose a video template first.",
        variant: "destructive"
      });
      return;
    }

    if (!textOverlay.trim()) {
      toast({
        title: "Enter your text",
        description: "Add text content for your video.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedVideoUrl(null);

    try {
      const response = await fetch("/api/generate-video-from-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          textContent: textOverlay,
          aspectRatio,
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate video");
      }

      const data = await response.json();
      setGeneratedVideoUrl(data.videoUrl);
      
      toast({
        title: "Video created!",
        description: "Your video from template is ready."
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateSelect = (template: Template) => {
    if (template.isPremium && !canAccessPremium) {
      toast({
        title: "Premium Template",
        description: "Upgrade to Pro or Enterprise to unlock this template.",
        variant: "destructive"
      });
      return;
    }
    setSelectedTemplate(template);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold">Create Video</h1>
        <p className="text-muted-foreground">Generate professional videos with AI or use templates.</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "ai" | "template")}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="ai" className="gap-2" data-testid="tab-ai-video">
            <Wand2 className="h-4 w-4" />
            AI Video
          </TabsTrigger>
          <TabsTrigger value="template" className="gap-2" data-testid="tab-template-video">
            <FileText className="h-4 w-4" />
            Text to Video
          </TabsTrigger>
        </TabsList>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <TabsContent value="ai" className="mt-0 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  AI Video Generation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Aspect Ratio</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {aspectRatios.map((ratio) => (
                      <button
                        key={ratio.value}
                        onClick={() => setAspectRatio(ratio.value)}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          aspectRatio === ratio.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        data-testid={`button-ratio-${ratio.value}`}
                      >
                        <ratio.icon className={`h-5 w-5 mx-auto mb-1 ${aspectRatio === ratio.value ? "text-primary" : "text-muted-foreground"}`} />
                        <p className="font-medium text-xs">{ratio.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger data-testid="select-duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map((d) => (
                        <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt">Describe your video</Label>
                  <Textarea
                    id="prompt"
                    placeholder="e.g., A cinematic shot of coffee being poured into a cup with steam rising, warm lighting, professional look"
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    data-testid="input-video-prompt"
                  />
                </div>

                <Button 
                  onClick={handleAIGenerate} 
                  className="w-full gap-2"
                  disabled={isGenerating}
                  data-testid="button-generate-ai-video"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating video...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate AI Video
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="template" className="mt-0 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Film className="h-5 w-5 text-primary" />
                  Text to Video Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Choose Template</Label>
                  <ScrollArea className="h-40 border border-border rounded-lg p-2">
                    <div className="space-y-1">
                      {videoTemplates.length === 0 ? (
                        <p className="text-sm text-muted-foreground p-2">No video templates available</p>
                      ) : (
                        videoTemplates.map((template) => {
                          const iconConfig = videoIconMap[template.thumbnail] || { icon: Video, color: "text-muted-foreground" };
                          const IconComponent = iconConfig.icon;
                          return (
                            <button
                              key={template.id}
                              onClick={() => handleTemplateSelect(template)}
                              className={`w-full p-2 rounded-md text-left flex items-center gap-3 transition-all ${
                                selectedTemplate?.id === template.id
                                  ? "bg-primary/10 border border-primary"
                                  : "hover:bg-muted"
                              }`}
                              data-testid={`button-video-template-${template.id}`}
                            >
                              <div className={`shrink-0 w-8 h-8 rounded-md flex items-center justify-center bg-muted ${iconConfig.color}`}>
                                <IconComponent className="h-4 w-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">{template.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{template.description}</p>
                              </div>
                              {template.isPremium && !canAccessPremium && (
                                <Badge variant="secondary" className="shrink-0 gap-1">
                                  <Lock className="h-3 w-3" />
                                  Pro
                                </Badge>
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </div>

                <div className="space-y-2">
                  <Label>Aspect Ratio</Label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger data-testid="select-template-ratio">
                      <SelectValue placeholder="Select aspect ratio" />
                    </SelectTrigger>
                    <SelectContent>
                      {aspectRatios.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textOverlay">Your Text Content</Label>
                  <Textarea
                    id="textOverlay"
                    placeholder="Enter the text to display in your video..."
                    rows={4}
                    value={textOverlay}
                    onChange={(e) => setTextOverlay(e.target.value)}
                    data-testid="input-text-overlay"
                  />
                </div>

                <Button 
                  onClick={handleTemplateGenerate} 
                  className="w-full gap-2"
                  disabled={isGenerating || !selectedTemplate}
                  data-testid="button-generate-template-video"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating video...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Create Video from Template
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <Card className="h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Video Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedVideoUrl ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <video 
                      src={generatedVideoUrl} 
                      controls 
                      className="w-full h-full object-contain"
                      data-testid="video-preview"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = generatedVideoUrl;
                      a.download = 'generated-video.mp4';
                      a.click();
                    }}
                    data-testid="button-download-video"
                  >
                    <Download className="h-4 w-4" />
                    Download Video
                  </Button>
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-muted/50 rounded-lg border border-dashed border-border">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Video className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-muted-foreground mb-2">Your video will appear here</p>
                    <p className="text-sm text-muted-foreground">Choose AI generation or a template to get started</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
}
