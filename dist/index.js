var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  insertQuizAttemptSchema: () => insertQuizAttemptSchema,
  insertQuizSchema: () => insertQuizSchema,
  insertUserSchema: () => insertUserSchema,
  quizAttempts: () => quizAttempts,
  quizAttemptsRelations: () => quizAttemptsRelations,
  quizSubmissionSchema: () => quizSubmissionSchema,
  quizzes: () => quizzes,
  quizzesRelations: () => quizzesRelations,
  users: () => users,
  usersRelations: () => usersRelations
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  totalScore: integer("total_score").notNull().default(0),
  quizzesTaken: integer("quizzes_taken").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var quizzes = pgTable("quizzes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: text("category").notNull(),
  field: text("field").notNull(),
  // web-dev, android-dev, reverse-eng, ethical-hacking, etc.
  questions: jsonb("questions").notNull(),
  // Array of question objects
  difficulty: text("difficulty").notNull().default("medium"),
  timeLimit: integer("time_limit").notNull().default(1200),
  // 20 minutes for 20 questions
  isDailyQuiz: boolean("is_daily_quiz").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var quizAttempts = pgTable("quiz_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  quizId: varchar("quiz_id").notNull().references(() => quizzes.id),
  score: integer("score").notNull(),
  // percentage score
  pointsEarned: integer("points_earned").notNull(),
  timeSpent: integer("time_spent").notNull(),
  // in seconds
  answers: jsonb("answers").notNull(),
  // Array of user answers
  field: text("field").notNull(),
  isDailyQuiz: boolean("is_daily_quiz").notNull().default(false),
  ipAddress: text("ip_address"),
  completedAt: timestamp("completed_at").notNull().defaultNow()
});
var usersRelations = relations(users, ({ many }) => ({
  quizAttempts: many(quizAttempts)
}));
var quizzesRelations = relations(quizzes, ({ many }) => ({
  attempts: many(quizAttempts)
}));
var quizAttemptsRelations = relations(quizAttempts, ({ one }) => ({
  user: one(users, {
    fields: [quizAttempts.userId],
    references: [users.id]
  }),
  quiz: one(quizzes, {
    fields: [quizAttempts.quizId],
    references: [quizzes.id]
  })
}));
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true
});
var insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({
  id: true,
  completedAt: true
});
var quizSubmissionSchema = createInsertSchema(quizAttempts).pick({
  quizId: true,
  answers: true,
  timeSpent: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, sql as sql2 } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
var PostgresSessionStore = connectPg(session);
var DatabaseStorage = class {
  sessionStore;
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async createQuiz(insertQuiz) {
    const [quiz] = await db.insert(quizzes).values(insertQuiz).returning();
    return quiz;
  }
  async getQuizzesByCategory(category) {
    return await db.select().from(quizzes).where(eq(quizzes.category, category)).orderBy(desc(quizzes.createdAt)).limit(10);
  }
  async getQuizById(id) {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz || void 0;
  }
  async createQuizAttempt(insertAttempt) {
    const [attempt] = await db.insert(quizAttempts).values(insertAttempt).returning();
    return attempt;
  }
  async getUserQuizAttempts(userId) {
    return await db.select().from(quizAttempts).where(eq(quizAttempts.userId, userId)).orderBy(desc(quizAttempts.completedAt)).limit(20);
  }
  async getLeaderboard(limit = 50) {
    const result = await db.select({
      id: users.id,
      username: users.username,
      totalScore: users.totalScore,
      quizzesTaken: users.quizzesTaken
    }).from(users).where(sql2`${users.quizzesTaken} > 0`).orderBy(desc(users.totalScore)).limit(limit);
    return result.map((user, index) => ({
      ...user,
      averageScore: user.quizzesTaken > 0 ? Math.round(user.totalScore / user.quizzesTaken * 100 / 100) : 0,
      rank: index + 1
    }));
  }
  async getUserWithStats(userId) {
    const user = await this.getUser(userId);
    if (!user) return void 0;
    const leaderboard = await this.getLeaderboard();
    const userRank = leaderboard.find((entry) => entry.id === userId);
    return {
      ...user,
      rank: userRank?.rank,
      averageScore: user.quizzesTaken > 0 ? Math.round(user.totalScore / user.quizzesTaken * 100 / 100) : 0
    };
  }
  async canTakeDailyQuiz(userId, field, ipAddress) {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const existingAttempt = await db.select().from(quizAttempts).where(
      sql2`${quizAttempts.userId} = ${userId} 
        AND ${quizAttempts.field} = ${field}
        AND ${quizAttempts.isDailyQuiz} = true
        AND DATE(${quizAttempts.completedAt}) = ${today}`
    ).limit(1);
    const ipAttempt = await db.select().from(quizAttempts).where(
      sql2`${quizAttempts.ipAddress} = ${ipAddress}
        AND ${quizAttempts.field} = ${field}
        AND ${quizAttempts.isDailyQuiz} = true
        AND DATE(${quizAttempts.completedAt}) = ${today}`
    ).limit(1);
    return existingAttempt.length === 0 && ipAttempt.length === 0;
  }
  async getDailyQuizStatus(userId, ipAddress) {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const fields = ["web-development", "android-development", "reverse-engineering", "ethical-hacking"];
    const status = {};
    for (const field of fields) {
      const canTake = await this.canTakeDailyQuiz(userId, field, ipAddress);
      status[field] = !canTake;
    }
    return status;
  }
  async updateUserStats(userId, pointsEarned, field) {
    await db.update(users).set({
      totalScore: sql2`${users.totalScore} + ${pointsEarned}`,
      quizzesTaken: sql2`${users.quizzesTaken} + 1`
    }).where(eq(users.id, userId));
  }
  async getFieldLeaderboard(field, limit = 50) {
    const result = await db.select({
      id: users.id,
      username: users.username,
      totalScore: sql2`COALESCE(SUM(${quizAttempts.pointsEarned}), 0)`.as("fieldScore"),
      quizzesTaken: sql2`COUNT(${quizAttempts.id})`.as("fieldQuizzes")
    }).from(users).leftJoin(
      quizAttempts,
      sql2`${users.id} = ${quizAttempts.userId} 
        AND ${quizAttempts.field} = ${field} 
        AND ${quizAttempts.isDailyQuiz} = true`
    ).groupBy(users.id, users.username).having(sql2`COUNT(${quizAttempts.id}) > 0`).orderBy(sql2`fieldScore DESC`).limit(limit);
    return result.map((user, index) => ({
      ...user,
      totalScore: user.totalScore,
      quizzesTaken: user.quizzesTaken,
      averageScore: user.quizzesTaken > 0 ? Math.round(user.totalScore / user.quizzesTaken) : 0,
      rank: index + 1
    }));
  }
};
var storage = new DatabaseStorage();

// server/auth.ts
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !await comparePasswords(password, user.password)) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });
  app2.post("/api/register", async (req, res, next) => {
    const existingUser = await storage.getUserByUsername(req.body.username);
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }
    const user = await storage.createUser({
      ...req.body,
      password: await hashPassword(req.body.password)
    });
    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).json(user);
    });
  });
  app2.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

// server/gemini.ts
import { GoogleGenAI } from "@google/genai";
function getAIClient() {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
}
async function generateQuiz(field, questionCount = 20) {
  const fieldDescriptions = {
    "web-development": "modern web development including HTML5, CSS3, JavaScript ES6+, React, Vue, Angular, Node.js, Express, databases, APIs, responsive design, security, performance optimization, and deployment",
    "android-development": "Android app development including Java, Kotlin, Android SDK, Activities, Fragments, Intents, UI/UX design, data persistence, networking, testing, publishing, and performance optimization",
    "reverse-engineering": "software reverse engineering including disassembly, decompilation, static/dynamic analysis, debugging, malware analysis, binary exploitation, code obfuscation, and security research",
    "ethical-hacking": "ethical hacking and penetration testing including network security, web application security, system vulnerabilities, OWASP Top 10, Metasploit, Burp Suite, social engineering, and security frameworks"
  };
  const fieldDescription = fieldDescriptions[field] || field;
  const prompt = `Generate an educational quiz with exactly ${questionCount} multiple choice questions about ${fieldDescription}. 

  Focus on practical, real-world scenarios and current industry standards. Questions should test:
  - Fundamental concepts and terminology
  - Best practices and methodologies  
  - Problem-solving skills
  - Security considerations
  - Performance optimization
  - Industry tools and frameworks

  Each question should:
  - Be challenging but fair for intermediate learners
  - Have exactly 4 options (A, B, C, D)
  - Have only one correct answer
  - Include a detailed explanation for the correct answer
  - Be unique and cover different aspects of the field
  - Use realistic scenarios when possible

  Format the response as JSON with this structure:
  {
    "title": "Quiz title for ${field}",
    "category": "${field}",
    "questions": [
      {
        "id": "q1",
        "question": "Question text with practical context",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0,
        "explanation": "Detailed explanation of why this answer is correct and why others are wrong"
      }
    ],
    "timeLimit": ${questionCount * 60}
  }

  Make the questions educational, practical, and aligned with current industry standards.`;
  async function attemptQuizGeneration() {
    const ai = getAIClient();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              title: { type: "string" },
              category: { type: "string" },
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    question: { type: "string" },
                    options: {
                      type: "array",
                      items: { type: "string" },
                      minItems: 4,
                      maxItems: 4
                    },
                    correctAnswer: { type: "number" },
                    explanation: { type: "string" }
                  },
                  required: ["id", "question", "options", "correctAnswer", "explanation"]
                }
              },
              timeLimit: { type: "number" }
            },
            required: ["title", "category", "questions", "timeLimit"]
          }
        },
        contents: prompt
      });
      const rawJson = response.text;
      if (!rawJson) {
        throw new Error("Empty response from Gemini API");
      }
      const quizData = JSON.parse(rawJson);
      if (!quizData.questions || quizData.questions.length !== questionCount) {
        throw new Error("Invalid quiz format received from AI");
      }
      quizData.questions = quizData.questions.map((q, index) => ({
        ...q,
        id: q.id || `q_${index + 1}`
      }));
      return quizData;
    } catch (error) {
      throw error;
    }
  }
  try {
    return await attemptQuizGeneration();
  } catch (error) {
    console.error("Error generating quiz with Gemini:", error);
    throw new Error(`Failed to generate quiz: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
function calculateScore(questions, userAnswers) {
  if (questions.length !== userAnswers.length) {
    throw new Error("Questions and answers length mismatch");
  }
  const correctAnswers = userAnswers.filter(
    (answer, index) => answer === questions[index].correctAnswer
  ).length;
  const score = Math.round(correctAnswers / questions.length * 100);
  const pointsEarned = correctAnswers * 10 + (score >= 80 ? 50 : score >= 60 ? 20 : 0);
  return { score, pointsEarned };
}

// server/routes.ts
async function registerRoutes(app2) {
  setupAuth(app2);
  app2.post("/api/quiz/generate", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const { field, questionCount = 20, isDailyQuiz = false } = req.body;
      if (!field) {
        return res.status(400).json({ error: "Field is required" });
      }
      const userIp = req.ip || req.connection.remoteAddress || "";
      if (isDailyQuiz) {
        const canTakeDaily = await storage.canTakeDailyQuiz(req.user.id, field, userIp);
        if (!canTakeDaily) {
          return res.status(400).json({ error: "Daily quiz already completed for this field today" });
        }
      }
      const generatedQuiz = await generateQuiz(field, questionCount);
      const quiz = await storage.createQuiz({
        title: generatedQuiz.title,
        category: generatedQuiz.category,
        field,
        questions: generatedQuiz.questions,
        timeLimit: generatedQuiz.timeLimit,
        isDailyQuiz
      });
      res.json({
        id: quiz.id,
        title: quiz.title,
        category: quiz.category,
        field: quiz.field,
        questions: quiz.questions,
        timeLimit: quiz.timeLimit,
        isDailyQuiz
      });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/quiz/submit", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const submissionData = quizSubmissionSchema.parse(req.body);
      const quiz = await storage.getQuizById(submissionData.quizId);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }
      const { score, pointsEarned } = calculateScore(
        quiz.questions,
        submissionData.answers
      );
      const userIp = req.ip || req.connection.remoteAddress || "";
      const attempt = await storage.createQuizAttempt({
        userId: req.user.id,
        quizId: submissionData.quizId,
        answers: submissionData.answers,
        timeSpent: submissionData.timeSpent,
        score,
        pointsEarned,
        field: quiz.field || quiz.category,
        isDailyQuiz: quiz.isDailyQuiz || false,
        ipAddress: userIp
      });
      await storage.updateUserStats(req.user.id, pointsEarned, quiz.field || quiz.category);
      res.json({
        id: attempt.id,
        score,
        pointsEarned,
        correctAnswers: quiz.questions,
        userAnswers: submissionData.answers,
        timeSpent: submissionData.timeSpent,
        quizTitle: quiz.title,
        totalQuestions: quiz.questions.length
      });
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/quiz/:id", async (req, res, next) => {
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
  app2.get("/api/leaderboard", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const limit = parseInt(req.query.limit) || 50;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/profile", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userWithStats = await storage.getUserWithStats(req.user.id);
      if (!userWithStats) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(userWithStats);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/quiz-history", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const attempts = await storage.getUserQuizAttempts(req.user.id);
      res.json(attempts);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/daily-quiz-status", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userIp = req.ip || req.connection.remoteAddress || "";
      const status = await storage.getDailyQuizStatus(req.user.id, userIp);
      res.json(status);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/leaderboard/:field", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const limit = parseInt(req.query.limit) || 50;
      const leaderboard = await storage.getFieldLeaderboard(req.params.field, limit);
      res.json(leaderboard);
    } catch (error) {
      next(error);
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
