const fetch = require('node-fetch');

module.exports = async function (context, req) {

    // We need to give the parameters for the link
    let blobStorageUri = "myfirstblob1"; //ihiuhu
    let blobContainerName = "blob-container";

    // We are getting the 'username' header to determine the file that's needs to be downloaded
    var username = req.headers['username'];
    // Testing for when download has .png or .jpeg extension
    var download = ""
    var downloadpng = `https://${blobStorageUri}.blob.core.windows.net/${blobContainerName}/${username}.png`;
    var downloadjpg = `https://${blobStorageUri}.blob.core.windows.net/${blobContainerName}/${username}.jpg`;
    var downloadjpeg = `https://${blobStorageUri}.blob.core.windows.net/${blobContainerName}/${username}.jpeg`;

    // Making the 'GET' requests for each of the types of downloaded images
    let pngresp = await fetch(downloadpng, {
        method: 'GET'
    });
    let jpgresp = await fetch(downloadjpg, {
        method: 'GET'
    });
    let jpegresp = await fetch(downloadjpeg, {
        method: 'GET'
    });

    // Holds the data and is ready to be called
    let pngdata = await pngresp;
    let jpgdata = await jpgresp;
    let jpegdata = await jpegresp;

    // Checks if the blob exists or not for purposes of downloading
    // Test which is the correct download URL
    if (pngdata.statusText == "The specified blob does not exist." && jpgdata.statusText == "The specified blob does not exist." ) {
        // The attribute "statusText" determine if a blob exists
        success = false;
        context.log("Does not exist: " + pngdata);
        context.log("Does not exist: " + jpgdata);
    } else if (pngdata.statusText != "The specified blob does not exist.") {
        success = true;
        download = downloadpng;
        context.log("Does exist: " + pngdata);
    } else if (jpgdata.statusText != "The specified blob does not exist.") {
        success = true;
        download = downloadjpg;
        context.log("Does exist: " + jpgdata);
    } else if (jpegdata.statusText != "The specified blob does not exist.") {
        success = true;
        doNotTrack = downloadjpeg;
        context.log("Does existL: " + jpegdata);
    }
    
    context.res = {
        body: {
                 "downloadUri" : download,
                 "success": success,
        }
  };
  context.log(download);
  context.done();  
}