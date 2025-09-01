import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import Dashboard from "@/components/dashboard/dashboard";
import QuizSelection from "@/components/quiz/quiz-selection";
import ActiveQuiz from "@/components/quiz/active-quiz";
import QuizResults from "@/components/quiz/quiz-results";
import Leaderboard from "@/components/leaderboard/leaderboard";
import Profile from "@/components/profile/profile";
import { useQuizState } from "@/hooks/use-quiz-state";

export type Section = "dashboard" | "quiz" | "leaderboard" | "profile";

export default function HomePage() {
  // Load persisted section from localStorage
  const getInitialSection = (): Section => {
    try {
      // First check if there's a quiz state that should take precedence
      const saved = localStorage.getItem('quizState');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Return quiz section if there's an active quiz, quiz results, or current quiz
        if (parsed.currentQuiz && (parsed.isQuizActive || parsed.quizResults)) {
          return "quiz";
        }
      }
      
      // Then check saved section
      const savedSection = localStorage.getItem('currentSection');
      if (savedSection && ['dashboard', 'quiz', 'leaderboard', 'profile'].includes(savedSection)) {
        return savedSection as Section;
      }
    } catch (error) {
      console.warn('Failed to load persisted section:', error);
    }
    return "dashboard";
  };

  const [currentSection, setCurrentSection] = useState<Section>(getInitialSection);
  const { quizState, setCurrentQuiz, setQuizResults, resetQuizState } = useQuizState();

  const handleSectionChange = (section: Section) => {
    setCurrentSection(section);
    // Always save current section to localStorage
    try {
      localStorage.setItem('currentSection', section);
    } catch (error) {
      console.warn('Failed to save section:', error);
    }
  };

  const handleQuizStart = (quiz: any) => {
    setCurrentQuiz(quiz);
  };

  const handleQuizComplete = (results: any) => {
    setQuizResults(results);
  };

  const handleStartQuiz = () => {
    // Clear any existing quiz state when starting fresh
    resetQuizState();
    setCurrentSection("quiz");
  };

  const renderContent = () => {
    switch (currentSection) {
      case "dashboard":
        return <Dashboard onStartQuiz={handleStartQuiz} />;
      case "quiz":
        // Show results if available
        if (quizState.quizResults && quizState.currentQuiz) {
          return (
            <QuizResults
              results={quizState.quizResults}
              onTakeAnother={() => {
                resetQuizState();
                setCurrentSection("quiz");
              }}
              onViewLeaderboard={() => {
                setCurrentSection("leaderboard");
              }}
            />
          );
        }
        // Show active quiz if there's a current quiz and it's active
        if (quizState.currentQuiz && quizState.isQuizActive) {
          return (
            <ActiveQuiz
              quiz={quizState.currentQuiz}
              onQuizComplete={handleQuizComplete}
            />
          );
        }
        // Show quiz selection by default
        return <QuizSelection onQuizStart={handleQuizStart} />;
      case "leaderboard":
        return <Leaderboard />;
      case "profile":
        return <Profile />;
      default:
        return <Dashboard onStartQuiz={handleStartQuiz} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
      />
      <div className="flex">
        <Sidebar 
          currentSection={currentSection} 
          onSectionChange={handleSectionChange} 
        />
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}