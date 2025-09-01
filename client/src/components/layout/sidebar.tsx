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
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-card border-r border-border">
      <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-semibold text-foreground ml-3">QuizMaster Pro</span>
        </div>
        
        <nav className="mt-4 flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`nav-item w-full text-left flex items-center ${
                currentSection === item.key ? "active" : ""
              }`}
              onClick={() => onSectionChange(item.key)}
              data-testid={`sidebar-${item.key}`}
            >
              <i className={`${item.icon} mr-3 text-sm`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
