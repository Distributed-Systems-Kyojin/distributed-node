const utils = require('./utils/helper');

// environmental variables
require('dotenv').config();

//express app
const appMaker = require('./app');
const app = appMaker.makeApp();

// db connection methods

// const db_conn = require('./db_connection');
// const db = db_conn.openDatabase();
// db_conn.initDatabase();

const db_conn = require('./db_connection_pg');
const connect_db = async (db_conn) => {
    await db_conn.createDB();
}
connect_db(db_conn);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});

// utils.registerNode();

// Handle process exit to unregister the node
const handleExit = async () => {

    // utils.unregisterNode().then(() => {
    //     process.exit();
    // })
    // .catch((err) => {

    //     console.error('Error during deregistration:', err);
    //     process.exit(1);
    // });

    try {
        
        await utils.unregisterNode();
        process.exit();
    } 
    catch (error) {

        console.error('Error during deregistration:', err);
        process.exit(1);
    }
};

// Listen for various termination signals
process.on('exit', handleExit);
process.on('SIGINT', handleExit); // For CTRL+C
process.on('SIGTERM', handleExit); // For external kill commands
process.on('SIGHUP', handleExit); // When the terminal is closed