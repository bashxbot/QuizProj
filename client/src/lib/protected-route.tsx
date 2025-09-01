import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Route, Redirect } from "wouter";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType<any>;
}

export function ProtectedRoute({ 
  path, 
  component: Component 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/80 to-primary/5">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-transparent border-t-primary border-r-accent"></div>
          <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-primary/20 to-accent/20"></div>
        </div>
      </div>
    );
  }

  return (
    <Route path={path}>
      {user ? <Component /> : <Redirect to="/auth" />}
    </Route>
  );
}