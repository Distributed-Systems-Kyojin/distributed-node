const db = require('../db_connection').openDatabase();

// save chunk data to the database
const saveChunk = async (chunkId, fileId, fileName, chunkIndex, chunkData) => {
    const insertQuery = 'INSERT INTO ChunkData (chunkID, fileId, fileName, chunkIndex, chunkData, createdAt) VALUES (?, ?, ?, ?, ?, ?)';
    const params = [chunkId, fileId, fileName, chunkIndex, chunkData, new Date().toISOString()];
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
const getChunk = async (fileId) => {
    const selectQuery = 'SELECT * FROM ChunkData WHERE fileId = ?';
    const params = [fileId];
    
    return new Promise((resolve, reject) => {

        db.all(selectQuery, params, (err, row) => {
            if (err) {
                console.error('Error getting chunk data:', err);
                reject(err);
            }
            else {
                console.log(`Retrieved chunk data for ${fileId}`);
                resolve(row);
            }
        });
    });
}

module.exports = { saveChunk, getChunk };