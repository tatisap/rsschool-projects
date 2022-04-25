import { initAdaptiveMenu } from '../../scripts/menu.js';
import { getPets, initPage } from '../../scripts/pagination.js';
import { setPage } from '../../scripts/pagination.js';
import { showPetInfo } from '../../scripts/popup.js';

const buttons = document.querySelector('.pagination').querySelectorAll('button');

initAdaptiveMenu();
getPets().then(() => {
  initPage(0);
  buttons.forEach(button => {
    if (!button.classList.contains('active')) button.addEventListener('click', setPage);
  });
}
);

let cardsContainerWrapper = document.querySelector('.pets-cards-wrapper');
cardsContainerWrapper.addEventListener('click', (event) => {
  if (!event.target.closest('.card')) return; 
  let name = event.target.closest('.card').querySelector('.card-title').textContent;
  showPetInfo(name);
}); 

