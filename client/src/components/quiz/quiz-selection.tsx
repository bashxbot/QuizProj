
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
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Challenge Your Brain
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose your field and test your knowledge with AI-generated questions
        </p>
      </div>

      {/* Mode Selection */}
      <div className="flex justify-center space-x-4 mb-8">
        <Button
          variant={selectedMode === "daily" ? "default" : "outline"}
          onClick={() => setSelectedMode("daily")}
          className={selectedMode === "daily" ? "btn-primary" : "btn-outline"}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Daily Challenge
        </Button>
        <Button
          variant={selectedMode === "practice" ? "default" : "outline"}
          onClick={() => setSelectedMode("practice")}
          className={selectedMode === "practice" ? "btn-primary" : "btn-outline"}
        >
          <Target className="w-4 h-4 mr-2" />
          Practice Mode
        </Button>
      </div>

      {selectedMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizFields.map((field) => (
            <Card key={field.id} className="card cursor-pointer">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <field.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground">{field.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm mb-4">
                  {field.description}
                </p>
                <Button 
                  onClick={() => handleStartQuiz(field.id, 20, selectedMode === "daily")}
                  className="w-full btn-primary mb-3"
                  disabled={selectedMode === "daily" && (dailyQuizStatus as any)?.[field.id]?.completed}
                >
                  {selectedMode === "daily" && (dailyQuizStatus as any)?.[field.id]?.completed 
                    ? "Completed Today" 
                    : `Start ${selectedMode === "daily" ? "Daily" : "Practice"} Quiz`
                  }
                </Button>
                {selectedMode === "daily" && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground text-center">
                      20 questions • Counts toward leaderboard
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
