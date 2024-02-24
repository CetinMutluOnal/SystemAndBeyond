document.addEventListener('DOMContentLoaded', function(){

    const allButtons = document.querySelectorAll('.searchBtn');
    const searchBar = document.querySelector('.searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');

    for (var i = 0; i < allButtons.length; i++) {
        allButtons[i].addEventListener('click', function() {
        searchBar.style.visibility = 'visible';
        searchBar.classList.add('open');
        this.setAttribute('aria-expanded', 'true');
        searchInput.focus();
    });
    }

    searchClose.addEventListener('click', function() {
        searchBar.style.visibility = 'hidden';
        searchBar.classList.remove('open');
        this.setAttribute('aria-expanded', 'false');
    });

});

document.body.addEventListener('change', function (event) {
    if (event.target.id === 'fileInput') {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
            const avatarReader = new FileReader();

        avatarReader.onload = function (e) {
            const avatarImage = document.getElementById('avatarImage');
            avatarImage.src = e.target.result;
        };

        avatarReader.readAsDataURL(file);
    }
        } 
    else if (event.target.id === 'coverInput') {
        const fileInput = event.target;
        const file = fileInput.files[0];
        if (file) {
            const coverReader = new FileReader();

        coverReader.onload = function (e) {
            console.log('Image Data URL:', e.target.result);
            const coverImage = document.getElementById('coverImage');
            coverImage.src = e.target.result;
        };

        coverReader.readAsDataURL(file);
        }
    }
});