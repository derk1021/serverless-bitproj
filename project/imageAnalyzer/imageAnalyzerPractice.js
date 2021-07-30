'use strict';

// All the required imports
const fs = require('fs');
const https = require('https');
const path = require('path');
const createReadStream = require('fs').createReadStream
const sleep = require('util').promisify(setTimeout);
const fetch = require('node-fetch');
const multipart = require('parse-multipart');
const async = require('async');
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

// Start: authenticating client
const key = '6e571ca58219412ab0bdf08d48056966';
const endpoint = 'https://computervisionseeingit.cognitiveservices.azure.com/';

const requestParameters = 'visualFeatures=Categories,Description,Objects,Tags';
const uriBase = endpoint + 'vision/v2.1/analyze?' + requestParameters;

const apiKey = new ApiKeyCredentials({
    inHeader: {
    'Ocp-Apim-Subscription-Key': key
}});

const computerVisionClient = new ComputerVisionClient(apiKey, endpoint);
// End: authenticating client


function computerVision() {
    async.series([
        async function () {
            /**
             * Describes the image through text:
             * Has a list of texts and confidence levels depicting certainty 
             * Taking the first output text in the list takes the highest confidence %
             */
            console.log('-------------------------------------------------');
            console.log('GIVE DESCRIPTION');
            console.log();

            const describeURL = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/celebrities.jpg';

            // Analyze URL image
            const caption = (await computerVisionClient.describeImage(describeURL, {visualFeatures: ['Description']})).captions[0];
            // Uncomment below to see the json object
            //const jsonCaption = await computerVisionClient.describeImage(describeURL);
            //console.log(jsonCaption);

            // Output
            // "toFixed(2)" rounds the number to 2 decimal places
            console.log(`Text: ${caption.text} (${caption.confidence.toFixed(2)} confidence)`);

            /**
             * Categorizes the image:
             * Goes by a parent/child hierarchy
             * Example: if the image has multiple people, it can be categorized as "people_group"
             * "people_group" is under teh category of "people_"
             */
            console.log('-------------------------------------------------');
            console.log('SHOW CATEGORIES');
            console.log();

            const categoryURLImage = 'https://moderatorsampleimages.blob.core.windows.net/samples/sample16.png';

            // Analyze URL image
            const categories = (await computerVisionClient.analyzeImage(categoryURLImage, {visualFeatures: ['Categories']})).categories;
            // Uncomment below to see the json object
            //const jsonCategories = await computerVisionClient.analyzeImage(categoryURLImage);
            //console.log(jsonCategories);

            // Output
            console.log(`Categories: ${categories[0].name} (${categories[0].score.toFixed(2)} confidence)`);

            /**
             * Gives tags to the image:
             * Can detect what the objects or setting in the image are
             * No hierarchy of organization
             * Example: indoor, outdoor, grass, building, house, sky, etc.
             */
            console.log('-------------------------------------------------');
            console.log('DETECT TAGS');
            console.log();

            // Image of different kind of dog.
            const tagsURL = 'https://moderatorsampleimages.blob.core.windows.net/samples/sample16.png';

            // Analyze URL image
            const tags = (await computerVisionClient.analyzeImage(tagsURL, { visualFeatures: ['Tags'] })).tags;
            formatting(tags);
            // Uncomment below to see the json object
            //const jsonTags = (await computerVisionClient.analyzeImage(tagsURL, { visualFeatures: ['Tags'] }));
            //console.log(jsonTags);

            // Output
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
 
            // Image of a dog
            const objectURL = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-node-sdk-samples/master/Data/image.jpg';

            // Analyze a URL image
            const objects = (await computerVisionClient.analyzeImage(objectURL, { visualFeatures: ['Objects'] })).objects;
            // Uncomment below to see the json object
            //const jsonObjects = (await computerVisionClient.analyzeImage(objectURL, { visualFeatures: ['Objects'] }));
            //console.log(jsonObjects);

            // Output
            if (objects.length) {
                // "for (const someVar of something)" is another way to loop
                for (const obj of objects) { 
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

            // Image of red shirt with microsoft logos
            const brandURLImage = 'https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/images/red-shirt-logo.jpg';

            // Analyze image URL
            const brand = (await computerVisionClient.analyzeImage(brandURLImage, {visualFeatures: ['Brands']})).brands;
            // Uncomment below to see json object
            //const jsonBrand = (await computerVisionClient.analyzeImage(brandURLImage, {visualFeatures: ['Brands']})); 
            //console.log(jsonBrand);

            // Output
            if (brand.length) {
                for (const b of brand) {
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

            // Image of a family
            const facesImageURL = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/faces.jpg';

            // Analyze image URL
            const faces = (await computerVisionClient.analyzeImage(facesImageURL, {visualFeatures: ['Faces']})).faces;
            // Uncomment below to see json object
            //const jsonFaces = (await computerVisionClient.analyzeImage(facesImageURL, {visualFeatures: ['Faces']}));
            //console.log(jsonFaces);

            // Output
            if (faces.length) {
                for (const face of faces) {
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

            // Shows a landmark
            const domainURLImage = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/landmark.jpg';

            // Analyze URL image
            // Can either be 'landmarks' or 'celebrities'
            const domain = (await computerVisionClient.analyzeImageByDomain('landmarks', domainURLImage)).result.landmarks;
            // Uncomment to see json object
            //const jsonDomain = (await computerVisionClient.analyzeImageByDomain('landmarks', domainURLImage));
            //console.log(jsonDomain);

            // Output
            if (domain.length) {
                for (const obj of domain) {
                    console.log(`Domain: ${obj.name} (${obj.confidence.toFixed(2)} confidence)`);
                    if (!obj.faceRectangle) {
                        console.log('');
                    } else {
                        console.log(`Dimensions: top=${(obj.faceRectangle.top)}, ` + `left=${obj.faceRectangle.left}, ` 
                        + `bottom=${obj.faceRectangle.left + obj.faceRectangle.height}, ` 
                        + `right=${obj.faceRectangle.top + obj.faceRectangle.width}, ` + `(${obj.faceRectangle.width}x${obj.faceRectangle.height})`); 
                    }
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
            // The URL image and local images are not racy/adult. 
            // Try your own racy/adult images for a more effective result.
            const adultURLImage = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/celebrities.jpg';

            // Analyze URL image
            const adult = (await computerVisionClient.analyzeImage(adultURLImage, {visualFeatures: ['Adult']})).adult;
            // Uncomment to see json
            //const jsonAdult = (await computerVisionClient.analyzeImage(adultURLImage, {visualFeatures: ['Adult']}));
            //console.log(jsonAdult);

            // Output
            console.log(`Adult Content Status: ${!adult.isAdultContent ? 'None detected' : 'Detected'} (${adult.adultScore.toFixed(4)} confidence)`);
            console.log(`Racy Content Status: ${!adult.isRacyContent ? 'None detected' : 'Detected'} (${adult.adultScore.toFixed(4)} confidence)`);
            console.log(`Gory Content Status: ${!adult.isGoryContent ? 'None detected' : 'Detected'} (${adult.adultScore.toFixed(4)} confidence)`);
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

    const callComputerVision = computerVision();

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: callComputerVision
    };
}