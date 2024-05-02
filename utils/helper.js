const axios = require('axios');
require('dotenv').config();

const fileServerUrl = 'http://localhost:3000';

const nodeId = process.env.NODE_ID;
const nodeURL = `http://localhost:${process.env.PORT || 5000}`;

// Register with the file server
const registerNode = async () => {

  try {

    let response = await axios.post(`${fileServerUrl}/node/register`, { nodeId, nodeURL });

    if (response.status === 200) {
        console.log(`Node ${nodeId} registered with file server.`);
    } 
    else {
       console.error('Error registering node:', response.data); 
    }
  } 
  catch (err) {
    console.error('Error registering node:', err);
  }
};

// Deregister with the file server
const unregisterNode = async () => {

  try {

    let response = await axios.post(`${fileServerUrl}/node/unregister`, { nodeId, nodeURL });

    if (response.status === 200) {
        console.log(`Node ${nodeId} unregistered from file server.`);
    } 
    else {
        console.error('Error unregistering node:', response.data);
    }
  } 
  catch (err) {
    console.error('Error unregistering node:', err);
  }
};

module.exports = { registerNode, unregisterNode };
