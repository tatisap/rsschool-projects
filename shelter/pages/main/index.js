import { initAdaptiveMenu } from '../../scripts/menu.js';
import { getPets } from '../../scripts/slider.js';

initAdaptiveMenu();
getPets();

const buttonLeft = document.querySelector('.button-arrow-left');
const buttonRight = document.querySelector('.button-arrow-right');

buttonLeft.addEventListener('click', getPets);
buttonRight.addEventListener('click', getPets);
