function y1k3s() {
    let name1 = document.getElementById("name1").value;
    let name2 = document.getElementById("name2").value;
    let name3 = document.getElementById("name3").value;
    let name4 = document.getElementById("name4").value;
    if (name1 !== "" && name2 !== "" && name3 !== "" && name4 !== "") {
        document.getElementById("image1").src = `data:image/png;base64,https://cataas.com/cat/cute/says/${name1}`;
        document.getElementById("image2").src = `data:image/png;base64,https://cataas.com/cat/cute/says/${name2}`;
        document.getElementById("image3").src = `data:image/png;base64,https://cataas.com/cat/cute/says/${name3}`;
        document.getElementById("image4").src = `data:image/png;base64,https://cataas.com/cat/cute/says/${name4}`;
    }
}