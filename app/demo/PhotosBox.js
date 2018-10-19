// service
import randomInt from 'awesome-js-funcs/math/randomInt';

export default class PhotosBox {
  constructor() {
    this._config = {
      photoSrc: [],
      width: 0,
      height: 0,
      clipFeather: .2,
      switchTimeOut: 4e3,
      maxClipRadius: 0,
      velocity: 0,
    };
    this.photos = [];
    this.canvas = null;

    this.state = {
      clipRadius: 0,
      picBottom: null,
      picBottomIndex: -1,
      picTop: null,
      picTopIndex: 0,
      clipX: 0,
      clipY: 0,
      ref: 0,
    };
  };

  config({
           canvas,
           photoSrc = [],
           width,
           height,
           clipFeather,
           switchTimeOut,
           velocity,
         }) {
    this.canvas = canvas;

    const canvasClientRect = this.canvas.getBoundingClientRect();

    this._config.photoSrc = photoSrc;
    this._config.width = width || canvasClientRect.width;
    this._config.height = height || canvasClientRect.height;
    if (clipFeather) {
      this._config.clipFeather = clipFeather;
    }
    if (switchTimeOut) {
      this._config.switchTimeOut = switchTimeOut;
    }

    this._config.maxClipRadius = Math.floor(
      Math.sqrt(
        Math.pow(this._config.width, 2) + Math.pow(this._config.height, 2)
      ) / (1 - this._config.clipFeather)
    );

    this._config.velocity = velocity
      ? velocity
      : this._config.maxClipRadius * .002;

    this.canvas.width = this._config.width;
    this.canvas.height = this._config.height;
    this.ctx = this.canvas.getContext('2d');

    this.tempCanvas = document.createElement('canvas');
    this.tempCanvas.width = this._config.width;
    this.tempCanvas.height = this._config.height;
    this.tempCtx = this.tempCanvas.getContext('2d');

    this._photosLoader()
      .then(() => this._draw());

    return this;
  };

  _photosLoader() {
    const _loadImagePromise = (src) => new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve());
      image.addEventListener('error', (e) => reject(e));
      image.src = src;
      this.photos.push(image);
    });

    return Promise.all(
      this._config.photoSrc
        .map((src) => _loadImagePromise(src))
    );
  };

  _draw() {
    const draw = () => {
      if (this.state.clipRadius > this._config.maxClipRadius) {
        this._setDrawConfig();

        setTimeout(() => {
          this.state.ref = window.requestAnimationFrame(draw);
        }, this._config.switchTimeOut);
        return;
      }

      this.state.clipRadius += this._config.velocity;
      this._drawTempCanvas();

      this.ctx.drawImage(this.state.picBottom, 0, 0);
      this.ctx.drawImage(this.tempCanvas, 0, 0);

      this.state.ref = window.requestAnimationFrame(draw);
    };

    this._setDrawConfig();
    this.state.ref = window.requestAnimationFrame(draw);
  };

  _setPhotoIndex(photoIndex) {
    return photoIndex + 1 < this.photos.length
      ? photoIndex + 1
      : 0;
  };

  _setDrawConfig() {
    this.state.clipRadius = 0;
    this.state.clipX = randomInt(0, this._config.width);
    this.state.clipY = randomInt(0, this._config.height);
    this.state.picBottomIndex = this._setPhotoIndex(this.state.picBottomIndex);
    this.state.picTopIndex = this._setPhotoIndex(this.state.picTopIndex);

    this.state.picBottom = this.photos[this.state.picBottomIndex];
    this.state.picTop = this.photos[this.state.picTopIndex];
  };

  _drawTempCanvas() {
    this.tempCtx.save();
    this.tempCtx.clearRect(0, 0, this._config.width, this._config.height);
    this.tempCtx.drawImage(this.state.picTop, 0, 0);

    const radialGradient = this.tempCtx.createRadialGradient(
      this.state.clipX,
      this.state.clipY,
      1,
      this.state.clipX,
      this.state.clipY,
      this.state.clipRadius
    );

    radialGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
    radialGradient.addColorStop(1 - this._config.clipFeather, 'rgba(0, 0, 0, 1)');
    radialGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    this.tempCtx.beginPath();
    this.tempCtx.globalCompositeOperation = 'destination-in';

    this.tempCtx.arc(this.state.clipX, this.state.clipY, this.state.clipRadius, 0, Math.PI * 2, false);
    this.tempCtx.fillStyle = radialGradient;
    this.tempCtx.fill();
    this.tempCtx.restore();
  };
};
