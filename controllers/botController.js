const request = require('request')
const {sendREmail} = require('../util/sendMail');
const database = require('../database');
const ObjectId = require('mongodb').ObjectId; 


let token = 'EAAFfqmXKLTcBABNUFedVFS6qy63X45RTdXAeJAkTMUshGn7ZBGUSkSti9ZAuuHAOhDW2cAN8yqP0cj2RAbJyp3pq3y7RmOFqnKZAE23ZB7sRlKlb7K9CGhKFjDhzPYVK1KhpNs35jDz70bZAq9DRDjVZBbMB0SSMS4zXkoKui9wtQvEAqzLEKgfIbNeyEktKHAL84scXoquQZDZD'

let verifyWebhook = (req, res) => {
    let VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'arslanyounas';

    if(req.query['hub.verify_token'] === VERIFY_TOKEN){
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong Token")
};

let postWebhook = async (req, res) => {
    // Parse the request body from the POST
    let body = req.body;
    const randomGreetings = [`How are you?`,
        `I hope you're doing well`,
        `I hope you're having a great day.`]

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(async function (entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];

            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            sendMarkSeen(sender_psid);

            if (webhook_event.message) {
                let msg = webhook_event.message.text;
                console.log(msg)
                if (msg.includes('/')) {
                    let tempResp = msg.split(' ');
                    let action = tempResp[0];
                    if (action.includes('desc')) {
                        let answer = await getProduct(tempResp[1], 'description')
                        callSendAPI(sender_psid, answer);
                    }
                    else if (action.includes('price') || action.includes('shipping')) {
                        let answer = await getProduct(tempResp[1], action.replace('/', ''))
                        callSendAPI(sender_psid, answer);
                    }
                    else if (action.includes('buy')){
                        let answer = await getProduct(tempResp[1], null)
                        sendREmail( JSON.stringify(answer));
                    }

                }
                else if (msg.includes('Hi') || msg.includes('Hello') || msg.includes('Good morning')){
                    callSendAPI(sender_psid, randomGreetings[Math.floor(Math.random() * 3)]);
                }
            }

        });

        // Return a '200 OK' response to all events
        

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
    res.status(200).send('EVENT_RECEIVED');
};


const getProduct = async (id, entity) => {
    try {
        console.log(database.client)
        const products = database.client.db('products').collection('productList');
        //const response = await products.find({ id: parseInt(id) }).toArray();
        const response = await products.find({ "_id" : ObjectId(id) }).toArray();
        
        console.log(response);
        let detail = '';
        response?.[0]?.[entity] ?  detail = response?.[0]?.[entity] :  detail = `Sorry we could not find ${entity}`;
        return detail
    } catch (err) {
        console.log(err)
    }
}


// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": { "text": response }
    };

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v15.0/me/messages",
        "qs": { "access_token": process.env.APP_TOKEN || token},
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!');
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

function sendMarkSeen(sender){
	request({
		url: 'https://graph.facebook.com/v15.0/me/messages',
		qs: {access_token: token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			sender_action: "mark_seen",
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

//sendREmail( 'dsds');

module.exports = {
    verifyWebhook,
    postWebhook,
    
};