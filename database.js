const { MongoClient } = require('mongodb');

const database = module.exports;
const uri = `mongodb+srv://ayounas02:test123@cluster0.okzqruf.mongodb.net/?retryWrites=true&w=majority`;

async function main(){
    database.client = new MongoClient(uri);
    try {
        // Connect to the MongoDB cluster
        await database.client.connect();
        console.log('DB Connected')
    } catch (e) {
        console.error(e);
    } 
}

main().catch(console.error);
