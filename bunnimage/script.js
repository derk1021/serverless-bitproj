// no async for post requests
function getImage(event) {
    // stops the page from refreshing
    event.preventDefault(); 
    // we reference the html form element with document.getElementById("YOUR_FORM_ID"), so we can create a FormData object
    // also used for header and file input
    let refId = document.getElementById("formData");
    let inputName = document.getElementById('inputTheName');
    let inputFile = document.getElementById('chooseFiles');
    // we extract the file the user uploaded using fileInput.files[0]
    const file = inputFile.files[0];
    // creating the FormData Object, used as the body since we're uploading an image
    let formObj = new FormData(refId);
    // finally, we add the file created to the FormData object using append, and a key('file')-value(file) pair
    formObj.append('file', file);

    try {
        if (inputName.value !== '') {
            // making request to Azure function and UPLOADING
            let uploadUrl = "https://dereksemotionalfunction.azurewebsites.net/api/bunnimage-upload?";
            let resp = fetch(uploadUrl, {
                method: 'POST',
                body: formObj,
                headers: {
                    'codename': inputName.value
                }
            });
            $('#output').text('Your image has been stored successfully!');
        } else {
            alert('No name error.');
      }
    } catch (error) {
        $('#output').text("There is an error!");
    }
}

// async got get requests
async function downloadImage() {
    let inputDownloadable = document.getElementById("downloadusername");
    // using the bunnimage download api
    let downloadUrl = "https://dereksemotionalfunction.azurewebsites.net/api/bunnimage-download?";
    if (inputDownloadable.value !== '') {
        try {
        // making a get request to the image
        // also returns a Promise containing a response
        fetch(downloadUrl, {
            headers: {
            username: inputDownloadable.value
            }
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log('data:', data);
            console.log('data.downloadUri:', data.downloadUri);
            window.log(data.downloadUri, '_self');
        });
        } catch (error) {
        $('#output').text(error);
        }
    } else {
        $('#output').text("Specify the correct name!");
    }
}