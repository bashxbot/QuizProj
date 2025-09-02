
import React from 'react';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Trophy, 
  User, 
  Settings, 
  BarChart3,
  Brain,
  Calendar,
  Target,
  Award,
  Users,
  BookOpen,
  Heart
} from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const [location, navigate] = useLocation();

  const tabs = [
    { 
      id: 'dashboard', 
      label: 'Home', 
      icon: Home, 
      href: '/',
      color: 'text-blue-400'
    },
    { 
      id: 'quiz', 
      label: 'Quiz', 
      icon: Brain, 
      href: '/quiz',
      color: 'text-purple-400'
    },
    { 
      id: 'leaderboard', 
      label: 'Ranking', 
      icon: Trophy, 
      href: '/leaderboard',
      color: 'text-yellow-400'
    },
    { 
      id: 'stats', 
      label: 'Stats', 
      icon: BarChart3, 
      href: '/stats',
      color: 'text-orange-400'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User, 
      href: '/profile',
      color: 'text-green-400'
    },
  ];

  const handleTabClick = (tab: any) => {
    setActiveTab(tab.id);
    if (tab.href && tab.href !== location) {
      navigate(tab.href);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      <div className="flex justify-around items-center bg-background/95 backdrop-blur-lg border-t border-border/50 px-2 py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id || location === tab.href;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-h-[48px] min-w-[48px] relative",
                isActive 
                  ? "bg-primary/20 text-primary scale-105" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 active:scale-95"
              )}
            >
              <tab.icon className={cn(
                "h-5 w-5 mb-0.5 transition-colors duration-200",
                isActive ? "text-primary" : tab.color
              )} />
              <span className={cn(
                "text-[10px] font-medium transition-colors duration-200 leading-tight",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Action Button */}
      <div className="absolute -top-7 left-1/2 transform -translate-x-1/2">
        <button
          onClick={() => {
            setActiveTab('quiz');
            navigate('/quiz');
          }}
          className="w-14 h-14 bg-gradient-to-r from-primary to-purple-500 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 border-4 border-background"
        >
          <Brain className="w-7 h-7 text-white" />
        </button>
      </div>
    </div>
  );
};

export default MobileNav;
