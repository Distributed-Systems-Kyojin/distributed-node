require("dotenv").config();

const { json } = require("express");

const fileService = require('../services/fileService');

const saveChunk = async (req, res) => {
    console.log("inside saveChunk");
    const { chunkId, fileName, chunkIndex, chunk } = req.body;
    let base64Data = Buffer.from(chunk).toString('base64');

    try {
        await fileService.saveChunk(chunkId, fileName, chunkIndex, base64Data);
        res.status(200).send(json({ message: `Chunk ${chunkIndex} saved for ${fileName}` }));
    } catch (err) {
        console.log(err);
        res.status(500).send(json({ message: `Error saving chunk ${chunkIndex} for ${fileName}` }));
    }
}

const getChunk = async (req, res) => {
    const { chunkId, fileName } = req.params;
    try {
        const chunkData = await fileService.getChunk(chunkId, fileName);
        res.status(200).send(chunkData);
    } catch (err) {
        console.log(err);
        res.status(500).send(json({ message: `Error getting chunk for ${fileName}` }));
    }
}

module.exports = {
    saveChunk,
    getChunk
};
