import Templates from '../share/Templates';
import demo from './demo.pug';
import _style from './demo.scss';

import functionToPromise from 'awesome-js-funcs/typeConversion/functionToPromise';
import areaPolygon from './areaPolygon';

export default class DemoComponent {
  constructor() {
    this.context = document.querySelector('.main-screen');

    this.config = {
      circleRadius: 100,
      circleCenterX: 0,
      circleCenterY: 0,
      wholeArea: 0,
    };

    this.config.wholeArea = Math.PI * Math.pow(this.config.circleRadius, 2);
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

    this.circle = new fabric.Circle({
      radius: this.config.circleRadius,
      left: this.canvas.width >> 1,
      top: this.canvas.height >> 1,
      fill: 'transparent',
      stroke: '#ff0000',
      originX: 'center',
      originY: 'center',
    });
    this.canvas.add(this.circle);

    this.config.circleCenterX = this.circle.left;
    this.config.circleCenterY = this.circle.top;

    console.log(this.config);
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

        const customPath = this.canvas.getObjects()[1];

        if (customPath.type !== 'path') {
          return;
        }

        // this.drawInCircle(customPath);
        this.drawFree(customPath);
      },
    });
  };

  drawInCircle(customPath) {
    customPath.set({
      stroke: 'transparent',
    });

    this.canvas.renderAll();

    const pathPoints = customPath.path.map(point => this.clipToCirclePoint({
      x: point[1],
      y: point[2],
    }));

    console.log(pathPoints);

    const polygon = new fabric.Polygon(pathPoints);
    this.canvas.add(polygon);

    const area = areaPolygon(pathPoints);
    console.log('Area: ', area);
    console.log('Score: ', this.calcScore(area));
  };

  drawFree(customPath) {
    customPath.set({
      fill: '#ff0000',
      stroke: '#ff0000',
    });

    this.canvas.renderAll();

    const pathPoints = customPath.path.map(point => ({
      x: point[1],
      y: point[2],
    }));

    console.log(pathPoints);

    const area = areaPolygon(pathPoints);
    console.log('Area: ', area);
    console.log('Score: ', this.calcScore(area));
  };

  clipToCirclePoint({x, y}) {
    if (
      Math.pow(x - this.config.circleCenterX, 2) +
      Math.pow(y - this.config.circleCenterY, 2) <=
      Math.pow(this.config.circleRadius, 2)
    ) {
      return {x, y};
    }

    const
      dx = x - this.config.circleCenterX
      , dy = y - this.config.circleCenterY
      , rad = Math.atan2(dy, dx)
      , newX = this.config.circleCenterX + Math.cos(rad) * this.config.circleRadius
      , newY = this.config.circleCenterY + Math.sin(rad) * this.config.circleRadius
    ;

    console.log({x, y}, {newX, newY});

    return {x: newX, y: newY};
  };

  calcScore(area) {
    const percentage = 1 - Math.abs(area - this.config.wholeArea) / this.config.wholeArea;
    return Math.round(percentage * 100);
  };
};
