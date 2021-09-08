'use strict';

// All the required imports
const fetch = require('node-fetch');
const multipart = require('parse-multipart');
const async = require('async');


// authenticating client
const key = '6e571ca58219412ab0bdf08d48056966';
const endpoint = 'https://computervisionseeingit.cognitiveservices.azure.com/';

async function computerVision(img) {
    async.series([
        async function () {
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
                    'Ocp-Apim-Subscription-Key': key 
                }
            });

            const data = await resp.json();
            // Uncomment to see data object
            //console.log('data:', data);

            /**
             * Describes the image through text:
             * Has a list of texts and confidence levels depicting certainty 
             * Taking the first output text in the list takes the highest confidence %
             */
            console.log('-------------------------------------------------');
            console.log('GIVE DESCRIPTION');
            console.log();

            // Output
            // "toFixed(2)" rounds the number to 2 decimal places
            console.log(`Text: ${data.description.captions[0].text} (${data.description.captions[0].confidence.toFixed(2)} confidence)`);
            
            /**
             * Categorizes the image:
             * Goes by a parent/child hierarchy
             * Example: if the image has multiple people, it can be categorized as "people_group"
             * "people_group" is under teh category of "people_"
             */
             console.log('-------------------------------------------------');
             console.log('SHOW CATEGORIES');
             console.log();
 
             // Output
             console.log(`Categories: ${data.categories[0].name} (${data.categories[0].score.toFixed(2)} confidence)`);
            
             /**
             * Gives tags to the image:
             * Can detect what the objects or setting in the image are
             * No hierarchy of organization
             * Example: indoor, outdoor, grass, building, house, sky, etc.
             */
            console.log('-------------------------------------------------');
            console.log('DETECT TAGS');
            console.log();

            // Output
            formatting(data.tags);

            function formatting(tags) {
                for (let i = 0; i < tags.length; i++) {
                    console.log((`Tags: ${tags[i].name} (${tags[i].confidence.toFixed(2)} confidence),`));
                }
            }

            /**
             * Detects object in the image (different from tags):
             * Gives bounding box coordinates for each object (tag) found
             * Can also find multiple instances of the same tag if found
             */
            console.log('-------------------------------------------------');
            console.log('DETECT OBJECTS');
            console.log();

            // Output
            if (data.objects.length) {
                // "for (const someVar of something)" is another way to loop
                for (const obj of data.objects) { 
                    console.log(`Objects: ${obj.object} (${obj.confidence.toFixed(2)} confidence)`); 
                    console.log(`Dimensions: top=${(obj.rectangle.x)}, ` + `left=${obj.rectangle.y}, ` + `bottom=${obj.rectangle.y + obj.rectangle.h}, ` 
                    + `right=${obj.rectangle.x + obj.rectangle.w}, ` + `(${obj.rectangle.w}x${obj.rectangle.h})`); 
                }
            } else { 
                console.log('No objects found.'); 
            }

            /**
             * Detects brands in the image:
             * Gives bounding box coordinates around the logo
             * Can detect logo image (microsoft logo) and stylized brand (the words "microsoft") simultaneously
             */
            console.log('-------------------------------------------------');
            console.log('DETECT BRANDS');
            console.log();

            // Output
            if (data.brands.length) {
                for (const b of data.brands) {
                    console.log(`Brands: ${b.name} (${b.confidence} confidence)`);
                }
            } else {
                console.log('No brand detected.');
            }
            /**
             * Can detect human faces in an image:
             * Generate the age, gender, and rectangle for each detected face.
             */
            console.log('-------------------------------------------------');
            console.log('DETECT FACES');
            console.log();

            // Output
            if (data.faces.length) {
                for (const face of data.faces) {
                    console.log(`Faces: age=${face.age}, gender=${face.gender}`);
                    console.log(`Dimensions: top=${(face.faceRectangle.top)}, ` + `left=${face.faceRectangle.left}, ` 
                    + `bottom=${face.faceRectangle.left + face.faceRectangle.height}, ` 
                    + `right=${face.faceRectangle.top + face.faceRectangle.width}, ` + `(${face.faceRectangle.width}x${face.faceRectangle.height})`); 
                }
            } else {
                console.log('No face(s) detected.');
            }

            /**
             * Can detect landmarks/celebrities in an image:
             * Generate the age, gender, and rectangle for each detected face.
             */
            console.log('-------------------------------------------------');
            console.log('DETECT DOMAIN-SPECIFIC CONTENT');
            console.log();
            
            if (data.categories[0].detail.celebrities.length) {
                for (const obj of data.categories[0].detail.celebrities) {
                    console.log(`Celebrities: ${obj.name} (${obj.confidence.toFixed(2)} confidence)`);
                    if (!obj.faceRectangle) {
                        console.log('');
                    } else {
                        console.log(`Dimensions: top=${(obj.faceRectangle.top)}, ` + `left=${obj.faceRectangle.left}, ` 
                        + `bottom=${obj.faceRectangle.left + obj.faceRectangle.height}, ` 
                        + `right=${obj.faceRectangle.top + obj.faceRectangle.width}, ` 
                        + `(${obj.faceRectangle.width}x${obj.faceRectangle.height})`); 
                    }
                }
            } else if (data.categories[0].detail.landmarks.length) {
                for (const obj2 of data.categories[0].detail.landmarks) {
                    console.log(`Landmarks: ${obj2.name} (${obj2.confidence.toFixed(2)} confidence)`);
                }
            } else {
                console.log('No landmarks/celebrities found.');
            }

            /**
             * Can detect adult content in an image:
             * Returns three boolean properties—isAdultContent, isRacyContent, and...
             * isGoryContent—in its JSON response
             * The method also returns corresponding properties—adultScore, racyScore and...
             * goreScore—which represent confidence scores between zero and one for each...
             * respective category.
             */
            console.log('-------------------------------------------------');
            console.log('DETECT ADULT/RACY/GORY CONTENT');
            console.log();

            // Output
            console.log(`Adult Content Status: ${!data.adult.isAdultContent ? 'None detected' : 'Detected'} (${data.adult.adultScore.toFixed(4)} confidence)`);
            console.log(`Racy Content Status: ${!data.adult.isRacyContent ? 'None detected' : 'Detected'} (${data.adult.adultScore.toFixed(4)} confidence)`);
            console.log(`Gory Content Status: ${!data.adult.isGoryContent ? 'None detected' : 'Detected'} (${data.adult.adultScore.toFixed(4)} confidence)`);
            
            return data.description;
        },
        function () {
            return new Promise((resolve) => {
            resolve();
            })
        }
    ], (err) => {
    throw (err);
    });
}


module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var boundary = multipart.getBoundary(req.headers['content-type']);
    //console.log('boundary:', boundary);
    var body = req.body;
    //console.log('body:', body);
    // store the given image into a list of objects that gives the filename and type of file
    var parts = multipart.Parse(body, boundary);
    //console.log('parts:', parts);
    // parts[0].data = entire image
    const callComputerVision = await computerVision(parts[0].data);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: callComputerVision
    };
}