const fetch = require('node-fetch');
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    async function getCatPicture() {
        let resp = await fetch("https://cataas.com/cat/cute/says/Serverless", {
            method: 'GET'
        });
        
        let data = await resp.arrayBuffer()
        // we need to receive it as a buffer since this is an image we are receiving from the API
        // Buffer?? https://developer.mozilla.org/en-US/docs/Web/API/Blob
       
        let base64data = Buffer.from(data).toString('base64')
        //put what you want to turn into base64 inside "originaldata"
        //"originaldata" will be encoded in base64.

        return base64data;
    }

    let getCat1 = await getCatPicture();
    let getCat2 = await getCatPicture();

    function allNames() {
        let theNames = ['Shreya', 'Emily', 'Fifi', 'Beau', 'Evelyn', 'Julia', 'Daniel', 'Fardeen'];
        let randomVal = Math.floor(theNames.length * Math.random());
        let resultName = theNames[randomVal];

        return resultName;
    }

    let getName1 = allNames();
    let getName2 = allNames();

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            cat1: getCat1,
            cat2: getCat2,
            names: [getName1, getName2]
        } //json format in curly braces
    };
}