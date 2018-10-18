import Templates from '../share/Templates';
import demo from './demo.pug';
import _style from './demo.scss';

export default class DemoComponent {
  constructor() {
    this.context = document.querySelector('.main-screen');
  };

  load() {
    return new Promise(resolve => {
      this.context.classList.add(_style.wrapper);

      new Templates(demo, this.context, {
        _style,
      }).load();

      setTimeout(resolve, 0);
    });
  };
};
