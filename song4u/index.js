const queryString = require('querystring');

module.exports = async function (context, req) {
    // Ex. of reqbody output: 
    // 'ToCountry=US&MediaContentType0=image%2Fjpeg&ToState=MI&SmsMessageSid=MM0fe83458b74a1f626eb0da4685ab28b5&NumMedia=1'
    const reqBody = req.body;
    console.log('reqBody:', reqBody);

    // we need to parse reqbody
    const queryObject = queryString.parse(reqBody);
    console.log('queryObject:', queryObject);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: queryObject.MediaUrl0
    };
}

