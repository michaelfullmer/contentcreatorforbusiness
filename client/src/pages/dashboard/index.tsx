import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Sparkles, 
  FileText, 
  BarChart3, 
  TrendingUp,
  Clock,
  Zap
} from "lucide-react";
import { Link } from "wouter";

const stats = [
  {
    title: "Total Content",
    value: "24",
    change: "+12%",
    icon: FileText,
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    title: "AI Generations",
    value: "156",
    change: "+28%",
    icon: Sparkles,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10"
  },
  {
    title: "Engagement Rate",
    value: "4.2%",
    change: "+0.8%",
    icon: TrendingUp,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10"
  },
  {
    title: "Time Saved",
    value: "18h",
    change: "this week",
    icon: Clock,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10"
  }
];

const recentContent = [
  {
    id: "1",
    title: "Holiday Sale Announcement",
    type: "Social Post",
    status: "published",
    createdAt: "2 hours ago"
  },
  {
    id: "2",
    title: "Weekly Newsletter - December Edition",
    type: "Email",
    status: "draft",
    createdAt: "5 hours ago"
  },
  {
    id: "3",
    title: "Product Launch: Winter Collection",
    type: "Blog Post",
    status: "published",
    createdAt: "1 day ago"
  },
  {
    id: "4",
    title: "Customer Success Story",
    type: "Case Study",
    status: "draft",
    createdAt: "2 days ago"
  }
];

const quickActions = [
  { label: "Social Post", icon: Sparkles, color: "bg-violet-500" },
  { label: "Email", icon: FileText, color: "bg-blue-500" },
  { label: "Blog Article", icon: FileText, color: "bg-emerald-500" },
  { label: "Ad Copy", icon: Zap, color: "bg-orange-500" }
];

export default function DashboardHome() {
  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
        </div>
        <Link href="/dashboard/create">
          <Button className="gap-2" data-testid="button-new-content">
            <Plus className="h-4 w-4" />
            Create Content
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} data-testid={`card-stat-${stat.title.toLowerCase().replace(/\s+/g, "-")}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
            <CardTitle className="text-lg font-semibold">Recent Content</CardTitle>
            <Link href="/dashboard/content">
              <Button variant="ghost" size="sm" data-testid="button-view-all-content">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentContent.map((content) => (
              <div 
                key={content.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover-elevate"
                data-testid={`card-recent-content-${content.id}`}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{content.title}</p>
                  <p className="text-sm text-muted-foreground">{content.type}</p>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={content.status === "published" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {content.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{content.createdAt}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Quick Create</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Link key={action.label} href="/dashboard/create">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-12"
                  data-testid={`button-quick-${action.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <span>{action.label}</span>
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
          <CardTitle className="text-lg font-semibold">Performance Overview</CardTitle>
          <Button variant="ghost" size="sm" data-testid="button-view-analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
              <p>Analytics chart will appear here</p>
              <p className="text-sm">Start creating content to see your stats</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
