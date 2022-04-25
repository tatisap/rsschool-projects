import { initAdaptiveMenu } from '../../scripts/menu.js';
import { getPets } from '../../scripts/pagination.js';
import { setPage } from '../../scripts/pagination.js';
import { showPetInfo } from '../../scripts/popup.js';

const buttons = document.querySelector('.pagination').querySelectorAll('button');

initAdaptiveMenu();
getPets().then(() => {
  buttons.forEach(button => {
    button.addEventListener('click', setPage);
  });
}
);

let cardsContainerWrapper = document.querySelector('.pets-cards-wrapper');
cardsContainerWrapper.addEventListener('click', (event) => {
  if (!event.target.closest('.card')) return; 
  let name = event.target.closest('.card').querySelector('.card-title').textContent;
  showPetInfo(name);
}); 

