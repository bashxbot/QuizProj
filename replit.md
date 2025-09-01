# Overview

This is a full-stack quiz application called "QuizMaster Pro" that allows users to take AI-generated quizzes on various topics. The application features user authentication, quiz generation using Google's Gemini AI, score tracking, and leaderboards. Built with React frontend and Express backend, it provides an engaging platform for knowledge testing and competition.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18** with TypeScript for the UI layer
- **Vite** as the build tool and dev server
- **Wouter** for client-side routing instead of React Router
- **TanStack Query** for server state management and caching
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for styling with custom design tokens
- **React Hook Form** with Zod validation for form handling

## Backend Architecture
- **Express.js** server with TypeScript
- **Passport.js** with Local Strategy for session-based authentication
- **Express Session** with PostgreSQL session store for persistent sessions
- RESTful API endpoints for quiz operations, user management, and leaderboards
- **Drizzle ORM** for database operations with type-safe schema definitions
- Custom middleware for request logging and error handling

## Database Design
- **PostgreSQL** as the primary database using Neon serverless
- **Drizzle ORM** for schema management and migrations
- Three main tables:
  - `users` - User accounts with authentication and statistics
  - `quizzes` - Quiz definitions with questions stored as JSONB
  - `quiz_attempts` - User quiz submissions and scoring history
- Relational design with foreign key constraints

## Authentication & Authorization
- Session-based authentication using Passport.js Local Strategy
- Password hashing with Node.js crypto (scrypt) and random salts
- Protected routes requiring authentication middleware
- Session storage in PostgreSQL for scalability
- Trust proxy configuration for deployment environments

## State Management
- Server state managed by TanStack Query with automatic caching
- Local component state using React hooks
- Form state handled by React Hook Form with Zod schemas
- Authentication state provided through React Context

## AI Integration
- **Google Gemini 2.5 Flash** for quiz generation
- Structured prompts to generate consistent quiz formats
- JSON schema validation for AI responses
- Category-based quiz generation with configurable question counts

# External Dependencies

## AI Services
- **Google Generative AI** (@google/genai) - Quiz content generation using Gemini models

## Database & Storage
- **Neon Database** (@neondatabase/serverless) - Serverless PostgreSQL hosting
- **Drizzle ORM** (drizzle-orm) - Type-safe database operations and migrations
- **connect-pg-simple** - PostgreSQL session store for Express sessions

## Authentication
- **Passport.js** (passport, passport-local) - Authentication middleware and strategies
- **Express Session** (express-session) - Session management

## Frontend Libraries
- **Radix UI** - Comprehensive set of accessible UI primitives
- **TanStack React Query** - Server state management and caching
- **React Hook Form** - Form handling with validation
- **Wouter** - Lightweight client-side routing
- **Zod** - TypeScript-first schema validation

## Development Tools
- **Vite** - Fast build tool and development server
- **TypeScript** - Type safety across the full stack
- **Tailwind CSS** - Utility-first CSS framework
- **ESBuild** - Fast JavaScript bundler for production builds