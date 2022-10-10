const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const initWebRoute = require('./routes/webRoutes')

let app = express();


//use body-parser to post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// init all web routes
initWebRoute(app);

let port = process.env.PORT || 5002;

app.listen(port, ()=>{
   console.log(`App is running at the port ${port}`) ;
});