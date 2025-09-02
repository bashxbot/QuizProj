import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { useQuizState } from "@/hooks/use-quiz-state";
import { useLocation } from "wouter";
import { 
  Brain, 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  Play,
  Award,
  Star,
  Users,
  BookOpen,
  Zap,
  ChevronRight,
  Plus,
  BarChart3,
  Sparkles,
  Menu,
  X
} from "lucide-react";

// Import components
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import QuizSelection from "@/components/quiz/quiz-selection";
import ActiveQuiz from "@/components/quiz/active-quiz";
import QuizResults from "@/components/quiz/quiz-results";
import Dashboard from "@/components/dashboard/dashboard";
import Leaderboard from "@/components/leaderboard/leaderboard";
import Profile from "@/components/profile/profile";

export default function HomePage() {
  const { user } = useAuth();
  const { quizState } = useQuizState();
  const [location, setLocation] = useLocation();
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mock data for demonstration - in real app this would come from API
  const dashboardStats = {
    totalQuizzes: user?.quizzesCompleted || 0,
    totalPoints: user?.totalPoints || 0,
    averageScore: user?.averageScore || 0,
    currentStreak: user?.streak || 0,
    rank: user?.rank || 0,
    level: Math.floor((user?.totalPoints || 0) / 100) + 1
  };

  const recentActivity = [
    { id: 1, type: 'quiz', title: 'JavaScript Fundamentals', score: 85, date: '2 hours ago', points: 85 },
    { id: 2, type: 'achievement', title: 'Quiz Master', description: 'Completed 10 quizzes', date: '1 day ago' },
    { id: 3, type: 'quiz', title: 'React Basics', score: 92, date: '2 days ago', points: 92 },
  ];

  const categories = [
    { name: 'Programming', icon: Brain, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20', count: 150 },
    { name: 'Science', icon: Target, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20', count: 120 },
    { name: 'Math', icon: BarChart3, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20', count: 80 },
    { name: 'History', icon: BookOpen, color: 'text-yellow-500', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', count: 90 },
  ];

  const achievements = [
    { id: 1, title: 'First Steps', description: 'Complete your first quiz', icon: Star, earned: true, color: 'text-yellow-500' },
    { id: 2, title: 'Perfect Score', description: 'Get 100% on any quiz', icon: Trophy, earned: true, color: 'text-gold-500' },
    { id: 3, title: 'Speed Demon', description: 'Complete quiz in under 5 minutes', icon: Zap, earned: false, color: 'text-orange-500' },
    { id: 4, title: 'Consistency', description: 'Complete quizzes for 7 days straight', icon: Calendar, earned: false, color: 'text-green-500' },
  ];

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    setIsSidebarOpen(false);
  };

  const renderMainContent = () => {
    // Show active quiz if there's one in progress
    if (quizState.isQuizActive && quizState.currentQuiz) {
      return <ActiveQuiz />;
    }

    // Show quiz results if available
    if (quizState.quizResults) {
      return (
        <QuizResults 
          onTakeAnother={() => setCurrentSection("quiz")}
          onViewLeaderboard={() => setCurrentSection("leaderboard")}
        />
      );
    }

    switch (currentSection) {
      case "quiz":
        return <QuizSelection />;
      case "leaderboard":
        return <Leaderboard />;
      case "profile":
        return <Profile />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
                <span className="text-lg font-semibold text-yellow-200">Welcome back!</span>
              </div>
              <h1 className="text-4xl font-bold">
                Hello, {user?.username || 'Quiz Master'}! 👋
              </h1>
              <p className="text-xl text-purple-100 max-w-2xl">
                Ready to challenge your knowledge? You're currently level {dashboardStats.level} with {dashboardStats.totalPoints} points!
              </p>
              <div className="flex items-center space-x-4 pt-2">
                <Button 
                  onClick={() => setCurrentSection("quiz")}
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Quiz Now
                </Button>
                <Button 
                  onClick={() => setCurrentSection("leaderboard")}
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold px-6 py-3 rounded-xl"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  View Rankings
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Brain className="w-32 h-32 text-white/80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Quizzes</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{dashboardStats.totalQuizzes}</p>
              </div>
              <Brain className="h-12 w-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Points</p>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{dashboardStats.totalPoints}</p>
              </div>
              <Star className="h-12 w-12 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Average Score</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">{dashboardStats.averageScore}%</p>
              </div>
              <Target className="h-12 w-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Current Rank</p>
                <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">#{dashboardStats.rank || '--'}</p>
              </div>
              <Trophy className="h-12 w-12 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quiz Categories */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              Quiz Categories
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentSection("quiz")}
              className="hover:bg-primary/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Browse All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.name}
                  variant="outline"
                  onClick={() => setCurrentSection("quiz")}
                  className={`h-24 flex-col space-y-2 ${category.bgColor} border-2 hover:shadow-lg transition-all duration-300 hover:scale-105`}
                >
                  <Icon className={`h-8 w-8 ${category.color}`} />
                  <div className="text-center">
                    <div className="font-semibold">{category.name}</div>
                    <div className="text-xs text-muted-foreground">{category.count} quizzes</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'quiz' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'
                  }`}>
                    {activity.type === 'quiz' ? 
                      <Brain className="h-5 w-5 text-blue-500" /> : 
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    }
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{activity.title}</h4>
                    {activity.score && (
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {activity.score}% • {activity.points} pts
                        </Badge>
                      </div>
                    )}
                    {activity.description && (
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3">
              <Award className="h-5 w-5 text-yellow-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div 
                    key={achievement.id} 
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                      achievement.earned 
                        ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-800' 
                        : 'bg-muted/30 border border-dashed border-muted-foreground/30'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      achievement.earned ? 'bg-yellow-200 dark:bg-yellow-900/40' : 'bg-muted'
                    }`}>
                      <Icon className={`h-5 w-5 ${achievement.earned ? achievement.color : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${achievement.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                    {achievement.earned && (
                      <Badge variant="default" className="bg-yellow-500 text-white">
                        ✓ Earned
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 lg:ml-0">
        {/* Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold">Quiz Master Pro</h1>
          <div className="w-10" /> {/* Spacer */}
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderMainContent()}
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav activeTab={currentSection} setActiveTab={setCurrentSection} />
    </div>
  );
}