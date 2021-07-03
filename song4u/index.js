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
    //context.log('reqBody:', reqBody);

    // we need to parse reqbody
    const queryObject = queryString.parse(reqBody);
    //context.log('queryObject:', queryObject);

    let resp = await fetch(queryObject.MediaUrl0, {
        method: 'GET',
    });
    //context.log('resp:', resp);

    // receive the response
    let data = await resp.arrayBuffer();
    //context.log('data:', data);
    // we are receiving it as a Buffer since this is binary data

    let result = await analyzeImage(data);
    //context.log('result:', result);

    let age = parseInt(result[0].faceAttributes.age);

    let generation = '';

    const songs = {"GenZ":"https://open.spotify.com/track/0SIAFU49FFHwR3QnT5Jx0k?si=1c12067c9f2b4fbf", 
    "GenY":"https://open.spotify.com/track/1Je1IMUlBXcx1Fz0WE7oPT?si=a04bbdf6ec4948b9", 
    "GenX":"https://open.spotify.com/track/4Zau4QvgyxWiWQ5KQrwL43?si=790d9e3ef2ed408d", 
    "BabyBoomers":"https://open.spotify.com/track/4gphxUgq0JSFv2BCLhNDiE?si=1abb329f2dc24f50", 
    "Unknown":"https://open.spotify.com/track/5ygDXis42ncn6kYG14lEVG?si=84b49b41d09d4d11"}
    
    if (age > 5 && age < 25) {
        generation = `We guessed you're part of this generation: GenZ! Happy listening! ${songs['GenZ']}`;
    } else if (age > 24 && age < 41) {
        generation = `We guessed you're part of this generation: GenY! Happy listening! ${songs['GenY']}`;
    } else if (age > 40 && age < 57) {
        generation = `We guessed you're part of this generation: GenX! Happy listening! ${songs['GenX']}`;
    } else if (age > 56 && age < 76) {
        generation = `We guessed you're part of this generation: BabyBoomers! Happy listening! ${songs['BabyBoomers']}`;
    } else {
        generation = `We guessed you're part of this generation: Unknown! Happy listening! ${songs['Unknown']}`;
    }

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