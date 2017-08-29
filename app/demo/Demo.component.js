import * as THREE from 'three';
import {
  CSS3DObject,
  CSS3DRenderer,
} from '../share/three/CSS3DRenderer';

import {
  DeviceOrientationControls
} from '../share/three/DeviceOrientationControls';

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
        , img = document.createElement('img')
      ;

      img.width = 1026; // 2 pixels extra to close the gap.
      img.src = side.url;

      let
        object = new CSS3DObject(img)
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
};
