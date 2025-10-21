// scrollForm will be a system to:
// Set up and run the core of threejs,
// set up gsap animations for scroll triggers, 
// create and run updateLoops for each scene,
// target html elements to assign scene/renderer to the element

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'stats.js';

class ScrollForm {
    constructor(targetElements,sceneClasses) {

        this.mouse = new THREE.Vector2(); // scenes can access this mouse
        this.raycaster = new THREE.Raycaster();
        this.clock = new THREE.Clock();
       
        this.targetElements=targetElements;
        this.scenes = [];// need to instantiate each scene
        // need to instantiate each story from sceneClasses
        for (var i =0;i<sceneClasses.length;i++){
            this.scenes.push(new sceneClasses[i](this));
        }

        this.init();
    }

    init() {
        for (var i =0;i<this.scenes.length;i++){
            this.setupThreeJS();
        }
    }

    /**\
     * @description Set up the core of threejs for each scene
     * @param {HTMLElement} targetElement - The HTLML element to append the renderer to
     * @returns {Object} - An object containing the scene, camera, and renderer
     */
    setupThreeJS(targetElement){ // we need to do this for each scene
        //create scene
        const thisScene = new THREE.Scene();
        //create camera
        const thisCamera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight, 0.1,1000); 
        thisCamera.position.z = 5;
        thisScene.add(thisCamera);
        //create renderer
        const thisRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        thisRenderer.setSize(window.innerWidth, window.innerHeight);
        thisRenderer.setPixelRatio(window.devicePixelRatio);
        //append renderer to target element
        if (targetElement){
            targetElement.appendChild(thisRenderer.domElement);
        }
        

       const returnObj = {"scene":thisScene,"camera":thisCamera,"renderer":thisRenderer};
       return returnObj;

    }

    //update Loop for each scene
    update(){
        
    }
    
}