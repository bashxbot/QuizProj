
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQuizState } from "@/hooks/use-quiz-state";
import { Globe, FlaskConical, Landmark, BookOpen, Calendar, Target } from "lucide-react";
import { useState } from "react";

interface QuizSelectionProps {
  onQuizStart: (quiz: any) => void;
}

export default function QuizSelection({ onQuizStart }: QuizSelectionProps) {
  const { toast } = useToast();
  const { setCurrentQuiz, setIsQuizActive } = useQuizState();
  const [selectedMode, setSelectedMode] = useState<"daily" | "practice" | null>(null);

  const { data: dailyQuizStatus } = useQuery({
    queryKey: ["/api/daily-quiz-status"],
  });

  const isDailyQuizCompleted = (field: string) => {
    return dailyQuizStatus && (dailyQuizStatus as any)[field] === true;
  };

  const generateQuizMutation = useMutation({
    mutationFn: async ({ field, questionCount, isDailyQuiz }: { field: string; questionCount: number; isDailyQuiz: boolean }) => {
      const res = await apiRequest("POST", "/api/quiz/generate", { field, questionCount, isDailyQuiz });
      return await res.json();
    },
    onSuccess: (quiz) => {
      setCurrentQuiz(quiz);
      setIsQuizActive(true);
      onQuizStart(quiz);
    },
    onError: (error) => {
      toast({
        title: "Failed to generate quiz",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStartQuiz = (field: string, questionCount: number = 20, isDailyQuiz: boolean = false) => {
    if (isDailyQuiz && isDailyQuizCompleted(field)) {
      toast({
        title: "Daily Challenge Already Completed",
        description: "You can only take the daily challenge once per day. Try again tomorrow!",
        variant: "destructive",
      });
      return;
    }
    generateQuizMutation.mutate({ field, questionCount, isDailyQuiz });
  };

  const quizFields = [
    {
      id: "web-development",
      name: "Web Development",
      description: "HTML, CSS, JavaScript, React, Node.js",
      icon: Globe,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "data-science",
      name: "Data Science",
      description: "Python, Machine Learning, Statistics",
      icon: FlaskConical,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "system-design",
      name: "System Design",
      description: "Architecture, Scalability, Databases",
      icon: Landmark,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "algorithms",
      name: "Algorithms & DS",
      description: "Data Structures, Problem Solving",
      icon: BookOpen,
      color: "from-orange-500 to-red-500",
    },
    {
      id: "android-development",
      name: "Android Development",
      description: "Java, Kotlin, Android SDK",
      icon: Target,
      color: "from-indigo-500 to-blue-500",
    },
    {
      id: "ethical-hacking",
      name: "Ethical Hacking",
      description: "Security, Penetration Testing",
      icon: FlaskConical,
      color: "from-red-500 to-pink-500",
    },
  ];

  if (generateQuizMutation.isPending) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Generating Your Quiz</h2>
          <p className="text-muted-foreground">
            Our AI is crafting personalized questions just for you...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/3 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-accent/3 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/2 blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="text-center mb-12 relative z-10">
        <h1 className="text-5xl font-black mb-6 gradient-text animate-gradient-x">
          Challenge Your Brain
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Choose your field and test your knowledge with AI-generated questions
        </p>
        <div className="mt-6 h-1 w-48 bg-gradient-to-r from-primary via-accent to-primary rounded-full mx-auto pulse-glow"></div>
      </div>

      {/* Mode Selection */}
      <div className="flex justify-center space-x-6 mb-12 relative z-10">
        <Button
          variant={selectedMode === "daily" ? "default" : "outline"}
          onClick={() => setSelectedMode("daily")}
          className={`px-10 py-4 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden ${
            selectedMode === "daily" 
              ? "btn-primary enhanced-glow" 
              : "glass-effect border-primary/30 hover:border-primary/50"
          }`}
        >
          <span className="relative z-10 flex items-center">
            <Calendar className="w-5 h-5 mr-3 sparkle" />
            Daily Challenge
          </span>
        </Button>
        <Button
          variant={selectedMode === "practice" ? "default" : "outline"}
          onClick={() => setSelectedMode("practice")}
          className={`px-10 py-4 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden ${
            selectedMode === "practice" 
              ? "btn-primary enhanced-glow" 
              : "glass-effect border-accent/30 hover:border-accent/50"
          }`}
        >
          <span className="relative z-10 flex items-center">
            <Target className="w-5 h-5 mr-3 sparkle" />
            Practice Mode
          </span>
        </Button>
      </div>

      {selectedMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {quizFields.map((field) => (
            <Card key={field.id} className="glass-morphism border-0 group hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden enhanced-glow">
              <div className={`h-3 bg-gradient-to-r ${field.color} opacity-80`} />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="pb-6 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${field.color} bg-opacity-20 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <field.icon className="h-8 w-8 text-foreground sparkle" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold gradient-text">{field.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 relative z-10">
                <p className="text-muted-foreground text-base mb-6 leading-relaxed">
                  {field.description}
                </p>
                <Button 
                  onClick={() => handleStartQuiz(field.id, 20, selectedMode === "daily")}
                  className="w-full btn-primary enhanced-glow relative overflow-hidden py-4 text-base font-bold rounded-xl mb-4"
                  disabled={selectedMode === "daily" && (dailyQuizStatus as any)?.[field.id]?.completed}
                >
                  <span className="relative z-10">
                    {selectedMode === "daily" && (dailyQuizStatus as any)?.[field.id]?.completed 
                      ? "✅ Completed Today" 
                      : `🚀 Start ${selectedMode === "daily" ? "Daily" : "Practice"} Quiz`
                    }
                  </span>
                </Button>
                {selectedMode === "daily" && (
                  <div className="glass-effect p-3 rounded-xl border border-primary/20">
                    <p className="text-sm text-muted-foreground text-center font-medium">
                      ⏱️ 20 questions • 🏆 Counts toward leaderboard
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!selectedMode && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Select a mode above to see available quiz fields
          </p>
        </div>
      )}
    </div>
  );
}
