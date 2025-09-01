import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  totalScore: integer("total_score").notNull().default(0),
  quizzesTaken: integer("quizzes_taken").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const quizzes = pgTable("quizzes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: text("category").notNull(),
  field: text("field").notNull(), // web-dev, android-dev, reverse-eng, ethical-hacking, etc.
  questions: jsonb("questions").notNull(), // Array of question objects
  difficulty: text("difficulty").notNull().default("medium"),
  timeLimit: integer("time_limit").notNull().default(1200), // 20 minutes for 20 questions
  isDailyQuiz: boolean("is_daily_quiz").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  quizId: varchar("quiz_id").notNull().references(() => quizzes.id),
  score: integer("score").notNull(), // percentage score
  pointsEarned: integer("points_earned").notNull(),
  timeSpent: integer("time_spent").notNull(), // in seconds
  answers: jsonb("answers").notNull(), // Array of user answers
  field: text("field").notNull(),
  isDailyQuiz: boolean("is_daily_quiz").notNull().default(false),
  ipAddress: text("ip_address"),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  quizAttempts: many(quizAttempts),
}));

export const quizzesRelations = relations(quizzes, ({ many }) => ({
  attempts: many(quizAttempts),
}));

export const quizAttemptsRelations = relations(quizAttempts, ({ one }) => ({
  user: one(users, {
    fields: [quizAttempts.userId],
    references: [users.id],
  }),
  quiz: one(quizzes, {
    fields: [quizAttempts.quizId],
    references: [quizzes.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({
  id: true,
  completedAt: true,
});

// Schema for quiz submission from frontend (without calculated fields)
export const quizSubmissionSchema = createInsertSchema(quizAttempts).pick({
  quizId: true,
  answers: true,
  timeSpent: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;
export type QuizAttempt = typeof quizAttempts.$inferSelect;

// Additional types for API responses
export type UserWithStats = User & {
  rank?: number;
  averageScore?: number;
};

export type LeaderboardEntry = {
  id: string;
  username: string;
  totalScore: number;
  quizzesTaken: number;
  averageScore: number;
  rank: number;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
};

export type GeneratedQuiz = {
  title: string;
  category: string;
  questions: QuizQuestion[];
  timeLimit: number;
};
