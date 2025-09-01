
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, RotateCcw, Users, RefreshCw, Trophy, Medal, Award, Star, TrendingUp, Clock, Target, Lightbulb, AlertCircle } from "lucide-react";
import { useQuizState } from "@/hooks/use-quiz-state";
import { useState } from "react";

interface QuizResultsProps {
  results: {
    id: string;
    score: number;
    pointsEarned: number;
    correctAnswers: any[];
  };
  onTakeAnother: () => void;
  onViewLeaderboard: () => void;
}

export default function QuizResults({ results, onTakeAnother, onViewLeaderboard }: QuizResultsProps) {
  const { score, pointsEarned, correctAnswers } = results;
  const { quizState, setCurrentQuiz } = useQuizState();
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const totalQuestions = correctAnswers.length;
  const correctCount = Math.round((score / 100) * totalQuestions);
  const percentage = Math.round(score);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-500";
    if (score >= 80) return "text-blue-500";
    if (score >= 70) return "text-yellow-500";
    if (score >= 60) return "text-orange-500";
    return "text-red-500";
  };

  const getRankDisplay = (score: number) => {
    if (score >= 90) {
      return {
        icon: <div className="relative">
          <Trophy className="h-12 w-12 text-yellow-500 animate-bounce" />
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-1">
            <span className="text-white text-xs font-bold">1st</span>
          </div>
        </div>,
        title: "Gold Medal",
        subtitle: "Outstanding Performance!",
        gradient: "from-yellow-400 via-yellow-500 to-yellow-600"
      };
    }
    if (score >= 80) {
      return {
        icon: <div className="relative">
          <Medal className="h-12 w-12 text-gray-400 animate-pulse" />
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full p-1">
            <span className="text-white text-xs font-bold">2nd</span>
          </div>
        </div>,
        title: "Silver Medal",
        subtitle: "Excellent Work!",
        gradient: "from-gray-400 via-gray-500 to-gray-600"
      };
    }
    if (score >= 70) {
      return {
        icon: <div className="relative">
          <Award className="h-12 w-12 text-amber-600 animate-pulse" />
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-600 to-amber-800 rounded-full p-1">
            <span className="text-white text-xs font-bold">3rd</span>
          </div>
        </div>,
        title: "Bronze Medal",
        subtitle: "Good Job!",
        gradient: "from-amber-600 via-amber-700 to-amber-800"
      };
    }
    return {
      icon: <div className="relative">
        <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">{Math.floor(score/10)}</span>
        </div>
      </div>,
      title: "Keep Improving",
      subtitle: "You can do better!",
      gradient: "from-blue-500 to-purple-600"
    };
  };

  const rankDisplay = getRankDisplay(percentage);

  const handleRetakeTest = () => {
    if (quizState.currentQuiz) {
      setCurrentQuiz(quizState.currentQuiz);
    }
  };

  const questionsToShow = showAllQuestions ? correctAnswers : correctAnswers.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Animated Results Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 animate-pulse"></div>
        <Card className="relative modern-card border-2 border-primary/30 shadow-2xl">
          <CardContent className="p-12 text-center relative">
            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-10 w-2 h-2 bg-primary rounded-full animate-ping"></div>
              <div className="absolute top-20 right-20 w-1 h-1 bg-accent rounded-full animate-ping delay-1000"></div>
              <div className="absolute bottom-10 left-20 w-1.5 h-1.5 bg-primary rounded-full animate-ping delay-500"></div>
              <div className="absolute bottom-20 right-10 w-1 h-1 bg-accent rounded-full animate-ping delay-1500"></div>
            </div>

            {/* Achievement Icon */}
            <div className="flex justify-center mb-8">
              <div className={`p-8 bg-gradient-to-br ${rankDisplay.gradient} rounded-3xl border-4 border-white/20 shadow-2xl transform hover:scale-110 transition-all duration-500 float`}>
                {rankDisplay.icon}
              </div>
            </div>

            <div className="space-y-4 mb-10">
              <h2 className="text-5xl font-bold gradient-text mb-4">Quiz Complete!</h2>
              <h3 className={`text-2xl font-semibold bg-gradient-to-r ${rankDisplay.gradient} bg-clip-text text-transparent`}>
                {rankDisplay.title}
              </h3>
              <p className="text-lg text-muted-foreground">{rankDisplay.subtitle}</p>
            </div>

            {/* Enhanced Score Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="group">
                <div className="glass-effect p-8 rounded-2xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl">
                  <div className="flex items-center justify-center mb-4">
                    <TrendingUp className="h-8 w-8 text-primary mr-3" />
                    <div className={`text-6xl font-black ${getScoreColor(percentage)} animate-pulse`}>
                      {percentage}%
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-muted-foreground">Overall Score</p>
                  <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${getScoreColor(percentage).replace('text-', 'from-')} to-primary transition-all duration-1000 ease-out`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="glass-effect p-8 rounded-2xl border-2 border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl">
                  <div className="flex items-center justify-center mb-4">
                    <Star className="h-8 w-8 text-amber-500 mr-3 animate-spin" />
                    <span className="text-6xl font-black text-amber-500 animate-bounce">{pointsEarned}</span>
                  </div>
                  <p className="text-lg font-semibold text-muted-foreground">Points Earned</p>
                  <div className="mt-3 flex justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(pointsEarned/20) ? 'text-amber-500 fill-current' : 'text-muted-foreground'} transition-colors duration-300`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="glass-effect p-8 rounded-2xl border-2 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl">
                  <div className="flex items-center justify-center mb-4">
                    <Target className="h-8 w-8 text-emerald-500 mr-3" />
                    <span className="text-6xl font-black text-emerald-500">{correctCount}</span>
                    <span className="text-3xl font-semibold text-muted-foreground ml-2">/{totalQuestions}</span>
                  </div>
                  <p className="text-lg font-semibold text-muted-foreground">Correct Answers</p>
                  <div className="mt-3 grid grid-cols-10 gap-1">
                    {[...Array(totalQuestions)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-2 rounded-full transition-colors duration-300 delay-${i * 100} ${
                          i < correctCount ? 'bg-emerald-500' : 'bg-muted'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                onClick={handleRetakeTest}
                size="lg"
                className="bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-500 transform hover:scale-110 hover:shadow-2xl pulse-glow text-lg"
              >
                <RefreshCw className="mr-3 h-6 w-6" />
                Retake Test
              </Button>
              <Button 
                onClick={onTakeAnother}
                variant="outline"
                size="lg"
                className="border-3 border-primary/30 hover:border-primary/60 bg-glass-effect backdrop-blur-md py-4 px-8 rounded-2xl transition-all duration-500 transform hover:scale-110 hover:shadow-2xl text-lg font-semibold"
              >
                <RotateCcw className="mr-3 h-6 w-6" />
                New Quiz
              </Button>
              <Button 
                variant="outline" 
                onClick={onViewLeaderboard}
                size="lg"
                className="border-3 border-accent/30 hover:border-accent/60 bg-glass-effect backdrop-blur-md py-4 px-8 rounded-2xl transition-all duration-500 transform hover:scale-110 hover:shadow-2xl text-lg font-semibold"
              >
                <Users className="mr-3 h-6 w-6" />
                Leaderboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completely Redesigned Question Review */}
      <Card className="modern-card border-2 border-primary/20 shadow-xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-3xl font-bold gradient-text">Question Review</h3>
                <p className="text-muted-foreground text-lg">Detailed breakdown of your performance</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 px-4 py-2 text-lg">
                {correctCount} Correct
              </Badge>
              <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30 px-4 py-2 text-lg">
                {totalQuestions - correctCount} Incorrect
              </Badge>
            </div>
          </div>

          <div className="space-y-6">
            {questionsToShow.map((question, index) => (
              <div key={index} className="group">
                <div className={`glass-effect p-8 rounded-2xl border-2 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl ${
                  question.isCorrect 
                    ? 'border-emerald-500/30 hover:border-emerald-500/50 bg-emerald-500/5' 
                    : 'border-red-500/30 hover:border-red-500/50 bg-red-500/5'
                }`}>
                  
                  {/* Question Header */}
                  <div className="flex items-start space-x-6 mb-6">
                    <div className="flex-shrink-0">
                      <div className={`p-4 rounded-2xl ${
                        question.isCorrect 
                          ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border-2 border-emerald-500/30' 
                          : 'bg-gradient-to-br from-red-500/20 to-red-600/20 border-2 border-red-500/30'
                      }`}>
                        {question.isCorrect ? (
                          <CheckCircle className="h-8 w-8 text-emerald-500" />
                        ) : (
                          <XCircle className="h-8 w-8 text-red-500" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-4 py-2 text-lg font-semibold">
                          Question {index + 1}
                        </Badge>
                        <Badge 
                          variant={question.isCorrect ? "default" : "destructive"}
                          className={`px-4 py-2 text-lg font-semibold ${
                            question.isCorrect 
                              ? 'bg-emerald-500 hover:bg-emerald-600' 
                              : 'bg-red-500 hover:bg-red-600'
                          }`}
                        >
                          {question.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                        </Badge>
                      </div>

                      <h4 className="text-xl font-bold text-foreground leading-relaxed">
                        {question.question}
                      </h4>
                    </div>
                  </div>

                  {/* Answer Options Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {question.options?.map((option: string, optionIndex: number) => {
                      const isUserAnswer = question.userAnswer === option;
                      const isCorrectAnswer = question.correctAnswer === option;
                      
                      return (
                        <div key={optionIndex} className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          isCorrectAnswer 
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700' 
                            : isUserAnswer && !question.isCorrect
                              ? 'bg-red-500/10 border-red-500/40 text-red-700'
                              : 'bg-muted/30 border-muted/50'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              isCorrectAnswer 
                                ? 'bg-emerald-500 text-white' 
                                : isUserAnswer && !question.isCorrect
                                  ? 'bg-red-500 text-white'
                                  : 'bg-muted text-muted-foreground'
                            }`}>
                              {String.fromCharCode(65 + optionIndex)}
                            </div>
                            <span className="font-medium">{option}</span>
                            <div className="ml-auto flex space-x-2">
                              {isCorrectAnswer && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                              {isUserAnswer && !isCorrectAnswer && <XCircle className="h-5 w-5 text-red-500" />}
                              {isUserAnswer && <Badge variant="outline" className="text-xs">Your Choice</Badge>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Section */}
                  {question.explanation && (
                    <div className="glass-effect p-6 rounded-xl border border-accent/30 bg-gradient-to-r from-accent/5 to-primary/5">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-accent/20 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-accent mb-2">Explanation</h5>
                          <p className="text-muted-foreground leading-relaxed">{question.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Show More/Less Button */}
            {correctAnswers.length > 3 && (
              <div className="text-center pt-6">
                <Button
                  onClick={() => setShowAllQuestions(!showAllQuestions)}
                  variant="outline"
                  size="lg"
                  className="border-2 border-primary/30 hover:border-primary/50 bg-glass-effect backdrop-blur-md px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  {showAllQuestions ? (
                    <>Show Less <Clock className="ml-2 h-5 w-5" /></>
                  ) : (
                    <>Show All {correctAnswers.length} Questions <Clock className="ml-2 h-5 w-5" /></>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
