const express = require('express');
const cors = require('cors');

// environmental variables
require('dotenv').config();

const fileRoutes = require('./routes/fileRoutes');

const makeApp = () => {
    // express app
    const app = express();

    app.use(
        cors({
            exposedHeaders: ["x-refresh-token", "x-access-token"],
        })
    );
    app.use(express.json({ limit: '10mb' }));

    // middleware & static files
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });

    // set static file path for production build
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static('client/build'));
    }

    app.use((req, res, next) => {
        res.locals.path = req.path;
        next();
    });

    //root path
    app.get('/', (req, res) => {
        res.send("Welcome...!");
    });

    //routes
    app.use('/file', fileRoutes);

    // handle all other routes
    app.use(async (req, res, next) => {
        next(createError.NotFound());
    });

    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.send({
            error: {
                status: err.status || 500,
                message: err.message,
            },
        });
    });

    return app;
}

module.exports = {
    makeApp
}
