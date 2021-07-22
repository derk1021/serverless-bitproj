'use strict';

// All the required imports
const async = require('async');
const fs = require('fs');
const https = require('https');
const path = require("path");
const createReadStream = require('fs').createReadStream
const sleep = require('util').promisify(setTimeout);
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

// Start: authenticating client
const key = '6e571ca58219412ab0bdf08d48056966';
const endpoint = 'https://computervisionseeingit.cognitiveservices.azure.com/';

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
        console.log('Analyzing URL image to describe...', describeURL.split('/').pop());
        const caption = (await computerVisionClient.describeImage(describeURL)).captions[0];
        console.log(`This may be ${caption.text} (${caption.confidence.toFixed(2)} confidence)`);

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
        console.log('Analyzing category in image...', categoryURLImage.split('/').pop());
        const categories = (await computerVisionClient.analyzeImage(categoryURLImage)).categories;
        console.log(`Categories: ${formatCategories(categories)}`);

        // Formats the image categories
        function formatCategories(categories) {
            categories.sort((a, b) => b.score - a.score);
            return categories.map(cat => `${cat.name} (${cat.score.toFixed(2)})`).join(', ');
        }

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
        console.log('Analyzing tags in image...', tagsURL.split('/').pop());
        const tags = (await computerVisionClient.analyzeImage(tagsURL, { visualFeatures: ['Tags'] })).tags;
        console.log(`Tags: ${formatTags(tags)}`);

        // Format tags for display
        function formatTags(tags) {
          return tags.map(tag => (`${tag.name} (${tag.confidence.toFixed(2)})`)).join(', ');
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
        console.log('Analyzing objects in image...', objectURL.split('/').pop());
        const objects = (await computerVisionClient.analyzeImage(objectURL, { visualFeatures: ['Objects'] })).objects;
        console.log();

        // Print objects bounding box and confidence
        if (objects.length) {
          console.log(`${objects.length} object${objects.length == 1 ? '' : 's'} found:`);
          for (const obj of objects) { console.log(`    ${obj.object} (${obj.confidence.toFixed(2)}) at ${formatRectObjects(obj.rectangle)}`); }
        } else { console.log('No objects found.'); }

        // Formats the bounding box
        function formatRectObjects(rect) {
          return `top=${rect.y}`.padEnd(10) + `left=${rect.x}`.padEnd(10) + `bottom=${rect.y + rect.h}`.padEnd(12)
            + `right=${rect.x + rect.w}`.padEnd(10) + `(${rect.w}x${rect.h})`;
        }
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
  
  computerVision();