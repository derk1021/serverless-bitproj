const { SpeechSynthesizer } = require('microsoft-cognitiveservices-speech-sdk');
const sdk = require('microsoft-cognitiveservices-speech-sdk');
const fs = require('fs');

// When you want to send the audio to a file
function synthesizeSpeech() {
    // Authenticating client
    const speechConfig = sdk.SpeechConfig.fromSubscription('02caa1019faf4771ad4a879ae98f44f7', 'eastus');
    // Returns the path of the output audio file
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput("testFileOutput.wav");
    // Creates an object to synthesize the configurations
    const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
    // 
    synthesizer.speakTextAsync(        
        "A simple test to write to a file.",
        result => {
        synthesizer.close();
        if (result) {
            // return result as stream
            return fs.createReadStream("testFileOutput.wav");
        }
    },
    error => {
        console.log(error);
        synthesizer.close();
    });
}

synthesizeSpeech();