
import { Brain, BarChart3, Play, Trophy, User, Sparkles, Crown, Zap, Star } from "lucide-react";
import type { Section } from "@/pages/home-page";

interface SidebarProps {
  currentSection: Section;
  onSectionChange: (section: Section) => void;
}

export default function Sidebar({ currentSection, onSectionChange }: SidebarProps) {
  const navItems = [
    { 
      key: "dashboard" as const, 
      label: "Command Center", 
      icon: BarChart3, 
      gradient: "from-blue-500 to-cyan-500",
      description: "Overview & Analytics",
      badge: "New"
    },
    { 
      key: "quiz" as const, 
      label: "Quiz Arena", 
      icon: Play, 
      gradient: "from-purple-500 to-pink-500",
      description: "Challenge Yourself",
      badge: "Hot"
    },
    { 
      key: "leaderboard" as const, 
      label: "Hall of Fame", 
      icon: Trophy, 
      gradient: "from-yellow-500 to-orange-500",
      description: "Global Rankings",
      badge: "Live"
    },
    { 
      key: "profile" as const, 
      label: "Your Profile", 
      icon: User, 
      gradient: "from-green-500 to-emerald-500",
      description: "Settings & Stats",
      badge: null
    },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-80 xl:w-96">
      {/* Enhanced Sidebar Container */}
      <div className="h-full glass-morphism border-r border-white/20 backdrop-blur-xl">
        <div className="flex-1 flex flex-col overflow-y-auto">
          
          {/* Revolutionary Header Section */}
          <div className="p-8 border-b border-white/10">
            <div className="relative group">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              
              <div className="relative flex items-center space-x-6 p-6 glass-morphism rounded-3xl border border-white/20 hover:border-primary/40 transition-all duration-500 group-hover:scale-105">
                <div className="relative">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/30 animate-pulse-glow">
                    <Brain className="h-8 w-8 text-white animate-float" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce flex items-center justify-center">
                    <Crown className="h-4 w-4 text-white" />
                  </div>
                  {/* Orbit Animation */}
                  <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-spin" style={{animationDuration: "8s"}}></div>
                  <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-3xl font-black gradient-text">QuizMaster</span>
                    <Sparkles className="h-5 w-5 text-yellow-400 animate-sparkle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Pro Edition</div>
                    <div className="glass-morphism px-3 py-1 rounded-xl border border-green-500/30">
                      <span className="text-green-400 text-sm font-bold">PREMIUM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Navigation */}
          <nav className="flex-1 p-6 space-y-4">
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white/90 mb-6 flex items-center">
                <Zap className="h-5 w-5 mr-3 text-yellow-400" />
                Navigation Hub
              </h3>
              
              <div className="space-y-3">
                {navItems.map((item, index) => (
                  <button
                    key={item.key}
                    className={`w-full group relative overflow-hidden rounded-2xl transition-all duration-500 ${
                      currentSection === item.key 
                        ? "glass-morphism border-2 border-primary/60 bg-gradient-to-r from-primary/20 to-accent/20 shadow-2xl shadow-primary/30" 
                        : "text-white/70 hover:text-white hover:glass-morphism hover:border hover:border-white/30"
                    }`}
                    onClick={() => onSectionChange(item.key)}
                    data-testid={`sidebar-${item.key}`}
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    {/* Animated Background */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-10 animate-shimmer`}></div>
                    </div>
                    
                    <div className="relative p-6 flex items-center space-x-4">
                      {/* Enhanced Icon Container */}
                      <div className="relative">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                          <item.icon className="h-6 w-6 text-white" />
                        </div>
                        
                        {/* Badge */}
                        {item.badge && (
                          <div className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg text-xs font-bold text-white animate-pulse">
                            {item.badge}
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-lg group-hover:text-white transition-colors duration-300">
                            {item.label}
                          </span>
                          {currentSection === item.key && (
                            <Star className="h-5 w-5 text-yellow-400 animate-sparkle" />
                          )}
                        </div>
                        <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Active Indicator */}
                    {currentSection === item.key && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-primary to-accent rounded-r-full animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Enhanced Stats Section */}
          <div className="p-6 border-t border-white/10">
            <div className="modern-card p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                <Trophy className="h-5 w-5 mr-3 text-yellow-400" />
                Your Progress
              </h3>
              
              <div className="space-y-4">
                {[
                  { label: "Quizzes Completed", value: "42", icon: Play, color: "text-blue-400" },
                  { label: "Current Streak", value: "7 days", icon: Zap, color: "text-yellow-400" },
                  { label: "Global Rank", value: "#234", icon: Trophy, color: "text-green-400" }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                      <span className="text-white/70 group-hover:text-white transition-colors duration-300">{stat.label}</span>
                    </div>
                    <span className={`font-bold ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Power User Badge */}
          <div className="p-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 p-6 group hover:scale-105 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-shimmer"></div>
              <div className="relative flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse-glow">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-white mb-1">Power User</div>
                  <div className="text-sm text-white/60">Unlock premium features</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
