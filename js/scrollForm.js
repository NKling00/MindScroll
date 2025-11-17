// scrollForm will be a system to:
// Set up and run the core of threejs,
// set up gsap animations for scroll triggers, 
// create and run updateLoops for each scene,
// target html elements to assign scene/renderer to the element

import * as THREE from 'three';

/**
 * ScrollForm is the central system to manage individual THREEJS scenes.It will be able to handle any necessary communications between scenes
 */

export class ScrollForm {
    constructor(targetElements,storyClasses) {

        this.mouse = new THREE.Vector2(); // scenes can access this mouse
        this.clock = new THREE.Clock();
       
        this.targetElements=targetElements;
        this.stories = [];

        //setup methods
        this.setupMouseMove(); // calculate mouse position

        this.initScenes(storyClasses);
        this.setupScrollTriggers();
    }

    initScenes(storyClasses) {
        //instantiate each scene
        for (var i =0;i<storyClasses.length;i++){
            console.log('for loop element:' + this.targetElements[i]);
            this.stories.push(new storyClasses[i](this,this.targetElements[i]));
        }
    
    }
    setupScrollTriggers() {
     // custom gsap scroll triggers in here   
    }

    setupMouseMove() {
         window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
    }
    
    
}