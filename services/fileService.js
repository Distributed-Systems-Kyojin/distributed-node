const db = require('../db_connection').openDatabase();

// save chunk data to the database
const saveChunk = async (chunkId, fileName, chunkIndex, chunkData) => {
    try {
        db.run('INSERT INTO ChunkData (chunkID, fileName, chunkIndex, chunkData, createdAt) VALUES (?, ?, ?, ?, ?)', [chunkId, fileName, chunkIndex, chunkData, new Date().toISOString()], function (err) {
            if (err) {
                console.error('Error saving chunk data:', err);
            }
            else {
                console.log(`Saved chunk ${chunkIndex} for ${fileName}`);
            }
        });
    } catch (err) {
        console.error('Error saving chunk data:', err);
    }
}

// get saved chunk data from id and filename
const getChunk = async (chunkId, fileName) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM ChunkData WHERE chunkID = ? AND fileName = ?', [chunkId, fileName], (err, row) => {
            if (err) {
                console.error('Error getting chunk data:', err);
                reject(err);
            }
            else {
                resolve(row);
            }
        });
    });
}

module.exports = { saveChunk, getChunk };