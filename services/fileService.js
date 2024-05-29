const fs = require('fs');
const path = require('path');
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

const saveChunkAsFile = async (chunkId, fileId, fileName, chunkIndex, chunkData) => {
    const insertQuery = 'INSERT INTO ChunkData (chunkID, fileId, fileName, chunkIndex, createdAt) VALUES (?, ?, ?, ?, ?)';
    const params = [chunkId, fileId, fileName, chunkIndex, new Date().toISOString()];

    return new Promise((resolve, reject) => {
        db.run(insertQuery, params, function(err) {
            if (err) {
                console.error(`Error saving chunk data: ${err}`);
                return reject(err);
            }

            const fileDir = path.join(__dirname, '../data', fileId);
            const filePath = path.join(fileDir, `${chunkId}.txt`);

            fs.promises.mkdir(fileDir, { recursive: true })
                .then(() => fs.promises.writeFile(filePath, chunkData))
                .then(() => {
                    console.log(`Saved chunk ${chunkIndex} for ${fileName}`);
                    resolve();
                })
                .catch((err) => {
                    console.error(`Error saving chunk data: ${err}`);
                    reject(err);
                });
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

const getChunkFromFile = async (fileId) => {
    const selectQuery = 'SELECT * FROM ChunkData WHERE fileId = ?';
    const params = [fileId];

    return new Promise((resolve, reject) => {
        db.all(selectQuery, params, async (err, rows) => {
            if (err) {
                console.error('Error getting chunk data:', err);
                reject(err);
            }
            else {
                console.log(`Retrieved chunk data for ${fileId}`);
                try {
                    const chunks = [];
                    for (const row of rows) {
                        const filePath = path.join(__dirname, '../data', fileId, `/${row.chunkID}.txt`);
                        const data = await fs.promises.readFile(filePath, 'utf-8');
                        chunks.push({ ...row, chunkData: data });
                    }
                    resolve(chunks);
                } catch (err) {
                    console.error('Error getting chunk data:', err);
                    reject(err);
                }
            }
        });
    });
}

module.exports = { saveChunk, getChunk, saveChunkAsFile, getChunkFromFile };