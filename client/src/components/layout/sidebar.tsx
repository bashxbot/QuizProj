
import React from 'react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  LayoutDashboard, 
  Brain, 
  Trophy, 
  User, 
  Settings, 
  LogOut, 
  Home,
  Target,
  BookOpen,
  Award,
  TrendingUp,
  Calendar,
  BarChart3,
  Users,
  Clock,
  Star,
  Zap,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface SidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapsed?: () => void;
}

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Overview and statistics',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    hoverColor: 'hover:bg-blue-500/20'
  },
  {
    id: 'quiz',
    label: 'Take Quiz',
    icon: Brain,
    description: 'Start a new quiz',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    hoverColor: 'hover:bg-purple-500/20'
  },
  {
    id: 'leaderboard',
    label: 'Leaderboard',
    icon: Trophy,
    description: 'View rankings',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    hoverColor: 'hover:bg-yellow-500/20'
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    description: 'Manage your account',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    hoverColor: 'hover:bg-green-500/20'
  }
];

const quickActions = [
  {
    id: 'daily-quiz',
    label: 'Daily Challenge',
    icon: Calendar,
    description: 'Complete today\'s challenge',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  },
  {
    id: 'practice',
    label: 'Practice Mode',
    icon: Target,
    description: 'Sharpen your skills',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10'
  },
  {
    id: 'achievements',
    label: 'Achievements',
    icon: Award,
    description: 'View your progress',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10'
  }
];

export function Sidebar({ 
  currentSection, 
  onSectionChange, 
  className,
  isCollapsed = false,
  onToggleCollapsed
}: SidebarProps) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">QuizMaster</h2>
                <p className="text-xs text-muted-foreground">Pro Edition</p>
              </div>
            </div>
          )}
          {onToggleCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapsed}
              className="ml-auto p-2 h-8 w-8"
            >
              {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          )}
        </div>

        {/* User Info */}
        {user && !isCollapsed && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.username || 'User'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user.totalPoints || 0} points
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          <div className="mb-4">
            {!isCollapsed && (
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Main Navigation
              </h3>
            )}
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = currentSection === item.id;
                const Icon = item.icon;
                
                return (
                  <TooltipProvider key={item.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          size={isCollapsed ? "sm" : "default"}
                          onClick={() => onSectionChange(item.id)}
                          className={cn(
                            "w-full justify-start group transition-all duration-200",
                            isCollapsed ? "px-2" : "px-3",
                            isActive 
                              ? `${item.bgColor} ${item.color} border border-current/20` 
                              : `${item.hoverColor} hover:${item.color}`,
                            "relative overflow-hidden"
                          )}
                        >
                          <div className={cn(
                            "flex items-center",
                            isCollapsed ? "justify-center" : "justify-start space-x-3"
                          )}>
                            <Icon className={cn(
                              "h-5 w-5 transition-colors",
                              isActive ? item.color : "text-muted-foreground group-hover:" + item.color
                            )} />
                            {!isCollapsed && (
                              <>
                                <span className="font-medium">{item.label}</span>
                                {isActive && (
                                  <ChevronRight className="h-4 w-4 ml-auto opacity-60" />
                                )}
                              </>
                            )}
                          </div>
                          
                          {/* Active indicator */}
                          {isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-current rounded-r-full" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent side="right" className="flex flex-col">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-xs text-muted-foreground">{item.description}</span>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </nav>
          </div>

          <Separator className="my-4" />

          {/* Quick Actions */}
          <div className="mb-4">
            {!isCollapsed && (
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Quick Actions
              </h3>
            )}
            <div className="space-y-1">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <TooltipProvider key={action.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size={isCollapsed ? "sm" : "default"}
                          onClick={() => {
                            if (action.id === 'daily-quiz') {
                              onSectionChange('quiz');
                            } else if (action.id === 'practice') {
                              onSectionChange('quiz');
                            } else if (action.id === 'achievements') {
                              onSectionChange('profile');
                            }
                          }}
                          className={cn(
                            "w-full justify-start group transition-all duration-200",
                            isCollapsed ? "px-2" : "px-3",
                            `hover:${action.bgColor} hover:${action.color}`
                          )}
                        >
                          <div className={cn(
                            "flex items-center",
                            isCollapsed ? "justify-center" : "justify-start space-x-3"
                          )}>
                            <Icon className={cn(
                              "h-4 w-4 transition-colors",
                              `text-muted-foreground group-hover:${action.color}`
                            )} />
                            {!isCollapsed && (
                              <span className="text-sm font-medium">{action.label}</span>
                            )}
                          </div>
                        </Button>
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent side="right" className="flex flex-col">
                          <span className="font-medium">{action.label}</span>
                          <span className="text-xs text-muted-foreground">{action.description}</span>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Stats Section */}
          {!isCollapsed && user && (
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Your Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">Total Points</span>
                  </div>
                  <Badge variant="secondary" className="font-bold">
                    {user.totalPoints || 0}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Quizzes Taken</span>
                  </div>
                  <Badge variant="secondary" className="font-bold">
                    {user.quizzesCompleted || 0}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">Avg Score</span>
                  </div>
                  <Badge variant="secondary" className="font-bold">
                    {user.averageScore ? `${Math.round(user.averageScore)}%` : '0%'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-3 border-t border-border/50 space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={isCollapsed ? "sm" : "default"}
                onClick={() => onSectionChange('settings')}
                className={cn(
                  "w-full justify-start group transition-all duration-200",
                  isCollapsed ? "px-2" : "px-3",
                  "hover:bg-gray-500/10 hover:text-gray-600"
                )}
              >
                <div className={cn(
                  "flex items-center",
                  isCollapsed ? "justify-center" : "justify-start space-x-3"
                )}>
                  <Settings className="h-5 w-5" />
                  {!isCollapsed && <span className="font-medium">Settings</span>}
                </div>
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <span>Settings</span>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={isCollapsed ? "sm" : "default"}
                onClick={handleLogout}
                className={cn(
                  "w-full justify-start group transition-all duration-200",
                  isCollapsed ? "px-2" : "px-3",
                  "hover:bg-red-500/10 hover:text-red-600"
                )}
              >
                <div className={cn(
                  "flex items-center",
                  isCollapsed ? "justify-center" : "justify-start space-x-3"
                )}>
                  <LogOut className="h-5 w-5" />
                  {!isCollapsed && <span className="font-medium">Logout</span>}
                </div>
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <span>Logout</span>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );

  return (
    <aside className={cn(
      "bg-card border-r border-border/50 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-72",
      "hidden md:flex flex-col",
      className
    )}>
      <SidebarContent />
    </aside>
  );
}

// Mobile Sidebar Component
export function MobileSidebar({ 
  currentSection, 
  onSectionChange, 
  isOpen, 
  onClose 
}: {
  currentSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    onClose();
  };

  return (
    <div className={cn(
      "fixed inset-0 z-50 md:hidden",
      isOpen ? "pointer-events-auto" : "pointer-events-none"
    )}>
      {/* Backdrop */}
      <div 
        className={cn(
          "absolute inset-0 bg-black/60 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-80 bg-card border-r border-border/50 transform transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">QuizMaster</h2>
                  <p className="text-xs text-muted-foreground">Pro Edition</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* User Info */}
            {user && (
              <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.username?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.username || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.totalPoints || 0} points
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <div className="space-y-2">
              <div className="mb-4">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Main Navigation
                </h3>
                <nav className="space-y-1">
                  {navigationItems.map((item) => {
                    const isActive = currentSection === item.id;
                    const Icon = item.icon;
                    
                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? "secondary" : "ghost"}
                        size="default"
                        onClick={() => handleSectionChange(item.id)}
                        className={cn(
                          "w-full justify-start group transition-all duration-200 px-3",
                          isActive 
                            ? `${item.bgColor} ${item.color} border border-current/20` 
                            : `${item.hoverColor} hover:${item.color}`,
                          "relative overflow-hidden"
                        )}
                      >
                        <div className="flex items-center justify-start space-x-3">
                          <Icon className={cn(
                            "h-5 w-5 transition-colors",
                            isActive ? item.color : "text-muted-foreground group-hover:" + item.color
                          )} />
                          <span className="font-medium">{item.label}</span>
                          {isActive && (
                            <ChevronRight className="h-4 w-4 ml-auto opacity-60" />
                          )}
                        </div>
                        
                        {/* Active indicator */}
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-current rounded-r-full" />
                        )}
                      </Button>
                    );
                  })}
                </nav>
              </div>

              <Separator className="my-4" />

              {/* Quick Actions */}
              <div className="mb-4">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Quick Actions
                </h3>
                <div className="space-y-1">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={action.id}
                        variant="ghost"
                        size="default"
                        onClick={() => {
                          if (action.id === 'daily-quiz') {
                            handleSectionChange('quiz');
                          } else if (action.id === 'practice') {
                            handleSectionChange('quiz');
                          } else if (action.id === 'achievements') {
                            handleSectionChange('profile');
                          }
                        }}
                        className={cn(
                          "w-full justify-start group transition-all duration-200 px-3",
                          `hover:${action.bgColor} hover:${action.color}`
                        )}
                      >
                        <div className="flex items-center justify-start space-x-3">
                          <Icon className={cn(
                            "h-4 w-4 transition-colors",
                            `text-muted-foreground group-hover:${action.color}`
                          )} />
                          <span className="text-sm font-medium">{action.label}</span>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Stats Section */}
              {user && (
                <div className="px-3 py-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Your Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">Total Points</span>
                      </div>
                      <Badge variant="secondary" className="font-bold">
                        {user.totalPoints || 0}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Quizzes Taken</span>
                      </div>
                      <Badge variant="secondary" className="font-bold">
                        {user.quizzesCompleted || 0}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium">Avg Score</span>
                      </div>
                      <Badge variant="secondary" className="font-bold">
                        {user.averageScore ? `${Math.round(user.averageScore)}%` : '0%'}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer Actions */}
          <div className="p-3 border-t border-border/50 space-y-2">
            <Button
              variant="ghost"
              size="default"
              onClick={() => handleSectionChange('settings')}
              className="w-full justify-start px-3 hover:bg-gray-500/10 hover:text-gray-600"
            >
              <div className="flex items-center justify-start space-x-3">
                <Settings className="h-5 w-5" />
                <span className="font-medium">Settings</span>
              </div>
            </Button>

            <Button
              variant="ghost"
              size="default"
              onClick={handleLogout}
              className="w-full justify-start px-3 hover:bg-red-500/10 hover:text-red-600"
            >
              <div className="flex items-center justify-start space-x-3">
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
