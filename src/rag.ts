// rag.ts
import { embed } from './embed.js';
import { db } from './db.js';

/**
 * Generate an embedding vector for the given text.
 * @param text The text to embed.
 * @returns The embedding vector.
 */
export async function Embed(text: string): Promise<number[]> {
  return await embed(text);
}

/**
 * Save the ID and text vector into the specified table.
 * If the table doesn't exist, it creates it automatically.
 * @param id Integer ID for the record.
 * @param text Text to embed and store.
 * @param tablename Name of the table to store in.
 * @returns Boolean indicating success.
 */
export async function Save(id: number, text: string, tablename: string): Promise<boolean> {
  try {
    const vector = await embed(text);
    const vectorArray = new Float32Array(vector);
    const vectorJson = JSON.stringify(Array.from(vectorArray));

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS ${tablename} (
        id INTEGER PRIMARY KEY,
        text TEXT,
        embedding BLOB
      )
    `;

    const insertSQL = `INSERT OR REPLACE INTO ${tablename} (id, text, embedding) VALUES (?, ?, vec_f32(?))`;

    return new Promise<boolean>((resolve) => {
      db.serialize(() => {
        db.run(createTableSQL, (err) => {
          if (err) {
            console.error('Error creating table:', err.message);
            resolve(false);
            return;
          }
          
          db.run(insertSQL, [id, text, vectorJson], function (err: Error | null) {
            if (err) {
              console.error('Error inserting into table:', err.message);
              resolve(false);
            } else {
              console.log(`Saved item ${id} to '${tablename}'`);
              resolve(true);
            }
          });
        });
      });
    });
  } catch (error) {
    console.error('Error in ragSave:', error);
    return false;
  }
}

/**
 * Search for the most similar vectors using vector similarity.
 * @param text Text to search with.
 * @param tablename Name of the table to search in.
 * @param qty Number of results to return.
 * @returns Array of IDs in order of closeness.
 */
export async function Search(text: string, tablename: string, qty: number): Promise<number[]> {
  try {
    const queryVector = await embed(text);
    const vectorArray = new Float32Array(queryVector);
    const vectorJson = JSON.stringify(Array.from(vectorArray));

    const searchSQL = `
      SELECT id, vec_distance_cosine(embedding, vec_f32(?)) AS distance
      FROM ${tablename}
      ORDER BY distance ASC
      LIMIT ?
    `;

    return new Promise((resolve, reject) => {
      db.all<{id: number, distance: number}>(searchSQL, [vectorJson, qty], (err: Error | null, rows) => {
        if (err) {
          console.error('Error during vector search:', err.message);
          reject(err);
        } else {
          // Ensure IDs are returned as numbers
          const ids = rows.map(row => Number(row.id));
          resolve(ids);
        }
      });
    });
  } catch (error) {
    console.error('Error in ragSearch:', error);
    return [];
  }
}