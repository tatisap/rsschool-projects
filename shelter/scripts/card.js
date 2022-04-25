export class Card {
    constructor() {
      let container = document.createElement('div')
      container.classList.add('card');
  
      let image = document.createElement('img');
      image.classList.add('card-img');
      container.append(image);
  
      let title = document.createElement('span');
      title.classList.add('card-title');
      container.append(title);
  
      let button = document.createElement('button');
      button.classList.add('button-secondary');
      button.textContent = 'Learn more';
      container.append(button);
  
      this.container = container;
      this.image = image;
      this.title = title;
    }
    addInto(elem) {
      elem.append(this.container);
    }
    fill(src, text) {
      this.image.src = src;
      this.image.alt = text;
      this.title.textContent = text;
    }
  }