import { fileURLToPath } from 'url';
import path from 'path';
import { getLlama } from 'node-llama-cpp';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let model;
let context;
/**
 * Initializes the embedding model and context
 */
export async function initEmbedder() {
    const MODEL_NAME = 'nomic-embed-text-v1.5.Q5_K_M.gguf';
    const modelPath = path.resolve(__dirname, "../model/" + MODEL_NAME);
    try {
        const llama = await getLlama();
        model = await llama.loadModel({ modelPath });
        context = await model.createEmbeddingContext();
    }
    catch (error) {
        console.error('Error initializing embedder:', error);
        throw error;
    }
}
/**
 * Generates an embedding vector for the input text
 * @param text The text to generate an embedding for
 * @returns A promise that resolves to the embedding vector
 */
export async function embed(text) {
    if (!context) {
        throw new Error("Embedding context not initialized. Call initEmbedder() first.");
    }
    try {
        const embedding = await context.getEmbeddingFor(text);
        return embedding.vector;
    }
    catch (error) {
        console.error('Error generating embedding:', error);
        throw error;
    }
}
