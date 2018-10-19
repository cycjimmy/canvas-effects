import Templates from '../share/Templates';
import demo from './demo.pug';
import _style from './demo.scss';

// images
import imgGray from '../../static/images/gray.jpg';
import imgColor from '../../static/images/color.jpg';

// service
import PhotosBox from './PhotosBox';

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
    })
      .then(() => {
        this.init();
      });
  };

  init() {
    new PhotosBox().config({
      canvas: this.context.querySelector('.' + _style.canvas),
      photoSrc: [
        imgGray,
        imgColor,
      ],
    });
  };

};
