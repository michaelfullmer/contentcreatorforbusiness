import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Eye,
  ThumbsUp,
  Share2,
  MessageSquare,
  FileText,
  Instagram,
  Mail
} from "lucide-react";
import { useState } from "react";

const overviewStats = [
  {
    title: "Total Views",
    value: "12,847",
    change: "+18.2%",
    trend: "up",
    icon: Eye
  },
  {
    title: "Engagement",
    value: "3,428",
    change: "+12.5%",
    trend: "up",
    icon: ThumbsUp
  },
  {
    title: "Shares",
    value: "892",
    change: "+8.3%",
    trend: "up",
    icon: Share2
  },
  {
    title: "Comments",
    value: "456",
    change: "-2.1%",
    trend: "down",
    icon: MessageSquare
  }
];

const topContent = [
  {
    id: "1",
    title: "Holiday Sale Announcement",
    type: "social",
    views: 4523,
    engagement: "8.2%"
  },
  {
    id: "2",
    title: "Product Launch Email",
    type: "email",
    views: 3241,
    engagement: "12.4%"
  },
  {
    id: "3",
    title: "Year in Review Blog Post",
    type: "blog",
    views: 2187,
    engagement: "5.6%"
  },
  {
    id: "4",
    title: "Black Friday Promo",
    type: "social",
    views: 1892,
    engagement: "7.8%"
  },
  {
    id: "5",
    title: "Welcome Newsletter",
    type: "email",
    views: 1456,
    engagement: "15.2%"
  }
];

const typeIcons: Record<string, React.ElementType> = {
  social: Instagram,
  email: Mail,
  blog: FileText
};

const weeklyData = [
  { day: "Mon", posts: 3, engagement: 245 },
  { day: "Tue", posts: 2, engagement: 189 },
  { day: "Wed", posts: 4, engagement: 312 },
  { day: "Thu", posts: 2, engagement: 178 },
  { day: "Fri", posts: 5, engagement: 423 },
  { day: "Sat", posts: 1, engagement: 87 },
  { day: "Sun", posts: 2, engagement: 156 }
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("7d");

  const maxEngagement = Math.max(...weeklyData.map(d => d.engagement));

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your content performance and engagement.</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px]" data-testid="select-time-range">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat) => (
          <Card key={stat.title} data-testid={`stat-${stat.title.toLowerCase().replace(/\s+/g, "-")}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
                <Badge 
                  variant={stat.trend === "up" ? "default" : "secondary"}
                  className="gap-1"
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
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

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Weekly Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-2">
              {weeklyData.map((data) => (
                <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-primary/20 rounded-t-md relative overflow-hidden"
                    style={{ height: `${(data.engagement / maxEngagement) * 200}px` }}
                  >
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-md"
                      style={{ height: `${(data.engagement / maxEngagement) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{data.day}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t border-border">
              <div>
                <p className="text-sm text-muted-foreground">Total Posts</p>
                <p className="text-lg font-semibold">{weeklyData.reduce((acc, d) => acc + d.posts, 0)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Engagement</p>
                <p className="text-lg font-semibold">{weeklyData.reduce((acc, d) => acc + d.engagement, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
            <CardTitle className="text-lg font-semibold">Top Performing Content</CardTitle>
            <Button variant="ghost" size="sm" data-testid="button-view-all-analytics">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {topContent.map((content, index) => {
              const IconComponent = typeIcons[content.type] || FileText;
              return (
                <div 
                  key={content.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  data-testid={`top-content-${content.id}`}
                >
                  <span className="text-lg font-bold text-muted-foreground w-6">
                    {index + 1}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconComponent className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{content.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{content.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{content.views.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{content.engagement}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Content Performance by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-violet-500 flex items-center justify-center">
                  <Instagram className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Social Media</p>
                  <p className="text-sm text-muted-foreground">24 posts</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg. Engagement</span>
                  <span className="font-medium">7.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Reach</span>
                  <span className="font-medium">45.2K</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-sm text-muted-foreground">12 campaigns</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Open Rate</span>
                  <span className="font-medium">24.8%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Click Rate</span>
                  <span className="font-medium">3.2%</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Blog</p>
                  <p className="text-sm text-muted-foreground">8 articles</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg. Read Time</span>
                  <span className="font-medium">4.5 min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Views</span>
                  <span className="font-medium">12.8K</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
