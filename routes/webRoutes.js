const express = require('express')
const botController = require('../controllers/botController')

let router = express.Router();

let initWebRoutes = (app)=> {
    router.get("/webhook", botController.verifyWebhook);
    router.post("/webhook", botController.postWebhook);

    return app.use("/", router);
};

module.exports = initWebRoutes;