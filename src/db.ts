import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Absolute path to SQLite DB
const dbPath = path.resolve(__dirname, '../rag.db');

// SQLite database object
export const db = new sqlite3.Database(dbPath);

// Load the sqlite-vec extension
export function loadVectorExtension(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Adjust the path depending on your OS
    const extensionPath = path.resolve(__dirname, '../sqlite-vec/vec0.so'); // .dll for Windows

    db.loadExtension(extensionPath, (err) => {
      if (err) {
        console.error('Failed to load sqlite-vec extension:', err.message);
        reject(err);
      } else {
        console.log('sqlite-vec extension loaded successfully');
        resolve();
      }
    });
  });
}