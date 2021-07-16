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
/*
    if (inputName.value !== '') {

    } else {
        alert('No name error.')
    }
    */
    try {
        if (inputName.value !== '') {
            let url = "https://dereksemotionalfunction.azurewebsites.net/api/bunnimage-upload?";
            // making request to Azure function
            let resp = fetch(url, {
                method: 'POST',
                body: formObj,
                headers: {
                    'codename': inputName.value
                }
            });
            $('#output').text('Your image has been stored successfully!');
        } else {
            alert('No name error.')
      }
    } catch (error) {
        $('#output').text("dfdf");
    }
}