import { Brain } from "lucide-react";
import type { Section } from "@/pages/home-page";

interface SidebarProps {
  currentSection: Section;
  onSectionChange: (section: Section) => void;
}

export default function Sidebar({ currentSection, onSectionChange }: SidebarProps) {
  const navItems = [
    { key: "dashboard" as const, label: "Dashboard", icon: "fas fa-tachometer-alt" },
    { key: "quiz" as const, label: "Take Quiz", icon: "fas fa-play-circle" },
    { key: "leaderboard" as const, label: "Leaderboard", icon: "fas fa-trophy" },
    { key: "profile" as const, label: "Profile", icon: "fas fa-user" },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 glass-morphism border-r border-primary/20 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/2 via-transparent to-accent/2"></div>
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/5 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-accent/5 blur-2xl animate-pulse delay-1000"></div>
      
      <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto relative z-10">
        <div className="flex items-center flex-shrink-0 px-6 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-75 animate-pulse"></div>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
              <Brain className="h-6 w-6 text-primary float" />
            </div>
          </div>
          <span className="text-xl font-black gradient-text ml-3">QuizMaster Pro</span>
        </div>
        
        <nav className="mt-4 flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`group flex items-center px-4 py-4 text-sm font-semibold rounded-xl transition-all duration-300 w-full text-left relative overflow-hidden ${
                currentSection === item.key
                  ? "glass-morphism border border-primary/30 text-primary shadow-lg shadow-primary/10"
                  : "text-foreground hover:glass-effect hover:text-primary hover:scale-105"
              }`}
              onClick={() => onSectionChange(item.key)}
              data-testid={`sidebar-${item.key}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                currentSection === item.key ? "opacity-100" : ""
              }`}></div>
              <i className={`${item.icon} mr-4 relative z-10 ${
                currentSection === item.key 
                  ? "text-primary sparkle" 
                  : "text-muted-foreground group-hover:text-primary"
              }`}></i>
              <span className="relative z-10">{item.label}</span>
              {currentSection === item.key && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-primary pulse-glow"></div>
              )}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
