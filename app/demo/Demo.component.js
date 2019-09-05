import Templates from '../share/Templates';
import demo from './demo.pug';
import _style from './demo.scss';

import functionToPromise from 'awesome-js-funcs/typeConversion/functionToPromise';
import areaPolygon from './areaPolygon';

export default class DemoComponent {
  constructor() {
    this.context = document.querySelector('.main-screen');

    this.config = {
      canvasWidth: 750,
      canvasHeight: 1500,
      circleRadius: 200,
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
    this.canvas = new fabric.Canvas(
      this.context.querySelector('.' + _style.canvas),
      {
        enableRetinaScaling: false,
        width: this.config.canvasWidth,
        height: this.config.canvasHeight,
        cssOnly: true,
        backstoreOnly: true,
        selectable: false,
        selection: false,      // 画板显示选中
        skipTargetFind: true,  // 整个画板元素不能被选中,
        isDrawingMode: true,
      }
    );

    // set freeDrawingBrush
    this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
    this.canvas.freeDrawingBrush.width = 10;
    this.canvas.freeDrawingBrush.color = '#ff9999';

    console.log(this.canvas.freeDrawingBrush);

    this.circle = new fabric.Circle({
      radius: this.config.circleRadius,
      left: this.canvas.width >> 1,
      top: this.canvas.height >> 1,
      fill: 'transparent',
      stroke: '#ff9999',
      originX: 'center',
      originY: 'center',
      strokeWidth: 4,
    });
    this.canvas.add(this.circle);

    this.config.circleCenterX = this.circle.left;
    this.config.circleCenterY = this.circle.top;

    console.log(this.config);
  };

  eventBind() {
    // window.addEventListener('resize', () => {
    //   setTimeout(() => {
    //     this.canvas.setWidth(window.innerWidth);
    //     this.canvas.setHeight(window.innerHeight);
    //   }, 500);
    // });

    this.canvas.on({
      'path:created': () => {

        console.log('path:created');
        this.canvas.isDrawingMode = false;

        const customPath = this.canvas.getObjects()[1];

        if (customPath.type !== 'path') {
          return;
        }

        this.drawInCircle(customPath);
        // this.drawFree(customPath);
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

    const polygon = new fabric.Polygon(pathPoints, {
      fill: '#ff9999',
    });
    this.canvas.add(polygon);

    const area = areaPolygon(pathPoints);
    console.log('Area: ', area);
    const scoreUsingArea = this.calcScoreUsingArea(area);
    const scoreUsingPoints = this.calcScoreUsingPoints(pathPoints);
    console.log('ScoreUsingArea: ', scoreUsingArea);
    console.log('ScoreUsingPoints: ', scoreUsingPoints);
    console.log('Score: ', Math.min(scoreUsingArea, scoreUsingPoints));
  };

  drawFree(customPath) {
    customPath.set({
      fill: '#ff9999',
      stroke: 'transparent',
      strokeWidth: 0,
    });

    this.canvas.renderAll();

    const pathPoints = customPath.path.map(point => ({
      x: point[1],
      y: point[2],
    }));

    console.log(pathPoints);

    const area = areaPolygon(pathPoints);
    console.log('Area: ', area);
    const scoreUsingArea = this.calcScoreUsingArea(area);
    const scoreUsingPoints = this.calcScoreUsingPoints(pathPoints);
    console.log('ScoreUsingArea: ', scoreUsingArea);
    console.log('ScoreUsingPoints: ', scoreUsingPoints);
    console.log('Score: ', Math.min(scoreUsingArea, scoreUsingPoints));
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

  calcScoreUsingArea(area) {
    const percentage = 1 - Math.abs(area - this.config.wholeArea) / this.config.wholeArea;
    return (percentage * 100).toFixed(2);
  };

  calcScoreUsingPoints(points) {
    const pointLength = points.length;

    if (!pointLength) {
      return 0;
    }

    const scoreSum = points.reduce((sum, point) => {
      const lengthToCenter = Math.sqrt(
        Math.pow(point.x - this.config.circleCenterX, 2)
        + Math.pow(point.y - this.config.circleCenterY, 2)
      );

      const pointScore = (1 - Math.abs(lengthToCenter - this.config.circleRadius) / this.config.circleRadius) * 100;
      // console.log(point, lengthToCenter, pointScore);
      return sum + pointScore;
    }, 0);

    const score = scoreSum / pointLength;
    console.log(scoreSum, score);

    return score.toFixed(2);
  };
};
