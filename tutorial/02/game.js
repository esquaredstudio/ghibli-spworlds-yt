import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

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
    this.camera.position.set(25, 10, 25);

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

    const manager = new THREE.LoadingManager();

    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath(
      'https://cdn.jsdelivr.net/npm/three@0.177.0/examples/jsm/libs/draco/'
    );

    const gltfLoader = new GLTFLoader(manager);
    gltfLoader.setDRACOLoader(this.dracoLoader);

    gltfLoader.load(
      '../../assets/models/ghibli-spworld-tutorial.glb',
      (gltf) => {
        this.scene.add(gltf.scene);
        gltf.scene.position.y = 0;
        gltf.scene.traverse((child) => {
          if (child.isMesh && child.name === 'floor') {
            this.floor = child;
            this.floor.castShadow = false;
            this.floor.receiveShadow = true;
            this.floor.material.roughness = 1;
          }

          if (child.isMesh && child.name.search('invisible') !== -1) {
            child.visible = false;
          }
        });
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );

    this._ShowStats();

    this.outlineEffect = new OutlineEffect(this.renderer);

    this.renderer.setAnimationLoop(this.Update.bind(this));
  }

  OnWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  _ShowStats() {
    this.stats = new Stats();
    this.stats.showPanel(0);
    this.stats.dom.style.position = 'absolute';
    this.stats.dom.style.left = '2px';
    this.stats.dom.style.top = '100%';
    this.stats.dom.style.transform = 'translateY(-102%)';
    document.body.appendChild(this.stats.dom);
  }

  Update() {
    const delta = this.clock.getDelta();
    if (this.controls) this.controls.update();
    this.renderer.render(this.scene, this.camera);
    if (this.outlineEffect) this.outlineEffect.render(this.scene, this.camera);
    if (this.stats) this.stats.update();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
