import { GoogleGenAI } from "@google/genai";
import { type GeneratedQuiz, type QuizQuestion } from "@shared/schema";

function getAIClient() {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
}

export async function generateQuiz(field: string, questionCount: number = 20): Promise<GeneratedQuiz> {
  const fieldDescriptions = {
    "web-development": "modern web development including HTML5, CSS3, JavaScript ES6+, React, Vue, Angular, Node.js, Express, databases, APIs, responsive design, security, performance optimization, and deployment",
    "android-development": "Android app development including Java, Kotlin, Android SDK, Activities, Fragments, Intents, UI/UX design, data persistence, networking, testing, publishing, and performance optimization",
    "reverse-engineering": "software reverse engineering including disassembly, decompilation, static/dynamic analysis, debugging, malware analysis, binary exploitation, code obfuscation, and security research",
    "ethical-hacking": "ethical hacking and penetration testing including network security, web application security, system vulnerabilities, OWASP Top 10, Metasploit, Burp Suite, social engineering, and security frameworks"
  };

  const fieldDescription = fieldDescriptions[field as keyof typeof fieldDescriptions] || field;

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

  async function attemptQuizGeneration(): Promise<GeneratedQuiz> {
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
        contents: prompt,
      });

      const rawJson = response.text;
      if (!rawJson) {
        throw new Error("Empty response from Gemini API");
      }

      const quizData: GeneratedQuiz = JSON.parse(rawJson);

      // Validate the response
      if (!quizData.questions || quizData.questions.length !== questionCount) {
        throw new Error("Invalid quiz format received from AI");
      }

      // Add unique IDs if not provided
      quizData.questions = quizData.questions.map((q, index) => ({
        ...q,
        id: q.id || `q_${index + 1}`,
      }));

      return quizData;
    } catch (error: any) {
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

export function calculateScore(questions: QuizQuestion[], userAnswers: number[]): { score: number; pointsEarned: number } {
  if (questions.length !== userAnswers.length) {
    throw new Error("Questions and answers length mismatch");
  }

  const correctAnswers = userAnswers.filter((answer, index) => 
    answer === questions[index].correctAnswer
  ).length;

  const score = Math.round((correctAnswers / questions.length) * 100);
  const pointsEarned = correctAnswers * 10 + (score >= 80 ? 50 : score >= 60 ? 20 : 0); // Bonus points for high scores

  return { score, pointsEarned };
}