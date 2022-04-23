export class Blackout {
  constructor() {
    let blackout = document.createElement('div');
    blackout.classList.add('blackout');

    this.blackout = blackout;
  }
  addInto(elem) {
    elem.append(this.blackout);
  }
  remove() {
    this.blackout.remove();
  }
}