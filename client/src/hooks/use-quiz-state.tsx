
import React, { createContext, useContext, useState, ReactNode } from "react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface Quiz {
  id: string;
  title: string;
  category: string;
  field: string;
  questions: Question[];
  timeLimit: number;
  isDailyQuiz: boolean;
}

interface QuizResults {
  id: string;
  score: number;
  pointsEarned: number;
  correctAnswers: Question[];
  userAnswers: number[];
  totalQuestions: number;
  timeSpent?: number;
}

interface QuizState {
  currentQuiz: Quiz | null;
  currentAnswers: number[];
  timeRemaining: number;
  quizResults: QuizResults | null;
  isQuizActive: boolean;
  lastUpdate?: number;
}

interface QuizContextType {
  quizState: QuizState;
  setCurrentQuiz: (quiz: Quiz | null) => void;
  setCurrentAnswers: (answers: number[]) => void;
  setTimeRemaining: (time: number) => void;
  setQuizResults: (results: QuizResults | null) => void;
  setIsQuizActive: (active: boolean) => void;
  updateAnswer: (questionIndex: number, answer: number) => void;
  resetQuizState: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

const initialState: QuizState = {
  currentQuiz: null,
  currentAnswers: [],
  timeRemaining: 0,
  quizResults: null,
  isQuizActive: false,
  lastUpdate: Date.now(),
};

// Load state from localStorage on initialization
const loadPersistedState = (): QuizState => {
  try {
    const saved = localStorage.getItem('quizState');
    if (saved) {
      const parsed = JSON.parse(saved);
      
      // Always restore the state if it exists, regardless of active status
      if (parsed.currentQuiz) {
        // Check if the quiz was started recently (within 24 hours)
        const lastUpdate = parsed.lastUpdate || Date.now();
        const hoursSinceUpdate = (Date.now() - lastUpdate) / (1000 * 60 * 60);
        
        if (hoursSinceUpdate < 24) {
          return { 
            ...parsed, 
            lastUpdate: Date.now(),
            // Ensure we have valid defaults
            currentAnswers: parsed.currentAnswers || [],
            timeRemaining: parsed.timeRemaining || 0,
            isQuizActive: parsed.isQuizActive || false,
          };
        }
      }
    }
  } catch (error) {
    console.warn('Failed to load persisted quiz state:', error);
  }
  
  return initialState;
};

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quizState, setQuizState] = useState<QuizState>(loadPersistedState);

  const setCurrentQuiz = (quiz: Quiz | null) => {
    const newState = {
      ...quizState,
      currentQuiz: quiz,
      currentAnswers: quiz ? new Array(quiz.questions.length).fill(-1) : [],
      timeRemaining: quiz ? 20 * 60 : 0, // Always 20 minutes (1200 seconds)
      isQuizActive: !!quiz,
      quizResults: null,
      lastUpdate: Date.now(),
    };
    setQuizState(newState);
    // Persist to localStorage
    if (quiz) {
      localStorage.setItem('quizState', JSON.stringify(newState));
    } else {
      localStorage.removeItem('quizState');
    }
  };

  const setCurrentAnswers = (answers: number[]) => {
    setQuizState(prev => ({ ...prev, currentAnswers: answers }));
  };

  const setTimeRemaining = (time: number | ((prev: number) => number)) => {
    setQuizState(prev => {
      const newTime = typeof time === 'function' ? time(prev.timeRemaining || 0) : time;
      const validTime = isNaN(newTime) ? 0 : Math.max(0, newTime);
      const newState = { ...prev, timeRemaining: validTime, lastUpdate: Date.now() };
      if (prev.currentQuiz && prev.isQuizActive) {
        localStorage.setItem('quizState', JSON.stringify(newState));
      }
      return newState;
    });
  };

  const setQuizResults = (results: QuizResults | null) => {
    setQuizState(prev => {
      const newState = { 
        ...prev, 
        quizResults: results,
        isQuizActive: false,
      };
      localStorage.setItem('quizState', JSON.stringify(newState));
      return newState;
    });
  };

  const setIsQuizActive = (active: boolean) => {
    setQuizState(prev => {
      const newState = { ...prev, isQuizActive: active };
      if (prev.currentQuiz) {
        localStorage.setItem('quizState', JSON.stringify(newState));
      }
      return newState;
    });
  };

  const updateAnswer = (questionIndex: number, answer: number) => {
    setQuizState(prev => {
      const newAnswers = [...prev.currentAnswers];
      newAnswers[questionIndex] = answer;
      const newState = { ...prev, currentAnswers: newAnswers, lastUpdate: Date.now() };
      // Always persist when quiz state changes
      localStorage.setItem('quizState', JSON.stringify(newState));
      return newState;
    });
  };

  const resetQuizState = () => {
    const clearedState = { ...initialState, lastUpdate: Date.now() };
    setQuizState(clearedState);
    localStorage.removeItem('quizState');
  };

  return (
    <QuizContext.Provider
      value={{
        quizState,
        setCurrentQuiz,
        setCurrentAnswers,
        setTimeRemaining,
        setQuizResults,
        setIsQuizActive,
        updateAnswer,
        resetQuizState,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuizState() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuizState must be used within a QuizProvider");
  }
  return context;
}
