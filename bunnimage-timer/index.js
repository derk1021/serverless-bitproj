/******** Code: Deletes files in blob container after every 5 mins *********/
const { BlobServiceClient } = require("@azure/storage-blob");
const connectionstring = process.env["AZURE_STORAGE_CONNECTION_STRING"];
const account = "myfirstblob1";

module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();

    // Creates a BlobServiceClient object that will be used to create a container client.
    const blobServiceClient = await BlobServiceClient.fromConnectionString(connectionstring);
    // Create a variable that references the name of the container that contains the file you want to delete.
    const deletecontainer = "blob-container";
    // Fetch the container with that name
    const deletecontainerClient = await blobServiceClient.getContainerClient(deletecontainer);

    for await (const blob of deletecontainerClient.listBlobsFlat()) {
        context.log('\t', blob.name);
        await deleteBlob(blob.name, deletecontainerClient)
        // access the blob's name and call deleteBlob to delete it!
    }    
    context.log("Just deleted your blobs!")

    if (myTimer.isPastDue)
    {
        context.log('JavaScript is running late!');
    }
    context.log('JavaScript timer trigger function ran!', timeStamp);   
};

async function deleteBlob(filename, deletecontainerClient) {
    // Within that container, fetch the block blob client that has the name of filename.
    const deleteblockBlobClient = deletecontainerClient.getBlockBlobClient(filename);
    // Download the blob from the system and fetch a reference to the readable stream.
    const downloadBlockBlobResponse = await deleteblockBlobClient.download(0); // 0 refers to the position of the blob to download
    // Delete the blob.
    const blobDeleteResponse = deleteblockBlobClient.delete();

    // Notice: downloadBlockBlobResponse and blobDeleteResponse aren't highlighted because they're responses
    result = {
        body : {
            deletename: filename,
            success: true
        }
    };
    return result;
}