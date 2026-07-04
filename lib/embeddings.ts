import { GoogleGenAI } from "@google/genai";

const { GEMINI_API_KEY } = process.env;
if (!GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Handles both string and string[] inputs with automatic 429 backoff retries
export async function generateEmbedding(textOrList: string | string[], retries = 3, delay = 5000): Promise<number[][]> {
    try {
        // Convert single query strings to a clean iterable array uniform payload
        const contents = Array.isArray(textOrList) ? textOrList : [textOrList];

        const response = await ai.models.embedContent({
            model: "gemini-embedding-001",
            contents: contents
        });

        if (!response?.embeddings) {
            throw new Error("Invalid embedding response layout received from Gemini API");
        }

        // Return an array of nested matrix arrays
        return response.embeddings.map(e => e.values);

    } catch (error: any) {
        // FIX 7: Capture 429 Rate limits and sleep rather than crashing the script execution
        if ((error?.status === 429 || error?.message?.includes("429")) && retries > 0) {
            console.warn(`Rate limit hit. Cooling down for ${delay / 1000} seconds... (${retries} retries remaining)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return generateEmbedding(textOrList, retries - 1, delay * 2);
        }
        throw error;
    }
}