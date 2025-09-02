import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useQuizState } from "@/hooks/use-quiz-state";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import type { QuizQuestion } from "@shared/schema";

export default function ActiveQuiz() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { 
    quizState, 
    updateAnswer, 
    setTimeRemaining, 
    setQuizResults,
    setIsQuizActive 
  } = useQuizState();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const submitQuizMutation = useMutation({
    mutationFn: async (answers: number[]) => {
      if (!quizState.currentQuiz?.id) {
        throw new Error("No quiz selected");
      }
      
      // Calculate time spent in seconds with proper null checks
      const totalTime = (quizState.currentQuiz.timeLimit || 1200); // Use quiz time limit or 20 minutes default
      const remainingTime = quizState.timeRemaining || 0;
      const timeSpent = Math.max(1, totalTime - remainingTime); // Ensure positive number, minimum 1 second

      const res = await apiRequest("POST", "/api/quiz/submit", {
        quizId: quizState.currentQuiz.id,
        answers: answers || [],
        timeSpent: timeSpent || 1, // Ensure timeSpent is never null/undefined
      });
      return await res.json();
    },
    onSuccess: (results) => {
      setQuizResults(results);
      setIsQuizActive(false);
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
      
      toast({
        title: "Quiz Submitted!",
        description: `You scored ${results.score}% and earned ${results.pointsEarned} points!`,
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to submit quiz",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmitQuiz = () => {
    if (submitQuizMutation.isPending) return;
    submitQuizMutation.mutate(quizState.currentAnswers);
  };

  // Initialize timer
  useEffect(() => {
    if (!quizState.currentQuiz || !quizState.isQuizActive) return;

    // Initialize timer if not set
    if (quizState.timeRemaining <= 0) {
      const timeLimit = quizState.currentQuiz.timeLimit || 1200; // Use quiz time limit or 20 minutes default
      setTimeRemaining(timeLimit);
    }
  }, [quizState.currentQuiz, setTimeRemaining, quizState.isQuizActive, quizState.timeRemaining]);

  // Timer countdown
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Only start timer if quiz is active and has time remaining
    if (!quizState.isQuizActive || quizState.timeRemaining <= 0) {
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev: number) => {
        const currentTime = prev || 0;
        const newTime = Math.max(0, currentTime - 1);
        if (newTime <= 0) {
          // Clear timer before submitting
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          // Submit quiz when time runs out
          setTimeout(() => handleSubmitQuiz(), 100);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [quizState.isQuizActive, quizState.timeRemaining]);

  const handleAnswerSelect = (answerIndex: number) => {
    updateAnswer(currentQuestionIndex, answerIndex);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizState.currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const formatTime = (seconds: number) => {
    // Handle null, undefined, or invalid numbers
    const validSeconds = isNaN(seconds) || seconds == null ? 0 : Math.max(0, Math.floor(seconds));
    const mins = Math.floor(validSeconds / 60);
    const secs = validSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!quizState.currentQuiz || !quizState.currentQuiz.questions || quizState.currentQuiz.questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-muted-foreground">Loading quiz...</p>
      </div>
    );
  }

  const currentQuestion = quizState.currentQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizState.currentQuiz.questions.length) * 100;
  const answeredQuestions = quizState.currentAnswers.filter(answer => answer !== -1).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Header */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground" data-testid="quiz-title">
              {quizState.currentQuiz.title}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Question <span data-testid="current-question">{currentQuestionIndex + 1}</span> of{" "}
                <span data-testid="total-questions">{quizState.currentQuiz.questions.length}</span>
              </div>
              <div className={`flex items-center space-x-2 text-sm px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                quizState.timeRemaining <= 60 
                  ? "bg-destructive/10 text-destructive animate-pulse" 
                  : quizState.timeRemaining <= 300 
                    ? "bg-orange-500/10 text-orange-500" 
                    : "bg-primary/10 text-primary"
              }`}>
                <Clock className="h-4 w-4" />
                <span data-testid="timer" className="font-mono text-base">
                  {formatTime(quizState.timeRemaining)}
                </span>
              </div>
            </div>
          </div>

          <Progress value={progress} className="h-2" data-testid="quiz-progress" />
        </CardContent>
      </Card>

      {/* Quiz Question */}
      <Card className="shadow-sm">
        <CardContent className="p-8">
          <h3 className="text-xl font-medium text-foreground mb-6" data-testid="question-text">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  quizState.currentAnswers[currentQuestionIndex] === index
                    ? "border-primary bg-primary/5 text-primary font-medium"
                    : "border-border hover:border-primary/50 hover:bg-accent/50"
                }`}
                data-testid={`option-${index}`}
              >
                <span className="font-medium mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="text-sm text-muted-foreground">
          {answeredQuestions} of {quizState.currentQuiz.questions.length} answered
        </div>

        {currentQuestionIndex === quizState.currentQuiz.questions.length - 1 ? (
          <Button
            onClick={handleSubmitQuiz}
            disabled={submitQuizMutation.isPending}
            className="min-w-[120px]"
          >
            {submitQuizMutation.isPending ? "Submitting..." : "Submit Quiz"}
          </Button>
        ) : (
          <Button onClick={handleNextQuestion}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}