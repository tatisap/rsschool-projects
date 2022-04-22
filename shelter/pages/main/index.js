import { initAdaptiveMenu } from '../../scripts/menu.js';
import { getPets } from '../../scripts/slider.js';
import { showPetInfo } from '../../scripts/popup.js';

initAdaptiveMenu();
getPets();

const buttonLeft = document.querySelector('.button-arrow-left');
const buttonRight = document.querySelector('.button-arrow-right');

buttonLeft.addEventListener('click', getPets);
buttonRight.addEventListener('click', getPets);

let cardsContainer = document.querySelector('.slider-cards');
cardsContainer.addEventListener('click', (event) => {
  if (!event.target.closest('.slider-card')) return; 
  let name = event.target.closest('.slider-card').querySelector('.slider-card-title').textContent;
  showPetInfo(name);
})