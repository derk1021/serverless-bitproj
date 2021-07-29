# Technologies

### Azure Services

**Name of Service**
- Service 1: Computer Vision
- The purpose of my first azure service is to perform image analysis in order to 
obtain a piece of text from a given image; that text describes what the image is
about with a certain level of confidence. For that particular text to be chosen,
the service chooses the description (from an array of descriptions) with the highest
confidence.
- Service 2: Text to Speech
- The purpose of my second azure service is to convert the description or given
text of an image an audio output. I wanted to include vocal output because my project
is designed to help blind individuals. As a result, this service works in conjuntion 
to the computer vision service because it translates text to speech. 

### APIs

**Name of API**
- Cognitive Services API: this API allows me to perform anything related to machine
learning (no experience), such as searching for objects in photos to identifying human
age and emotion in the same pictures. Within this API are the computer vision and text
to speech services.

### Packages/Libraries/Databases

**Name of Packages/Library/Database**
- Packages for text-to-speech: fs (performs file system operations, used as a callback API) and microsoft-cognitiveservices-speech-sdk (support usage of builtin json objects for initilializing credentials and audio functionality)
- Packages for computer vision: parse-multipart (we need to parse the raw multipart payload to extract the files or data contained on it) and node-fetch (allows for http requests to be made)

### Front-end Languages

**Name of Language**
- React: main framework for building the website (combines Javascript XML, HTML, and CSS)
- Javascript: written to code the functionality of the services
- HTML: used to develop the small details of the website (buttons, text boxes, etc.)
- CSS: styling purposes for the UI

### Flowchart

![](https://user-images.githubusercontent.com/74162956/127563249-b43cb9cb-14b5-403c-84df-3c9ae9061b61.png)