import Templates from '../share/Templates';
import * as demo from './demo.pug';
import * as _style from './demo.scss';

export default class DemoComponent {
  constructor() {
    this.context = document.querySelector('.main-screen');      // 上下文
  };

  load() {

    return new Promise(resolve => {
      this.context.classList.add(_style.wrapper);

      new Templates(demo, this.context, {
        _style,
      }).load();

      setTimeout(() => resolve(), 0);
    });
  };
};
