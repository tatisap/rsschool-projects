import { onBlackout } from '../scripts/blackout.js';
import { offBlackout } from '../scripts/blackout.js';

const hamburgerButton = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');
const navList = document.querySelector('.nav-list');
const blackout = document.querySelector('.blackout');
const logo = document.querySelector('.logo');

export function initAdaptiveMenu() {
  hamburgerButton.addEventListener('click', switchMenu);

  nav.addEventListener('click', closeMenu);
  blackout.addEventListener('click', closeMenu);

  blackout.style.display = 'none';
}

function switchMenu() {
  hamburgerButton.classList.toggle('active');
  nav.classList.toggle('active');
  navList.classList.toggle('active');
  logo.classList.toggle('active');
  document.body.classList.toggle('no-scroll');

  (blackout.style.display === 'none') ? onBlackout() : offBlackout();
}

function closeMenu(event) {
  if (event.target.classList.contains('nav-link') || event.target.classList.contains('blackout')) {
    hamburgerButton.classList.remove('active');
    nav.classList.remove('active');
    navList.classList.remove('active');
    logo.classList.remove('active');
    document.body.classList.remove('no-scroll');

    offBlackout();
  }
}