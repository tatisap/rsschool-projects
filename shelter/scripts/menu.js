const hamburgerButton = document.querySelector('.hamburger');
const header = document.querySelector('header');
const nav = document.querySelector('.nav');
const navList = document.querySelector('.nav-list');
const blackout = document.createElement('div');
const logo = document.querySelector('.logo');

export function initAdaptiveMenu() {
  header.append(blackout);
  blackout.classList.add('blackout');

  hamburgerButton.addEventListener('click', switchMenu);

  nav.addEventListener('click', closeMenu);
}

function switchMenu() {
  hamburgerButton.classList.toggle('active');
  nav.classList.toggle('active');
  navList.classList.toggle('active');
  blackout.classList.toggle('active');
  logo.classList.toggle('active');
}

function closeMenu(event) {
  if (event.target.classList.contains('nav-link')) {
    hamburgerButton.classList.remove('active');
    nav.classList.remove('active');
    navList.classList.remove('active');  
    blackout.classList.remove('active');
    logo.classList.remove('active');
  }
}