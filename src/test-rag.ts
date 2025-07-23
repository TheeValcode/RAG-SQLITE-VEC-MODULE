// test-rag.ts
import { Embed, Save, Search } from './rag.js';
import { initEmbedder } from './embed.js'; // Make sure this exists and is correct
import { loadVectorExtension } from './db.js';

async function runTests() {
  try {
    // Initialize the embedder and vector extension
    await initEmbedder();
    await loadVectorExtension(); // Now properly await this

    console.log('Testing Embed...');
    const vector = await Embed('Hello world');
    console.log('Embed vector:', vector.slice(0, 5), '...');

    console.log('\n Testing Save...');
    const saveResult = await Save(1, 'Banana is yellow', 'fruits');
    console.log('Save result:', saveResult);

    // Add a few more items for better search testing
    await Save(2, 'Apple is red and crunchy', 'fruits');
    await Save(3, 'Orange is citrus and orange colored', 'fruits');

    console.log('\n Testing Search...');
    const results = await Search('yellow fruit', 'fruits', 3);
    console.log('Search results (IDs):', results);
  } catch (err) {
    console.error('Test failed:', err);
  }
}

runTests();