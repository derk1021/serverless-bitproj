var multipart = require('parse-multipart');
var fetch = requie('node-fetch');

module.exports = async function (context, req) {
    var boundary = multipart.getBoundary(req.headers['content-type']);
    
    var body = req.body;

    var parts = multipart.Parse(body, boundary);

    //module.exports function
    //analyze the image
    var result = await analyzeImage(parts[0].data);
    context.res = {
        body: {
            result
        }
    };
    console.log(result)
    context.done(); 
}


async function analyzeImage(img){
    const subscriptionKey = process.env.SUBSCRIPTIONKEY;
    const uriBase = process.env.ENDPOINT + '/face/v1.0/detect';

    let params = new URLSearchParams({
        'returnFaceId': 'true',
        'returnFaceAttributes': 'emotion'     //FILL IN THIS LINE
    });
    
    //COMPLETE THE CODE
    let resp = await fetch(uriBase + '?' + params.toString(), {
        method: 'POST',  //post because we're sending something to the body
        body: 'img',  //WHAT ARE WE SENDING TO THE API?
      
      	//ADD YOUR TWO HEADERS HERE
        headers: {
            'Content-Type': 'application/octet-stream', //adssociated with post requests
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    });

    let getData = await resp.json(); // obtaining the data, calling analyzeImage();
    return getData;
}

