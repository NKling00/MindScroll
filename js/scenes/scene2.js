import{quickModelLoad} from '/js/utils/threeHelpers.js';
import {createMountainRange,cyberBrain } from '/js/assets/Objects.js';
import {GameObject} from '/js/engine/GameObject.js';
import * as scripts from '/js/assets/objScripts.js';
import * as THREE from 'three';

export class Scene2 {
    constructor(app) {
        this.app = app;
        this.objects = [];
        this.gameObjects = [];
        this.isVisible = false;
        
        this.clock = new THREE.Clock();

        this.init();
        this.hide(); //hide by default  
    }

    init() {
        this.createScene();
        this.setupAnimations();
    }

    createScene() {

        //Moutain Range
        this.mountain = createMountainRange(20,20,20);
        this.app.scene.add(this.mountain);
        this.objects.push(this.mountain);
        gsap.from(this.mountain.position,{y: -15, duration: 25,delay:0, ease: "elastic.out(0.5,0.3)"}); //animate mountain into scene


        // Test Box
        const geometry = new THREE.BoxGeometry(1,1,1);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0xFF0000,
            transparent: true,
            opacity: 0.8
        });
        
        /*
        const loader = new GTFLLoader();
        loader.load('../models/brain1.glb',function(gltf){
            scene.add(gltf.scene);
        });
        const brain  = new THREE.
        */

        this.sphere = new THREE.Mesh(geometry, material);
        this.sphere.position.set(0, 0, 0);
        //this.app.scene.add(this.sphere);
        this.objects.push(this.sphere);

        const includeObj =(model)=>{
            console.log('added model');
            this.objects.push(model);
            this.hide();
        }

        this.cyberBrain = new GameObject(cyberBrain());
        this.cyberBrain.addToScene(this.app.scene);
        this.objects.push(this.cyberBrain.object3D);
        this.gameObjects.push(this.cyberBrain);
        this.cyberBrain.addScript(scripts.RotateScript, {speed: -0.05,axis: 'y'});
       // quickModelLoad('models/brainModel1High.glb',this.app.scene,includeObj);


        // Add particle system
       
    }

    setupAnimations() {
        // Rotation animation
        gsap.to(this.sphere.rotation, {
            x: Math.PI * 2,
            y: Math.PI * 2,
            duration: 10,
            repeat: -1,
            ease: "none"
        });

        // Scroll-triggered animations
        this.app.animationManager.createScrollAnimation({
            target: this.sphere.scale,
            trigger: ".content-section",
            start: "top top",
            end: "bottom top",
            scrub: 3,
            ease: "",
            animation: {
                x: 5,
                y: 5,
                z: 5
            }
        });

        // Particle animation
        
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
        if (!this.isVisible) return;

        const deltaTime = this.clock.getDelta(); //get delta time for update
        for (const obj of this.gameObjects) { //update all gameobjects by sending deltatime
            obj.update(deltaTime); 
        }
    }
}