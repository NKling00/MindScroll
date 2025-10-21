
import * as THREE from 'three';
import {sphereBrain,createFabric,YellowParticles} from '/js/assets/Objects.js';
import * as scripts from '/js/assets/objScripts.js';
import {GameObject} from '/js/engine/gameObject.js';
import { createInspector } from '/js/utils/inspector.js';


export class Scene1 {
    constructor(app) {
        this.app = app;
        this.objects = [];
        this.gameObjects = [];
        this.isVisible = false;
        
        this.init();
        this.hide(); //hide by default
    }

    init() {
        //this.clock = new THREE.Clock();
        //this.raycaster = new THREE.Raycaster();
        //this.mouse = new THREE.Vector2();
        this.hoverPoint = null;
        // window.addEventListener('mousemove', (event) => {
        //     this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        //     this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        // });
        this.createScene();
        this.setupAnimations();
    }

    setupObjects() {
            
        //Instance BRAIN
        this.brainGameObject = new GameObject(sphereBrain);
            this.brainGameObject.addScript(scripts.RotateScript, {speed: -0.05,axis: 'y'});
            this.brainGameObject.addScript(scripts.HoverScript,{});
            
        this.brainOriginalPos = this.brainGameObject.object3D.geometry.attributes.position.array.slice();

        this.brainGameObject.addToScene(this.app.scene);
        this.objects.push(this.brainGameObject.object3D); //add to objects for scene Control
        this.gameObjects.push(this.brainGameObject); //add to gameObjects for update loop
        gsap.from(this.brainGameObject.object3D.position,{x: 0, y: 0, z: -10, duration: 5.5,delay:3, ease: "elastic.out(0.5,0.3)"}); //animate brain into scene
        //
        
        //Inspector
       // createInspector(this.brainGameObject); //create inspector for this gameObject

        //Fabric
        const{fabricMesh,fabricGeo} = createFabric(); 
        this.originalPositions = fabricGeo.attributes.position.array.slice();
        this.fabricObject = new GameObject(fabricMesh);
        this.fabricObject.addScript(scripts.RotateScript, {speed: .1,axis: 'y'});
        this.addToStory(this.fabricObject);
        



        // Add particle system
        //this.createParticles();
        const gPart = YellowParticles();
        console.log('gPart',gPart);
        this.particles = new GameObject(gPart);
        //this.particles.addScript(scripts.RotateScript, {speed: .1, axis: 'y'});
        this.particles.addScript(scripts.RotateScript, {speed: 0.1,axis: 'y'});
        //createInspector(this.particles); //create inspector for this gameObject
        this.addToStory(this.particles);
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
        
        // Scroll animations for the fabric
        // this.app.animationManager.createScrollAnimation({
        //     target: this.fabricObject.object3D.rotation,
        //     trigger: ".hero-section",
        //     start: "top top",
        //     end: "bottom top",
        //     scrub: 3,
        //     ease: "",
        //     animation: {
        //         x: 0,
        //         y: .9,
        //         z: 0
        //     }

        // });
       
         this.app.animationManager.createScrollAnimation({
            target: this.fabricObject.object3D.scale,
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: 3,
            ease: "",
            animation: {
                x: .2,
                y: .2,
                z: .2
            }
        });
         this.app.animationManager.createScrollAnimation({
            target: this.particles.object3D.scale,
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: 3,
            ease: "",
            animation: {
                x: 2,
                y: 2,
                z: 2
            }
        });
        
       
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

        const deltaTime = this.app.clock.getDelta(); //get delta time for update
        for (const obj of this.gameObjects) { //update all gameobjects by sending deltatime
            obj.update(deltaTime); 
        }

        
        //RayCast
        this.app.raycaster.setFromCamera(this.app.mouse, this.app.camera);
        const intersects = this.app.raycaster.intersectObject(this.fabricObject.object3D);
        const brainIntersects = this.app.raycaster.intersectObject(this.brainGameObject.object3D);
        //ANIMATE FABRIC VERTS
        scripts.fabricWave(this.fabricObject.object3D.geometry,this.originalPositions,intersects);
        //scripts.fabricWave(this.brainGameObject.object3D.geometry,this.brainOriginalPos,brainIntersects, {radius: 2,strength:.2});
        scripts.applyVertexPress(this.brainGameObject.object3D.geometry,this.brainOriginalPos,brainIntersects,.34,18,'wave');
        
    }

   
}