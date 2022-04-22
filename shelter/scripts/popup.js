class ModalWindow {
  constructor() {
    let container = document.createElement('div');
    container.classList.add('modal-window');
    this.container = container;

    let image = document.createElement('img');
    image.classList.add('modal-window-img');
    container.append(image);
    
    let info = document.createElement('div');
    info.classList.add('modal-window-info');
    container.append(info);

    let title = document.createElement('h3');
    title.classList.add('modal-window-title');
    info.append(title);

    let subtitle = document.createElement('p');
    subtitle.classList.add('modal-window-subtitle');
    info.append(subtitle);

    let text = document.createElement('p');
    text.classList.add('modal-window-pet-info');
    info.append(text);

    let list = document.createElement('ul');
    list.classList.add('modal-window-info-list');
    info.append(list);
    
    let liClassNames = ['pet-age', 'pet-inoculations', 'pet-diseases', 'pet-parasites'];
    liClassNames.forEach(name => {
      let li = document.createElement('li');
      li.classList.add(name);

      let span = document.createElement('span');
      li.append(span);
      switch (name) {
        case 'pet-age': span.textContent = 'Age: ';
          break;
        case 'pet-inoculations': span.textContent = 'Inoculations: ';
          break;
        case 'pet-diseases': span.textContent = 'Diseases: ';
          break;
        case 'pet-parasites': span.textContent = 'Parasites: ';
          break;
      }

      list.append(li);
    })

    let button = document.createElement('button');
    button.classList.add('modal-window-close-button');
    container.append(button);
    
    button.addEventListener('click', () => {
      this.container.style.display = 'none';
    })

    this.container = container;
    this.image = image;
    this.title = title;
    this.subtitle = subtitle;
    this.text = text;
    this.list = list;
    this.button = button;
  }

  setInfo(data) {
    this.image.src = data.img;
    this.title.textContent = data.name;
    this.subtitle.textContent = `${data.type} - ${data.breed}`;
    this.text.textContent = data.description;
    Array.from(this.list.children).forEach(child => {
      switch (child.classList[0]) {
        case 'pet-age': child.append(data.age);
          break;
        case 'pet-inoculations': child.append(data.inoculations);
          break;
        case 'pet-diseases': child.append(data.diseases);
          break;
        case 'pet-parasites': child.append(data.parasites);
          break;
      }
    });
  }
  addToPage() {
    document.body.append(this.container);
  }
}

export async function showPetInfo(name) {
  const petsRes = await fetch('../../assets/pets.json');
  const petsData = await petsRes.json();

  const pet = new ModalWindow();
  pet.setInfo(petsData.find(pet => pet.name === name));
  pet.addToPage();

} 

