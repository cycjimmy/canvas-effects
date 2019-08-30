import Templates from '../share/Templates';
import demo from './demo.pug';
import _style from './demo.scss';

import functionToPromise from 'awesome-js-funcs/typeConversion/functionToPromise';
import areaPolygon from './areaPolygon';

export default class DemoComponent {
  constructor() {
    this.context = document.querySelector('.main-screen');
  };

  load() {
    return Promise.resolve()
      .then(() => functionToPromise(() => {
        this.context.classList.add(_style.wrapper);
        new Templates(demo, this.context, {
          _style,
        }).load();
      }))
      .then(() => {
        this.paramInit();
        this.eventBind();
      });
  };

  paramInit() {
    this.canvas = new fabric.Canvas(this.context.querySelector('.' + _style.canvas), {
      enableRetinaScaling: false,
      width: window.innerWidth,
      height: window.innerHeight,
      cssOnly: true,
      backstoreOnly: true,
      selectable: false,
      selection: false,      // 画板显示选中
      skipTargetFind: true,  // 整个画板元素不能被选中,
      isDrawingMode: true,
    });

    console.log(this.canvas);
  };

  eventBind() {
    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.canvas.setWidth(window.innerWidth);
        this.canvas.setHeight(window.innerHeight);
      }, 500);
    });

    this.canvas.on({
      'path:created': () => {
        console.log('path:created');
        this.canvas.isDrawingMode = false;

        const customPath = this.canvas.getObjects()[0];
        customPath.set({
          fill: '#ff0000',
          stroke: '#ff0000',
        });

        this.canvas.renderAll();

        console.log(customPath);
        console.log(customPath.calcCoords());

        const pathPoints = customPath.path.map(point => [
          point[1],
          point[2],
        ]);
        console.log(pathPoints);

        const firstPoint = pathPoints[0];
        const lastPoint = pathPoints[pathPoints.length - 1];
        console.log(firstPoint, lastPoint, firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]);
        if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
          pathPoints.push(firstPoint);
        }

        console.log(pathPoints);

        const area = areaPolygon(pathPoints);
        console.log('Area: ', area);
      }
    });
  };
};
