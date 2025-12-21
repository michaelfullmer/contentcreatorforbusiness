import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Instagram,
  Mail,
  FileText
} from "lucide-react";
import { Link } from "wouter";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface ScheduledContent {
  id: string;
  title: string;
  type: "social" | "email" | "blog";
  time: string;
}

const scheduledContent: Record<string, ScheduledContent[]> = {
  "2025-12-23": [
    { id: "1", title: "Holiday Sale Post", type: "social", time: "10:00 AM" }
  ],
  "2025-12-24": [
    { id: "2", title: "Christmas Eve Newsletter", type: "email", time: "9:00 AM" }
  ],
  "2025-12-25": [
    { id: "3", title: "Christmas Greetings", type: "social", time: "8:00 AM" }
  ],
  "2025-12-27": [
    { id: "4", title: "Year in Review Blog", type: "blog", time: "2:00 PM" }
  ],
  "2025-12-30": [
    { id: "5", title: "New Year Sale Promo", type: "social", time: "11:00 AM" },
    { id: "6", title: "Newsletter Recap", type: "email", time: "3:00 PM" }
  ]
};

const typeIcons = {
  social: Instagram,
  email: Mail,
  blog: FileText
};

const typeColors = {
  social: "bg-violet-500",
  email: "bg-blue-500",
  blog: "bg-emerald-500"
};

export default function ContentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 21)); // December 2025

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDayContent = (day: number) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return scheduledContent[dateKey] || [];
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 md:h-32 border-b border-r border-border bg-muted/30" />
      );
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const content = getDayContent(day);
      const isToday = day === 21 && month === 11 && year === 2025;
      
      days.push(
        <div 
          key={day} 
          className={`h-24 md:h-32 border-b border-r border-border p-1 md:p-2 overflow-hidden ${isToday ? "bg-primary/5" : ""}`}
          data-testid={`calendar-day-${day}`}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : ""}`}>
            {day}
          </div>
          <div className="space-y-1">
            {content.slice(0, 2).map((item) => {
              const IconComponent = typeIcons[item.type];
              return (
                <div 
                  key={item.id}
                  className={`flex items-center gap-1 p-1 rounded text-xs ${typeColors[item.type]} text-white truncate`}
                >
                  <IconComponent className="h-3 w-3 shrink-0" />
                  <span className="truncate hidden md:inline">{item.title}</span>
                </div>
              );
            })}
            {content.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{content.length - 2} more
              </Badge>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  const upcomingContent = Object.entries(scheduledContent)
    .flatMap(([date, items]) => items.map(item => ({ ...item, date })))
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold">Content Calendar</h1>
          <p className="text-muted-foreground">Plan and schedule your content ahead of time.</p>
        </div>
        <Link href="/dashboard/create">
          <Button className="gap-2" data-testid="button-schedule-content">
            <Plus className="h-4 w-4" />
            Schedule Content
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
            <CardTitle className="text-lg font-semibold">
              {months[month]} {year}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={previousMonth} data-testid="button-prev-month">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth} data-testid="button-next-month">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-7 border-t border-l border-border">
              {daysOfWeek.map((day) => (
                <div 
                  key={day} 
                  className="p-2 text-center text-sm font-medium bg-muted/50 border-b border-r border-border"
                >
                  {day}
                </div>
              ))}
              {renderCalendarDays()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Upcoming</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingContent.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No scheduled content
              </p>
            ) : (
              upcomingContent.map((item) => {
                const IconComponent = typeIcons[item.type];
                return (
                  <div 
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    data-testid={`upcoming-${item.id}`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${typeColors[item.type]} flex items-center justify-center shrink-0`}>
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} at {item.time}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
