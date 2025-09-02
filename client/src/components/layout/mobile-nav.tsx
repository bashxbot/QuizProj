
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
    <div className="mobile-nav lg:hidden">
      <div className="flex justify-around items-center bg-glass-heavy backdrop-blur-lg border-t border-white/10">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id || location === tab.href;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={cn(
                "mobile-nav-item flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 min-h-[60px] min-w-[60px]",
                isActive 
                  ? "bg-primary/20 text-primary scale-105" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5 active:scale-95"
              )}
            >
              <tab.icon className={cn(
                "mobile-icon mb-1 transition-colors duration-200",
                isActive ? "text-primary" : tab.color
              )} />
              <span className={cn(
                "text-xs font-medium transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Action Button */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
        <button
          onClick={() => {
            setActiveTab('quiz');
            navigate('/quiz');
          }}
          className="w-12 h-12 bg-gradient-to-r from-primary to-purple-400 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <Brain className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default MobileNav;
