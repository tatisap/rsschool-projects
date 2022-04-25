import { Card } from '../scripts/card.js';

const sliderContainer = document.querySelector('.slider-wrapper');
const slider = document.querySelector('.slider');
const buttonLeft = document.querySelector('.button-arrow-left');
const buttonRight = document.querySelector('.button-arrow-right');

const slideSize = (sliderContainer.offsetWidth === 990) ? 3 : (sliderContainer.offsetWidth === 580) ? 2 : 1;
let currentSlideDraft = [];

export function initSlider() {
  getSlide().then(slide => {
    slide.setLeftPos(`${slider.offsetWidth / 3}px`)
    slide.addBeforeEnd(slider);
  });
    buttonLeft.addEventListener('click', addSlide);
    buttonRight.addEventListener('click', addSlide);
}

async function getSlide(event) {
  const petsRes = await fetch('../../assets/pets.json');
  const petsData = await petsRes.json();

  currentSlideDraft = generateSlideDraft(petsData);
  let slide = new Slide (currentSlideDraft);
  slide.event = event;
  return slide;
}   

function addSlide(event) {
  getSlide(event).then(slide => {
    if (slide.event.target.classList.contains('button-arrow-left')) {
      buttonLeft.removeEventListener('click', addSlide);
      slide.setLeftPos('0px');
      slide.addAfterBeginning(slider);
      let slides = document.querySelectorAll('.slide');
      slides.forEach((slide, index) => {
        slide.style.left = `${parseInt(slide.style.left) + (slider.offsetWidth / 3)}px`;
        if(index === (slides.length -1)) setTimeout(() => {
          slide.remove();
          buttonLeft.addEventListener('click', addSlide);
        }, 300);
      });
    }
    if (slide.event.target.classList.contains('button-arrow-right')) {
      buttonRight.removeEventListener('click', addSlide);
      slide.setLeftPos(`${slider.offsetWidth / 3 * 2}px`);
      slide.addBeforeEnd(slider);
      let slides = document.querySelectorAll('.slide');
      slides.forEach((slide, index) => {
        slide.style.left = `${parseInt(slide.style.left) - (slider.offsetWidth / 3)}px`;
        if(index === 0) setTimeout(() => {
          slide.remove();
          buttonRight.addEventListener('click', addSlide);
        }, 300);
      });
    }
  });
}

function generateSlideDraft(petsData) {
  let draft = new Set();
  while (draft.size != slideSize) {
  let pet = petsData[Math.floor(Math.random() * petsData.length)];
  if (!currentSlideDraft.find(item => item.name === pet.name)) draft.add(pet);
  }
  return Array.from(draft);
}

class Slide {
  constructor(slideDraft) {
    let slide = document.createElement('div');
    slide.classList.add('slide');

    slideDraft.forEach(pet => {
      let card = new Card();
      card.fill(pet.img, pet.name);
      card.addInto(slide);
    });

    this.slide = slide;
  }
  addBeforeEnd(elem) {
    elem.append(this.slide);
  }
  addAfterBeginning(elem) {
    elem.prepend(this.slide);
  }
  setLeftPos(x) {
    this.slide.style.left = x;
  }
}