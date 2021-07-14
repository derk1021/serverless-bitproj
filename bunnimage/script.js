function getImage(event) {
    /*
    if (document.getElementById('name').value !== '') {
        $('#output').text(document.getElementById('name').value + "❤️");
    }
    */
    event.preventDefault(); // stops the page from refreshing
    if (document.getElementById('name').value !== '') {
        $('#output').text('Thanks!');
    } else {
        alert('No name error.')
    }
}