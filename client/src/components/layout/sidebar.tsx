import { Brain, BarChart3, Play, Trophy, User } from "lucide-react";
import type { Section } from "@/pages/home-page";

interface SidebarProps {
  currentSection: Section;
  onSectionChange: (section: Section) => void;
}

export default function Sidebar({ currentSection, onSectionChange }: SidebarProps) {
  const navItems = [
    { key: "dashboard" as const, label: "Dashboard", icon: BarChart3, gradient: "from-blue-500 to-cyan-500" },
    { key: "quiz" as const, label: "Take Quiz", icon: Play, gradient: "from-purple-500 to-pink-500" },
    { key: "leaderboard" as const, label: "Leaderboard", icon: Trophy, gradient: "from-yellow-500 to-orange-500" },
    { key: "profile" as const, label: "Profile", icon: User, gradient: "from-green-500 to-emerald-500" },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 glass-morphism border-r border-white/20">
      <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6 mb-8">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25 animate-pulse-glow">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce">
              <div className="w-2 h-2 bg-white rounded-full m-1"></div>
            </div>
          </div>
          <div className="ml-4">
            <span className="text-2xl font-black gradient-text">QuizMaster</span>
            <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent -mt-1">Pro</div>
          </div>
        </div>
        
        <nav className="mt-4 flex-1 px-4 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`w-full text-left flex items-center space-x-3 p-4 rounded-2xl transition-all duration-300 group ${
                currentSection === item.key 
                  ? "glass-morphism border border-primary bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white shadow-lg shadow-primary/25" 
                  : "text-white/70 hover:text-white hover:bg-white/5 hover:glass-morphism hover:border hover:border-white/20"
              }`}
              onClick={() => onSectionChange(item.key)}
              data-testid={`sidebar-${item.key}`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-lg">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
