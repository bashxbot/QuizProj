
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, Medal, Award, Crown, Star, Target, TrendingUp, 
  Users, Zap, Flame, Sparkles, ChevronUp, ChevronDown,
  Brain, Clock, BarChart3, Activity, Rocket, Play
} from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  username: string;
  totalQuizzes: number;
  averageScore: number;
  totalPoints: number;
}

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard"],
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return { icon: Crown, gradient: "from-yellow-400 to-orange-500", glow: "shadow-yellow-500/50" };
      case 2: return { icon: Medal, gradient: "from-gray-400 to-gray-600", glow: "shadow-gray-500/50" };
      case 3: return { icon: Award, gradient: "from-amber-600 to-yellow-700", glow: "shadow-amber-500/50" };
      default: return { icon: Star, gradient: "from-purple-500 to-pink-600", glow: "shadow-purple-500/30" };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    if (score >= 50) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "badge-success";
    if (score >= 70) return "badge-warning";
    return "badge-error";
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="content-wrapper">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-white/70">Loading leaderboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-yellow-500/25 animate-pulse-glow mx-auto">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="heading-modern mb-6">Global Leaderboard</h1>
          <p className="subheading-modern max-w-2xl mx-auto">
            Compete with quiz masters from around the world and climb the ranks!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Players", value: leaderboard?.length || 0, icon: Users, gradient: "from-blue-500 to-cyan-500" },
            { label: "Active Today", value: Math.floor((leaderboard?.length || 0) * 0.3), icon: Activity, gradient: "from-green-500 to-emerald-500" },
            { label: "Avg Score", value: `${Math.round((leaderboard?.reduce((acc, user) => acc + user.averageScore, 0) || 0) / (leaderboard?.length || 1))}%`, icon: Target, gradient: "from-purple-500 to-pink-500" },
            { label: "Top Score", value: `${Math.max(...(leaderboard?.map(u => u.averageScore) || [0]))}%`, icon: Flame, gradient: "from-orange-500 to-red-500" }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="stat-card">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-xl mb-4 group-hover:animate-float`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <div className="stat-value mb-2">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Leaderboard */}
        <div className="modern-card">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black gradient-text flex items-center">
              <BarChart3 className="mr-4 h-8 w-8 text-primary" />
              Top Performers
            </h2>
            <Badge className="badge-primary flex items-center">
              <Users className="h-4 w-4 mr-2" />
              {leaderboard?.length || 0} Players
            </Badge>
          </div>

          {leaderboard && leaderboard.length > 0 ? (
            <div className="space-y-4">
              {leaderboard.map((user, index) => {
                const rankInfo = getRankIcon(user.rank);
                const Icon = rankInfo.icon;
                
                return (
                  <div
                    key={index}
                    className={`glass-morphism p-6 rounded-2xl border border-white/10 hover:border-primary/30 transition-all duration-300 group ${
                      user.rank <= 3 ? 'border-primary/40 bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {/* Rank and User Info */}
                      <div className="flex items-center space-x-6">
                        <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${rankInfo.gradient} flex items-center justify-center shadow-xl ${rankInfo.glow} group-hover:animate-float`}>
                          <Icon className="h-8 w-8 text-white" />
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">#{user.rank}</span>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1 flex items-center">
                            {user.username}
                            {user.rank === 1 && <Crown className="h-5 w-5 ml-2 text-yellow-400 animate-bounce" />}
                            {user.rank <= 3 && <Sparkles className="h-4 w-4 ml-2 text-primary animate-sparkle" />}
                          </h3>
                          <p className="text-white/60 text-sm flex items-center">
                            <Brain className="h-4 w-4 mr-2" />
                            {user.totalQuizzes} quizzes completed
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center space-x-8">
                        {/* Average Score */}
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getScoreColor(user.averageScore)}`}>
                            {Math.round(user.averageScore)}%
                          </div>
                          <p className="text-white/50 text-xs uppercase tracking-wide">Avg Score</p>
                        </div>

                        {/* Total Points */}
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {user.totalPoints.toLocaleString()}
                          </div>
                          <p className="text-white/50 text-xs uppercase tracking-wide">Points</p>
                        </div>

                        {/* Performance Badge */}
                        <Badge className={getScoreBadge(user.averageScore)}>
                          {user.averageScore >= 90 ? 'Expert' : 
                           user.averageScore >= 70 ? 'Advanced' : 'Learning'}
                        </Badge>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 progress-container">
                      <div 
                        className="progress-bar" 
                        style={{ width: `${user.averageScore}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Trophy className="h-20 w-20 text-white/20 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white/60 mb-4">No rankings yet</h3>
              <p className="text-white/40">Be the first to complete a quiz and claim the top spot!</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="modern-card max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl mx-auto mb-6 animate-float">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold gradient-text mb-4">Ready to Climb the Ranks?</h3>
            <p className="text-white/70 mb-6">
              Take more quizzes to improve your score and move up the leaderboard!
            </p>
            <button className="btn-modern group">
              <Play className="h-5 w-5 mr-3 group-hover:animate-bounce" />
              Start New Quiz
              <Flame className="h-5 w-5 ml-3 group-hover:animate-pulse" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
