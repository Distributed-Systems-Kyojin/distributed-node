require("dotenv").config();

const { json } = require("express");

const fileService = require('../services/fileService');

const saveChunk = async (req, res) => {
    const { chunkId, fileName, chunkIndex, chunk } = req.body;
    let base64Data = Buffer.from(chunk).toString('base64');

    try {
        await fileService.saveChunk(chunkId, fileName, chunkIndex, base64Data);
        res.status(200).send({ message: `Chunk ${chunkIndex} saved for ${fileName}` });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: `Error saving chunk ${chunkIndex} for ${fileName}` });
    }
}

const getChunk = async (req, res) => {
    const { fileName, chunkIndex } = req.query;
    try {
        const chunkData = await fileService.getChunk(fileName, chunkIndex);
        res.status(200).send(chunkData);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: `Error getting chunk for ${fileName}` });
    }
}

module.exports = {
    saveChunk,
    getChunk
};
