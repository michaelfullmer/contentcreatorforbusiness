import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Search, 
  Plus, 
  FileText,
  Instagram,
  Mail,
  Presentation,
  Trash2,
  Edit3,
  MoreVertical,
  Filter,
  Video
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "wouter";
import type { ContentItem, TemplateCategory } from "@shared/schema";

const categoryIcons: Record<TemplateCategory, React.ElementType> = {
  social: Instagram,
  email: Mail,
  blog: FileText,
  presentation: Presentation,
  video: Video
};

const categoryColors: Record<TemplateCategory, string> = {
  social: "bg-violet-500",
  email: "bg-blue-500",
  blog: "bg-emerald-500",
  presentation: "bg-orange-500",
  video: "bg-red-500"
};

export default function ContentLibrary() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<TemplateCategory | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "published">("all");

  const { data: contentItems = [], isLoading } = useQuery<ContentItem[]>({
    queryKey: ["/api/content"]
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/content/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "Content deleted",
        description: "The content has been removed."
      });
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  });

  const filteredContent = contentItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold">My Content</h1>
          <p className="text-muted-foreground">Manage all your generated content in one place.</p>
        </div>
        <Link href="/dashboard/create">
          <Button className="gap-2" data-testid="button-create-new">
            <Plus className="h-4 w-4" />
            Create New
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v as TemplateCategory | "all")}>
            <SelectTrigger className="w-[140px]" data-testid="select-category">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="blog">Blog</SelectItem>
              <SelectItem value="presentation">Presentation</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as "all" | "draft" | "published")}>
            <SelectTrigger className="w-[120px]" data-testid="select-status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredContent.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No content found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterCategory !== "all" || filterStatus !== "all"
                ? "Try adjusting your filters or search query."
                : "Start creating content to see it here."}
            </p>
            <Link href="/dashboard/create">
              <Button data-testid="button-create-first">Create Your First Content</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContent.map((item) => {
            const IconComponent = categoryIcons[item.category];
            const bgColor = categoryColors[item.category];
            
            return (
              <Card 
                key={item.id} 
                className="hover-elevate transition-all"
                data-testid={`card-content-${item.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" data-testid={`button-menu-${item.id}`}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2" data-testid={`button-edit-${item.id}`}>
                          <Edit3 className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="gap-2 text-destructive"
                          onClick={() => deleteMutation.mutate(item.id.toString())}
                          data-testid={`button-delete-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="font-medium mb-1 line-clamp-2" data-testid={`text-title-${item.id}`}>{item.title}</h3>
                  <p className="text-sm text-muted-foreground capitalize mb-3" data-testid={`text-category-${item.id}`}>{item.category}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant={item.status === "published" ? "default" : "secondary"} data-testid={`badge-status-${item.id}`}>
                      {item.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
