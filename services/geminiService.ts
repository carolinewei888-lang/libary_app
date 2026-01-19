import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Book, BookDeepDetails } from "../types";

// Access API Key using Vite's import.meta.env
// The variable in .env or Vercel must be named VITE_GOOGLE_API_KEY
const getApiKey = (): string => {
  // @ts-ignore - Handling Vite types without explicit declaration file
  return import.meta.env.VITE_GOOGLE_API_KEY || '';
};

export const generateBookMetadata = async (title: string): Promise<{ author: string, description: string, category: string, isbn: string } | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate real-world metadata for a book titled "${title}". 
                 If it is a real book, provide its actual ISBN-13.
                 Return a JSON object with:
                 - author (string)
                 - description (string, max 20 words, engaging)
                 - category (string, e.g., Fiction, Sci-Fi, Tech)
                 - isbn (string, standard ISBN-13 without dashes if available, else empty string)`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            author: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            isbn: { type: Type.STRING },
          },
          required: ["author", "description", "category", "isbn"],
        } as Schema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Gemini AI Metadata Error:", error);
    // Fallback for demo if API fails/key is missing
    return {
      author: "Unknown Author",
      description: "AI generation failed. Please fill manually.",
      category: "General",
      isbn: ""
    };
  }
};

export const recommendBooks = async (books: Book[], mood: string): Promise<{ bookId: string, reason: string }[]> => {
    try {
        const ai = new GoogleGenAI({ apiKey: getApiKey() });
        // Simplified list for token efficiency
        const bookListSimple = books
            .filter(b => b.status === 'AVAILABLE')
            .map(b => ({ id: b.id, title: b.title, author: b.author, category: b.category }));
        
        if (bookListSimple.length === 0) return [];

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `I have these available books: ${JSON.stringify(bookListSimple)}. 
                       The user is in this mood: "${mood}".
                       Recommend the top 3 best books for them.
                       Return a JSON array where each item has:
                       - 'bookId' (string, matching the provided ID)
                       - 'reason' (string, a short 1-sentence explanation why this book fits the mood).`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            bookId: { type: Type.STRING },
                            reason: { type: Type.STRING }
                        },
                        required: ["bookId", "reason"]
                    }
                } as Schema
            }
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        return [];

    } catch (error) {
        console.error("Gemini AI Recommendation Error", error);
        return [];
    }
}

export const getBookDeepDive = async (title: string, author: string): Promise<BookDeepDetails> => {
    try {
        const ai = new GoogleGenAI({ apiKey: getApiKey() });
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `For the book "${title}" by ${author}, provide a deep dive analysis.
                       Return a JSON object with:
                       - 'chapterCount' (string, estimated number of chapters)
                       - 'coreConcepts' (array of 3 strings, key takeaways or philosophy)
                       - 'nytReview' (string, a 1-paragraph style review similar to New York Times Book Review)
                       - 'matchReason' (string, why this book is relevant for personal/financial growth)`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        chapterCount: { type: Type.STRING },
                        coreConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
                        nytReview: { type: Type.STRING },
                        matchReason: { type: Type.STRING },
                    },
                    required: ["chapterCount", "coreConcepts", "nytReview", "matchReason"],
                } as Schema
            }
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        throw new Error("No response text");
    } catch (error) {
        console.error("Gemini Deep Dive Error", error);
        return {
            chapterCount: "Unknown",
            coreConcepts: ["Detailed analysis unavailable", "Please check back later", "AI Service Error"],
            nytReview: "We are currently unable to generate a review for this title.",
            matchReason: "Standard catalog entry."
        };
    }
};
