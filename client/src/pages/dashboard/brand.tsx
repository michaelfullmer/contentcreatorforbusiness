import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Building2, Palette, Users, MessageSquare, Loader2, Save } from "lucide-react";
import type { BrandProfile } from "@shared/schema";

const brandProfileFormSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().optional(),
  targetAudience: z.string().optional(),
  brandVoice: z.string().optional(),
  keyMessages: z.string().optional(),
  brandColors: z.string().optional(),
});

type BrandProfileFormValues = z.infer<typeof brandProfileFormSchema>;

const industries = [
  "Retail & E-commerce",
  "Professional Services",
  "Healthcare",
  "Technology",
  "Food & Beverage",
  "Real Estate",
  "Education",
  "Fitness & Wellness",
  "Beauty & Fashion",
  "Home Services",
  "Other"
];

const voiceOptions = [
  "Professional & Authoritative",
  "Friendly & Approachable",
  "Playful & Fun",
  "Sophisticated & Elegant",
  "Bold & Energetic",
  "Calm & Reassuring",
  "Innovative & Forward-thinking"
];

export default function BrandProfile() {
  const { toast } = useToast();

  const { data: profile, isLoading } = useQuery<BrandProfile | null>({
    queryKey: ["/api/brand-profile"]
  });

  const form = useForm<BrandProfileFormValues>({
    resolver: zodResolver(brandProfileFormSchema),
    defaultValues: {
      businessName: "",
      industry: "",
      targetAudience: "",
      brandVoice: "",
      keyMessages: "",
      brandColors: "",
    }
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        businessName: profile.businessName || "",
        industry: profile.industry || "",
        targetAudience: profile.targetAudience || "",
        brandVoice: profile.brandVoice || "",
        keyMessages: profile.keyMessages || "",
        brandColors: profile.brandColors || "",
      });
    }
  }, [profile, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: BrandProfileFormValues) => {
      await apiRequest("POST", "/api/brand-profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brand-profile"] });
      toast({
        title: "Profile saved",
        description: "Your brand profile has been updated successfully."
      });
    },
    onError: () => {
      toast({
        title: "Save failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: BrandProfileFormValues) => {
    saveMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold">Brand Profile</h1>
        <p className="text-muted-foreground">Define your brand identity to generate consistent, on-brand content.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Business Information
                </CardTitle>
                <CardDescription>Tell us about your business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Acme Coffee Co." {...field} data-testid="input-business-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-industry">
                            <SelectValue placeholder="Select your industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Target Audience
                </CardTitle>
                <CardDescription>Who are you trying to reach?</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Audience Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g., Small business owners aged 30-50 who value quality and convenience. They're busy professionals looking for ways to save time..."
                          rows={6}
                          {...field}
                          data-testid="input-target-audience"
                        />
                      </FormControl>
                      <FormDescription>
                        Describe your ideal customers - their demographics, interests, and pain points.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Brand Voice
                </CardTitle>
                <CardDescription>How should your content sound?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="brandVoice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voice & Tone</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-brand-voice">
                            <SelectValue placeholder="Select your brand voice" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {voiceOptions.map((voice) => (
                            <SelectItem key={voice} value={voice}>{voice}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keyMessages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Messages</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g., Quality ingredients, locally sourced. Fast and friendly service. Making mornings better since 2015."
                          rows={4}
                          {...field}
                          data-testid="input-key-messages"
                        />
                      </FormControl>
                      <FormDescription>
                        List the main messages you want to convey in your content.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Visual Identity
                </CardTitle>
                <CardDescription>Your brand&apos;s visual elements</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="brandColors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Colors</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Navy blue, gold, white"
                          {...field}
                          data-testid="input-brand-colors"
                        />
                      </FormControl>
                      <FormDescription>
                        List your primary brand colors for content styling suggestions.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="gap-2" disabled={saveMutation.isPending} data-testid="button-save-brand">
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Brand Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
