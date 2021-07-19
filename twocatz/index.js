const fetch = require('node-fetch');
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // these are basically the headers you manually input
    name1 = req.query.name1;
    name2 = req.query.name2;
    name3 = req.query.name3;
    name4 = req.query.name4;

    async function getCatPicture(name) {
        let endpoint = `https://cataas.com/cat/says/${name}`;
        let resp = await fetch(endpoint, {
            method: 'GET'
        });
        
        let data = await resp.arrayBuffer()
        // we need to receive it as a buffer since this is an image we are receiving from the API
        // Buffer?? https://developer.mozilla.org/en-US/docs/Web/API/Blob
       
        let base64data = 'data:image/png;base64,' + Buffer.from(data).toString('base64')
        //put what you want to turn into base64 inside "originaldata"
        //"originaldata" will be encoded in base64.

        return base64data;
    }

    let result1 = await getCatPicture(name1);
    let result2 = await getCatPicture(name2);
    let result3 = await getCatPicture(name3);
    let result4 = await getCatPicture(name4);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            cat1: result1,
            cat2: result2,
            cat3: result3,
            cat4: result4
        } //json format in curly braces
    };
}