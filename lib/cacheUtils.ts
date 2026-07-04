// lib/cacheUtils.ts
import crypto from "crypto";

/**
 * Generates a consistent, hashed cache key based on the user prompt and language.
 */
export function generateCacheKey(query: string, languageCode: string = "en-US"): string {
    // 1. Normalize the query text
    const normalizedQuery = query.trim().toLowerCase();
    
    // 2. MD5 Hash the string so long paragraphs turn into compact, valid Redis key strings
    const hash = crypto
        .createHash("md5")
        .update(`${normalizedQuery}:${languageCode}`)
        .digest("hex");
        
    return `vaidya:cache:${hash}`;
}