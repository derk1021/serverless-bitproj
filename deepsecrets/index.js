const querystring = require('querystring');

module.exports = async function (context, req) {
    const convert = querystring.parse(req.body);
    context.log(convert);
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: convert.body
    };
}