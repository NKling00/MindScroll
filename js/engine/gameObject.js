import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';

export class GameObject {
    constructor(object3D) {
        this.object3D = object3D || new THREE.Object3D();

        this.scripts =[];
        this.enabled = true;
        this.mixer = null; // For animations
        this.animationActions = {};
        this.animateOnScroll = false;
        //TODO: add in a gui element that can be enabled for basic position,scale,rotation manipulation
    }

    addScript(ScriptClass, params = {}) {
        // Get default parameters from the script class
        const defaults = ScriptClass.parameters || {};
        const finalParams = {};

        // Merge user params with defaults
        for (const key in defaults) {
        finalParams[key] = params[key] ?? defaults[key].default; //either get the user value or check the class declaration for a default
        }

        // Create and store the script instance
        const scriptInstance = new ScriptClass(this, finalParams); //final params passes the user params + defaults combined together
        this.scripts.push(scriptInstance);

        // call lifecycle hook
        if (typeof scriptInstance.start === 'function') {
            scriptInstance.start();
        }

        return scriptInstance;
    }

    update(deltaTime) {
        for (const script of this.scripts) {
            if (typeof script.update === 'function') {
                script.update(deltaTime);
            }
        }
        if (this.mixer && !this.animateOnScroll) {
            //console.log('animating with mixer');
            this.mixer.update(deltaTime);  
        }
        
    }

    addToScene(scene) {
        scene.add(this.object3D);
    }

    setPosition(x, y, z) {
        this.object3D.position.set(x, y, z);
    }

    setRotation(x, y, z) {
        this.object3D.rotation.set(x, y, z);
    }

    setScale(x, y, z) {
        this.object3D.scale.set(x, y, z);
    }


    loadModelToStory(url,story, onLoad) {
        const loader = new GLTFLoader();
        loader.load(url, (gltf) => {
            this.object3D = (gltf.scene);
            const animations = gltf.animations;
            //console.log(`Found animations: ${animations}`);
            //setup animations if they exist
            if (animations.length > 0){
                this.mixer = new THREE.AnimationMixer(this.object3D);
                animations.forEach((clip) => { //store each animation clip as its name in an object to call later
                    const action = this.mixer.clipAction(clip);
                    this.animationActions[clip.name] = action;
                    //console.log(`Loaded animation: ${clip.name}`); 
                });

            }
            story.addToStory(this);
            if (onLoad) onLoad();
        });
    }

    playAnimationOnce(animName,callback=null) {
        console.log('Attempting to play animation Once:', animName);
        if (this.mixer && this.animationActions[animName]) {
            const action = this.animationActions[animName];
            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true; // Keep final frame
            action.play(); //action is actually this.mixer.clip
            this.mixer.addEventListener('finished', (e) => {
                console.log('Animation finished!');
                callback?.();
            }); 
        }
        if (!this.animationActions[animName]) { //no animation found
            console.warn(`Animation ${animName} not found!`);
        }
    }

    playAnimationLoop(animName) {
        console.log('Attempting to play animation:', animName);
        if (this.mixer && this.animationActions[animName]) {
            console.log(`Playing animation: ${animName}`);
            const action = this.animationActions[animName];
            action.setLoop(THREE.LoopRepeat);
            action.clampWhenFinished = false; // Do not clamp, allow looping
            action.play();
            // this.animationActions[animName].reset().play();
        }
        if (!this.animationActions[animName]) {
            console.warn(`Animation ${animName} not found!`);
        }
    }

    disableFogMaterials(){
        //not sure if this will always work depending on how file is packaged
        for(const meshChild of this.object3D.children[0].children ){
                meshChild.material.fog=false;
        }
        
     }
     
     SetScrollAnimate(animName,triggerElem){
        this.animateOnScroll = true; //disable update from firing for animation
        const action=this.animationActions[animName];
        const animationDuration = action.getClip().duration;
        action.play();//play the action
        this.mixer.setTime(0); //set initial time to zero
        gsap.to({ time: 0 }, {
        time: animationDuration,
        ease: "none",
        scrollTrigger: {
            trigger: triggerElem,
            start: "top top",
            end: "bottom center",
            scrub: true,
            markers:false,
            onUpdate: self => {
            this.mixer.setTime(self.progress * animationDuration);
            }
        }
        });
    
     }


}