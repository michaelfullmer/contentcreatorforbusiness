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
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  Copy, 
  Download, 
  RefreshCw,
  Instagram,
  Mail,
  FileText,
  Presentation,
  Wand2,
  Loader2,
  Lock,
  Linkedin,
  Twitter,
  Facebook,
  Send,
  Newspaper,
  Tag,
  UserCheck,
  BookOpen,
  ListOrdered,
  Star,
  TrendingUp,
  Target,
  Users,
  Building
} from "lucide-react";
import type { TemplateCategory, Template } from "@shared/schema";

// Map template thumbnails to icons and colors
const templateIconMap: Record<string, { icon: React.ElementType; color: string }> = {
  instagram: { icon: Instagram, color: "text-pink-500" },
  linkedin: { icon: Linkedin, color: "text-blue-600" },
  twitter: { icon: Twitter, color: "text-sky-500" },
  facebook: { icon: Facebook, color: "text-blue-500" },
  welcome: { icon: Send, color: "text-green-500" },
  newsletter: { icon: Newspaper, color: "text-orange-500" },
  promo: { icon: Tag, color: "text-purple-500" },
  reengagement: { icon: UserCheck, color: "text-teal-500" },
  howto: { icon: BookOpen, color: "text-indigo-500" },
  listicle: { icon: ListOrdered, color: "text-amber-500" },
  review: { icon: Star, color: "text-yellow-500" },
  news: { icon: TrendingUp, color: "text-red-500" },
  pitch: { icon: Target, color: "text-emerald-500" },
  sales: { icon: Users, color: "text-cyan-500" },
  company: { icon: Building, color: "text-slate-500" },
};

const contentTypes: { value: TemplateCategory; label: string; icon: React.ElementType; description: string }[] = [
  { value: "social", label: "Social Media Post", icon: Instagram, description: "Instagram, Facebook, LinkedIn, Twitter" },
  { value: "email", label: "Email", icon: Mail, description: "Newsletters, promotional emails, updates" },
  { value: "blog", label: "Blog Article", icon: FileText, description: "Blog posts, articles, guides" },
  { value: "presentation", label: "Presentation", icon: Presentation, description: "Pitch decks, slide content" },
];

const toneOptions = [
  "Professional",
  "Casual",
  "Friendly",
  "Formal",
  "Persuasive",
  "Informative",
  "Humorous",
  "Inspirational"
];

export default function CreateContent() {
  const { toast } = useToast();
  const [contentType, setContentType] = useState<TemplateCategory>("social");
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Professional");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const { data: templates = [] } = useQuery<Template[]>({
    queryKey: ["/api/templates"]
  });

  const filteredTemplates = templates.filter(t => t.category === contentType);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Describe what content you want to create.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedContent("");

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          contentType,
          tone
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  setGeneratedContent(prev => prev + data.content);
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      toast({
        title: "Content generated!",
        description: "Your content is ready. You can copy or edit it."
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

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard."
    });
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "content"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded",
      description: "Content has been downloaded as a text file."
    });
  };

  const handleTemplateSelect = (template: Template) => {
    if (template.isPremium) {
      toast({
        title: "Premium Template",
        description: "Upgrade to a paid plan to unlock this template.",
        variant: "destructive"
      });
      return;
    }
    setSelectedTemplate(template);
    setPrompt(`Create a ${template.name}: ${template.description}`);
  };

  const handleSave = async () => {
    if (!generatedContent.trim() || !title.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a title and generate content first.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: generatedContent,
          category: contentType,
          status: "draft"
        })
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      toast({
        title: "Content saved!",
        description: "Your content has been saved as a draft."
      });
    } catch {
      toast({
        title: "Save failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold">Create Content</h1>
        <p className="text-muted-foreground">Use AI to generate professional content in seconds.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                Content Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Content Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {contentTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setContentType(type.value)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        contentType === type.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      data-testid={`button-type-${type.value}`}
                    >
                      <type.icon className={`h-5 w-5 mb-2 ${contentType === type.value ? "text-primary" : "text-muted-foreground"}`} />
                      <p className="font-medium text-sm">{type.label}</p>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Template (Optional)</Label>
                <ScrollArea className="h-32 border border-border rounded-lg p-2">
                  <div className="space-y-1">
                    {filteredTemplates.length === 0 ? (
                      <p className="text-sm text-muted-foreground p-2">No templates for this category</p>
                    ) : (
                      filteredTemplates.map((template) => {
                        const iconConfig = templateIconMap[template.thumbnail] || { icon: FileText, color: "text-muted-foreground" };
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
                            data-testid={`button-template-${template.id}`}
                          >
                            <div className={`shrink-0 w-8 h-8 rounded-md flex items-center justify-center bg-muted ${iconConfig.color}`}>
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{template.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{template.description}</p>
                            </div>
                            {template.isPremium && (
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
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger data-testid="select-tone">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {toneOptions.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title (for saving)</Label>
                <Input
                  id="title"
                  placeholder="e.g., Holiday Sale Announcement"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  data-testid="input-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Describe your content</Label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., Write a social media post announcing our 25% holiday sale. Mention free shipping on orders over $50 and that the sale ends December 31st."
                  rows={5}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  data-testid="input-prompt"
                />
              </div>

              <Button 
                onClick={handleGenerate} 
                className="w-full gap-2"
                disabled={isGenerating}
                data-testid="button-generate"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-4 flex flex-row items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Generated Content
              </CardTitle>
              {generatedContent && (
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={handleCopy} data-testid="button-copy">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleGenerate} data-testid="button-regenerate">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {generatedContent ? (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 p-4 rounded-lg bg-muted/50 border border-border mb-4 overflow-auto">
                    <pre className="whitespace-pre-wrap text-sm font-sans">{generatedContent}</pre>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button onClick={handleSave} className="flex-1 gap-2" data-testid="button-save">
                      Save as Draft
                    </Button>
                    <Button variant="outline" onClick={handleCopy} className="gap-2" data-testid="button-copy-main">
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                    <Button variant="outline" onClick={handleDownload} className="gap-2" data-testid="button-download">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center p-8">
                  <div>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-muted-foreground mb-2">Your generated content will appear here</p>
                    <p className="text-sm text-muted-foreground">Fill in the details and click "Generate Content"</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
