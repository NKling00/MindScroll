
import * as THREE from 'three';
import {GameObject} from '/js/engine/gameObject.js';


export class Story {
    constructor(app) {
        this.app = app;
        this.objects = [];
        this.gameObjects = [];
        this.isVisible = false;
        
        this.init();
    }

    init() {       
        this.createScene(); // instance 3d objects
        this.setupAnimations(); //assign GSAP Animations
    }

    createScene() {
        //instance objects here and add to scene using this.addToStory(object)
        
    }

    addToStory(object) { //Use this method to add objects to this story
        if (object instanceof GameObject) {
            console.log('Adding GameObject to scene:', object);
            object.addToScene(this.app.scene);  // Add to scene(uses the method in GameObject)
            this.gameObjects.push(object); // Add to gameObjects for update loop
            this.objects.push(object.object3D); //add to objects for scene Control
            
        }
        else if(object instanceof THREE.Object3D) {
            this.app.scene.add(object); // Add to scene
            this.objects.push(object); //add to objects for scene Control
        }
    }

    

    setupAnimations() {
        // Setup any GSAP animations or ScrollTriggers specific to this scene here
    }

    show() {
        this.isVisible = true;
        this.objects.forEach(obj => {
            obj.visible = true;
        });
    }

    hide() {
        this.isVisible = false;
        this.objects.forEach(obj => {
            obj.visible = false;
        });
    }

 
    update() {
        //update loop. Loop calls gameobject update methods
        //extra animation logic can go here
        if (!this.isVisible) return;

        const deltaTime = this.app.clock.getDelta(); //get delta time for update
        // const deltaTime = this.clock.getDelta(); //get delta time for update
        for (const obj of this.gameObjects) { //update all gameobjects by sending deltatime
            obj.update(deltaTime); 
        }
        
    }

   
}