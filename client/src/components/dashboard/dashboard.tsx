import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ClipboardList, Medal, Calendar, Clock, CheckCircle, Trophy, Play } from "lucide-react";
import type { UserWithStats, QuizAttempt } from "@shared/schema";

interface DashboardProps {
  onStartQuiz: () => void;
}

export default function Dashboard({ onStartQuiz }: DashboardProps) {
  const { user } = useAuth();

  const { data: userStats, isLoading: statsLoading } = useQuery<UserWithStats>({
    queryKey: ["/api/profile"],
    enabled: !!user,
  });

  const { data: quizHistory, isLoading: historyLoading } = useQuery<QuizAttempt[]>({
    queryKey: ["/api/quiz-history"],
    enabled: !!user,
  });

  if (statsLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const recentActivity = quizHistory?.slice(0, 3) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, <span data-testid="text-welcome-username">{user?.username}</span>!
        </h1>
        <p className="text-muted-foreground">Ready to challenge your knowledge today?</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label mb-2">Total Score</p>
                <p className="stat-value" data-testid="stat-total-score">
                  {userStats?.totalScore?.toLocaleString() || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Star className="text-primary h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label mb-2">Quizzes Taken</p>
                <p className="stat-value" data-testid="stat-quizzes-taken">
                  {userStats?.quizzesTaken || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ClipboardList className="text-primary h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label mb-2">Current Rank</p>
                <p className="stat-value" data-testid="stat-current-rank">
                  {userStats?.rank ? `#${userStats.rank}` : "Unranked"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Medal className="text-primary h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Start Quiz */}
        <Card className="card">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Play className="mr-3 h-5 w-5 text-primary" />
              Quick Start
            </h2>
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Ready for a Challenge?</h3>
              <p className="text-muted-foreground mb-6">
                Test your knowledge with AI-generated questions across multiple categories
              </p>
              <Button 
                onClick={onStartQuiz} 
                className="w-full btn-primary"
                data-testid="button-start-quiz"
              >
                <Play className="mr-2 h-4 w-4" />
                Start Quiz
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="card">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Clock className="text-primary mr-3 h-5 w-5" />
              Recent Activity
            </h2>
            <div className="h-80 overflow-y-auto">
              <div className="space-y-3">
                {historyLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-16 bg-muted rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : quizHistory && quizHistory.length > 0 ? (
                  quizHistory.slice(0, 10).map((attempt, index) => (
                    <div key={attempt.id} className="bg-muted/50 p-4 rounded-lg hover:bg-muted transition-colors" data-testid={`activity-${attempt.id}`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <CheckCircle className="text-primary h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-foreground">Quiz #{index + 1}</p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(attempt.completedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md font-medium">
                              {attempt.score}% Score
                            </span>
                            <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded-md font-medium">
                              +{attempt.pointsEarned} pts
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-muted/50 rounded-lg">
                    <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-1">No quiz activity yet</p>
                    <p className="text-xs text-muted-foreground">Take your first quiz to see your activity here</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
