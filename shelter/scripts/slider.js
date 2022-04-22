const cards = Array.from(document.querySelectorAll('.slider-card')).filter(card => card.offsetWidth !== 0);
const buttonLeft = document.querySelector('.button-arrow-left');
const buttonRight = document.querySelector('.button-arrow-right');

const slideSize = cards.length;
let currentSlide = [];


export async function getPets() {
  const petsRes = await fetch('../../assets/pets.json');
  const petsData = await petsRes.json();

  currentSlide = generateSlide(petsData);
  showPets(currentSlide);
}   

function generateSlide(petsData) {
  let slide = new Set();
  while (slide.size != slideSize) {
  let pet = petsData[Math.floor(Math.random() * petsData.length)];
  console.log(pet);
  if (!currentSlide.find(item => item.name === pet.name)) slide.add(pet);
  }
  console.log(slide);
  return Array.from(slide);
}

function showPets(slide) {
  slide.forEach((pet, index) => {
    cards[index].querySelector('.slider-card-img').src = pet.img;
    cards[index].querySelector('.slider-card-img').alt = pet.name;
    cards[index].querySelector('.slider-card-title').textContent = pet.name;
  });
}


