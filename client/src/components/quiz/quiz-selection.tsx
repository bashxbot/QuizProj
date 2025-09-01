
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, Play, Clock, Star, Zap, BookOpen, Globe, 
  Cpu, Atom, Palette, Music, Trophy, Rocket, Sparkles,
  ChevronRight, Target, Award, Crown, Flame
} from "lucide-react";

interface QuizSelectionProps {
  onStartQuiz: (topic: string, difficulty: string) => void;
  isLoading: boolean;
}

export default function QuizSelection({ onStartQuiz, isLoading }: QuizSelectionProps) {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const topics = [
    { 
      id: "javascript", 
      name: "JavaScript", 
      icon: Cpu, 
      description: "Modern web development",
      gradient: "from-yellow-400 to-orange-500",
      popularity: 95
    },
    { 
      id: "python", 
      name: "Python", 
      icon: Brain, 
      description: "Data science & AI",
      gradient: "from-blue-500 to-cyan-500",
      popularity: 92
    },
    { 
      id: "react", 
      name: "React", 
      icon: Atom, 
      description: "Frontend frameworks",
      gradient: "from-cyan-400 to-blue-500",
      popularity: 88
    },
    { 
      id: "nodejs", 
      name: "Node.js", 
      icon: Globe, 
      description: "Backend development",
      gradient: "from-green-500 to-emerald-600",
      popularity: 85
    },
    { 
      id: "css", 
      name: "CSS", 
      icon: Palette, 
      description: "Styling & design",
      gradient: "from-purple-500 to-pink-600",
      popularity: 78
    },
    { 
      id: "algorithms", 
      name: "Algorithms", 
      icon: Target, 
      description: "Problem solving",
      gradient: "from-red-500 to-rose-600",
      popularity: 82
    },
  ];

  const difficulties = [
    { 
      id: "easy", 
      name: "Easy", 
      description: "Perfect for beginners",
      icon: Star,
      gradient: "from-green-400 to-emerald-500",
      time: "5-10 min"
    },
    { 
      id: "medium", 
      name: "Medium", 
      description: "Good challenge level",
      icon: Zap,
      gradient: "from-yellow-400 to-orange-500",
      time: "10-15 min"
    },
    { 
      id: "hard", 
      name: "Hard", 
      description: "For experts only",
      icon: Flame,
      gradient: "from-red-500 to-pink-600",
      time: "15-20 min"
    },
  ];

  const handleStartQuiz = () => {
    if (selectedTopic && selectedDifficulty) {
      onStartQuiz(selectedTopic, selectedDifficulty);
    }
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/25 animate-pulse-glow mx-auto">
              <Brain className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
              <Crown className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="heading-modern mb-6">Choose Your Challenge</h1>
          <p className="subheading-modern max-w-2xl mx-auto">
            Select a topic and difficulty level to start your AI-powered quiz adventure!
          </p>
        </div>

        {/* Topic Selection */}
        <div className="mb-16">
          <h2 className="text-3xl font-black gradient-text mb-2 flex items-center justify-center">
            <BookOpen className="mr-3 h-8 w-8 text-primary" />
            Select Topic
          </h2>
          <p className="text-center text-white/70 mb-8">Choose what you'd like to be tested on</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => {
              const Icon = topic.icon;
              const isSelected = selectedTopic === topic.id;
              
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`modern-card text-left group relative overflow-hidden ${
                    isSelected ? 'border-primary/60 bg-primary/10' : 'hover:border-primary/40'
                  }`}
                >
                  {/* Popularity Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="badge-primary">
                      {topic.popularity}% popular
                    </Badge>
                  </div>

                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${topic.gradient} flex items-center justify-center mb-6 shadow-xl group-hover:animate-float`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">{topic.name}</h3>
                  <p className="text-white/70 mb-4">{topic.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-primary">
                      <Trophy className="h-4 w-4 mr-2" />
                      <span className="text-sm font-semibold">Popular Choice</span>
                    </div>
                    <ChevronRight className={`h-6 w-6 transition-transform duration-300 ${
                      isSelected ? 'text-primary translate-x-2' : 'text-white/50 group-hover:translate-x-2'
                    }`} />
                  </div>

                  {isSelected && (
                    <div className="absolute top-4 left-4 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-16">
          <h2 className="text-3xl font-black gradient-text mb-2 flex items-center justify-center">
            <Target className="mr-3 h-8 w-8 text-accent" />
            Select Difficulty
          </h2>
          <p className="text-center text-white/70 mb-8">How challenging do you want your quiz to be?</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {difficulties.map((difficulty) => {
              const Icon = difficulty.icon;
              const isSelected = selectedDifficulty === difficulty.id;
              
              return (
                <button
                  key={difficulty.id}
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                  className={`modern-card text-center group relative ${
                    isSelected ? 'border-accent/60 bg-accent/10' : 'hover:border-accent/40'
                  }`}
                >
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${difficulty.gradient} flex items-center justify-center mb-6 shadow-xl group-hover:animate-float mx-auto`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">{difficulty.name}</h3>
                  <p className="text-white/70 mb-4">{difficulty.description}</p>
                  
                  <div className="flex items-center justify-center space-x-2 text-white/60">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{difficulty.time}</span>
                  </div>

                  {isSelected && (
                    <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Quiz Button */}
        <div className="text-center">
          <button
            onClick={handleStartQuiz}
            disabled={!selectedTopic || !selectedDifficulty || isLoading}
            className={`btn-modern text-xl px-12 py-6 group ${
              !selectedTopic || !selectedDifficulty ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="spinner mr-3"></div>
                Generating Quiz...
              </div>
            ) : (
              <div className="flex items-center">
                <Rocket className="h-6 w-6 mr-3 group-hover:animate-bounce" />
                Start Quiz Adventure
                <Sparkles className="h-6 w-6 ml-3 animate-sparkle" />
              </div>
            )}
          </button>
          
          {(!selectedTopic || !selectedDifficulty) && (
            <p className="text-white/50 text-sm mt-4">
              Please select both a topic and difficulty level to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
