import { useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Dashboard } from "@/components/dashboard/dashboard";
import QuizSelection from "@/components/quiz/quiz-selection";
import ActiveQuiz from "@/components/quiz/active-quiz";
import QuizResults from "@/components/quiz/quiz-results";
import Leaderboard from "@/components/leaderboard/leaderboard";
import Profile from "@/components/profile/profile";
import MobileNav from "@/components/layout/mobile-nav";
import { useQuizState } from "@/hooks/use-quiz-state";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

export type Section = "dashboard" | "quiz" | "leaderboard" | "profile" | "settings" | "achievements" | "stats";

export default function HomePage() {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [activeTab, setActiveTab] = useState("dashboard");
  const { quizState, setCurrentQuiz, setIsQuizActive, resetQuizState } = useQuizState();

  // Generate quiz mutation
  const generateQuizMutation = useMutation({
    mutationFn: async ({ topic, difficulty }: { topic: string; difficulty: string }) => {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          field: topic,
          questionCount: 10,
          difficulty: difficulty
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to generate quiz');
      }

      return response.json();
    },
    onSuccess: (quiz) => {
      setCurrentQuiz(quiz);
      setIsQuizActive(true);
      setActiveSection("quiz");
    },
    onError: (error) => {
      console.error('Quiz generation failed:', error);
      alert('Failed to generate quiz. Please try again.');
    }
  });

  const handleStartQuiz = (topic: string, difficulty: string) => {
    generateQuizMutation.mutate({ topic, difficulty });
  };

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    setActiveTab(section);
    // Close mobile sidebar
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const renderMainContent = () => {
    // Handle quiz flow
    if (quizState.isQuizActive && quizState.currentQuiz) {
      if (quizState.quizResults) {
        return (
          <QuizResults 
            onTakeAnother={() => {
              resetQuizState();
              setActiveSection("quiz");
            }}
            onViewLeaderboard={() => setActiveSection("leaderboard")}
          />
        );
      }
      return <ActiveQuiz />;
    }

    // Handle section-based navigation
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "quiz":
        return (
          <QuizSelection 
            onStartQuiz={handleStartQuiz}
            isLoading={generateQuizMutation.isPending}
          />
        );
      case "leaderboard":
        return <Leaderboard />;
      case "profile":
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  // Determine current section based on URL or quiz state
  const getCurrentSection = (): Section => {
    if (quizState.isQuizActive) return "quiz";

    if (location.includes('/quiz')) return "quiz";
    if (location.includes('/leaderboard')) return "leaderboard";
    if (location.includes('/profile')) return "profile";
    if (location.includes('/achievements')) return "achievements";
    if (location.includes('/stats')) return "stats";

    return "dashboard";
  };

  // Update active section when location changes
  useState(() => {
    const currentSection = getCurrentSection();
    setActiveSection(currentSection);
    setActiveTab(currentSection);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-glass-heavy backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="btn-icon btn-glass"
            aria-label="Open menu"
          >
            <Menu className="mobile-icon" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center">
              <span className="text-white text-xs font-bold">Q</span>
            </div>
            <span className="font-bold text-white">QuizApp</span>
          </div>

          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Desktop Navbar */}
      <div className="hidden lg:block">
        <Navbar 
          onSectionChange={handleSectionChange}
          activeSection={activeSection}
        />
      </div>

      {/* Layout Container */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:relative lg:translate-x-0"
        />

        {/* Main Content */}
        <main className={cn(
          "flex-1 min-h-screen transition-all duration-300",
          "pt-20 lg:pt-0", // Add top padding for mobile header
          "pb-20 lg:pb-0", // Add bottom padding for mobile nav
          isSidebarOpen && "lg:ml-0" // No margin adjustment needed on desktop
        )}>
          <div className="container mx-auto">
            {renderMainContent()}
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav 
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          handleSectionChange(tab as Section);
        }}
      />

      {/* Loading Overlay */}
      {generateQuizMutation.isPending && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="modern-card p-8 text-center max-w-sm mx-4">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="mobile-text-lg font-semibold mb-2">Generating Your Quiz</h3>
            <p className="mobile-text-sm text-muted-foreground">
              Creating personalized questions just for you...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}