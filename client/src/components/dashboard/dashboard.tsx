import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Watch,
  Gamepad2,
  Headphones,
  Music,
  Camera,
  Video,
  Image,
  FileText,
  Folder,
  Download,
  Upload,
  Share,
  Link,
  Mail,
  Phone,
  MessageCircle,
  Bell,
  Settings,
  Search,
  Filter,
  Sort,
  Grid,
  List,
  Map,
  Bookmark,
  Tag,
  Flag,
  Pin,
  Archive,
  Trash,
  Edit,
  Copy,
  Scissors,
  Clipboard,
  Save,
  Refresh,
  RotateCcw,
  RotateCw,
  Maximize,
  Minimize,
  Plus,
  Minus,
  Check,
  X,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  UserPlus,
  UserMinus,
  UserCheck,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Coffee,
  Gift,
  Sparkles,
  Rocket,
  Lightning,
  Sun,
  Moon,
  CloudRain,
  Umbrella,
  Snowflake,
  Wind,
  Thermometer,
  Compass,
  Navigation,
  MapPin,
  Route,
  Car,
  Bike,
  Train,
  Plane,
  Ship,
  Bus,
  Truck,
  Taxi,
  Home,
  Building,
  Store,
  Factory,
  School,
  Hospital,
  Bank,
  Hotel,
  Restaurant,
  ShoppingCart,
  CreditCard,
  Wallet,
  DollarSign,
  Euro,
  PoundSterling,
  Yen,
  Bitcoin,
  TrendingDown,
  PlusCircle,
  MinusCircle,
  PlayCircle,
  PauseCircle,
  StopCircle,
  SkipBack,
  SkipForward,
  FastForward,
  Rewind,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Speaker,
  RadioIcon,
  Disc,
  Cassette,
  Vinyl,
  Headset,
  MousePointer,
  Mouse,
  Keyboard,
  Printer,
  Scanner,
  Monitor as MonitorIcon,
  Laptop,
  TabletIcon,
  SmartphoneIcon,
  WatchIcon,
  Cpu,
  HardDrive,
  MemoryStick,
  Usb,
  Wifi,
  WifiOff,
  Bluetooth,
  BluetoothIcon,
  Radio,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
  Battery,
  BatteryLow,
  Plug,
  Power,
  PowerOff,
  Loader,
  Loader2,
  MoreHorizontal,
  MoreVertical,
  Menu,
  MenuSquare,
  Sidebar,
  PanelLeft,
  PanelRight,
  PanelTop,
  PanelBottom,
  Layout,
  LayoutDashboard,
  LayoutGrid,
  LayoutList,
  Columns,
  Rows,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Pentagon,
  Octagon,
  Star as StarIcon,
  Heart as HeartIcon,
  Diamond as DiamondIcon,
  Spade,
  Club,
  Clover,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6
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
  const [selectedTimeframe, setSelectedTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('weekly');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAchievements, setShowAchievements] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showQuizSelection, setShowQuizSelection] = useState(false); // Added state for quiz selection

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
    totalQuizzes: profile?.quizzesTaken || 0,
    averageScore: 87.3,
    currentStreak: 7,
    totalPoints: profile?.totalScore || 0,
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
    },
    {
      id: '5',
      title: 'Streak Champion',
      description: 'Maintain a 30-day streak',
      icon: Flame,
      color: 'text-orange-400',
      progress: 7,
      maxProgress: 30,
      rarity: 'epic'
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

  const categories = [
    { id: 'all', label: 'All Categories', count: 156 },
    { id: 'web-dev', label: 'Web Development', count: 45 },
    { id: 'android-dev', label: 'Android Development', count: 32 },
    { id: 'reverse-eng', label: 'Reverse Engineering', count: 23 },
    { id: 'ethical-hacking', label: 'Ethical Hacking', count: 28 },
    { id: 'data-science', label: 'Data Science', count: 18 },
    { id: 'machine-learning', label: 'Machine Learning', count: 10 }
  ];

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

  return (
    <div className="mobile-container py-4 sm:py-6 lg:py-8 space-y-6 lg:space-y-8">
      {/* Welcome Header */}
      <div className="modern-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="mobile-text-2xl font-bold mb-2">
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
            <p className="mobile-text-sm text-muted-foreground">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="mobile-text-xl font-bold text-primary">Level {mockStats.level}</div>
              <div className="mobile-text-xs text-muted-foreground">Quiz Master</div>
            </div>
            <Avatar className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-primary/20">
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
            className="h-3 bg-secondary"
          />
          <p className="mobile-text-xs text-muted-foreground">
            {mockStats.nextLevelXp - mockStats.xp} XP until Level {mockStats.level + 1}
          </p>
        </div>
      </div>

      {/* Daily Challenge */}
      <div className="modern-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="mobile-text-lg font-semibold flex items-center gap-2">
            <Target className="mobile-icon text-primary" />
            Daily Challenge
          </h2>
          <Badge variant="outline" className="mobile-text-xs">
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
              <Button size="sm" className="mobile-button">
                <Zap className="mobile-icon mr-2" />
                Start Quiz
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="dashboard-grid">
        <Card className="dashboard-stat-card">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dashboard-stat-label">Total Quizzes</p>
                <p className="dashboard-stat-value">{mockStats.totalQuizzes}</p>
              </div>
              <Brain className="mobile-icon text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-stat-card">
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

        <Card className="dashboard-stat-card">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dashboard-stat-label">Current Streak</p>
                <p className="dashboard-stat-value text-orange-400">{mockStats.currentStreak} days</p>
              </div>
              <Flame className="mobile-icon text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-stat-card">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dashboard-stat-label">Global Rank</p>
                <p className="dashboard-stat-value text-yellow-400">#{mockStats.globalRank}</p>
              </div>
              <Trophy className="mobile-icon text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 h-auto p-1">
          <TabsTrigger value="overview" className="mobile-text-sm py-2 px-3">
            <LayoutDashboard className="mobile-icon mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="recent" className="mobile-text-sm py-2 px-3">
            <Clock className="mobile-icon mr-2" />
            Recent
          </TabsTrigger>
          <TabsTrigger value="achievements" className="mobile-text-sm py-2 px-3">
            <Award className="mobile-icon mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="social" className="mobile-text-sm py-2 px-3">
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
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="mobile-text-base">Performance charts coming soon</p>
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
                {(quizHistory || []).slice(0, 10).map((attempt: QuizAttempt) => (
                  <div key={attempt.id} className="flex items-center gap-4 p-3 rounded-lg glass-light">
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
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          {/* Achievement Categories */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="default"
              size="sm"
              className="mobile-button"
            >
              <Award className="mobile-icon mr-2" />
              All Achievements
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="mobile-button"
            >
              <CheckCircle className="mobile-icon mr-2" />
              Unlocked
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="mobile-button"
            >
              <Lock className="mobile-icon mr-2" />
              Locked
            </Button>
          </div>

          {/* Achievements Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockAchievements.map(achievement => (
              <div 
                key={achievement.id}
                className={cn(
                  "modern-card border-2 transition-all duration-300",
                  getRarityColor(achievement.rarity),
                  achievement.unlockedAt ? "opacity-100" : "opacity-60"
                )}
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
              {mockFriends.map(friend => (
                <div key={friend.id} className="flex items-center gap-4 p-3 rounded-lg glass-light">
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
              <Button size="sm" variant="outline" className="mobile-button">
                View Full
              </Button>
            </div>

            <div className="space-y-2">
              {(leaderboard || []).slice(0, 5).map((entry: any, index: number) => (
                <div key={entry.id} className="flex items-center gap-4 p-3 rounded-lg glass-light">
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

      {/* Quick Actions */}
      <div className="modern-card">
        <h3 className="mobile-text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button className="btn-primary h-auto py-4 flex-col gap-2">
            <Zap className="mobile-icon" />
            <span className="mobile-text-sm font-medium">Quick Quiz</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <Calendar className="mobile-icon" />
            <span className="mobile-text-sm font-medium">Daily Challenge</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <Trophy className="mobile-icon" />
            <span className="mobile-text-sm font-medium">Leaderboard</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <Settings className="mobile-icon" />
            <span className="mobile-text-sm font-medium">Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
}