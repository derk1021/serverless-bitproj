'use strict';

// All the required imports
const fetch = require('node-fetch');
const multipart = require('parse-multipart');

// authenticating client
const key = '6e571ca58219412ab0bdf08d48056966';
const endpoint = 'https://computervisionseeingit.cognitiveservices.azure.com/';

module.exports = async function (context, req) {
    var boundary = multipart.getBoundary(req.headers['content-type']);
    var body = req.body;
    // store the given image into a list of objects that gives the filename and type of file
    var parts = multipart.Parse(body, boundary);
    // parts[0].data = entire image or jpeg/png
    const callComputerVision = await computerVision(parts[0].data);

    const description = callComputerVision.captions[0].text;
    const confidence = callComputerVision.captions[0].confidence;
    const imageDescription = `The description is ${description}. This description's confidence is ${confidence.toFixed(2)*100}%`;

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: imageDescription
    };
}


async function computerVision(img) {
    const uriBase = endpoint + 'vision/v2.1/analyze?';

    let params = new URLSearchParams({
        'visualFeatures': 'Description,Categories,Faces,Objects,Tags,Brands,Adult',
        'details': 'Celebrities,Landmarks',
        'language': 'en'
    });
    
    let resp = await fetch(uriBase + params.toString(), {
        method: 'POST',  
        body: img,  
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': key,
            //"Access-Control-Allow-Origin" : "*", 
            //"Access-Control-Allow-Credentials" : true 
        }
    });

    const data = await resp.json();
    // Uncomment to see data object
    //console.log('data:', data);

    // We want to return the object containing the available texts along with each confidence
    return data.description;
}   