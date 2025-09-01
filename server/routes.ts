import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { generateQuiz, calculateScore } from "./gemini";
import { insertQuizSchema, insertQuizAttemptSchema, quizSubmissionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Quiz generation endpoint
  app.post("/api/quiz/generate", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { field, questionCount = 20, isDailyQuiz = false } = req.body;
      if (!field) {
        return res.status(400).json({ error: "Field is required" });
      }

      const userIp = req.ip || req.connection.remoteAddress || "";

      // Check if user already took daily quiz today for this field
      if (isDailyQuiz) {
        const canTakeDaily = await storage.canTakeDailyQuiz(req.user!.id, field, userIp);
        if (!canTakeDaily) {
          return res.status(400).json({ error: "Daily quiz already completed for this field today" });
        }
      }

      const generatedQuiz = await generateQuiz(field, questionCount);
      
      // Save quiz to database
      const quiz = await storage.createQuiz({
        title: generatedQuiz.title,
        category: generatedQuiz.category,
        field: field,
        questions: generatedQuiz.questions,
        timeLimit: generatedQuiz.timeLimit,
        isDailyQuiz,
      });

      res.json({
        id: quiz.id,
        title: quiz.title,
        category: quiz.category,
        field: quiz.field,
        questions: quiz.questions,
        timeLimit: quiz.timeLimit,
        isDailyQuiz,
      });
    } catch (error) {
      next(error);
    }
  });

  // Submit quiz attempt
  app.post("/api/quiz/submit", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const submissionData = quizSubmissionSchema.parse(req.body);

      // Get quiz to validate answers
      const quiz = await storage.getQuizById(submissionData.quizId);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      // Calculate score
      const { score, pointsEarned } = calculateScore(
        quiz.questions as any,
        submissionData.answers as number[]
      );

      const userIp = req.ip || req.connection.remoteAddress || "";

      // Create quiz attempt
      const attempt = await storage.createQuizAttempt({
        userId: req.user!.id,
        quizId: submissionData.quizId,
        answers: submissionData.answers,
        timeSpent: submissionData.timeSpent,
        score,
        pointsEarned,
        field: quiz.field || quiz.category,
        isDailyQuiz: quiz.isDailyQuiz || false,
        ipAddress: userIp,
      });

      // Update user stats for all quiz attempts
      await storage.updateUserStats(req.user!.id, pointsEarned, quiz.field || quiz.category);

      res.json({
        id: attempt.id,
        score,
        pointsEarned,
        correctAnswers: quiz.questions as any,
        userAnswers: submissionData.answers,
        timeSpent: submissionData.timeSpent,
        quizTitle: quiz.title,
        totalQuestions: quiz.questions.length,
      });
    } catch (error) {
      next(error);
    }
  });

  // Get quiz by ID
  app.get("/api/quiz/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const quiz = await storage.getQuizById(req.params.id);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      res.json(quiz);
    } catch (error) {
      next(error);
    }
  });

  // Get leaderboard
  app.get("/api/leaderboard", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const leaderboard = await storage.getLeaderboard(limit);

      res.json(leaderboard);
    } catch (error) {
      next(error);
    }
  });

  // Get user profile with stats
  app.get("/api/profile", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const userWithStats = await storage.getUserWithStats(req.user!.id);
      if (!userWithStats) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(userWithStats);
    } catch (error) {
      next(error);
    }
  });

  // Get user quiz history
  app.get("/api/quiz-history", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const attempts = await storage.getUserQuizAttempts(req.user!.id);
      res.json(attempts);
    } catch (error) {
      next(error);
    }
  });

  // Get daily quiz status
  app.get("/api/daily-quiz-status", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const userIp = req.ip || req.connection.remoteAddress || "";
      const status = await storage.getDailyQuizStatus(req.user!.id, userIp);
      res.json(status);
    } catch (error) {
      next(error);
    }
  });

  // Get field-based leaderboard
  app.get("/api/leaderboard/:field", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const leaderboard = await storage.getFieldLeaderboard(req.params.field, limit);
      res.json(leaderboard);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
