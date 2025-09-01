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
    <div className="space-y-8 relative">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-40 h-40 rounded-full bg-primary/3 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-60 h-60 rounded-full bg-accent/3 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/2 blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Header */}
      <div className="mb-8 relative z-10">
        <h1 className="text-4xl font-bold gradient-text mb-3 animate-gradient-x">
          Welcome back, <span data-testid="text-welcome-username" className="animate-bounce inline-block">{user?.username}</span>!
        </h1>
        <p className="text-muted-foreground text-lg">Ready to challenge your knowledge today?</p>
        <div className="mt-4 h-1 w-32 bg-gradient-to-r from-primary via-accent to-primary rounded-full pulse-glow"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 relative z-10">
        <Card className="glass-morphism border-0 overflow-hidden group hover:scale-105 transition-all duration-500 enhanced-glow">
          <CardContent className="p-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Total Score</p>
                <p className="text-4xl font-black text-primary mb-2 sparkle" data-testid="stat-total-score">
                  {userStats?.totalScore?.toLocaleString() || 0}
                </p>
                <div className="h-1 w-20 bg-gradient-to-r from-primary to-transparent rounded-full"></div>
              </div>
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 float shadow-lg shadow-primary/25">
                <Star className="text-primary h-10 w-10 sparkle" />
              </div>
            </div>
            <div className="mt-6 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary/60 pulse-glow" />
                <span className="font-medium">Total points earned across all quizzes</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism border-0 overflow-hidden group hover:scale-105 transition-all duration-500 enhanced-glow">
          <CardContent className="p-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors duration-500" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Quizzes Taken</p>
                <p className="text-4xl font-black text-accent mb-2 sparkle" data-testid="stat-quizzes-taken">
                  {userStats?.quizzesTaken || 0}
                </p>
                <div className="h-1 w-20 bg-gradient-to-r from-accent to-transparent rounded-full"></div>
              </div>
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent/20 to-accent/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 float shadow-lg shadow-accent/25">
                <ClipboardList className="text-accent h-10 w-10 sparkle" />
              </div>
            </div>
            <div className="mt-6 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-accent/60 pulse-glow" />
                <span className="font-medium">Total quizzes completed successfully</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism border-0 overflow-hidden group hover:scale-105 transition-all duration-500 enhanced-glow">
          <CardContent className="p-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl group-hover:bg-yellow-500/10 transition-colors duration-500" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Current Rank</p>
                <p className="text-4xl font-black text-yellow-500 mb-2 sparkle" data-testid="stat-current-rank">
                  {userStats?.rank ? `#${userStats.rank}` : "Unranked"}
                </p>
                <div className="h-1 w-20 bg-gradient-to-r from-yellow-500 to-transparent rounded-full"></div>
              </div>
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 float shadow-lg shadow-yellow-500/25">
                <Medal className="text-yellow-500 h-10 w-10 sparkle" />
              </div>
            </div>
            <div className="mt-6 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500/60 pulse-glow" />
                <span className="font-medium">Position on global leaderboard</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Start Quiz */}
        <Card className="glass-morphism border-0 overflow-hidden group hover:scale-[1.02] transition-all duration-500 enhanced-glow">
          <CardContent className="p-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8" />
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold gradient-text mb-8 flex items-center animate-gradient-x">
                <Calendar className="mr-4 h-8 w-8 text-primary sparkle" />
                Quick Start
              </h2>
              <div className="text-center p-10 glass-morphism rounded-3xl border border-primary/20 group-hover:border-primary/40 transition-all duration-500">
                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mx-auto mb-6 float shadow-2xl shadow-primary/20">
                    <Play className="h-12 w-12 text-primary sparkle" />
                  </div>
                  <div className="absolute inset-0 w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 mx-auto blur-2xl opacity-80 pulse-glow" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Ready for a Challenge?</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                  Test your knowledge with AI-generated questions across multiple categories
                </p>
                <Button 
                  onClick={onStartQuiz} 
                  className="w-full btn-primary enhanced-glow relative overflow-hidden py-6 text-lg font-bold rounded-2xl"
                  data-testid="button-start-quiz"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <Play className="mr-3 h-6 w-6" />
                    Start Quiz
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-morphism border-0 overflow-hidden group hover:scale-[1.02] transition-all duration-500 enhanced-glow">
          <CardContent className="p-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold gradient-text mb-6 flex items-center animate-gradient-x">
                <Clock className="text-accent mr-4 h-8 w-8 sparkle" />
                Recent Activity
              </h2>
              <div className="h-80 overflow-y-auto pr-4 scrollbar-thin">
                <div className="space-y-4">
                  {historyLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-20 glass-effect rounded-2xl loading-shimmer"></div>
                      ))}
                    </div>
                  ) : quizHistory && quizHistory.length > 0 ? (
                    quizHistory.slice(0, 10).map((attempt, index) => (
                      <div key={attempt.id} className="glass-morphism p-6 rounded-2xl hover:border-primary/40 border border-primary/20 transition-all duration-300 group interactive-card" data-testid={`activity-${attempt.id}`}>
                        <div className="flex items-center space-x-4">
                          <div className="bg-gradient-to-br from-primary/30 to-accent/30 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20">
                            <CheckCircle className="text-primary h-6 w-6 sparkle" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-base font-bold text-foreground">Quiz #{index + 1}</p>
                              <span className="text-sm text-muted-foreground font-medium">
                                {new Date(attempt.completedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm px-4 py-2 bg-gradient-to-r from-primary/20 to-primary/30 text-primary rounded-2xl font-bold border border-primary/20">
                                {attempt.score}% Score
                              </span>
                              <span className="text-sm px-4 py-2 bg-gradient-to-r from-accent/20 to-accent/30 text-accent rounded-2xl font-bold border border-accent/20">
                                +{attempt.pointsEarned} pts
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 glass-morphism rounded-2xl border border-primary/20">
                      <div className="relative mb-6">
                        <Trophy className="h-16 w-16 text-muted-foreground mx-auto opacity-50 float" />
                        <div className="absolute inset-0 h-16 w-16 mx-auto blur-xl bg-primary/20 rounded-full"></div>
                      </div>
                      <p className="text-lg text-muted-foreground mb-3 font-semibold">No quiz activity yet</p>
                      <p className="text-sm text-muted-foreground">Take your first quiz to see your activity here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
