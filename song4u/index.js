const queryString = require('querystring');
const fetch = require('node-fetch');

/* 
Initialize the request body -> parse it -> make a fetch request (GET) ->
receive the data in the form of a buffer -> analyze the given image -> 
get our result in the first index
*/
module.exports = async function (context, req) {
    // Ex. of reqbody output: 
    // 'ToCountry=US&MediaContentType0=image%2Fjpeg&ToState=MI&SmsMessageSid=MM0fe83458b74a1f626eb0da4685ab28b5&NumMedia=1'
    const reqBody = req.body;
    context.log('reqBody:', reqBody);

    // we need to parse reqbody
    const queryObject = queryString.parse(reqBody);
    context.log('queryObject:', queryObject);

    context.log(queryObject.MediaUrl0);
    let resp = await fetch(queryObject.MediaUrl0, {
        method: 'GET',
    });

    // receive the response
    let data = await resp.arrayBuffer();
    context.log(data);
    // we are receiving it as a Buffer since this is binary data

    let result = await analyzeImage(data);
    context.log(result);

    let age = parseInt(result[0].faceAttributes.age);
    context.log(age);

    let generation = '';

    if (age > 5 && age < 25) {
        generation = 'GenZ';
    } else if (age > 24 && age < 41) {
        generation = 'GenY';
    } else if (age > 40 && age < 57) {
        generation = 'GenX';
    } else if (age > 56 && age < 76) {
        generation = 'BabyBoomers';
    } else {
        generation = 'Unknown';
    }
    context.log(generation);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: generation
    };
}

async function analyzeImage(image) {
    // subscription key and endpoint
    //const subscriptKey = process.env.SUBSCRIPTION_KEY;
    //const theUrl = process.env.SONGREC_ENDPOINT + 'face/v1.0/detect';
    const subscriptKey = process.env.SUBSCRIPTIONKEY;
    const theUrl = process.env.ENDPOINT + 'face/v1.0/detect';
    // establish the parameters 
    let theParameters = new URLSearchParams({
        'returnFaceId': 'true',
        'returnFaceAttributes': 'age'
    });

    let resp = await fetch(theUrl + '?' + theParameters.toString(), {
        method: 'POST',
        body: image,  //WHAT ARE WE SENDING TO THE API?
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': subscriptKey //do this in the next section
        }
    });

    let data = await resp.json();

    return data;
}