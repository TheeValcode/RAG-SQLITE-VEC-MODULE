# RAG Module

A TypeScript implementation of a Retrieval-Augmented Generation (RAG) module using node-llama-cpp for embeddings and SQLite with vector extensions for efficient similarity search.

## Features

- Text embedding generation using LLaMA-based models
- Vector storage and retrieval with SQLite
- Efficient similarity search for semantic queries
- Simple API for saving and querying documents
- Built with TypeScript for type safety

## Project Structure

```
rag-module/
├── src/
│   ├── rag.ts         # Core RAG functionality
│   ├── embed.ts       # Text embedding utilities
│   ├── db.ts          # Database connection and setup
│   ├── test-rag.ts    # Integration tests for RAG
│   ├── test-embed.ts  # Tests for embedding functionality
│   └── test-db.ts     # Database setup tests
├── model/             # Directory for model files (not included in repo)
├── dist/              # Compiled JavaScript output
└── rag.db            # SQLite database file (created at runtime)
```

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- SQLite3 development files

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd rag-module
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Download the embedding model:
   - Create a `model` directory in the project root
   - Download the `nomic-embed-text-v1.5.Q5_K_M.gguf` model file into the `model` directory
   - Or modify `embed.ts` to point to your preferred model

4. Build the project:
   ```bash
   npm run build
   ```

## Usage

### Basic Example

```typescript
import { initEmbedder } from './embed.js';
import { loadVectorExtension } from './db.js';
import { Embed, Save, Search } from './rag.js';

async function example() {
  // Initialize the embedding model and database
  await initEmbedder();
  await loadVectorExtension();

  // Generate an embedding
  const vector = await Embed('Hello world');
  console.log('Embedding:', vector.slice(0, 5), '...');

  // Save a document
  await Save(1, 'Banana is yellow', 'fruits');
  await Save(2, 'Apple is red and crunchy', 'fruits');
  await Save(3, 'Orange is citrus and orange colored', 'fruits');

  // Search for similar documents
  const results = await Search('yellow fruit', 'fruits', 2);
  console.log('Search results:', results);
}

example().catch(console.error);
```

### API Reference

#### `Embed(text: string): Promise<number[]>`
Generates an embedding vector for the given text.

#### `Save(id: number, text: string, tablename: string): Promise<boolean>`
Saves a text document with its embedding to the specified table.

#### `Search(query: string, tablename: string, limit: number): Promise<number[]>`
Searches for documents similar to the query and returns matching document IDs.

## Running Tests

1. Test the embedding functionality:
   ```bash
   npm run test-embed
   ```

2. Test database operations:
   ```bash
   npm run test-db
   ```

3. Test the complete RAG pipeline:
   ```bash
   npm run test-rag
   ```

## Implementation Details

### Embedding
- Uses `node-llama-cpp` for generating text embeddings
- Supports any LLaMA-compatible model (default: nomic-embed-text-v1.5)
- Handles model loading and inference

### Database
- SQLite with vector extension for efficient similarity search
- Stores document text alongside their vector embeddings
- Uses `sqlite-vec` for vector operations

### Search
- Implements cosine similarity for finding similar documents
- Returns results ordered by relevance
- Supports configurable result limits

## License

ISC

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Acknowledgements

- [node-llama-cpp](https://github.com/withcatai/node-llama-cpp) - For efficient LLM inference
- [SQLite](https://sqlite.org/) - For embedded database storage
- [sqlite-vec](https://github.com/asg017/sqlite-vec) - For vector similarity search
