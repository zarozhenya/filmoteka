import { Loading } from 'notiflix';

export class Loader {
  constructor() {
    Loading.init({
      backgroundColor: 'rgba(0, 0, 0, 0.25)',
      svgColor: '#ff6b01',
    });
  }
  show() {
    Loading.standard();
  }
  hide() {
    Loading.remove();
  }
}
