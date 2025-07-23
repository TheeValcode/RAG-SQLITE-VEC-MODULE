import { db, loadVectorExtension } from './db.js';

loadVectorExtension();

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS test_vectors (id INTEGER PRIMARY KEY, embedding VECTOR);`, (err) => {
    if (err) {
      console.error("Failed to create table:", err);
    } else {
      console.log("Table created");
    }
  });
});
