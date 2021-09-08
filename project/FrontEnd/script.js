function returnText(event) {
    event.preventDefault();

    // We reference the html form element with document.getElementById("YOUR_FORM_ID")...
    // so we can create a FormData object.
    let refId = document.getElementById("formData");
    let inputFile = document.getElementById('chooseFiles');

    // We extract the file the user uploaded using fileInput.files[0].
    const file = inputFile.files[0];

    // Creating the FormData Object, used as the body since we're uploading an image.
    // Remember that form-data is use for attaching images.
    let formObj = new FormData(refId);

    // Finally, we add the file created to the FormData object using append...
    // and a key('file')-value(file) pair.
    formObj.append('image', file);

    /**
     * HERE IS A TABLE REPRESENTING THE XMLHttpRequest.readyState PROPERTIES:
     * --------------------------------------------------------------------------------------------
     * | Value | State            | Description                                                   |
     * --------------------------------------------------------------------------------------------
     * |   0   | UNSENT           | Client has been created. open() not called yet.               |
     * |   1   | OPENED           | open() has been called.                                       |
     * |   2   | HEADERS_RECEIVED | send() has been called, and headers and status are available. |
     * |   3   | LOADING          | Downloading; responseText holds partial data.                 |
     * |   4   | DONE             | The operation is complete.                                    |
     * --------------------------------------------------------------------------------------------
     */

    // Sending and receiving HTTP request using the XMLHttpRequest() object method.
    let xhr = new XMLHttpRequest(); //--> xhr.readyState is 0

    // Making a post request, inputting the api, and true indicates an asyncronous request
    xhr.open('POST', "https://dereksemotionalfunction.azurewebsites.net/api/ImageAnalysisTrigger?", true); //--> xhr.readyState is 1
    
    // Sending the request BODY (aka the image).
    xhr.send(formObj); //--> xhr.readyState is 2
    
    // Anonymous function for getting the response
    xhr.onload = () => {
        // Seeing is the readystate is 'DONE' and status is 200 (meaning okay!)
        if (xhr.readyState == 4 && xhr.status == 200) {
            let response = xhr.responseText;
            $('#output').text(response);
        } else {
            $('#output').text('An error has occurred!');
        }
    };
}

function beginTranslation(event) {
    event.preventDefault();

    // Accessing the id of the button to translate.
    const startSynthesisAsyncButton = document.getElementById("startSynthesisAsyncButton");

    // Getting the text description.
    let synthesisText = document.getElementById("output").textContent;

    // Disable once the button is clicked. 
    startSynthesisAsyncButton.disabled = true;

    // Represents the speaker playback audio destination, which only works in browser.
    const player = new SpeechSDK.SpeakerAudioDestination();

    // You cannot run the text-to-speech translator again until it has completed
    player.onAudioEnd = () => {
        startSynthesisAsyncButton.disabled = false;
    };

    // Authenticating client using the SpeechSDK class to access methods.
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription('02caa1019faf4771ad4a879ae98f44f7', 'eastus');
    const audioConfig  = SpeechSDK.AudioConfig.fromSpeakerOutput(player);

    // Creates an object to synthesize the configurations.
    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

    // This is where the speech happens. The synthesizer is closed after.
    synthesizer.speakTextAsync(synthesisText,
        (result) => { 
            window.console.log(result);
            synthesizer.close();
        },
        (error) => {
            window.console.log(error);
            synthesizer.close();
    });
}