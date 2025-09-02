
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
import { Sparkles, Zap, Crown } from "lucide-react";

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

  const getSectionTitle = () => {
    switch (currentSection) {
      case "dashboard":
        return "Command Center";
      case "quiz":
        if (quizState.quizResults && quizState.currentQuiz) {
          return "Quiz Results";
        }
        if (quizState.currentQuiz && quizState.isQuizActive) {
          return "Active Challenge";
        }
        return "Quiz Arena";
      case "leaderboard":
        return "Hall of Fame";
      case "profile":
        return "Your Profile";
      default:
        return "QuizMaster Pro";
    }
  };

  const getSectionDescription = () => {
    switch (currentSection) {
      case "dashboard":
        return "Your learning journey starts here. Track progress, view achievements, and discover new challenges.";
      case "quiz":
        if (quizState.quizResults && quizState.currentQuiz) {
          return "Challenge completed! Review your performance and see how you stack up.";
        }
        if (quizState.currentQuiz && quizState.isQuizActive) {
          return "Test your knowledge and push your limits. Every question counts!";
        }
        return "Choose your battlefield. Select a topic and difficulty to begin your challenge.";
      case "leaderboard":
        return "See how you rank against other quiz masters. Climb the ranks and claim your crown!";
      case "profile":
        return "Manage your account, view statistics, and customize your quiz experience.";
      default:
        return "Welcome to the ultimate quiz experience.";
    }
  };

  const renderContent = () => {
    switch (currentSection) {
      case "dashboard":
        return <Dashboard onSectionChange={handleSectionChange} />;
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
        return <QuizSelection onStartQuiz={handleQuizStart} isLoading={false} />;
      case "leaderboard":
        return <Leaderboard />;
      case "profile":
        return <Profile />;
      default:
        return <Dashboard onSectionChange={handleSectionChange} />;
    }
  };

  return (
    <div className="page-container">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full animate-float" style={{animationDelay: "2s"}}></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full animate-float" style={{animationDelay: "4s"}}></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full animate-float" style={{animationDelay: "1s"}}></div>
      </div>

      <Navbar 
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
      />
      
      <div className="flex pt-20 min-h-screen">
        <Sidebar 
          currentSection={currentSection} 
          onSectionChange={handleSectionChange} 
        />
        
        <main className="flex-1 relative z-10">
          {/* Enhanced Page Header */}
          <div className="sticky top-20 z-20 backdrop-blur-xl bg-slate-900/50 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/30 animate-pulse-glow">
                      <Crown className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce">
                      <Sparkles className="h-4 w-4 text-white m-1" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-black gradient-text leading-tight animate-slide-in">
                      {getSectionTitle()}
                    </h1>
                    <p className="text-lg text-white/70 mt-2 animate-slide-in" style={{animationDelay: "0.2s"}}>
                      {getSectionDescription()}
                    </p>
                  </div>
                </div>
                
                <div className="hidden lg:flex items-center space-x-4 animate-slide-in" style={{animationDelay: "0.4s"}}>
                  <div className="glass-morphism px-6 py-3 rounded-2xl border border-primary/30">
                    <div className="flex items-center space-x-3">
                      <Zap className="h-5 w-5 text-yellow-400 animate-sparkle" />
                      <span className="text-white font-semibold">Pro Member</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="px-6 md:px-8 lg:px-12 py-8 lg:py-12">
            <div className="max-w-7xl mx-auto">
              <div className="animate-slide-up">
                {renderContent()}
              </div>
            </div>
          </div>

          {/* Enhanced Footer */}
          <footer className="mt-16 border-t border-white/10 bg-slate-900/50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-2xl font-black gradient-text">QuizMaster</span>
                      <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent -mt-1">Pro</div>
                    </div>
                  </div>
                  <p className="text-white/60 text-lg leading-relaxed mb-6">
                    The ultimate AI-powered quiz platform. Challenge yourself, compete with others, and expand your knowledge across countless topics.
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="glass-morphism px-4 py-2 rounded-xl border border-green-500/30">
                      <span className="text-green-400 font-semibold">✨ AI-Powered</span>
                    </div>
                    <div className="glass-morphism px-4 py-2 rounded-xl border border-blue-500/30">
                      <span className="text-blue-400 font-semibold">🚀 Real-time</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Dashboard", action: () => handleSectionChange("dashboard") },
                      { label: "Take Quiz", action: () => handleSectionChange("quiz") },
                      { label: "Leaderboard", action: () => handleSectionChange("leaderboard") },
                      { label: "Profile", action: () => handleSectionChange("profile") }
                    ].map((link, i) => (
                      <button
                        key={i}
                        onClick={link.action}
                        className="block text-white/60 hover:text-white transition-colors duration-300 hover:translate-x-2"
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Stats</h3>
                  <div className="space-y-4">
                    <div className="glass-morphism p-4 rounded-xl border border-white/10">
                      <div className="text-2xl font-bold gradient-text">1M+</div>
                      <div className="text-white/60">Questions Answered</div>
                    </div>
                    <div className="glass-morphism p-4 rounded-xl border border-white/10">
                      <div className="text-2xl font-bold gradient-text">50K+</div>
                      <div className="text-white/60">Active Users</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p className="text-white/50 text-center md:text-left">
                  © 2024 QuizMaster Pro. Powered by cutting-edge AI technology.
                </p>
                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                  <Sparkles className="h-4 w-4 text-yellow-400 animate-sparkle" />
                  <span className="text-white/60">Made with passion for learning</span>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
