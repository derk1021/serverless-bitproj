const multipart = require('parse-multipart');
const fetch = require('node-fetch');
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
    // Parsing the data
    const body = req.body;
    const boundary = multipart.getBoundary(req.headers['content-type']);
    const parsedBody = multipart.Parse(body, boundary);

    // checking what the file type is
    let filetype = parsedBody[0].type;
    let ext = "";
    if (filetype == "image/png") {
        ext = "png";
    } else if (filetype == "image/jpeg") {
        ext = "jpeg";
    } else if (filetype == "image/jpg") {
        ext = "jpg";
    } else {
        username = "invalidimage";
    }
    
    // calling the upload file function
    let responseMessage = await uploadFile(parsedBody, ext);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}

// Function for uploading a file to the blob storage
async function uploadFile(parsedBody, ext) {
    /*
    These three lines basically tell blob "Hey, these are my credentials,
    can you let me access my storage?"
    */
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerName = "blob-container";
    const containerClient = blobServiceClient.getContainerClient(containerName);    // Get a reference to a container
    
    // Creating a blob
    // ext == extension, like .jpeg or .png
    const blobName = 'test.' + ext;    // Create the container, or available directories
    const blockBlobClient = containerClient.getBlockBlobClient(blobName); // Get a block blob client, or getting the files ready
    
    // Uploading the blob to the container
    const uploadBlobResponse = await blockBlobClient.upload(parsedBody[0].data, parsedBody[0].data.length);

    // we don't return the upload because we are saving it in this function
    return "File Saved!"
}
