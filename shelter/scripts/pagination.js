import { Card } from '../scripts/card.js';

const wrapper = document.querySelector('.pets-cards-wrapper');
const buttons = document.querySelector('.pagination').querySelectorAll('button');
const buttonCurrent = document.querySelector('button.pagination-current');
let pageSize = (window.innerWidth < 1280 && window.innerWidth >= 768) ? 6 : (window.innerWidth < 768) ? 3 : 8;
console.log(pageSize);
let pets = [];
let pages = [];

export async function getPets() {
  const petsRes = await fetch('../../assets/pets.json');
  const petsData = await petsRes.json();

  for (let i = 0; i < 6; i++) {
    pets.push(...petsData);
  }
  console.log(pets);
  while (pets.length !== 0) {
    if (pets.length <= pageSize) {
      let page = pets.splice(0, pets.length);
      shufflePage(page);
      pages.push(page);
      break;
    }
    let page = pets.splice(0, pageSize);
    shufflePage(page);
    pages.push(page);
  }

  console.log(pages);
  console.log(pets);
  
  initFirstPage();
} 

function shufflePage(page) {
  for (let i = page.length - 1; i > 0; i--) {
    let x = Math.floor(Math.random() * (i + 1));
    [page[i], page[x]] = [page[x], page[i]];
  }
}

function initFirstPage() {
  pages[0].forEach(pet => {
    let card = new Card();
    card.fill(pet.img, pet.name);
    card.addInto(document.querySelector('.pets-cards'));

  });
}

export function setPage(event) {
  buttons.forEach(button => button.removeEventListener('click', setPage));
  let container = document.createElement('div');
  container.classList.add('pets-cards');

  switch (event.target.dataset.button) {
    case 'start': {
      addCards(pages[0], container);
      buttonCurrent.textContent = '1';
    } break;
    case 'left': {
      addCards(pages[+buttonCurrent.textContent - 2], container);
      buttonCurrent.textContent = `${+buttonCurrent.textContent - 1}`;
    } break;
    case 'right': {
      addCards(pages[+buttonCurrent.textContent], container);
      buttonCurrent.textContent = `${+buttonCurrent.textContent + 1}`;
    } break;
    case 'finish': {
      addCards(pages[pages.length - 1], container);
      buttonCurrent.textContent = `${pages.length}`;
    } break;
  }
  wrapper.prepend(container);
  wrapper.lastElementChild.classList.add('opacity0');
  setTimeout(() => {
    wrapper.lastElementChild.remove()
    buttons.forEach(button => button.addEventListener('click', setPage));
  }, 500);


  const buttonStart = document.querySelector('.pagination-start');
  const buttonLeft = document.querySelector('.pagination-left');
  const buttonRight = document.querySelector('.pagination-right');
  const buttonFinish = document.querySelector('.pagination-finish');

  switch (buttonCurrent.textContent) {
    case '1': {
      makeButtonDisabled(buttonStart);
      makeButtonDisabled(buttonLeft);
      makeButtonAvailable(buttonRight);
      makeButtonAvailable(buttonFinish);
    } break;
    case '2': {
      makeButtonAvailable(buttonStart);
      makeButtonAvailable(buttonLeft);
    } break;
    case `${pages.length - 1}`: {
      makeButtonAvailable(buttonRight);
      makeButtonAvailable(buttonFinish);
    } break;
    case `${pages.length}`: {
      makeButtonDisabled(buttonRight);
      makeButtonDisabled(buttonFinish);
      makeButtonAvailable(buttonStart);
      makeButtonAvailable(buttonLeft);
    } break;
  }
}

function addCards(page, container) {
  page.forEach(pet => {
    let card = new Card();
    card.fill(pet.img, pet.name);
    card.addInto(container);
  });
}

function makeButtonDisabled(button) {
  button.setAttribute('disabled', 'disabled');
  button.classList.remove('available');
}

function makeButtonAvailable(button) {
  button.removeAttribute('disabled');
  button.classList.add('available');
}