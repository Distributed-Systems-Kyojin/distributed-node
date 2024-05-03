const sqlite3 = require('sqlite3').verbose();
var db = null;

// Create or open the SQLite in-memory database
const openDatabase = () => {

    if (db === null) {

        let node_id = process.env.NODE_ID || '00';
        let db_file = 'db_' + node_id.trim() + '.sqlite';
        
        db = new sqlite3.Database(db_file, (err) => {
        
            if (err) {
                console.error('Could not connect to the database', err);
            }
            else {
                console.log('Connected to the SQLite in-memory database');
            }
        });
    }

    return db;
}

// Check if the "users" table exists and create it if it doesn't
const initDatabase = () => {

    db.serialize(() => {

        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='ChunkData'", [], (err, row) => {

            if (err) {
                console.error('Error checking for table', err);
                return;
            } 
            else if (!row) {

                // Table doesn't exist, create it
                db.run(
                    'CREATE TABLE ChunkData (chunkID TEXT PRIMARY KEY, fileName TEXT, merkleRootHash TEXT, nextChunkNodeID TEXT, nextChunkNodeURL TEXT, chunkPath TEXT, chunkIndex INTEGER, createdAt TEXT)',
                    (err) => {
                        if (err) {
                            console.error('Could not create ChunkData table', err);
                        } 
                        else {
                            console.log('Created ChunkData table');
                        }
                    }
                );

                return;
            } 
            else {
                console.log('Table already exists');
                return row;
            }
        });
    });
};

module.exports = { openDatabase, initDatabase };