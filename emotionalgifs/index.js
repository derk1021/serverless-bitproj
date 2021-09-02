var multipart = require('parse-multipart');
var fetch = require('node-fetch');

module.exports = async function (context, req) {
    var boundary = multipart.getBoundary(req.headers['content-type']);
    console.log('boundary:', boundary);
    var body = req.body;
    //console.log('body:', body);
    // store the given image into a list of objects that gives the filename and type of file
    var parts = multipart.Parse(body, boundary);
    //console.log('parts:', parts);
    //console.log('parts0:', parts[0].filename);
    //module.exports function
    //analyze the image
    var result = await analyzeImage(parts[0].data);
    //console.log('result:', result);
    // getting the emotion attribute
    let emotions = result[0].faceAttributes.emotion;
    //console.log('emotions:', emotions);
    let objects = Object.values(emotions);
    // FILL IT IN
    // What your array could look like: [0.01, 0.34, .....]

    const main_emotion = Object.keys(emotions).find(key => emotions[key] === Math.max(...objects));
    // gets the main emotion (happiness in this case)

    let gifUrl = await findGifs(main_emotion);

    context.res = {
        body: gifUrl
    };

    context.done(); 
}


async function analyzeImage(img){
    const subscriptionKey = "3cc99a9edd9a476aa17c9fc36b2fa5bf";
    const uriBase = "https://durmsapi.cognitiveservices.azure.com/face/v1.0/detect";
    //const subscriptionKey = process.env.SUBSCRIPTIONKEY;
    //const uriBase = process.env.ENDPOINT + '/face/v1.0/detect';
    // remember when testing with postman, hardcode teh subscription
    // key and azure url

    let params = new URLSearchParams({
        'returnFaceId': 'true',
        'returnFaceAttributes': 'emotion'
    })
    //COMPLETE THE CODE
    let resp = await fetch(uriBase + '?' + params.toString(), {
        method: 'POST',  //WHAT TYPE OF REQUEST?
        body: img,  //WHAT ARE WE SENDING TO THE API?
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': subscriptionKey //do this in the next section
        }
    })
    // data returns the 
    let data = await resp.json();
    return data; 
}

async function findGifs(emotion) {
    // giphy key
    const apiKey = "puky1KRol5OYx1TT6V7SaTsl6BDIYMPp";
    //const apiKey = process.env.giphykey;
    // returning the api with the giphy key with required additional parameters
    let apiResult = await fetch("https://api.giphy.com/v1/gifs/translate?api_key=" + apiKey + "&s=" + emotion);
    // translating the api to json format
    let jsonResult = await apiResult.json();
    //console.log('jsonResult:', jsonResult);
    // finds the url gif
    return jsonResult.data.url;
}