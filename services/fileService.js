const fs = require('fs');
const path = require('path');

const db = require('../db_connection_pg');

var pool = null;
const getPool = async () => {

    if (pool === null) {
        pool = await db.getDB();
    }
}
getPool();

const saveChunk = async (chunkId, fileId, fileName, chunkIndex, chunkData) => {

    const insertQuery = {
        name: 'save-chunk',
        text: 'INSERT INTO "ChunkData" ("chunkID", "fileId", "fileName", "chunkIndex", "chunkData", "createdAt") VALUES ($1, $2, $3, $4, $5, $6)',
        values: [chunkId, fileId, fileName, chunkIndex, chunkData, new Date().toISOString()],
    }

    try {
        const res = await pool.query(insertQuery);
        console.log(`Saved chunk ${chunkIndex} for ${fileName}`);
        return
    }
    catch (err) {
        console.error(`Error saving chunk data: ${err}`);
        throw err;
    }
}

const saveChunkAsFile = async (chunkId, fileId, fileName, chunkIndex, chunkData) => {

    const insertQuery = {
        name: 'save-chunk-as-file',
        text: 'INSERT INTO "ChunkData" ("chunkID", "fileId", "fileName", "chunkIndex", "createdAt") VALUES ($1, $2, $3, $4, $5)',
        values: [chunkId, fileId, fileName, chunkIndex, new Date().toISOString()],
    }

    try {

        const res = await pool.query(insertQuery);

        const fileDir = path.join(__dirname, '../data', fileId);
        const filePath = path.join(fileDir, `${chunkId}.txt`);

        fs.promises.mkdir(fileDir, { recursive: true })
            .then(() => fs.promises.writeFile(filePath, chunkData))
            .then(() => {
                console.log(`Saved chunk ${chunkIndex} for ${fileName}`);
                return;
            })
            .catch((err) => {
                console.error(`Error saving chunk data: ${err}`);
                throw err;
            });
    }
    catch (err) {
        console.error(`Error saving chunk data: ${err}`);
        throw err;
    }
}

const getChunk = async (fileId) => {

    const selectQuery = {
        name: 'get-chunk',
        text: 'SELECT * FROM "ChunkData" WHERE "fileId" = $1',
        values: [fileId],
    }

    try {

        const res = await pool.query(selectQuery);
        console.log(`Retrieved chunk data for ${fileId}`);

        return res.rows;
    } 
    catch (err) {
        console.error('Error getting chunk data:', err);
        throw err;
    }
}

const getChunkFromFile = async (fileId) => {

    const selectQuery = {
        name: 'get-chunk-from-file',
        text: 'SELECT * FROM "ChunkData" WHERE "fileId" = $1',
        values: [fileId],
    }

    try {

        const res = await pool.query(selectQuery);
        console.log(`Retrieved chunk data for ${fileId}`);

        try {

            const chunks = [];

            for (const row of res.rows) {

                const filePath = path.join(__dirname, '../data', fileId, `/${row.chunkID}.txt`);
                const data = await fs.promises.readFile(filePath, 'utf-8');

                chunks.push({ ...row, chunkData: data });
            }

            return chunks;
        } 
        catch (err) {
            console.error('Error getting chunk data:', err);
            throw err;
        }
    } 
    catch (err) {
        console.error('Error getting chunk data:', err);
        throw err;
    }
}

const deleteChunks = async (fileId) => {

    // check for the folder with fileId
    const fileDir = path.join(__dirname, '../data/', fileId);
    try {
        // delete the folder
        await fs.promises.rm(fileDir, { recursive: true });
        console.log(`Deleted chunks for ${fileId}`);

        // remove the rows from the database
        const deleteQuery = {
            name: 'delete-chunks',
            text: 'DELETE FROM "ChunkData" WHERE "fileId" = $1',
            values: [fileId],
        }

        const response = await pool.query(deleteQuery);
        console.log(`Deleted rows for ${fileId}`);

        return response;
    } catch (error) {
        console.error(`Error deleting chunks for ${fileId}: ${error}`);
        throw error;
    }

}

module.exports = { saveChunk, getChunk, saveChunkAsFile, getChunkFromFile, deleteChunks };