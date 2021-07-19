function y1k3s() {
    let inputSomething = document.getElementById("inputtext").value;
    if (inputSomething !== "") {
        document.getElementById("image").src = `https://cataas.com/cat/says/${inputSomething}`;
    }
}