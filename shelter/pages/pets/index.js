import { initAdaptiveMenu } from '../../scripts/menu.js';
import { showPetInfo } from '../../scripts/popup.js';

initAdaptiveMenu();

let cardsContainer = document.querySelector('.pets-cards');
cardsContainer.addEventListener('click', (event) => {
  if (!event.target.closest('.pet-card')) return; 
  let name = event.target.closest('.pet-card').querySelector('.pet-card-title').textContent;
  showPetInfo(name);
}); 