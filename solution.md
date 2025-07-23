RAG Module Summary 
The RAG Module (Retrieval-Augmented Generation) is a TypeScript-based solution designed to enable intelligent text embedding, storage, and retrieval. It leverages recent advancements in lightweight AI inference and vector databases to provide a simple and fast semantic search system.

Objective
To build a reusable Node.js module that:

Converts raw text into vector embeddings using a local LLaMA-based model.

Stores those vectors in a local SQLite database.

Allows fast semantic queries using vector similarity (cosine distance).

Can be easily integrated into any Node.js project with minimal setup.

Technical Components
1. Embedding Engine
Uses node-llama-cpp and llamafile to run nomic-embed-text-v1.5.Q5_K_M locally.

Generates vector embeddings from input text with high performance and low memory use.

Runs completely offline.

2. Database & Vector Search
Built on SQLite with sqlite-vec extension for native vector operations.

Each document's text and embedding are stored together.

Supports efficient similarity search (via cosine similarity).

3. Core Functions
Embed(text): Embeds any string of text into a numerical vector.

Save(id, text, table): Saves the text and its embedding in a specified table.

Search(query, table, limit): Returns IDs of documents closest in meaning to the query.

Workflow
Setup: Initializes the embedding engine and loads SQLite vector extension.

Embedding: Converts user input or documents into dense vectors.

Saving: Inserts the embedded document into a database table for later search.

Searching: Compares a new query embedding against stored vectors and ranks results.

Development Highlights
Implemented in modular TypeScript for clean, testable code.

Supports test scripts (test-embed.ts, test-db.ts, test-rag.ts) for each component.

Model files are stored locally in a model/ directory, ensuring offline use.

Works on machines without a GPU using llamafile with CPU-optimized quantization (Q5_K_M).

Benefits
Portable: Runs on any system with Node.js and SQLite installed.

Offline Capable: No network dependency; all inference and search happen locally.

Extendable: Can be plugged into larger RAG pipelines, chatbots, or search systems.
