import { DataAPIClient } from "@datastax/astra-db-ts";

type similarityMetric = "cosine" | "dot_product" | "euclidean";

const {
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN
} = process.env;

if (
    !ASTRA_DB_NAMESPACE ||
    !ASTRA_DB_COLLECTION ||
    !ASTRA_DB_API_ENDPOINT ||
    !ASTRA_DB_APPLICATION_TOKEN
) {
    throw new Error("Missing Astra DB environment variables");
}

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);

export const db = client.db(ASTRA_DB_API_ENDPOINT, {
    keyspace: ASTRA_DB_NAMESPACE
});

export const collectionName = ASTRA_DB_COLLECTION;

export async function createCollection(
    metric: similarityMetric = "dot_product"
) {
    try {
        const res = await db.createCollection(collectionName, {
            vector: {
                dimension: 3072,
                metric: metric
            }
        });

        console.log("Collection created:", res);
    } catch (error) {
        console.log("Collection may already exist.");
    }
}