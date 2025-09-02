import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Trophy, 
  Target, 
  Clock, 
  Star, 
  TrendingUp, 
  Calendar,
  Brain,
  Award,
  Users,
  Zap,
  Flame,
  Crown,
  Shield,
  Diamond,
  Heart,
  BookOpen,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Settings,
  CheckCircle,
  AlertCircle,
  Info,
  Gift,
  Sparkles,
  Rocket,
  Lightning,
  Coffee,
  Gamepad2,
  UserPlus,
  MessageCircle,
  Bell,
  Volume2,
  VolumeX,
  Moon,
  Sun
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface DashboardStats {
  totalQuizzes: number;
  averageScore: number;
  currentStreak: number;
  totalPoints: number;
  globalRank: number;
  level: number;
  xp: number;
  nextLevelXp: number;
  achievements: number;
  friendsCount: number;
  dailyGoal: number;
  dailyProgress: number;
  weeklyGoal: number;
  weeklyProgress: number;
  monthlyGoal: number;
  monthlyProgress: number;
}

interface QuizAttempt {
  id: string;
  title: string;
  category: string;
  score: number;
  timeSpent: number;
  completedAt: string;
  difficulty: string;
  pointsEarned: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Friend {
  id: string;
  username: string;
  level: number;
  avatar?: string;
  isOnline: boolean;
  lastActive: string;
  totalScore: number;
  rank: number;
}

interface DailyChallengeProgress {
  current: number;
  target: number;
  completed: boolean;
  reward: string;
  timeRemaining: string;
}

export function Dashboard() {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('weekly');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch dashboard data
  const { data: profile } = useQuery({
    queryKey: ['/api/profile'],
    queryFn: async () => {
      const response = await fetch('/api/profile', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    }
  });

  const { data: quizHistory } = useQuery({
    queryKey: ['/api/quiz-history'],
    queryFn: async () => {
      const response = await fetch('/api/quiz-history', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch quiz history');
      return response.json();
    }
  });

  const { data: leaderboard } = useQuery({
    queryKey: ['/api/leaderboard'],
    queryFn: async () => {
      const response = await fetch('/api/leaderboard?limit=10', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      return response.json();
    }
  });

  // Mock data for demonstration
  const mockStats: DashboardStats = {
    totalQuizzes: profile?.quizzesTaken || 47,
    averageScore: 87.3,
    currentStreak: 7,
    totalPoints: profile?.totalScore || 3250,
    globalRank: 142,
    level: 12,
    xp: 2847,
    nextLevelXp: 3000,
    achievements: 23,
    friendsCount: 45,
    dailyGoal: 3,
    dailyProgress: 2,
    weeklyGoal: 15,
    weeklyProgress: 12,
    monthlyGoal: 60,
    monthlyProgress: 47
  };

  const mockAchievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first quiz',
      icon: Target,
      color: 'text-green-400',
      unlockedAt: '2024-01-15',
      rarity: 'common'
    },
    {
      id: '2',
      title: 'Perfect Score',
      description: 'Get 100% on any quiz',
      icon: Star,
      color: 'text-yellow-400',
      unlockedAt: '2024-01-18',
      rarity: 'rare'
    },
    {
      id: '3',
      title: 'Speed Demon',
      description: 'Complete a quiz in under 5 minutes',
      icon: Zap,
      color: 'text-blue-400',
      unlockedAt: '2024-01-20',
      rarity: 'epic'
    },
    {
      id: '4',
      title: 'Quiz Master',
      description: 'Complete 100 quizzes',
      icon: Crown,
      color: 'text-purple-400',
      progress: 75,
      maxProgress: 100,
      rarity: 'legendary'
    }
  ];

  const mockFriends: Friend[] = [
    {
      id: '1',
      username: 'AlexQuiz',
      level: 15,
      isOnline: true,
      lastActive: '2024-01-21T10:30:00Z',
      totalScore: 4250,
      rank: 98
    },
    {
      id: '2',
      username: 'BrainiacSarah',
      level: 18,
      isOnline: false,
      lastActive: '2024-01-21T08:15:00Z',
      totalScore: 5680,
      rank: 45
    },
    {
      id: '3',
      username: 'QuizNinja',
      level: 22,
      isOnline: true,
      lastActive: '2024-01-21T11:45:00Z',
      totalScore: 7320,
      rank: 23
    }
  ];

  const dailyChallenge: DailyChallengeProgress = {
    current: 2,
    target: 3,
    completed: false,
    reward: '50 XP + Rare Badge',
    timeRemaining: '14h 23m'
  };

  const timeframes = [
    { id: 'daily', label: 'Today', icon: Calendar },
    { id: 'weekly', label: 'This Week', icon: BarChart3 },
    { id: 'monthly', label: 'This Month', icon: PieChart },
    { id: 'all', label: 'All Time', icon: LineChart }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-400/10';
      case 'rare': return 'border-blue-400 bg-blue-400/10';
      case 'epic': return 'border-purple-400 bg-purple-400/10';
      case 'legendary': return 'border-yellow-400 bg-yellow-400/10';
      default: return 'border-gray-400 bg-gray-400/10';
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const quickActions = [
    {
      id: 'quick-quiz',
      title: 'Quick Quiz',
      description: 'Start a 5-minute challenge',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      action: () => navigate('/quiz')
    },
    {
      id: 'daily-challenge',
      title: 'Daily Challenge',
      description: 'Complete today\'s special quiz',
      icon: Calendar,
      color: 'from-green-500 to-emerald-500',
      action: () => navigate('/quiz/daily')
    },
    {
      id: 'leaderboard',
      title: 'Leaderboard',
      description: 'Check your ranking',
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500',
      action: () => navigate('/leaderboard')
    },
    {
      id: 'achievements',
      title: 'Achievements',
      description: 'View your badges',
      icon: Award,
      color: 'from-purple-500 to-pink-500',
      action: () => navigate('/achievements')
    }
  ];

  return (
    <div className="mobile-container py-4 sm:py-6 lg:py-8 space-y-6 lg:space-y-8 min-h-screen">
      {/* Welcome Header */}
      <div className="modern-card animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-grow">
            <h1 className="mobile-text-2xl font-bold mb-2 bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome back, {user?.username}! 👋
            </h1>
            <p className="mobile-text-base text-muted-foreground">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="mobile-text-sm text-muted-foreground font-mono">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="mobile-text-xl font-bold text-primary">Level {mockStats.level}</div>
              <div className="mobile-text-xs text-muted-foreground">Quiz Master</div>
            </div>
            <Avatar className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <AvatarFallback className="text-lg sm:text-xl font-bold bg-gradient-to-br from-primary to-purple-400 text-white">
                {user?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="mobile-text-sm font-medium">Experience Points</span>
            <span className="mobile-text-sm text-muted-foreground">
              {mockStats.xp}/{mockStats.nextLevelXp} XP
            </span>
          </div>
          <Progress 
            value={(mockStats.xp / mockStats.nextLevelXp) * 100} 
            className="h-3 bg-secondary animate-pulse"
          />
          <p className="mobile-text-xs text-muted-foreground">
            {mockStats.nextLevelXp - mockStats.xp} XP until Level {mockStats.level + 1}
          </p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {quickActions.map((action, index) => (
          <button
            key={action.id}
            onClick={action.action}
            className={cn(
              "modern-card p-4 sm:p-6 text-center hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/30",
              "animate-fade-in-up"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={cn(
              "w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br mx-auto mb-3 flex items-center justify-center",
              action.color
            )}>
              <action.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="mobile-text-sm sm:mobile-text-base font-semibold mb-1">{action.title}</h3>
            <p className="mobile-text-xs text-muted-foreground">{action.description}</p>
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="dashboard-grid">
        <Card className="dashboard-stat-card animate-bounce-in">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dashboard-stat-label">Total Quizzes</p>
                <p className="dashboard-stat-value">{mockStats.totalQuizzes}</p>
              </div>
              <Brain className="mobile-icon text-primary animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-stat-card animate-bounce-in" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dashboard-stat-label">Average Score</p>
                <p className={`dashboard-stat-value ${getScoreColor(mockStats.averageScore)}`}>
                  {mockStats.averageScore}%
                </p>
              </div>
              <Target className="mobile-icon text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-stat-card animate-bounce-in" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dashboard-stat-label">Current Streak</p>
                <p className="dashboard-stat-value text-orange-400">{mockStats.currentStreak} days</p>
              </div>
              <Flame className="mobile-icon text-orange-400 animate-bounce" />
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-stat-card animate-bounce-in" style={{ animationDelay: '300ms' }}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dashboard-stat-label">Global Rank</p>
                <p className="dashboard-stat-value text-yellow-400">#{mockStats.globalRank}</p>
              </div>
              <Trophy className="mobile-icon text-yellow-400 animate-glow" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Challenge */}
      <div className="modern-card animate-slide-in-left">
        <div className="flex items-center justify-between mb-4">
          <h2 className="mobile-text-lg font-semibold flex items-center gap-2">
            <Target className="mobile-icon text-primary" />
            Daily Challenge
          </h2>
          <Badge variant="outline" className="mobile-text-xs animate-pulse">
            <Clock className="w-3 h-3 mr-1" />
            {dailyChallenge.timeRemaining}
          </Badge>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="mobile-text-sm">Complete 3 quizzes today</span>
              <span className="mobile-text-sm font-medium">
                {dailyChallenge.current}/{dailyChallenge.target}
              </span>
            </div>
            <Progress 
              value={(dailyChallenge.current / dailyChallenge.target) * 100}
              className="h-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="mobile-icon text-yellow-400" />
              <span className="mobile-text-sm">Reward: {dailyChallenge.reward}</span>
            </div>
            {!dailyChallenge.completed && (
              <Button 
                size="sm" 
                className="mobile-button hover:scale-105 transition-transform"
                onClick={() => navigate('/quiz')}
              >
                <Zap className="mobile-icon mr-2" />
                Start Quiz
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 h-auto p-1 bg-secondary/50">
          <TabsTrigger value="overview" className="mobile-text-sm py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Activity className="mobile-icon mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="recent" className="mobile-text-sm py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Clock className="mobile-icon mr-2" />
            Recent
          </TabsTrigger>
          <TabsTrigger value="achievements" className="mobile-text-sm py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Award className="mobile-icon mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="social" className="mobile-text-sm py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="mobile-icon mr-2" />
            Social
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Goals Progress */}
          <div className="modern-card">
            <h3 className="mobile-text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="mobile-icon text-primary" />
              Progress Goals
            </h3>

            <div className="grid gap-4 sm:gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="mobile-text-sm font-medium">Daily Goal</span>
                  <span className="mobile-text-sm text-muted-foreground">
                    {mockStats.dailyProgress}/{mockStats.dailyGoal}
                  </span>
                </div>
                <Progress 
                  value={(mockStats.dailyProgress / mockStats.dailyGoal) * 100}
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="mobile-text-sm font-medium">Weekly Goal</span>
                  <span className="mobile-text-sm text-muted-foreground">
                    {mockStats.weeklyProgress}/{mockStats.weeklyGoal}
                  </span>
                </div>
                <Progress 
                  value={(mockStats.weeklyProgress / mockStats.weeklyGoal) * 100}
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="mobile-text-sm font-medium">Monthly Goal</span>
                  <span className="mobile-text-sm text-muted-foreground">
                    {mockStats.monthlyProgress}/{mockStats.monthlyGoal}
                  </span>
                </div>
                <Progress 
                  value={(mockStats.monthlyProgress / mockStats.monthlyGoal) * 100}
                  className="h-2"
                />
              </div>
            </div>
          </div>

          {/* Performance Chart Placeholder */}
          <div className="dashboard-chart-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="mobile-icon text-primary" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 sm:h-80 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50 animate-pulse" />
                  <p className="mobile-text-base font-medium">Performance charts coming soon</p>
                  <p className="mobile-text-sm">Track your progress over time</p>
                </div>
              </div>
            </CardContent>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          {/* Time Frame Selector */}
          <div className="flex flex-wrap gap-2">
            {timeframes.map(timeframe => (
              <Button
                key={timeframe.id}
                variant={selectedTimeframe === timeframe.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe.id as any)}
                className="mobile-button"
              >
                <timeframe.icon className="mobile-icon mr-2" />
                {timeframe.label}
              </Button>
            ))}
          </div>

          {/* Recent Quiz Attempts */}
          <div className="modern-card">
            <h3 className="mobile-text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="mobile-icon text-primary" />
              Recent Quiz Attempts
            </h3>

            <ScrollArea className="h-64 sm:h-80">
              <div className="space-y-3">
                {(quizHistory || []).slice(0, 10).map((attempt: QuizAttempt, index: number) => (
                  <div 
                    key={attempt.id || index} 
                    className="flex items-center gap-4 p-3 rounded-lg glass-light hover:bg-white/10 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="mobile-text-sm font-medium truncate">{attempt.title}</h4>
                      <div className="flex items-center gap-2 mobile-text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {attempt.category}
                        </Badge>
                        <span>•</span>
                        <span>{formatTime(attempt.timeSpent)}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(attempt.completedAt)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`mobile-text-base font-bold ${getScoreColor(attempt.score)}`}>
                        {attempt.score}%
                      </div>
                      <div className="mobile-text-xs text-muted-foreground">
                        +{attempt.pointsEarned} XP
                      </div>
                    </div>
                  </div>
                ))}

                {(!quizHistory || quizHistory.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="mobile-text-base">No recent quiz attempts</p>
                    <p className="mobile-text-sm">Take your first quiz to see your progress here</p>
                    <Button 
                      className="mt-4 mobile-button"
                      onClick={() => navigate('/quiz')}
                    >
                      <Zap className="mobile-icon mr-2" />
                      Start Your First Quiz
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          {/* Achievements Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockAchievements.map((achievement, index) => (
              <div 
                key={achievement.id}
                className={cn(
                  "modern-card border-2 transition-all duration-300 hover:scale-105",
                  getRarityColor(achievement.rarity),
                  achievement.unlockedAt ? "opacity-100" : "opacity-60",
                  "animate-bounce-in"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    achievement.unlockedAt 
                      ? "bg-gradient-to-br from-primary to-purple-400" 
                      : "bg-muted"
                  )}>
                    <achievement.icon className={cn(
                      "w-6 h-6",
                      achievement.unlockedAt ? "text-white" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="mobile-text-sm font-semibold">{achievement.title}</h4>
                    <p className="mobile-text-xs text-muted-foreground mt-1">
                      {achievement.description}
                    </p>

                    {achievement.progress !== undefined && (
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between mobile-text-xs">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <Progress 
                          value={(achievement.progress / (achievement.maxProgress || 1)) * 100}
                          className="h-1.5"
                        />
                      </div>
                    )}

                    {achievement.unlockedAt && (
                      <p className="mobile-text-xs text-muted-foreground mt-2">
                        Unlocked {formatRelativeTime(achievement.unlockedAt)}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">
                    {achievement.rarity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          {/* Friends List */}
          <div className="modern-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="mobile-text-lg font-semibold flex items-center gap-2">
                <Users className="mobile-icon text-primary" />
                Friends ({mockFriends.length})
              </h3>
              <Button size="sm" variant="outline" className="mobile-button">
                <UserPlus className="mobile-icon mr-2" />
                Add Friend
              </Button>
            </div>

            <div className="space-y-3">
              {mockFriends.map((friend, index) => (
                <div 
                  key={friend.id} 
                  className="flex items-center gap-4 p-3 rounded-lg glass-light hover:bg-white/10 transition-colors animate-slide-in-right"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-purple-400 text-white">
                        {friend.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background",
                      friend.isOnline ? "bg-green-400" : "bg-gray-400"
                    )} />
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="mobile-text-sm font-medium">{friend.username}</h4>
                      <Badge variant="outline" className="text-xs">
                        Level {friend.level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mobile-text-xs text-muted-foreground">
                      <span>Rank #{friend.rank}</span>
                      <span>•</span>
                      <span>{friend.totalScore.toLocaleString()} pts</span>
                    </div>
                    <p className="mobile-text-xs text-muted-foreground">
                      {friend.isOnline ? 'Online now' : `Last seen ${formatRelativeTime(friend.lastActive)}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="btn-icon">
                      <MessageCircle className="mobile-icon" />
                    </Button>
                    <Button size="sm" variant="ghost" className="btn-icon">
                      <Gamepad2 className="mobile-icon" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard Preview */}
          <div className="modern-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="mobile-text-lg font-semibold flex items-center gap-2">
                <Trophy className="mobile-icon text-primary" />
                Global Leaderboard
              </h3>
              <Button 
                size="sm" 
                variant="outline" 
                className="mobile-button"
                onClick={() => navigate('/leaderboard')}
              >
                View Full
              </Button>
            </div>

            <div className="space-y-2">
              {(leaderboard || []).slice(0, 5).map((entry: any, index: number) => (
                <div 
                  key={entry.id || index} 
                  className="flex items-center gap-4 p-3 rounded-lg glass-light hover:bg-white/10 transition-colors animate-slide-in-left"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold mobile-text-sm",
                    index === 0 && "bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900",
                    index === 1 && "bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900",
                    index === 2 && "bg-gradient-to-br from-orange-400 to-orange-600 text-orange-900",
                    index > 2 && "bg-muted text-muted-foreground"
                  )}>
                    {index + 1}
                  </div>

                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-purple-400 text-white mobile-text-sm">
                      {entry.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-grow min-w-0">
                    <h4 className="mobile-text-sm font-medium truncate">{entry.username}</h4>
                    <p className="mobile-text-xs text-muted-foreground">
                      {entry.quizzesTaken} quizzes • {entry.averageScore?.toFixed(1)}% avg
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="mobile-text-sm font-bold text-primary">
                      {entry.totalScore?.toLocaleString()}
                    </div>
                    <div className="mobile-text-xs text-muted-foreground">points</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}