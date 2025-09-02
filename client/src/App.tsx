import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { QuizProvider } from "@/hooks/use-quiz-state"; // Import QuizProvider
import { ProtectedRoute } from "./lib/protected-route";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found"; // Assuming NotFoundPage is actually NotFound

function Router() {
  return (
    <QuizProvider>
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <ProtectedRoute path="/" component={HomePage} />
        <ProtectedRoute path="/dashboard" component={HomePage} />
        <ProtectedRoute path="/quiz" component={HomePage} />
        <ProtectedRoute path="/leaderboard" component={HomePage} />
        <ProtectedRoute path="/profile" component={HomePage} />
        <ProtectedRoute path="/stats" component={HomePage} />
        <ProtectedRoute path="/settings" component={HomePage} />
        <ProtectedRoute path="/achievements" component={HomePage} />
        <Route component={NotFound} />
      </Switch>
    </QuizProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;