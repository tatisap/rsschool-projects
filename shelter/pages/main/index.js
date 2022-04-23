import { initAdaptiveMenu } from '../../scripts/menu.js';
import { initSlider } from '../../scripts/slider.js';
import { addSlide } from '../../scripts/slider.js';
import { showPetInfo } from '../../scripts/popup.js';

initAdaptiveMenu();
initSlider();


let cardsContainer = document.querySelector('.slider');
cardsContainer.addEventListener('click', (event) => {
  if (!event.target.closest('.slide')) return; 
  let name = event.target.closest('.slide').querySelector('.slide-card-title').textContent;
  showPetInfo(name);
}); 