import { useState, useEffect } from "react";
import { Link, useLocation, useRouter } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Home, 
  Trophy, 
  User, 
  Settings, 
  LogOut, 
  Menu,
  X,
  ChevronRight,
  Star,
  Target,
  Clock,
  Award,
  TrendingUp,
  Bell,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Monitor,
  Globe,
  HelpCircle,
  Info,
  BookOpen,
  BarChart3,
  Calendar,
  Zap,
  Brain,
  Crown,
  Flame,
  Heart,
  Shield,
  Eye,
  Minimize,
  Save,
  Lock,
  Unlock
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import MobileNav from "./mobile-nav";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: any;
  badge?: string | number;
  isActive?: boolean;
  color?: string;
  description?: string;
  shortcut?: string;
  children?: NavigationItem[];
}

interface SettingsItem {
  id: string;
  label: string;
  description: string;
  type: 'switch' | 'select' | 'button' | 'slider';
  value?: any;
  options?: { label: string; value: any }[];
  icon: any;
  onChange?: (value: any) => void;
}

export function Sidebar({ isOpen, onToggle, className }: SidebarProps) {
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');
  const [difficulty, setDifficulty] = useState('medium');
  const [privacy, setPrivacy] = useState('friends');
  const [activeView, setActiveView] = useState<'navigation' | 'settings' | 'profile'>('navigation');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  // Mock user stats
  const userStats = {
    level: 12,
    xp: 2847,
    nextLevelXp: 3000,
    totalQuizzes: 156,
    averageScore: 87.3,
    streak: 7,
    achievements: 23,
    rank: 142,
    totalUsers: 50000
  };

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/',
      icon: Home,
      color: 'text-blue-400',
      description: 'Overview and statistics',
      shortcut: '⌘1'
    },
    {
      id: 'quizzes',
      label: 'Quizzes',
      href: '/quiz',
      icon: Brain,
      color: 'text-purple-400',
      description: 'Take and create quizzes',
      shortcut: '⌘2',
      children: [
        { id: 'quick-quiz', label: 'Quick Quiz', href: '/quiz/quick', icon: Zap },
        { id: 'daily-challenge', label: 'Daily Challenge', href: '/quiz/daily', icon: Calendar, badge: 'New' },
        { id: 'practice-mode', label: 'Practice Mode', href: '/quiz/practice', icon: Target },
        { id: 'tournaments', label: 'Tournaments', href: '/quiz/tournaments', icon: Crown, badge: '3' }
      ]
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      href: '/leaderboard',
      icon: Trophy,
      color: 'text-yellow-400',
      description: 'Rankings and achievements',
      shortcut: '⌘3',
      badge: userStats.rank < 100 ? 'Top 100' : undefined
    },
    {
      id: 'achievements',
      label: 'Achievements',
      href: '/achievements',
      icon: Award,
      color: 'text-green-400',
      description: 'Badges and milestones',
      badge: userStats.achievements
    },
    {
      id: 'statistics',
      label: 'Statistics',
      href: '/stats',
      icon: BarChart3,
      color: 'text-orange-400',
      description: 'Performance analytics'
    },
    {
      id: 'friends',
      label: 'Friends',
      href: '/friends',
      icon: Heart,
      color: 'text-pink-400',
      description: 'Social connections',
      badge: '5'
    },
    {
      id: 'library',
      label: 'Library',
      href: '/library',
      icon: BookOpen,
      color: 'text-indigo-400',
      description: 'Study materials'
    }
  ];

  const settingsItems: SettingsItem[] = [
    {
      id: 'theme',
      label: 'Theme',
      description: 'Choose your preferred theme',
      type: 'select',
      value: theme,
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'System', value: 'system' }
      ],
      icon: theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor,
      onChange: (value) => {
        setTheme(value);
        // Apply theme to document
        document.documentElement.className = value === 'system' ? '' : `theme-${value}`;
      }
    },
    {
      id: 'notifications',
      label: 'Notifications',
      description: 'Receive quiz reminders and updates',
      type: 'switch',
      value: notificationsEnabled,
      icon: Bell,
      onChange: setNotificationsEnabled
    },
    {
      id: 'sound',
      label: 'Sound Effects',
      description: 'Play sounds for interactions',
      type: 'switch',
      value: soundEnabled,
      icon: soundEnabled ? Volume2 : VolumeX,
      onChange: setSoundEnabled
    },
    {
      id: 'vibration',
      label: 'Vibration',
      description: 'Haptic feedback on mobile',
      type: 'switch',
      value: vibrationEnabled,
      icon: Monitor, // Assuming Monitor icon can represent device feature
      onChange: setVibrationEnabled
    },
    {
      id: 'animations',
      label: 'Animations',
      description: 'Enable smooth transitions',
      type: 'switch',
      value: animationsEnabled,
      icon: Star, // Replaced Sparkles with Star as per common icon usage for 'feature enabled'
      onChange: setAnimationsEnabled
    },
    {
      id: 'high-contrast',
      label: 'High Contrast',
      description: 'Improve accessibility',
      type: 'switch',
      value: highContrastMode,
      icon: Eye,
      onChange: setHighContrastMode
    },
    {
      id: 'compact-mode',
      label: 'Compact Mode',
      description: 'Reduce spacing and padding',
      type: 'switch',
      value: compactMode,
      icon: Minimize,
      onChange: setCompactMode
    },
    {
      id: 'auto-save',
      label: 'Auto Save',
      description: 'Automatically save progress',
      type: 'switch',
      value: autoSaveEnabled,
      icon: Save,
      onChange: setAutoSaveEnabled
    },
    {
      id: 'language',
      label: 'Language',
      description: 'Choose your language',
      type: 'select',
      value: language,
      options: [
        { label: 'English', value: 'en' },
        { label: 'Spanish', value: 'es' },
        { label: 'French', value: 'fr' },
        { label: 'German', value: 'de' },
        { label: 'Japanese', value: 'ja' },
        { label: 'Chinese', value: 'zh' }
      ],
      icon: Globe,
      onChange: setLanguage
    },
    {
      id: 'difficulty',
      label: 'Default Difficulty',
      description: 'Preferred quiz difficulty',
      type: 'select',
      value: difficulty,
      options: [
        { label: 'Easy', value: 'easy' },
        { label: 'Medium', value: 'medium' },
        { label: 'Hard', value: 'hard' },
        { label: 'Expert', value: 'expert' }
      ],
      icon: Target,
      onChange: setDifficulty
    },
    {
      id: 'privacy',
      label: 'Profile Visibility',
      description: 'Who can see your profile',
      type: 'select',
      value: privacy,
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Friends Only', value: 'friends' },
        { label: 'Private', value: 'private' }
      ],
      icon: privacy === 'public' ? Unlock : Lock,
      onChange: setPrivacy
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    // Close mobile sidebar after navigation if it's open
    if (window.innerWidth < 1024 && isOpen) {
      onToggle();
    }
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const isActive = location === item.href;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections.includes(item.id);

    return (
      <div key={item.id} className={cn("mb-1", level > 0 && "ml-4")}>
        <div 
          className={cn(
            "sidebar-item group relative flex items-center gap-3 p-3 rounded-lg mx-2 transition-all duration-200 min-h-[48px]",
            isActive ? "bg-primary/20 text-primary border-l-4 border-primary" : "hover:bg-white/10 hover:transform hover:translate-x-1",
            !hasChildren && "cursor-pointer" 
          )}
          onClick={() => {
            if (hasChildren) {
              toggleSection(item.id);
            } else {
              handleNavigation(item.href);
            }
          }}
        >
          <item.icon className={cn("mobile-icon flex-shrink-0", item.color || "text-muted-foreground")} />
          <div className="flex-grow min-w-0">
            <span className="mobile-text-sm font-medium truncate block">
              {item.label}
            </span>
            {item.description && (
              <span className="mobile-text-xs text-muted-foreground truncate block">
                {item.description}
              </span>
            )}
          </div>
          {item.badge && (
            <Badge variant="secondary" className="text-xs">
              {item.badge}
            </Badge>
          )}
          {hasChildren && (
            <ChevronRight 
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                isExpanded && "rotate-90"
              )} 
            />
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-2 mt-1 space-y-1 animate-fade-in-up">
            {item.children?.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderSettingsItem = (item: SettingsItem) => {
    return (
      <div key={item.id} className="settings-item flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 px-2">
        <div className="settings-item-info flex-1">
          <div className="flex items-center gap-2 mb-1">
            <item.icon className="mobile-icon text-muted-foreground w-5 h-5" />
            <span className="settings-item-title text-sm font-medium">{item.label}</span>
          </div>
          <p className="settings-item-description text-xs text-muted-foreground">{item.description}</p>
        </div>
        <div className="settings-control">
          {item.type === 'switch' && (
            <Switch
              checked={item.value}
              onCheckedChange={item.onChange}
              className="mobile-button"
            />
          )}
          {item.type === 'select' && (
            <select
              value={item.value}
              onChange={(e) => item.onChange?.(e.target.value)}
              className="mobile-button bg-secondary text-secondary-foreground border border-white/10 rounded-lg px-3 py-2 text-sm"
            >
              {item.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          {item.type === 'button' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => item.onChange?.(true)}
              className="mobile-button"
            >
              Configure
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderUserProfile = () => {
    return (
      <div className="space-y-6 p-4">
        {/* User Header */}
        <div className="modern-card text-center">
          <Avatar className="w-20 h-20 mx-auto mb-4">
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-purple-400 text-white">
              {user?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h3 className="mobile-text-lg font-bold mb-1">{user?.username}</h3>
          <p className="mobile-text-sm text-muted-foreground mb-4">Level {userStats.level} Quiz Master</p>

          {/* XP Progress */}
          <div className="space-y-2">
            <div className="flex justify-between mobile-text-sm">
              <span>XP Progress</span>
              <span>{userStats.xp}/{userStats.nextLevelXp}</span>
            </div>
            <Progress value={(userStats.xp / userStats.nextLevelXp) * 100} className="h-2" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="modern-card text-center">
            <div className="mobile-text-2xl font-bold text-primary">{userStats.totalQuizzes}</div>
            <div className="mobile-text-xs text-muted-foreground">Quizzes Taken</div>
          </div>
          <div className="modern-card text-center">
            <div className="mobile-text-2xl font-bold text-green-400">{userStats.averageScore}%</div>
            <div className="mobile-text-xs text-muted-foreground">Average Score</div>
          </div>
          <div className="modern-card text-center">
            <div className="mobile-text-2xl font-bold text-orange-400">{userStats.streak}</div>
            <div className="mobile-text-xs text-muted-foreground">Day Streak</div>
          </div>
          <div className="modern-card text-center">
            <div className="mobile-text-2xl font-bold text-yellow-400">#{userStats.rank}</div>
            <div className="mobile-text-xs text-muted-foreground">Global Rank</div>
          </div>
        </div>

        {/* Achievements Preview */}
        <div className="modern-card">
          <h4 className="mobile-text-base font-semibold mb-3 flex items-center gap-2">
            <Award className="mobile-icon text-yellow-400" />
            Recent Achievements
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-yellow-500/10">
              <Crown className="w-6 h-6 text-yellow-400" />
              <div>
                <div className="mobile-text-sm font-medium">Quiz Master</div>
                <div className="mobile-text-xs text-muted-foreground">Complete 100 quizzes</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-green-500/10">
              <Flame className="w-6 h-6 text-orange-400" />
              <div>
                <div className="mobile-text-sm font-medium">7 Day Streak</div>
                <div className="mobile-text-xs text-muted-foreground">Quiz every day for a week</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button 
            className="btn-primary w-full" 
            onClick={() => {
              setActiveView('navigation');
              handleNavigation('/quiz');
            }}
          >
            <Target className="mobile-icon mr-2" />
            Take Quiz
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setActiveView('settings')}
          >
            <Settings className="mobile-icon mr-2" />
            Settings
          </Button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case 'navigation':
        return (
          <div className="py-4">
            <nav className="space-y-1">
              {navigationItems.map(item => renderNavigationItem(item))}
            </nav>
          </div>
        );
      case 'profile':
        return renderUserProfile();
      case 'settings':
        return (
          <div className="py-4 space-y-6 px-4">
            <div className="settings-section">
              <h3 className="settings-section-title text-lg font-semibold mb-3">Appearance</h3>
              {settingsItems.slice(0, 4).map(renderSettingsItem)}
            </div>

            <div className="settings-section">
              <h3 className="settings-section-title text-lg font-semibold mb-3">Accessibility</h3>
              {settingsItems.slice(4, 8).map(renderSettingsItem)}
            </div>

            <div className="settings-section">
              <h3 className="settings-section-title text-lg font-semibold mb-3">Preferences</h3>
              {settingsItems.slice(8).map(renderSettingsItem)}
            </div>

            <Separator />

            <div className="settings-section">
              <h3 className="settings-section-title text-lg font-semibold mb-3">About</h3>
              <div className="space-y-3">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <HelpCircle className="mobile-icon mr-3 w-5 h-5" />
                  Help & Support
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Info className="mobile-icon mr-3 w-5 h-5" />
                  About QuizApp
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  <Shield className="mobile-icon mr-3 w-5 h-5" />
                  Privacy Policy
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "sidebar-mobile lg:sidebar-desktop",
        isOpen ? "open" : "closed",
        className
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="mobile-text-lg font-bold gradient-text">QuizApp</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="lg:hidden btn-icon"
              >
                <X className="mobile-icon" />
              </Button>
            </div>

            {/* View Switcher */}
            <div className="flex bg-secondary/50 rounded-lg p-1">
              <button
                onClick={() => setActiveView('navigation')}
                className={cn(
                  "flex-1 py-2 px-3 rounded-md transition-all duration-200 mobile-text-sm font-medium",
                  activeView === 'navigation' 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Home
              </button>
              <button
                onClick={() => setActiveView('profile')}
                className={cn(
                  "flex-1 py-2 px-3 rounded-md transition-all duration-200 mobile-text-sm font-medium",
                  activeView === 'profile' 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveView('settings')}
                className={cn(
                  "flex-1 py-2 px-3 rounded-md transition-all duration-200 mobile-text-sm font-medium",
                  activeView === 'settings' 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Settings
              </button>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 px-2">
            {renderContent()}
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 space-y-3">
            {user && (
              <div className="flex items-center gap-3 p-3 rounded-lg glass-light">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-sm bg-gradient-to-br from-primary to-purple-400 text-white">
                    {user.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-grow min-w-0">
                  <p className="mobile-text-sm font-medium truncate">{user.username}</p>
                  <p className="mobile-text-xs text-muted-foreground">Level {userStats.level}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="btn-icon text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  title="Logout"
                >
                  <LogOut className="mobile-icon" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area - Removed as it duplicates renderContent() */}
      {/* The main content should be rendered by the parent component using the sidebar's navigation */}

      {/* Mobile Navigation */}
      {/* This component seems to be intended for the main app layout, not within the sidebar itself */}
      {/* <MobileNav activeTab={activeView} setActiveTab={setActiveView} /> */}
    </>
  );
}