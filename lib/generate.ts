import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Step 1: Detect language BEFORE generating the main response.
// This gives the model a single, unambiguous task instead of hoping
// it detects language while also formatting a complex response.
async function detectLanguage(query: string): Promise<string> {
    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Detect the language of the following text. Reply with ONLY one of these exact words: ENGLISH, HINDI, HINGLISH, TAMIL. No punctuation, no explanation.

Text: "${query}"`,
        config: { temperature: 0.0 },
    });

    const lang = result.text?.trim().toUpperCase() ?? "ENGLISH";

    // Normalise to one of our four known buckets
    if (lang.includes("HINDI")) return "HINDI";
    if (lang.includes("HINGLISH")) return "HINGLISH";
    if (lang.includes("TAMIL")) return "TAMIL";
    return "ENGLISH";
}

// Step 2: Build a language-specific system instruction so the model
// never has to guess — the target language is stated explicitly.
function buildSystemInstruction(language: string): string {
    const isEnglish = language === "ENGLISH";
    const isHindi = language === "HINDI";
    const isHinglish = language === "HINGLISH";
    const isTamil = language === "TAMIL";

    // Section headers in each language
    const headers = {
        topic: isEnglish ? "Topic" : isHindi ? "विषय" : isHinglish ? "Topic" : "தலைப்பு",
        overview: isEnglish ? "Overview" : isHindi ? "विवरण" : isHinglish ? "Overview" : "கண்ணோட்டம்",
        keyPoints: isEnglish ? "Key Points" : isHindi ? "मुख्य बातें" : isHinglish ? "Key Points" : "முக்கிய குறிப்புகள்",
        remedies: isEnglish ? "Remedies / Advice" : isHindi ? "उपचार और सलाह" : isHinglish ? "Upchar aur Salah" : "தீர்வுகள் / ஆலோசனை",
        precautions: isEnglish ? "Precautions" : isHindi ? "सावधानियां" : isHinglish ? "Savdhaniyan" : "முன்னெச்சரிக்கைகள்",
    };

    const langInstruction = isEnglish
        ? "You MUST write the ENTIRE response in English."
        : isHindi
            ? "आपको पूरा जवाब हिंदी में लिखना है। कोई भी अंग्रेज़ी शब्द उपयोग न करें।"
            : isHinglish
                ? "Poora response Hinglish mein likhna hai — Hindi aur English ka mix, jaise log WhatsApp pe likhte hain."
                : "நீங்கள் முழு பதிலையும் தமிழில் எழுத வேண்டும்.";

    return `
You are Vaidya, an Ayurveda AI assistant.
Your goal is to provide highly structured, user-friendly responses based STRICTLY on the provided context.

LANGUAGE DIRECTIVE (HIGHEST PRIORITY):
${langInstruction}
The detected user language is: ${language}. Do NOT switch languages mid-response under any circumstances.

CRITICAL LAYOUT RULES:
- Every main section header (🌿, 📝, ✅, 💡, ⚠) MUST start on its own new line, preceded by a blank line.
- Inside the Remedies section, every remedy MUST be a separate bullet point separated by a blank line. Never wrap them into a paragraph.

Strict Response Template (use the translated headers below exactly):

🌿 **[${headers.topic}]**

📝 **[${headers.overview}]**
(2-3 lines summary)

✅ **[${headers.keyPoints}]**
- Point 1
- Point 2

💡 **[${headers.remedies}]** (if applicable)
- **Herb/Remedy 1:** Detailed instructions.

- **Herb/Remedy 2:** Detailed instructions.

⚠ **[${headers.precautions}]** (if remedies are provided)
- Precaution 1
- Precaution 2
`;
}

export async function generateResponse(query: string, context: string) {
    // Detect language first, then generate — two focused calls beats one ambiguous call
    const language = await detectLanguage(query);
    const systemInstruction = buildSystemInstruction(language);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Context Document Content Blocks:\n${context}\n\nUser Question:\n${query}`,
        config: {
            systemInstruction,
            temperature: 0.0,
        },
    });

    return response.text;
}