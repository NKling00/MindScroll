import {ScrollController} from '/js/utils/scrollController.js';
import {AnimationManager} from '/js/utils/animationManager.js';
import {HeroScene} from '/js/scenes/scene1.js';
import {heroScene2} from '/js/scenes/heroScene2.js';
import {Scene2} from '/js/scenes/scene2.js';

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'stats.js';


//import { gsap } from 'gsap';

class ScrollytellingApp {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.currentCamera = null;
        this.storyCameras=[];
        this.renderer = null;
        this.scenes = {};
        this.currentScene = null;
        this.scrollController = null;
        this.animationManager = null;

        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.clock = new THREE.Clock();

        
        this.stat = null;

        //this.enableStats = true;
        this.usingComposer =false; // Flag to toggle between composer and renderer

        this.init();
    }

    init() {
        this.setupStats();
        this.setupMouseMove(); // event listener for mouse move
        this.setupThreeJS();
       
        this.setupScrollController();
        this.setupAnimationManager();
        this.loadStories(); // keep this order / I broke it before by moving things
        this.setupHTMLElementAnimation()
        this.animate();
    }

    setupStats(){
        if (!this.enableStats)return;
        this.stats = new Stats();
        this.stats.showPanel(0);//0: fps, 1:ms, 2:mb
        document.body.appendChild(this.stats.dom);
    }

    setupHTMLElementAnimation() {
        // Animate the module title       
    //     ScrollTrigger.create({
    //     trigger: ".moduleTitle",
    //     start: " top+=150 top ",
    //     end: "bottom -20%", // how long to pin (in pixels)
    //     pin: true,
    //     pinSpacing: true, // adds space after the pinned element
    //    // markers: true,
    //     onEnterBack:() =>{
    //         console.log('on enter title');
    //         gsap.to(".moduleTitle",{opacity:1,duration:5});},
    //     onLeave: () => {
    //         gsap.to(".moduleTitle", { opacity: 0, duration: 2 });
    //         }

    //     });
       


        //brain Video test

        // const video = document.getElementById('scrollVideo');
        //     const duration = video.duration;

        //     ScrollTrigger.create({
        //         trigger: ".videoScrollContainer",
        //         start: "top top",
        //         end: "bottom bottom",
        //         scrub: true,

        //         onUpdate: (self) => {
        //         const scrollProgress = self.progress;
        //         video.currentTime = scrollProgress * duration;
        //         console.log('vid:' + video.currentTime);
        //         }
        //     });
        


    //nodes setup
    
         gsap.to(".nodes-1", {
            y: -1000,
            x:-50,
            scrollTrigger: {
            trigger: ".nodeContainer",
            start: "top-=1200 top",
            end: "bottom top",
            scrub: true
            }
        });
         gsap.to(".nodes0", {
            y: -1000,
            x:0,
            scrollTrigger: {
            trigger: ".nodeContainer",
            start: "top-=800 top",
            end: "bottom  top",
            scrub: true
            }
        });

        gsap.to(".nodes1", {
            y: -1000,
            x:200,
            scrollTrigger: {
            trigger: ".nodeContainer",
            start: "top 80%",
            end: "bottom top",
            scrub: true
            }
        });
         gsap.to(".nodes2", {
            y:-500,
            x: -200,
            scrollTrigger: {
            trigger: ".nodeContainer",
            start: "top 80%",
            end: "bottom top",
            scrub: true
            }
        });
         gsap.to(".nodes3", {
            y:-500,
            x: 50,
            scrollTrigger: {
            trigger: ".nodeContainer",
            start: "top 80%",
            end: "bottom top",
            scrub: true
            }
        });
        gsap.to("#scrollVideo", {
            scale:1.1,
            scrollTrigger: {
            trigger: ".nodeContainer",
            start: "top top",
            end: "bottom top",
            scrub: true
            }
        });

        gsap.to("#scrollVideo",{
            opacity:0,
            scrollTrigger:{
                trigger:".videoScrollContainer",
                start:"bottom 100%",
                end:"bottom top",
                scrub:true,
                //markers:true
            }
        });




    }

    setupThreeJS() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0xECECEB, 2, 40);
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
        //fix coloring for composer //probably dont need this
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
    
    }

    setupScrollController() {
        this.scrollController = new ScrollController(this);
    }

    setupAnimationManager() {
        this.animationManager = new AnimationManager(this);
    }

    loadStories() {
        // Load individual scene modules
        this.scenes.title = new heroScene2(this);
        // this.storyCameras.push(this.scenes.title.camera); //add camera into camera system
        this.storyCameras[0]= this.scenes.title;   
       
        // this.scenes.hero = new HeroScene(this);
        this.scenes.scene1 = new Scene2(this);
        this.storyCameras[1]= this.scenes.title;  
        //this.storyCameras.push(this.scenes.scene1.camera);
            //this.scenes.scene2 = new Scene2(this);
      
        this.currentCamera = this.storyCameras[0];
        console.log('camera:'+ this.currentCamera);
    }

    switchScene(sceneName) {
        if (this.currentScene) {
            this.currentScene.hide();
        }
        
        this.currentScene = this.scenes[sceneName];
        if (this.currentScene) {
            this.currentCamera= this.currentScene.camera;
           // assignCameraToComposer(this.currentCamera);
            this.currentScene.show();
            
        }
    }

    assignCameraToComposer(cam){
        //might need to do a setup every time we switch cameras
    }

    onWindowResize() {
        this.currentCamera.aspect = window.innerWidth / window.innerHeight;
        this.currentCamera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        if(this.enableStats){this.stats.begin();}
        if (this.currentScene) {
            this.currentScene.update();
            this.currentScene.cleanUp();
        }
        
        //choose renderer
        
        if (!this.usingComposer && this.currentCamera.isCamera){this.renderer.render(this.scene, this.currentCamera);}
        else {this.composer.render();}
        if(this.enableStats){this.stats.end();}

    }

    setupMouseMove() {
         window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
    }

}



// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScrollytellingApp();
});