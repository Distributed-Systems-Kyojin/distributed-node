const db = require('../db_connection').openDatabase();

// save chunk data to the database
const saveChunk = async (chunkId, fileName, chunkIndex, chunkData) => {
    const insertQuery = 'INSERT INTO ChunkData (chunkID, fileName, chunkIndex, chunkData, createdAt) VALUES (?, ?, ?, ?, ?)';
    const params = [chunkId, fileName, chunkIndex, chunkData, new Date().toISOString()];
    return new Promise((resolve, reject) => {
        db.run(insertQuery, params, function(err) {
            if (err) {
                console.error(`Error saving chunk data: ${err}`);
                return reject(err);
            }

            console.log(`Saved chunk ${chunkIndex} for ${fileName}`);
            resolve();
        });
    });
}

// get saved chunk data from filename and chunk index
const getChunk = async (fileName, chunkIndex) => {
    const selectQuery = 'SELECT * FROM ChunkData WHERE chunkIndex = ? AND fileName = ?';
    const params = [chunkIndex, fileName];
    
    return new Promise((resolve, reject) => {
        db.get(selectQuery, params, (err, row) => {
            if (err) {
                console.error('Error getting chunk data:', err);
                reject(err);
            }
            else {
                console.log(`Retrieved chunk data for ${fileName} with index ${chunkIndex}`);
                resolve(row);
            }
        });
    });
}

module.exports = { saveChunk, getChunk };