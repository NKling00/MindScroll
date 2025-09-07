
import * as THREE from 'three';
import {GameObject} from '/js/engine/gameObject.js';


export class Story {
    constructor(app) {
        this.app = app;
        this.objects = [];
        this.gameObjects = [];
        this.isVisible = false;
        this.debugIndex = -1;
        this.deltaTime =0;
       
        
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        this.name = '';


        this.init();
        this.hide(); //hide all objects by default  
        this.setupDebugKeyboardControls();
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
           // console.log('Adding GameObject to scene:', object);
            object.addToScene(this.app.scene);  // Add to scene(uses the method in GameObject)
            this.gameObjects.push(object); // Add to gameObjects for update loop
            this.objects.push(object.object3D); //add to objects for scene Control
            
        }
        else if(object instanceof THREE.Object3D) {
            this.app.scene.add(object); // Add to scene
            this.objects.push(object); //add to objects for scene Control
        }
    }

    nextDebugObject(){
        if(this.debugIndex!= -1){this.gameObjects[this.debugIndex].disableDebugMode();} //disable last one
        this.debugIndex++;
        console.log('debug index: '+this.debugIndex + ' / '+ this.gameObjects.length);
        if (this.debugIndex > this.objects.length-1) //end of list
        {
            this.debugIndex =-1;
            console.log('reset debug index to -1');
            return
        }
        this.gameObjects[this.debugIndex].enableDebugMode();
    }

    setupAnimations() {
        // Setup any GSAP animations or ScrollTriggers specific to this scene here
    }

    show() {
        console.log('show story ' +this.name);
        this.isVisible = true;
        this.objects.forEach(obj => {
            obj.visible = true;
        });
        
    }

    hide() {
        console.log('hide story' + this.name);
        this.isVisible = false;
        this.objects.forEach(obj => {
            obj.visible = false;
        });
       
    }

 
    update() {
        //update loop. Loop calls gameobject update methods
        //extra animation logic can go here
        if (!this.isVisible) return;
        
        this.deltaTime = this.app.clock.getDelta(); //get delta time for update
        // const deltaTime = this.clock.getDelta(); //get delta time for update
        for (const obj of this.gameObjects) { //update all gameobjects by sending deltatime
            obj.update(this.deltaTime); 
        }
        
    }

   
    //debug controls
    setupDebugKeyboardControls(){ //ctrl + left and right
        window.addEventListener('keydown', (event) => {
            if (this.isVisible){
                if (event.ctrlKey) {
                    switch (event.key) {
                    case 'ArrowUp':
                        console.log('Ctrl + Arrow Up pressed');
                        break;
                    case 'ArrowDown':
                        console.log('Ctrl + Arrow Down pressed');
                        break;
                    case 'ArrowLeft':
                        console.log('Ctrl + Arrow Left pressed');
                        break;
                    case 'ArrowRight':
                        this.nextDebugObject();
                        break;
                    }
                }
            }
        });
    }

    cleanUp(){ //filter out any objects with a cleanup flag
        this.gameObjects = this.gameObjects.filter(obj => !obj.cleanUpFlag);

    }



}