import { Blackout } from '../scripts/blackout.js';

const hamburgerButton = document.querySelector('.hamburger');
const header = document.querySelector('header .container');
const nav = document.querySelector('.nav');
const blackout = new Blackout();
const logo = document.querySelector('.logo');

export function initAdaptiveMenu() {
  hamburgerButton.addEventListener('click', switchMenu);

  nav.addEventListener('click', closeMenu);
  blackout.blackout.addEventListener('click', closeMenu);
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      hamburgerButton.classList.remove('active');
      nav.classList.remove('active');
      logo.classList.remove('active');
      document.body.classList.remove('no-scroll');
  
      blackout.remove();
    };
  })
}

function switchMenu() {
  hamburgerButton.classList.toggle('active');
  nav.classList.toggle('active');
  logo.classList.toggle('active');
  document.body.classList.toggle('no-scroll');

  (document.querySelector('.blackout')) ? blackout.remove() : blackout.addInto(header);
}

function closeMenu(event) {
  if (event.target.classList.contains('nav-link') || event.target.classList.contains('blackout')) {
    hamburgerButton.classList.remove('active');
    nav.classList.remove('active');
    logo.classList.remove('active');
    document.body.classList.remove('no-scroll');

    blackout.remove();
  }
}