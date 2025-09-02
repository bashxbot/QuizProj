
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Trophy, Play, BarChart3, Target, Zap, Star, Crown, 
  TrendingUp, Calendar, Clock, Award, Sparkles, Flame,
  Brain, Users, Globe, Rocket, ChevronRight, Plus
} from "lucide-react";
import type { Section } from "@/pages/home-page";

interface DashboardProps {
  onSectionChange: (section: Section) => void;
}

export default function Dashboard({ onSectionChange }: DashboardProps) {
  const { user } = useAuth();

  const stats = [
    { 
      title: "Quizzes Completed", 
      value: "42", 
      change: "+12%", 
      icon: Play, 
      gradient: "from-blue-500 to-cyan-500",
      trend: "up"
    },
    { 
      title: "Current Streak", 
      value: "7 days", 
      change: "🔥", 
      icon: Flame, 
      gradient: "from-orange-500 to-red-500",
      trend: "up"
    },
    { 
      title: "Global Rank", 
      value: "#234", 
      change: "+45", 
      icon: Trophy, 
      gradient: "from-yellow-500 to-orange-600",
      trend: "up"
    },
    { 
      title: "Total Score", 
      value: "8,547", 
      change: "+892", 
      icon: Star, 
      gradient: "from-purple-500 to-pink-500",
      trend: "up"
    }
  ];

  const recentQuizzes = [
    { 
      title: "Advanced JavaScript Concepts", 
      score: 85, 
      date: "2 hours ago", 
      difficulty: "Expert",
      category: "Programming",
      badge: "New Record!"
    },
    { 
      title: "World History: Modern Era", 
      score: 92, 
      date: "1 day ago", 
      difficulty: "Hard",
      category: "History",
      badge: "Perfect!"
    },
    { 
      title: "Basic Physics Principles", 
      score: 78, 
      date: "2 days ago", 
      difficulty: "Medium",
      category: "Science",
      badge: null
    }
  ];

  const achievements = [
    { 
      title: "Quiz Master", 
      description: "Complete 50 quizzes", 
      progress: 84, 
      icon: Crown,
      unlocked: false
    },
    { 
      title: "Speed Demon", 
      description: "Answer 10 questions in under 30 seconds", 
      progress: 100, 
      icon: Zap,
      unlocked: true
    },
    { 
      title: "Knowledge Seeker", 
      description: "Try quizzes in 10 different categories", 
      progress: 70, 
      icon: Brain,
      unlocked: false
    }
  ];

  const quickActions = [
    {
      title: "Start Quick Quiz",
      description: "Random 10-question challenge",
      icon: Rocket,
      gradient: "from-purple-500 to-pink-500",
      action: () => onSectionChange("quiz")
    },
    {
      title: "View Leaderboard",
      description: "See global rankings",
      icon: Trophy,
      gradient: "from-yellow-500 to-orange-500",
      action: () => onSectionChange("leaderboard")
    },
    {
      title: "Update Profile",
      description: "Customize your experience",
      icon: Users,
      gradient: "from-green-500 to-emerald-500",
      action: () => onSectionChange("profile")
    }
  ];

  return (
    <div className="space-y-12 animate-slide-up">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden modern-card p-12 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-2 border-purple-500/30">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-shimmer"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/30 animate-pulse-glow">
                  <span className="text-3xl font-black text-white">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce flex items-center justify-center">
                  <Crown className="h-4 w-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-black gradient-text mb-2">
                  Welcome back, {user?.username}!
                </h1>
                <p className="text-xl text-white/70 mb-4">
                  Ready to challenge your mind and climb the leaderboard?
                </p>
                <div className="flex items-center space-x-4">
                  <div className="glass-morphism px-4 py-2 rounded-xl border border-green-500/30">
                    <span className="text-green-400 font-semibold flex items-center">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Level 15 Scholar
                    </span>
                  </div>
                  <div className="glass-morphism px-4 py-2 rounded-xl border border-blue-500/30">
                    <span className="text-blue-400 font-semibold">7-day streak! 🔥</span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={() => onSectionChange("quiz")}
              className="btn-modern relative group px-8 py-4 shadow-2xl"
            >
              <div className="flex items-center space-x-3">
                <Play className="h-6 w-6" />
                <span className="text-lg font-bold">Start Quiz</span>
                <Rocket className="h-5 w-5 animate-float" />
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="feature-card group cursor-pointer"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            <div className="relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
              
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-bold ${
                      stat.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {stat.trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : null}
                      {stat.change}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-4xl font-black gradient-text group-hover:scale-105 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold text-white/70 group-hover:text-white transition-colors duration-300">
                    {stat.title}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="modern-card p-8">
        <h2 className="text-3xl font-black gradient-text mb-8 flex items-center">
          <Zap className="h-8 w-8 mr-4 text-yellow-400" />
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="group relative overflow-hidden glass-morphism p-8 rounded-2xl border border-white/20 hover:border-primary/40 transition-all duration-500 hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              <div className="relative text-center">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                  <action.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors duration-300">
                  {action.title}
                </h3>
                <p className="text-white/60 group-hover:text-white/80 transition-colors duration-300">
                  {action.description}
                </p>
                <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-primary group-hover:translate-x-2 transition-all duration-300 mx-auto mt-4" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        
        {/* Recent Quizzes */}
        <div className="modern-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black gradient-text flex items-center">
              <Clock className="h-8 w-8 mr-4 text-blue-400" />
              Recent Activity
            </h2>
            <Button
              variant="ghost"
              onClick={() => onSectionChange("quiz")}
              className="glass-morphism border border-white/20 hover:border-primary/40 rounded-xl px-6 py-3"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Quiz
            </Button>
          </div>
          
          <div className="space-y-6">
            {recentQuizzes.map((quiz, index) => (
              <div
                key={index}
                className="group glass-morphism p-6 rounded-2xl border border-white/10 hover:border-primary/30 transition-all duration-500 hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-primary transition-colors duration-300">
                        {quiz.title}
                      </h3>
                      <p className="text-sm text-white/60">{quiz.category} • {quiz.difficulty}</p>
                    </div>
                  </div>
                  {quiz.badge && (
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-xl text-sm font-bold animate-pulse">
                      {quiz.badge}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`text-2xl font-bold ${
                      quiz.score >= 90 ? 'text-green-400' : 
                      quiz.score >= 70 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {quiz.score}%
                    </div>
                    <div className="text-sm text-white/60">{quiz.date}</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="modern-card p-8">
          <h2 className="text-3xl font-black gradient-text mb-8 flex items-center">
            <Award className="h-8 w-8 mr-4 text-yellow-400" />
            Achievements
          </h2>
          
          <div className="space-y-6">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`group p-6 rounded-2xl border-2 transition-all duration-500 ${
                  achievement.unlocked 
                    ? 'glass-morphism border-green-500/40 bg-green-500/10' 
                    : 'glass-morphism border-white/20 hover:border-primary/30'
                }`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-500 ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-yellow-500 to-orange-500 animate-pulse-glow' 
                      : 'bg-gradient-to-br from-gray-600 to-gray-700 group-hover:from-purple-500 group-hover:to-pink-500'
                  }`}>
                    <achievement.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg ${
                      achievement.unlocked ? 'text-green-400' : 'text-white group-hover:text-primary'
                    } transition-colors duration-300`}>
                      {achievement.title}
                    </h3>
                    <p className="text-white/60 text-sm">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <div className="text-green-400">
                      <Star className="h-6 w-6 animate-sparkle" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Progress</span>
                    <span className={achievement.unlocked ? 'text-green-400' : 'text-white/70'}>
                      {achievement.progress}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${
                        achievement.unlocked ? 'from-green-400 to-emerald-400' : 'from-primary to-accent'
                      }`}
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
