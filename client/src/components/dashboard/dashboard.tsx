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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card className="modern-card overflow-hidden group">
          <CardContent className="p-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Total Score</p>
                <p className="text-3xl font-bold text-primary" data-testid="stat-total-score">
                  {userStats?.totalScore?.toLocaleString() || 0}
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 float">
                <Star className="text-primary h-8 w-8" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-primary/60" />
                <span>Total points earned</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="modern-card overflow-hidden group">
          <CardContent className="p-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Quizzes Taken</p>
                <p className="text-3xl font-bold text-accent" data-testid="stat-quizzes-taken">
                  {userStats?.quizzesTaken || 0}
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 float">
                <ClipboardList className="text-accent h-8 w-8" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-accent/60" />
                <span>Quizzes completed</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="modern-card overflow-hidden group">
          <CardContent className="p-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Current Rank</p>
                <p className="text-3xl font-bold text-secondary" data-testid="stat-current-rank">
                  {userStats?.rank ? `#${userStats.rank}` : "Unranked"}
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 float">
                <Medal className="text-secondary h-8 w-8" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-secondary/60" />
                <span>Global leaderboard</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Start Quiz */}
        <Card className="modern-card overflow-hidden">
          <CardContent className="p-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                <Calendar className="mr-3 h-6 w-6 text-primary" />
                Quick Start
              </h2>
              <div className="text-center p-8 glass-effect rounded-2xl">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4 float">
                    <Play className="h-10 w-10 text-primary" />
                  </div>
                  <div className="absolute inset-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mx-auto blur-xl opacity-60" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Ready for a Challenge?</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Test your knowledge with AI-generated questions across multiple categories
                </p>
                <Button 
                  onClick={onStartQuiz} 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 pulse-glow"
                  data-testid="button-start-quiz"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Quiz
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="modern-card overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Clock className="text-secondary mr-2 h-5 w-5" />
              Recent Activity
            </h2>
            <div className="h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              <div className="space-y-3">
                {historyLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-16 bg-muted rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : quizHistory && quizHistory.length > 0 ? (
                  quizHistory.slice(0, 10).map((attempt, index) => (
                    <div key={attempt.id} className="glass-effect p-4 rounded-lg hover:bg-primary/5 transition-all duration-200 group" data-testid={`activity-${attempt.id}`}>
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-2 rounded-full group-hover:scale-110 transition-transform duration-200">
                          <CheckCircle className="text-primary h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-foreground">Quiz #{index + 1}</p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(attempt.completedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                              {attempt.score}% Score
                            </span>
                            <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full font-medium">
                              +{attempt.pointsEarned} pts
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 glass-effect rounded-lg">
                    <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-sm text-muted-foreground mb-2">No quiz activity yet</p>
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
