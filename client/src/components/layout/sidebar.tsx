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
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-6">
          <Brain className="h-8 w-8 text-primary mr-2" />
          <span className="text-lg font-bold">QuizMaster Pro</span>
        </div>
        
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors w-full text-left ${
                currentSection === item.key
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted hover:text-foreground"
              }`}
              onClick={() => onSectionChange(item.key)}
              data-testid={`sidebar-${item.key}`}
            >
              <i className={`${item.icon} mr-3 ${
                currentSection === item.key 
                  ? "text-primary-foreground" 
                  : "text-muted-foreground group-hover:text-foreground"
              }`}></i>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
