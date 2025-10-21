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

export class ScrollForm {
    constructor(targetElements,storyClasses) {

        this.mouse = new THREE.Vector2(); // scenes can access this mouse
        this.clock = new THREE.Clock();
       
        this.targetElements=targetElements;
        this.stories = [];

        //setup methods
        this.setupMouseMove(); // calculate mouse position

        this.initScenes(storyClasses);
    }

    initScenes(storyClasses) {
        //instantiate each scene
        for (var i =0;i<storyClasses.length;i++){
            console.log('for loop element:' + this.targetElements[i]);
            this.stories.push(new storyClasses[i](this,this.targetElements[i]));
        }
    }


    setupMouseMove() {
         window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
    }
    
    
}