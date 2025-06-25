import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class Game {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);

    window.addEventListener(
      'resize',
      () => {
        this.OnWindowResize();
      },
      false
    );

    const fov = 60;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 1.0;
    const far = 1000.0;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(0, 0, 5);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0);
    this.controls.update();

    this.clock = new THREE.Clock();

    this.scene = new THREE.Scene();

    let light = new THREE.AmbientLight(0xc1c1c1, 0.95);
    this.scene.add(light);

    new THREE.TextureLoader().load(
      '../../assets/textures/clouds_anime_6k.jpg',
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.colorSpace = THREE.SRGBColorSpace;
        this.scene.environment = texture;
        this.scene.background = texture;
      }
    );

    // const geometry = new THREE.BoxGeometry(2, 2, 2);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // this.scene.add(cube);

    this.renderer.setAnimationLoop(this.Update.bind(this));
  }

  OnWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  Update() {
    const delta = this.clock.getDelta();
    if (this.controls) this.controls.update();
    this.renderer.render(this.scene, this.camera);
    if (this.stats) this.stats.update();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
