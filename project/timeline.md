# Timeline
> Note: Copy and paste the task template (bottom of page)

## Week 1

### Develop the Image Analyzer (Azure Function):

#### Description
- The Image Analyzer is in charge of taking an image (png/jpeg) as input and returning output describing the image in the form of text. This function utilizes the Computer Vision API to retrieve textual data.

#### ETA:
> How long do you think it will take to complete this?
- 2 hours

#### Objective:
> Checklist of everything you need to do to complete this issue
- [ ] Make a new HTTP Trigger called and install node-fetch and parse-multipart
- [ ] Create a Computer Vision resource 
- [ ] Parse the raw image data
- [ ] Create an asynchronous function that takes the image as input
- [ ] Using that function, make a POST request and return the description attribute of the data

## Week 2

### Image Analyzer Implementation (Testing on UI):

#### Description
- With the Image Analyzer complete, we need to see if it will function on a website because it will be represented on a UI once the project is finished.

#### ETA:
> How long do you think it will take to complete this?
- 1 hour

#### Objective:
> Checklist of everything you need to do to complete this issue
- [ ] Use HTML elements to test overall functionality
- [ ] Create a function that returns the textual output through the click of a button (part of testing)
- [ ] Utilize the FormData object to convert the image to form-data (used as the request body)
- [ ] Make a POST request with the XMLHttpRequest object to call the API and output the description

## Week 3

### Develop and test the Text-to-Speech Translator:

#### Description
- Now that we have our Image Analyzer properly working on the beta UI, we can now turn the text to audio output. To do so, we must use the Speech SDK from Azure's Speech service. Similar to the development of our Image Analyzer, we will test it on the UI.

#### ETA:
> How long do you think it will take to complete this?
- 1 hour

#### Objective:
> Checklist of everything you need to do to complete this issue
- [ ] Use HTML elements to test overall functionality
- [ ] Create a function that returns the audio output through the click of a button (part of testing)
- [ ] Store the textual description by accessing its "textContent"
- [ ] Utilize the Speech SDK package to emit audio output (from the output text)

## Week 4

### Website Development:

#### Description
- With all of the pieces working synchronously, it is time to beautify our website! It may look plain and boring right now, but there is still a lot of work to be done.

#### ETA:
> How long do you think it will take to complete this?
- 2 hours

#### Objective:
> Checklist of everything you need to do to complete this issue
- [ ] For testing purposes, make sure the components function correctly
- [ ] Use CSS to beautify the UI (personal preference)


---

<details><summary>Task Template</summary>
<br>

### [Task Name]:

#### Description
- [Replace with description]

#### ETA:
> How long do you think it will take to complete this?
- [Replace with eta]

#### Objective:
> Checklist of everything you need to do to complete this issue
- [ ] [Replace with small task  1]
- [ ] [Replace with small task  2]
- [ ] [Replace with small task  3]

<br><br>
</details>