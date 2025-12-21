import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import DashboardHome from "@/pages/dashboard/index";
import CreateContent from "@/pages/dashboard/create";
import ContentLibrary from "@/pages/dashboard/content";
import ContentCalendar from "@/pages/dashboard/calendar";
import Analytics from "@/pages/dashboard/analytics";
import BrandProfile from "@/pages/dashboard/brand";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-4 px-4 h-14 border-b border-border shrink-0 sticky top-0 z-50 bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard">
        <DashboardLayout>
          <DashboardHome />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/create">
        <DashboardLayout>
          <CreateContent />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/content">
        <DashboardLayout>
          <ContentLibrary />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/calendar">
        <DashboardLayout>
          <ContentCalendar />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/analytics">
        <DashboardLayout>
          <Analytics />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/brand">
        <DashboardLayout>
          <BrandProfile />
        </DashboardLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
