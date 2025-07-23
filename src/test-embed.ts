import { initEmbedder, embed } from "./embed.js";

async function main() {
  try {
    console.log('Initializing embedder...');
    await initEmbedder();
    
    console.log('Generating embedding...');
    const result = await embed("Hello world from Val!");
    
    console.log('First 5 dimensions:', result.slice(0, 5), "...");
    console.log(`Total dimensions: ${result.length}`);
  } catch (error) {
    console.error('Error in main:', error);
    process.exit(1);
  }
}

main();
