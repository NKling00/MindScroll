import {ScrollController} from '/js/utils/scrollController.js';
import {AnimationManager} from '/js/utils/animationManager.js';
import {HeroScene} from '/js/scenes/scene1.js';
import {Scene2} from '/js/scenes/scene2.js';

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

//import { gsap } from 'gsap';

class ScrollytellingApp {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.scenes = {};
        this.currentScene = null;
        this.scrollController = null;
        this.animationManager = null;
        this.usingComposer = true; // Flag to toggle between composer and renderer
        
        this.init();
    }

    init() {
        this.setupThreeJS();
        this.setupScrollController();
        this.setupAnimationManager();
        this.loadScenes();
        this.setupHTMLElementAnimation()
        this.animate();
    }

    setupHTMLElementAnimation() {
        // Animate the module title       
        ScrollTrigger.create({
        trigger: ".moduleTitle",
        start: " top+=350 top ",
        end: "bottom -20%", // how long to pin (in pixels)
        pin: true,
        pinSpacing: true, // adds space after the pinned element
        markers: true,
        onEnterBack:() =>{
            console.log('on enter title');
            gsap.to(".moduleTitle",{opacity:1,duration:5});},
        onLeave: () => {
            gsap.to(".moduleTitle", { opacity: 0, duration: 2 });
            }

        });
        // Animate the title element
        gsap.from("#titleQ", {
            opacity: 0,
            duration: 4,
            delay: 3,
            ease: "power2.inOut"
        });
    }

    setupThreeJS() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0xECECEB, 1, 10);
        
        this.scene.background = new THREE.Color(0xECECEB);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
        this.renderer.setClearColor(0xECECEB); 
        //fix coloring for composer
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = .6;

        // Post-processing setup
        this.composer = new EffectComposer(this.renderer);
        
        this.composer.addPass(new RenderPass(this.scene, this.camera));

        this.bokehPass = new BokehPass(this.scene, this.camera, {
        focus: 1.7,
        aperture: 0.000669,
        maxblur: 0.009,

        width: window.innerWidth,
        height: window.innerHeight
        });

        this.composer.addPass(this.bokehPass);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xE97451, 1);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        
    // const gui = new GUI();
    // gui.add(this.bokehPass.uniforms.focus, 'value', 0, 100).name('Focus');
    // gui.add(this.bokehPass.uniforms.aperture, 'value', 0.00001, 0.01).name('Aperture');
    // gui.add(this.bokehPass.uniforms.maxblur, 'value', 0.0, 0.1).name('Max Blur');

    //animate aperture racking into focus on start
    gsap.from(this.bokehPass.uniforms.aperture, {value: 0.01,duration: 2,delay: 1});
    gsap.from(".moduleTitle", {opacity: 0, duration: 5, delay: 1,ease:'power2.inOut'});
    }

    setupScrollController() {
        this.scrollController = new ScrollController(this);
    }

    setupAnimationManager() {
        this.animationManager = new AnimationManager(this);
    }

    loadScenes() {
        // Load individual scene modules
        this.scenes.hero = new HeroScene(this);
        this.scenes.threats = new Scene2(this);
        this.scenes.threats.hide();
        //this.scenes.defense = new DefenseScene(this);
        //this.scenes.future = new FutureScene(this);
        
    }

    switchScene(sceneName) {
        if (this.currentScene) {
            this.currentScene.hide();
        }
        
        this.currentScene = this.scenes[sceneName];
        if (this.currentScene) {
            this.currentScene.show();
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.currentScene) {
            this.currentScene.update();
        }
        
        //choose renderer
        if (!this.usingComposer){this.renderer.render(this.scene, this.camera);}
        else {this.composer.render();}
        
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScrollytellingApp();
});