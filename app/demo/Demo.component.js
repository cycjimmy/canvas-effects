import * as THREE from 'three';
import QueryAll from '../share/QueryAll';
import {
  CSS3DObject,
  CSS3DRenderer,
} from '../share/three/CSS3DRenderer';

import {
  DeviceOrientationControls
} from '../share/three/DeviceOrientationControls';

import _style from './demo.scss';

// images
import negx from '../../static/images/negx.jpg';
import negy from '../../static/images/negy.jpg';
import negz from '../../static/images/negz.jpg';
import posx from '../../static/images/posx.jpg';
import posy from '../../static/images/posy.jpg';
import posz from '../../static/images/posz.jpg';

export default class DemoComponent {
  constructor() {
  };

  load() {
    return new Promise(resolve => {
      this.paramInit();
      this.init();
      setTimeout(() => resolve(), 0);
    })
      .then(() => {
        this.eventBind();
      });
  };

  paramInit() {
    this.context = document.querySelector('.main-screen');      // 上下文
    this.contextClientRect = this.context.getBoundingClientRect();
  };

  init() {
    let
      camera = new THREE.PerspectiveCamera(75, this.contextClientRect.width / this.contextClientRect.height, 1, 1000)
      , controls = new DeviceOrientationControls(camera)
      , scene = new THREE.Scene()
      , cube = new THREE.Object3D()
      , renderer = new CSS3DRenderer()
      , sides = [
        {
          url: posx,
          position: [-512, 0, 0],
          rotation: [0, Math.PI / 2, 0]
        },
        {
          url: negx,
          position: [512, 0, 0],
          rotation: [0, -Math.PI / 2, 0]
        },
        {
          url: posy,
          position: [0, 512, 0],
          rotation: [Math.PI / 2, 0, Math.PI]
        },
        {
          url: negy,
          position: [0, -512, 0],
          rotation: [-Math.PI / 2, 0, Math.PI]
        },
        {
          url: posz,
          position: [0, 0, 512],
          rotation: [0, Math.PI, 0]
        },
        {
          url: negz,
          position: [0, 0, -512],
          rotation: [0, 0, 0]
        }
      ]

      // function
      , animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      }
      , onWindowResize = () => {
        this.contextClientRect = this.context.getBoundingClientRect();

        camera.aspect = this.contextClientRect.width / this.contextClientRect.height;
        camera.updateProjectionMatrix();
        renderer.setSize(this.contextClientRect.width, this.contextClientRect.height);
      }
    ;

    scene.add(cube);

    for (let i = 0; i < sides.length; i++) {
      let
        side = sides[i]
        , boxSection = document.createElement('section')
        , boxContent = document.createElement('div')
        , imgBg = document.createElement('img')
      ;

      boxSection.classList.add(_style.boxSection);
      boxContent.classList.add(_style.boxContent);
      boxContent.innerHTML = `
      <div class=${_style.boxContentNum} data-num=${i}>${i}</div>
      `;

      imgBg.width = 1026; // 2 pixels extra to close the gap.
      imgBg.src = side.url;
      imgBg.classList.add(_style.boxBg);
      boxSection.appendChild(imgBg);
      boxSection.appendChild(boxContent);

      let
        object = new CSS3DObject(boxSection)
      ;

      object.position.fromArray(side.position);
      object.rotation.fromArray(side.rotation);
      cube.add(object);
    }

    renderer.setSize(this.contextClientRect.width, this.contextClientRect.height);
    this.context.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);

    animate();
  };

  eventBind() {
    new QueryAll('.' + _style.boxContentNum, this.context).on('click', function () {
      let
        num = this.dataset.num || ''
      ;

      console.log(num);
      alert(num);
    });
  };
};
