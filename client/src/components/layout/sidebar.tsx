import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { 
  Home,
  Brain,
  Trophy,
  History,
  User,
  Settings,
  LogOut,
  Play,
  Target,
  Award,
  BookOpen,
  TrendingUp,
  Calendar,
  Star,
  ChevronRight,
  Sparkles,
  Zap
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState("dashboard");

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/",
      description: "Overview & Stats",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
      id: "quiz",
      label: "Take Quiz",
      icon: Brain,
      path: "/quiz",
      description: "Start New Quiz",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800"
    },
    {
      id: "daily",
      label: "Daily Challenge",
      icon: Calendar,
      path: "/daily-quiz",
      description: "Today's Special",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800"
    },
    {
      id: "leaderboard",
      label: "Leaderboard",
      icon: Trophy,
      path: "/leaderboard",
      description: "Top Players",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800"
    },
    {
      id: "history",
      label: "My Progress",
      icon: History,
      path: "/history",
      description: "Quiz History",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      borderColor: "border-indigo-200 dark:border-indigo-800"
    }
  ];

  const handleNavigation = (item: typeof navigationItems[0]) => {
    setActiveSection(item.id);
    setLocation(item.path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-80 bg-background/95 backdrop-blur-lg
        border-r border-border/50 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none
      `}>
        <div className="flex flex-col h-full p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Quiz Master</h2>
                <p className="text-sm text-muted-foreground">Pro Edition</p>
              </div>
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* User Profile Card */}
          <Card className="border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-purple-500/5 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary font-bold text-lg">
                    {user ? getInitials(user.username) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-base truncate">
                    {user?.username || 'Guest User'}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                      <Star className="w-3 h-3 mr-1" />
                      {user?.totalPoints || 0} pts
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Level {Math.floor((user?.totalPoints || 0) / 100) + 1}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-border/20">
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">{user?.quizzesCompleted || 0}</div>
                  <div className="text-xs text-muted-foreground">Quizzes</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-500">{user?.averageScore || 0}%</div>
                  <div className="text-xs text-muted-foreground">Avg Score</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-500">#{user?.rank || '--'}</div>
                  <div className="text-xs text-muted-foreground">Rank</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Navigation</h3>
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            </div>
            
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = location === item.path || activeSection === item.id;
                const Icon = item.icon;
                
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => handleNavigation(item)}
                    className={`
                      w-full justify-start p-4 h-auto group transition-all duration-300 hover:scale-[1.02]
                      ${isActive 
                        ? `${item.bgColor} ${item.borderColor} border-2 shadow-lg ${item.color} font-semibold` 
                        : 'hover:bg-accent/50 border-2 border-transparent hover:border-border/30'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300
                        ${isActive 
                          ? `${item.bgColor} border ${item.borderColor}` 
                          : 'bg-muted/50 group-hover:bg-accent'
                        }
                      `}>
                        <Icon className={`w-5 h-5 ${isActive ? item.color : 'text-muted-foreground group-hover:text-foreground'}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className={`text-sm font-medium ${isActive ? item.color : 'text-foreground group-hover:text-foreground'}`}>
                          {item.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                      {isActive && (
                        <ChevronRight className={`w-4 h-4 ${item.color}`} />
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Quick Actions</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation('/quiz')}
                className="h-12 flex-col space-y-1 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30"
              >
                <Play className="w-4 h-4 text-purple-500" />
                <span className="text-xs text-purple-700 dark:text-purple-400 font-medium">Quick Quiz</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation('/leaderboard')}
                className="h-12 flex-col space-y-1 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
              >
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-xs text-yellow-700 dark:text-yellow-400 font-medium">Rankings</span>
              </Button>
            </div>
          </div>

          {/* Settings & Logout */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={() => setLocation('/settings')}
              className="w-full justify-start space-x-3 text-muted-foreground hover:text-foreground"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start space-x-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}