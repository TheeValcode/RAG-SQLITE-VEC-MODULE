// debug-extension.ts
import { db, loadVectorExtension } from './db.js';

async function debugExtension() {
  try {
    console.log('Loading sqlite-vec extension...');
    await loadVectorExtension();
    
    console.log('Testing basic vec functions...');
    
    // Test if vec0 module is loaded
    db.all("SELECT name FROM pragma_module_list() WHERE name LIKE '%vec%'", (err, rows) => {
      if (err) {
        console.error('Error checking modules:', err);
      } else {
        console.log('Vec modules loaded:', rows);
      }
    });
    
    // Test available functions
    db.all("SELECT name FROM pragma_function_list() WHERE name LIKE '%vec%'", (err, rows) => {
      if (err) {
        console.error('Error checking functions:', err);
      } else {
        console.log('Vec functions available:', rows);
      }
    });
    
    // Try a simple vec function
    db.get("SELECT vec_version() as version", (err, row) => {
      if (err) {
        console.error('vec_version error:', err.message);
      } else {
        console.log('sqlite-vec version:', row);
      }
    });
    
    // Try vec_from_list with a simple array
    const testVector = JSON.stringify([1, 2, 3]);
    db.get("SELECT vec_from_list(?) as test_vec", [testVector], (err, row) => {
      if (err) {
        console.error('vec_from_list error:', err.message);
      } else {
        console.log('vec_from_list test successful:', row);
      }
    });
    
  } catch (error) {
    console.error('Debug failed:', error);
  }
}

debugExtension();