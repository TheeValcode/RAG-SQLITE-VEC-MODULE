
<div align="center">

# 🧠 RAG SQLite Vector Module

### Local Embeddings • Vector Storage • Semantic Retrieval

A lightweight TypeScript module for generating text embeddings locally, storing them in SQLite, and retrieving semantically similar records using cosine distance.

<br/>

<img src="https://skillicons.dev/icons?i=ts,nodejs,sqlite&theme=dark" alt="TypeScript, Node.js and SQLite" />

<br/><br/>

![TypeScript](https://img.shields.io/badge/TypeScript-064e3b?style=flat-square&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-047857?style=flat-square&logo=sqlite&logoColor=white)
![Local Embeddings](https://img.shields.io/badge/Local-Embeddings-065f46?style=flat-square)
![Vector Search](https://img.shields.io/badge/Vector-Search-047857?style=flat-square)

</div>

---

## 📖 Overview

This project explores the retrieval component commonly used in Retrieval-Augmented Generation (RAG) systems.

It combines locally generated text embeddings with SQLite-based vector storage to support similarity searches over stored text records.

The module is intended as a foundation for applications such as document search, knowledge retrieval, and context selection for language-model workflows.

**Scope:** This repository implements embedding, storage, and retrieval functionality. It does not currently implement a complete question-answering pipeline or language-model response generation.

## ✨ Features

- Generate text embeddings locally using `node-llama-cpp`
- Load a GGUF embedding model
- Store text records and embeddings in SQLite
- Use the `sqlite-vec` extension for vector operations
- Search records using cosine distance
- Return matching record IDs ordered by similarity
- Limit the number of search results
- Organize records into caller-specified SQLite tables
- Access embedding, save, and search functionality through TypeScript functions

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Language | TypeScript |
| Runtime | Node.js |
| Embedding engine | node-llama-cpp |
| Embedding model | Nomic Embed Text v1.5 (GGUF) |
| Database | SQLite |
| Database driver | sqlite3 |
| Vector extension | sqlite-vec |
| Similarity metric | Cosine distance |

## 🏗️ Architecture

```text
                 INPUT TEXT
                     |
                     v
            +------------------+
            | node-llama-cpp   |
            | GGUF Embedder    |
            +------------------+
                     |
                     v
              EMBEDDING VECTOR
                     |
              +------+------+
              |             |
              v             v
          SAVE PATH     SEARCH PATH
              |             |
              v             v
         SQLite DB      Query Vector
              |             |
              |             v
              |       Cosine Distance
              |             |
              +------+------+
                     |
                     v
              MATCHING IDS
```

### How It Works

**Embedding**

The module initializes a local GGUF embedding model and converts input text into numerical vectors.

**Storage**

The `Save()` function generates an embedding and stores the record ID, original text, and vector in SQLite.

**Retrieval**

The `Search()` function embeds a query, compares it with stored vectors using `vec_distance_cosine`, and returns the closest record IDs.

The implementation uses a full similarity-ordering query rather than a dedicated approximate nearest-neighbor index.

## 📁 Project Structure

```text
src/
├── embed.ts        # Model loading and embedding generation
├── db.ts           # SQLite connection and extension loading
├── rag.ts          # Public embedding, storage, and search functions
├── test-embed.ts   # Embedding demonstration script
├── test-db.ts      # Database demonstration script
└── test-rag.ts     # End-to-end retrieval demonstration script

model/              # Local GGUF model (provided separately)
sqlite-vec/         # Native extension (provided separately)
rag.db              # Local SQLite database created at runtime
```

Compiled JavaScript is written to `dist/` when the TypeScript build runs.

## 🚀 Getting Started

### Prerequisites

You will need:

- A compatible Node.js installation
- npm
- Native build support required by the project's dependencies
- A compatible GGUF embedding model
- The `sqlite-vec` native extension for your operating system

The project has not been verified across all Node.js versions or operating systems.

### 1. Clone the Repository

```bash
git clone https://github.com/TheeValcode/RAG-SQLITE-VEC-MODULE.git

cd RAG-SQLITE-VEC-MODULE
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Prepare the Embedding Model

Create a `model` directory in the repository root.

Download the compatible Nomic Embed Text v1.5 GGUF model and save it using this filename:

```text
model/nomic-embed-text-v1.5.Q5_K_M.gguf
```

The filename is referenced directly in `src/embed.ts`.

The model is not bundled with the repository.

### 4. Prepare sqlite-vec

Download a compatible `sqlite-vec` extension from its official releases:

https://github.com/asg017/sqlite-vec/releases

The current `src/db.ts` implementation expects the extension at:

```text
sqlite-vec/vec0.so
```

This path targets a Linux-style shared library.

For Windows or macOS, the extension filename and path must be adjusted to match the platform.

The extension is loaded using SQLite's `loadExtension()` method.

### 5. Build the Project

```bash
npm run build
```

The TypeScript compiler outputs JavaScript to the `dist/` directory.

**Runtime note:** The existing embedding-model and SQLite-extension paths are resolved relative to the executing JavaScript file. Depending on whether scripts run from `src/` or compiled `dist/`, those paths may require adjustment. The project should be tested locally before treating the setup as verified.

## 💻 API Reference

The module exposes three primary functions from `src/rag.ts`.

### Embed()

```typescript
Embed(text: string): Promise<number[]>
```

Converts input text into a numerical embedding vector.

The embedding context must be initialized before calling this function.

### Save()

```typescript
Save(
  id: number,
  text: string,
  tablename: string
): Promise<boolean>
```

Generates an embedding and saves the ID, text, and vector to the specified SQLite table.

If the table does not exist, the function attempts to create it.

Existing records with the same ID are replaced.

**Important:** Table names are interpolated into SQL statements. Only trusted, validated table identifiers should be passed to this function.

### Search()

```typescript
Search(
  text: string,
  tablename: string,
  qty: number
): Promise<number[]>
```

Embeds a query and searches for similar stored vectors.

Results are ordered by ascending cosine distance and returned as record IDs.

The function does not currently return document text or similarity scores.

## 🔎 Example Workflow

The following illustrates the module's intended use:

```typescript
import { initEmbedder } from './embed.js';
import { loadVectorExtension } from './db.js';
import { Embed, Save, Search } from './rag.js';

async function main() {
  await initEmbedder();
  await loadVectorExtension();

  const vector = await Embed('Hello world');
  console.log('Embedding dimensions:', vector.length);

  await Save(1, 'Banana is a yellow fruit', 'fruits');
  await Save(2, 'Apples can be red or green', 'fruits');
  await Save(3, 'Oranges are citrus fruits', 'fruits');

  const ids = await Search('yellow fruit', 'fruits', 2);

  console.log('Matching document IDs:', ids);
}

main().catch(console.error);
```

This example assumes the runtime dependencies and native extension have been configured correctly.

## 🧪 Demonstration Scripts

The repository includes three demonstration scripts:

| File | Purpose |
|---|---|
| `src/test-embed.ts` | Generate and inspect an embedding |
| `src/test-db.ts` | Exercise database setup |
| `src/test-rag.ts` | Exercise embedding, storage, and retrieval |

The package currently defines these commands:

```bash
npm start
npm run test-db
npm run test-rag
```

`npm start` invokes the embedding demonstration script.

The default `npm test` script is a placeholder and does not run an automated test suite.

These scripts have not been independently verified as passing across supported environments.

## ⚠️ Current Limitations

- Requires a locally available GGUF model
- Requires a separately installed native vector extension
- Uses platform-specific extension paths
- Does not implement document chunking
- Does not implement metadata filtering
- Does not implement reranking
- Does not generate language-model responses
- Returns matching record IDs rather than full document objects
- Does not validate caller-supplied SQL table identifiers
- Does not provide a complete automated test suite

## 🗺️ Future Enhancements

- [ ] Cross-platform extension loading
- [ ] Configurable model paths
- [ ] Input validation for table identifiers
- [ ] Document chunking
- [ ] Metadata filtering
- [ ] Return document text and similarity scores
- [ ] Batch embedding support
- [ ] Automated tests
- [ ] Optional integration with an LLM response pipeline

## 📚 References

- [node-llama-cpp](https://github.com/withcatai/node-llama-cpp)
- [SQLite](https://www.sqlite.org/)
- [sqlite-vec](https://github.com/asg017/sqlite-vec)
- [Nomic Embed Text](https://huggingface.co/nomic-ai/nomic-embed-text-v1.5)

## 📬 Contact

**Sophia Val-Izevbigie**

[GitHub](https://github.com/TheeValcode) · [Email](mailto:sophiavalizevbigie@gmail.com)

---

<div align="center">

**Exploring semantic retrieval with TypeScript, local embeddings, and SQLite.**

</div>
