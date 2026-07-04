import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { db, collectionName } from "./astra";
import { generateEmbedding } from "./embeddings";
import { generateResponse} from "./generate";
import path from "path";

// FIX 1: Increase chunk size to decrease overall API calls and retain richer data structure
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2500,
    chunkOverlap: 300
});

function isPdf(url: string) {
    return url.toLowerCase().endsWith(".pdf");
}

export async function loadData(urls: string[]) {
    const collection = db.collection(collectionName);

    for (const url of urls) {
        console.log(`Processing: ${url}`);
        let cleanText = "";

        try {
            if (url.startsWith("LOCAL_PDF:")) {
                const { loadPdf } = await import("./pdfLoader");
                const pdfPath = url.replace("LOCAL_PDF:", "");
                const fullPath = path.join(process.cwd(), pdfPath);

                const rawText = await loadPdf(fullPath);
                
                // FIX 2: Clear horizontal tabs/spaces but PRESERVE newline structures (\n)
                cleanText = rawText
                    .replace(/[ \t]+/g, " ")
                    .replace(/\r\n/g, "\n")
                    .replace(/\n\s*\n/g, "\n\n")
                    .trim();
            } else {
                const loader = new PuppeteerWebBaseLoader(url, {
                    launchOptions: { headless: true },
                    gotoOptions: { waitUntil: "domcontentloaded" },
                    evaluate: async (page, browser) => {
                        const text = await page.evaluate(() => {
                            // FIX 3: Clean out HTML clutter/sidebars before extracting innerText
                            const selectorsToRemove = [
                                'nav', 'footer', 'header', 'aside', '.sidebar', 
                                '.ads', '.comments', 'script', 'style', '.cookie-banner'
                            ];
                            selectorsToRemove.forEach(selector => {
                                document.querySelectorAll(selector).forEach(el => el.remove());
                            });

                            const mainContent = document.querySelector("article") || 
                                                document.querySelector("main") || 
                                                document.querySelector("#main-content") ||
                                                document.body;

                            return mainContent ? mainContent.innerText : "";
                        });

                        await browser.close();
                        return text;
                    }
                });

                const rawText = await loader.scrape();
                // FIX 2 (Continued): Keep web paragraph separations intact
                cleanText = rawText.replace(/[ \t]+/g, " ").replace(/\n\s*\n/g, "\n\n").trim();
            }

            if (!cleanText) {
                console.log("No content extracted. Skipping...");
                continue;
            }

            const rawChunks = await splitter.splitText(cleanText);
            
            // FIX 4: Prepend explicit context headers onto every text fragment
            const structuredChunks = rawChunks.map(chunk => {
                return `Source URL: ${url}\nDocument Context: Ayurvedic Reference Material\n\nContent:\n${chunk}`;
            });

            // FIX 5: Batch chunks into a single embedding API request to bypass the 15 RPM limit
            const batchSize = 10; 
            for (let i = 0; i < structuredChunks.length; i += batchSize) {
                const batch = structuredChunks.slice(i, i + batchSize);
                console.log(`Embedding batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(structuredChunks.length / batchSize)}...`);

                // Pass the whole array to the updated embedding function
                const vectors = await generateEmbedding(batch);

                for (let j = 0; j < batch.length; j++) {
                    await collection.insertOne({
                        $vector: vectors[j],
                        text: batch[j],
                        source: url
                    });
                }

                // Brief 3-second cooldown between batches to protect Free Tier limits
                await new Promise(resolve => setTimeout(resolve, 3000));
            }

        } catch (error) {
            console.error(`Failed processing URL: ${url}`, error);
        }
    }
}

export async function retrieveDocs(query: string) {
    try {
        const collection = db.collection(collectionName);
        // Single query string embedding array retrieval
        const [queryVector] = await generateEmbedding([query]);

        const cursor = collection.find(
            {},
            {
                sort: { $vector: queryVector },
                limit: 4 // Reduced from 5 to avoid feeding oversized context walls to Gemini
            }
        );

        const documents = await cursor.toArray();
        return documents.map((doc: any) => ({
            text: doc.text,
            source: doc.source
        }));
    } catch (error) {
        console.error("Retrieval error:", error);
        return [];
    }
}

export async function askRAG(query: string) {
    try {
        console.log("Processing Inbound Query:", query);

        // BYPASS standalone query normalization to completely save daily quota
        const docs = await retrieveDocs(query);

        if (!docs.length) {
            return { answer: "I could not find this in my knowledge base.", docs: [] };
        }

        const context = docs
            .map((doc, index) => `[Document Block ${index + 1}]\n${doc.text}\n---`)
            .join("\n\n");

        // Single downstream generation call
        const answer = await generateResponse(query, context);
        return { answer, docs };
    } catch (error) {
        console.error("RAG Execution Error:", error);
        return { answer: "Something went wrong.", docs: [] };
    }
}