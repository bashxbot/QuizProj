import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Users, 
  RefreshCw, 
  Trophy, 
  Medal, 
  Award, 
  Star, 
  Clock, 
  Target, 
  Lightbulb, 
  AlertCircle,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { useQuizState } from "@/hooks/use-quiz-state";
import { useState } from "react";

interface QuizResultsProps {
  onTakeAnother: () => void;
  onViewLeaderboard: () => void;
}

export default function QuizResults({ onTakeAnother, onViewLeaderboard }: QuizResultsProps) {
  const { quizState, resetQuizState } = useQuizState();
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  
  if (!quizState.quizResults) {
    return (
      <Card className="max-w-2xl mx-auto border-2 border-dashed border-gray-300 dark:border-gray-600">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">No quiz results available</p>
          <p className="text-sm text-muted-foreground mt-2">Complete a quiz to see your results here</p>
        </CardContent>
      </Card>
    );
  }

  const { score, pointsEarned, correctAnswers, userAnswers, totalQuestions, timeSpent } = quizState.quizResults;
  const correctCount = Math.round((score / 100) * totalQuestions);
  const percentage = Math.round(score);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-500";
    if (score >= 80) return "text-blue-500";
    if (score >= 70) return "text-yellow-500";
    if (score >= 60) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 90) return "from-emerald-400 to-emerald-600";
    if (score >= 80) return "from-blue-400 to-blue-600";
    if (score >= 70) return "from-yellow-400 to-yellow-600";
    if (score >= 60) return "from-orange-400 to-orange-600";
    return "from-red-400 to-red-600";
  };

  const getRankDisplay = (score: number) => {
    if (score >= 90) {
      return {
        icon: <Trophy className="h-16 w-16 text-yellow-500 animate-bounce" />,
        title: "🏆 Excellent!",
        subtitle: "Outstanding Performance!",
        bgColor: "from-yellow-400 via-yellow-500 to-yellow-600"
      };
    }
    if (score >= 80) {
      return {
        icon: <Medal className="h-16 w-16 text-blue-500 animate-pulse" />,
        title: "🥈 Great Job!",
        subtitle: "Very Well Done!",
        bgColor: "from-blue-400 via-blue-500 to-blue-600"
      };
    }
    if (score >= 70) {
      return {
        icon: <Award className="h-16 w-16 text-amber-500 animate-pulse" />,
        title: "🥉 Good Work!",
        subtitle: "Nice Effort!",
        bgColor: "from-amber-400 via-amber-500 to-amber-600"
      };
    }
    if (score >= 60) {
      return {
        icon: <Target className="h-16 w-16 text-green-500" />,
        title: "✅ Passed!",
        subtitle: "Keep Improving!",
        bgColor: "from-green-400 via-green-500 to-green-600"
      };
    }
    return {
      icon: <TrendingUp className="h-16 w-16 text-red-500" />,
      title: "📈 Keep Trying!",
      subtitle: "Practice Makes Perfect!",
      bgColor: "from-red-400 via-red-500 to-red-600"
    };
  };

  const rankInfo = getRankDisplay(percentage);

  const handleRetakeQuiz = () => {
    resetQuizState();
    onTakeAnother();
  };

  const formatTime = (seconds: number = 0) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      {/* Main Results Card */}
      <Card className="relative overflow-hidden border-2 border-primary/20 shadow-2xl">
        <div className={`absolute inset-0 bg-gradient-to-br ${rankInfo.bgColor} opacity-5`}></div>
        <CardContent className="p-8 relative z-10">
          <div className="text-center space-y-6">
            {/* Trophy/Medal Icon */}
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 shadow-lg">
                {rankInfo.icon}
              </div>
            </div>

            {/* Score Display */}
            <div className="space-y-2">
              <h1 className={`text-6xl font-bold bg-gradient-to-r ${getScoreGradient(percentage)} bg-clip-text text-transparent`}>
                {percentage}%
              </h1>
              <h2 className="text-3xl font-bold text-foreground">{rankInfo.title}</h2>
              <p className="text-xl text-muted-foreground">{rankInfo.subtitle}</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={percentage} className="h-4 w-full bg-gray-200 dark:bg-gray-700">
                <div 
                  className={`h-full bg-gradient-to-r ${getScoreGradient(percentage)} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${percentage}%` }}
                />
              </Progress>
              <p className="text-sm text-muted-foreground">
                {correctCount} of {totalQuestions} questions correct
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Correct Answers */}
        <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{correctCount}</div>
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">Correct Answers</p>
          </CardContent>
        </Card>

        {/* Points Earned */}
        <Card className="border-2 border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
          <CardContent className="p-6 text-center">
            <Star className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{pointsEarned}</div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">Points Earned</p>
          </CardContent>
        </Card>

        {/* Time Spent */}
        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-6 text-center">
            <Clock className="h-12 w-12 text-blue-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatTime(timeSpent)}</div>
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Time Spent</p>
          </CardContent>
        </Card>
      </div>

      {/* Question Review */}
      <Card className="border-2 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-6 w-6 text-purple-500" />
              <h3 className="text-xl font-semibold text-foreground">Question Review</h3>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAllQuestions(!showAllQuestions)}
              className="border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              {showAllQuestions ? 'Hide Details' : 'View Details'}
              <Sparkles className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {showAllQuestions && correctAnswers && correctAnswers.length > 0 && (
            <div className="space-y-6">
              {correctAnswers.map((question: any, index: number) => {
                const userAnswer = userAnswers ? userAnswers[index] : -1;
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <Card 
                    key={question.id || index} 
                    className={`border-2 transition-all duration-300 ${
                      isCorrect 
                        ? 'border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50/50 to-green-100/50 dark:from-green-900/10 dark:to-green-800/10' 
                        : 'border-red-200 dark:border-red-800 bg-gradient-to-r from-red-50/50 to-red-100/50 dark:from-red-900/10 dark:to-red-800/10'
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Status Icon */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                          isCorrect 
                            ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700' 
                            : 'bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700'
                        }`}>
                          {isCorrect ? 
                            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" /> : 
                            <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                          }
                        </div>

                        <div className="flex-1 space-y-4">
                          {/* Question Header */}
                          <div className="flex items-start justify-between">
                            <h5 className="font-semibold text-lg">Question {index + 1}</h5>
                            <Badge 
                              variant={isCorrect ? "default" : "destructive"} 
                              className={`text-sm font-bold ${
                                isCorrect 
                                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                                  : 'bg-red-500 hover:bg-red-600 text-white'
                              }`}
                            >
                              {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                            </Badge>
                          </div>
                          
                          {/* Question Text */}
                          <p className="text-base font-medium text-foreground leading-relaxed">
                            {question.question}
                          </p>
                          
                          {/* Answer Options */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {question.options && question.options.map((option: string, optIndex: number) => {
                              const isUserChoice = userAnswer === optIndex;
                              const isCorrectAnswer = question.correctAnswer === optIndex;
                              
                              return (
                                <div 
                                  key={optIndex} 
                                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                                    isCorrectAnswer 
                                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300 shadow-md' 
                                      : isUserChoice && !isCorrectAnswer
                                      ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 shadow-md'
                                      : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                      isCorrectAnswer 
                                        ? 'bg-green-500 text-white' 
                                        : isUserChoice && !isCorrectAnswer
                                        ? 'bg-red-500 text-white'
                                        : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                                    }`}>
                                      {String.fromCharCode(65 + optIndex)}
                                    </div>
                                    <span className="font-medium flex-1">{option}</span>
                                    {isCorrectAnswer && <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />}
                                    {isUserChoice && !isCorrectAnswer && <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                          {/* Explanation */}
                          {question.explanation && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-400 mb-2">💡 Explanation</p>
                                  <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">{question.explanation}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button 
          onClick={handleRetakeQuiz}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Retake Quiz
        </Button>
        
        <Button 
          onClick={onTakeAnother}
          variant="outline"
          size="lg"
          className="border-2 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-4 rounded-lg font-bold transform hover:scale-105 transition-all duration-300"
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          New Quiz
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onViewLeaderboard}
          size="lg"
          className="border-2 border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 px-8 py-4 rounded-lg font-bold transform hover:scale-105 transition-all duration-300"
        >
          <Users className="mr-2 h-5 w-5" />
          Leaderboard
        </Button>
      </div>
    </div>
  );
}