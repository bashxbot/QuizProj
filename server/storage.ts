import { users, quizzes, quizAttempts, type User, type InsertUser, type Quiz, type InsertQuiz, type QuizAttempt, type InsertQuizAttempt, type UserWithStats, type LeaderboardEntry } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  getQuizzesByCategory(category: string): Promise<Quiz[]>;
  getQuizById(id: string): Promise<Quiz | undefined>;
  
  createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt>;
  getUserQuizAttempts(userId: string): Promise<QuizAttempt[]>;
  updateUserStats(userId: string, pointsEarned: number, field: string): Promise<void>;
  
  getLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
  canTakeDailyQuiz(userId: string, field: string, ipAddress: string): Promise<boolean>;
  getDailyQuizStatus(userId: string, ipAddress: string): Promise<Record<string, boolean>>;
  getFieldLeaderboard(field: string, limit?: number): Promise<LeaderboardEntry[]>;
  getUserWithStats(userId: string): Promise<UserWithStats | undefined>;
  
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const [quiz] = await db
      .insert(quizzes)
      .values(insertQuiz)
      .returning();
    return quiz;
  }

  async getQuizzesByCategory(category: string): Promise<Quiz[]> {
    return await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.category, category))
      .orderBy(desc(quizzes.createdAt))
      .limit(10);
  }

  async getQuizById(id: string): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz || undefined;
  }

  async createQuizAttempt(insertAttempt: InsertQuizAttempt): Promise<QuizAttempt> {
    const [attempt] = await db
      .insert(quizAttempts)
      .values(insertAttempt)
      .returning();
    return attempt;
  }

  async getUserQuizAttempts(userId: string): Promise<QuizAttempt[]> {
    return await db
      .select()
      .from(quizAttempts)
      .where(eq(quizAttempts.userId, userId))
      .orderBy(desc(quizAttempts.completedAt))
      .limit(20);
  }

  async getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    const result = await db
      .select({
        id: users.id,
        username: users.username,
        totalScore: users.totalScore,
        quizzesTaken: users.quizzesTaken,
      })
      .from(users)
      .where(sql`${users.quizzesTaken} > 0`)
      .orderBy(desc(users.totalScore))
      .limit(limit);

    return result.map((user, index) => ({
      ...user,
      averageScore: user.quizzesTaken > 0 ? Math.round((user.totalScore / user.quizzesTaken) * 100 / 100) : 0,
      rank: index + 1,
    }));
  }

  async getUserWithStats(userId: string): Promise<UserWithStats | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;

    const leaderboard = await this.getLeaderboard();
    const userRank = leaderboard.find(entry => entry.id === userId);

    return {
      ...user,
      rank: userRank?.rank,
      averageScore: user.quizzesTaken > 0 ? Math.round((user.totalScore / user.quizzesTaken) * 100 / 100) : 0,
    };
  }

  async canTakeDailyQuiz(userId: string, field: string, ipAddress: string): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0];
    
    // Check by user ID and IP
    const existingAttempt = await db
      .select()
      .from(quizAttempts)
      .where(
        sql`${quizAttempts.userId} = ${userId} 
        AND ${quizAttempts.field} = ${field}
        AND ${quizAttempts.isDailyQuiz} = true
        AND DATE(${quizAttempts.completedAt}) = ${today}`
      )
      .limit(1);

    const ipAttempt = await db
      .select()
      .from(quizAttempts)
      .where(
        sql`${quizAttempts.ipAddress} = ${ipAddress}
        AND ${quizAttempts.field} = ${field}
        AND ${quizAttempts.isDailyQuiz} = true
        AND DATE(${quizAttempts.completedAt}) = ${today}`
      )
      .limit(1);

    return existingAttempt.length === 0 && ipAttempt.length === 0;
  }

  async getDailyQuizStatus(userId: string, ipAddress: string): Promise<Record<string, boolean>> {
    const today = new Date().toISOString().split('T')[0];
    const fields = ["web-development", "android-development", "reverse-engineering", "ethical-hacking"];
    
    const status: Record<string, boolean> = {};
    
    for (const field of fields) {
      const canTake = await this.canTakeDailyQuiz(userId, field, ipAddress);
      status[field] = !canTake; // true if already taken
    }
    
    return status;
  }

  async updateUserStats(userId: string, pointsEarned: number, field: string): Promise<void> {
    await db
      .update(users)
      .set({
        totalScore: sql`${users.totalScore} + ${pointsEarned}`,
        quizzesTaken: sql`${users.quizzesTaken} + 1`,
      })
      .where(eq(users.id, userId));
  }

  async getFieldLeaderboard(field: string, limit: number = 50): Promise<LeaderboardEntry[]> {
    const result = await db
      .select({
        id: users.id,
        username: users.username,
        totalScore: sql<number>`COALESCE(SUM(${quizAttempts.pointsEarned}), 0)`.as('fieldScore'),
        quizzesTaken: sql<number>`COUNT(${quizAttempts.id})`.as('fieldQuizzes'),
      })
      .from(users)
      .leftJoin(quizAttempts, 
        sql`${users.id} = ${quizAttempts.userId} 
        AND ${quizAttempts.field} = ${field} 
        AND ${quizAttempts.isDailyQuiz} = true`
      )
      .groupBy(users.id, users.username)
      .having(sql`COUNT(${quizAttempts.id}) > 0`)
      .orderBy(sql`fieldScore DESC`)
      .limit(limit);

    return result.map((user, index) => ({
      ...user,
      totalScore: user.totalScore,
      quizzesTaken: user.quizzesTaken,
      averageScore: user.quizzesTaken > 0 ? Math.round((user.totalScore / user.quizzesTaken)) : 0,
      rank: index + 1,
    }));
  }
}

export const storage = new DatabaseStorage();
