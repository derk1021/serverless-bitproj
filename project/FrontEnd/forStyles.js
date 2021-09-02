// "menu" is targeting the dropdown with 3 bars
const menu = document.querySelector('#mobile-menu');
// "menuLinks" is targeting the lists (aka <ul>)
const menuLinks = document.querySelector('.navbar__menu');
// "navLogo" is targeting the logo ont he top left of website
const navLogo = document.querySelector('.navbar__logo');

menu.addEventListener('click', function() {
  // Checks if the "menu.is-active" and "menuLinks.active" classes...
  // are toggled (true or false)
  menu.classList.toggle('is-active');
  menuLinks.classList.toggle('active');
  // If true, then activate the following css
});

//  Close mobile Menu when clicking on a menu item
const hideMobileMenu = () => {
  // While the three bars are clicked...
  const menuBars = document.querySelector('.is-active');
  if (window.innerWidth <= 768 && menuBars) {
    // When the items are clicked, remove the dropdown
    menu.classList.toggle('is-active');
    menuLinks.classList.remove('active');
  }
};

// This goes for the links that are items that are clicked (including the logo) when dropdown is active
menuLinks.addEventListener('click', hideMobileMenu);
navLogo.addEventListener('click', hideMobileMenu);

