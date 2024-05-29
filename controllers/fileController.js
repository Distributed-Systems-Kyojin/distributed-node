require("dotenv").config();

const { json } = require("express");

const fileService = require('../services/fileService');

const saveChunk = async (req, res) => {
    const { chunkId, fileId, fileName, chunkIndex, chunk } = req.body;
    let base64Data = Buffer.from(chunk).toString('base64');

    try {
        await fileService.saveChunkAsFile(chunkId, fileId, fileName, chunkIndex, base64Data);
        res.status(200).send({ message: `Chunk ${chunkIndex} saved for ${fileName}` });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: `Error saving chunk ${chunkIndex} for ${fileName}` });
    }
}

const getChunk = async (req, res) => {
    const { fileId } = req.query;
    try {
        const chunkDataList = await fileService.getChunkFromFile(fileId);
        
        chunkDataList.map((chunkDataItem) => {
            chunkDataItem.chunkData = Buffer.from(chunkDataItem.chunkData, 'base64');
        });
        
        res.status(200).send(chunkDataList);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: `Error getting chunk for ${fileId}` });
    }
}

module.exports = {
    saveChunk,
    getChunk
};
