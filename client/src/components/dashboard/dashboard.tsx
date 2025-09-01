
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { 
  Brain, Clock, Trophy, Target, TrendingUp, Play, Star, 
  Award, Zap, Crown, Sparkles, ChevronRight, BarChart3,
  Calendar, Users, Fire, Rocket, Medal, BookOpen, Activity
} from "lucide-react";
import type { Section } from "@/pages/home-page";

interface DashboardProps {
  onSectionChange: (section: Section) => void;
}

export default function Dashboard({ onSectionChange }: DashboardProps) {
  const { data: profile } = useQuery({
    queryKey: ["/api/profile"],
  });

  const { data: recentQuizzes } = useQuery({
    queryKey: ["/api/quiz-history"],
  });

  const stats = [
    {
      label: "Total Quizzes",
      value: profile?.totalQuizzes || 0,
      icon: Brain,
      gradient: "from-purple-500 to-violet-600",
      change: "+12%",
      changeType: "positive"
    },
    {
      label: "Average Score",
      value: `${Math.round(profile?.averageScore || 0)}%`,
      icon: Target,
      gradient: "from-emerald-500 to-teal-600",
      change: "+5%",
      changeType: "positive"
    },
    {
      label: "Best Streak",
      value: profile?.bestStreak || 0,
      icon: Fire,
      gradient: "from-orange-500 to-red-600",
      change: "+2",
      changeType: "positive"
    },
    {
      label: "Rank Position",
      value: `#${profile?.rank || 'N/A'}`,
      icon: Crown,
      gradient: "from-yellow-500 to-amber-600",
      change: "↑3",
      changeType: "positive"
    },
  ];

  const achievements = [
    { name: "First Quiz", description: "Completed your first quiz", icon: Star, unlocked: true, gradient: "from-blue-500 to-cyan-500" },
    { name: "Perfect Score", description: "Got 100% on a quiz", icon: Trophy, unlocked: true, gradient: "from-yellow-500 to-orange-500" },
    { name: "Quiz Master", description: "Completed 10 quizzes", icon: Crown, unlocked: false, gradient: "from-purple-500 to-pink-500" },
    { name: "Speed Runner", description: "Completed a quiz in under 1 minute", icon: Zap, unlocked: false, gradient: "from-green-500 to-emerald-500" },
  ];

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="heading-modern mb-6">
            Welcome back, <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">{profile?.username}</span>!
          </h1>
          <p className="subheading-modern max-w-2xl mx-auto">
            Ready to challenge your mind? Your learning journey continues here with AI-powered quizzes.
          </p>
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={() => onSectionChange("quiz")}
              className="btn-modern group"
            >
              <Play className="h-6 w-6 mr-3 group-hover:animate-bounce" />
              Start New Quiz
              <Rocket className="h-5 w-5 ml-3 group-hover:animate-float" />
            </button>
            <button
              onClick={() => onSectionChange("profile")}
              className="btn-outline-modern group"
            >
              <BarChart3 className="h-5 w-5 mr-3 group-hover:animate-pulse" />
              View Progress
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="stat-card group">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-xl group-hover:animate-float`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    stat.changeType === 'positive' ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                <div className="stat-value mb-2">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Recent Quizzes */}
          <div className="modern-card">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black gradient-text flex items-center">
                <Activity className="mr-3 h-7 w-7 text-primary" />
                Recent Activity
              </h2>
              <Button
                variant="ghost"
                onClick={() => onSectionChange("profile")}
                className="text-primary hover:text-primary/80 font-semibold"
              >
                View All <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentQuizzes?.slice(0, 3).map((quiz: any, index: number) => (
                <div key={index} className="glass-morphism p-4 rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{quiz.topic}</h3>
                        <p className="text-white/60 text-sm flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(quiz.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        quiz.score >= 80 ? 'text-green-400' : 
                        quiz.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {quiz.score}%
                      </div>
                      <div className="text-white/60 text-sm">
                        {quiz.correctAnswers}/{quiz.totalQuestions}
                      </div>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-12">
                  <Brain className="h-16 w-16 text-white/30 mx-auto mb-4" />
                  <p className="text-white/60 text-lg">No quizzes taken yet</p>
                  <p className="text-white/40 text-sm">Start your first quiz to see your progress here</p>
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="modern-card">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black gradient-text flex items-center">
                <Award className="mr-3 h-7 w-7 text-accent" />
                Achievements
              </h2>
              <Badge className="badge-primary">
                {achievements.filter(a => a.unlocked).length}/{achievements.length}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div 
                    key={index} 
                    className={`glass-morphism p-4 rounded-xl border transition-all duration-300 ${
                      achievement.unlocked 
                        ? 'border-primary/30 hover:border-primary/50' 
                        : 'border-white/10 opacity-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                        achievement.unlocked 
                          ? `bg-gradient-to-br ${achievement.gradient}` 
                          : 'bg-white/10'
                      }`}>
                        <Icon className={`h-6 w-6 ${
                          achievement.unlocked ? 'text-white' : 'text-white/30'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold ${
                          achievement.unlocked ? 'text-white' : 'text-white/50'
                        }`}>
                          {achievement.name}
                        </h3>
                        <p className={`text-sm ${
                          achievement.unlocked ? 'text-white/70' : 'text-white/30'
                        }`}>
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.unlocked && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-black gradient-text mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Take Quiz",
                description: "Challenge yourself with AI-generated questions",
                icon: Play,
                action: () => onSectionChange("quiz"),
                gradient: "from-purple-500 to-pink-600",
                delay: "0s"
              },
              {
                title: "View Leaderboard",
                description: "See how you rank against other players",
                icon: Trophy,
                action: () => onSectionChange("leaderboard"),
                gradient: "from-yellow-500 to-orange-600",
                delay: "0.1s"
              },
              {
                title: "Update Profile",
                description: "Customize your profile and preferences",
                icon: Users,
                action: () => onSectionChange("profile"),
                gradient: "from-emerald-500 to-teal-600",
                delay: "0.2s"
              }
            ].map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="modern-card group text-left hover:scale-105 transition-all duration-500"
                  style={{ animationDelay: action.delay }}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-6 shadow-xl group-hover:animate-float mx-auto`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 text-center">{action.title}</h3>
                  <p className="text-white/70 text-center leading-relaxed">{action.description}</p>
                  <div className="flex justify-center mt-6">
                    <ChevronRight className="h-6 w-6 text-primary group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
