import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { createInspector } from '/js/utils/inspector.js';
import { setToColor } from '/js/utils/threeHelpers.js';

export class GameObject {
    constructor(object3D) {
        this.object3D = object3D || new THREE.Object3D();

        this.scripts =[];
        this.enabled = true;
        this.mixer = null; // For animations
        this.animationActions = {};
        this.animateOnScroll = false;

        this.debugInspector = null;
        this.name = 'name';
        this.var ={}; //use this to store custom variables

        this.cleanUpFlag = false;
        this.updateFunctions =[];
    }


    /**
     * Adds a script to the GameObject
     * @param {ScriptClass} ScriptClass - The script class to add
     * @param {Object} params - The parameters to pass to the script
     * @returns {ScriptInstance} The script instance that was added
     */
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

    getComponent(componentName) {
        // Find component by class name (constructor name) // Uses actual classname listed ,does not need a name attribute
        return this.scripts.find(script => script.constructor.name === componentName);
    }

    update(deltaTime) {
        if (!this.enabled) return; // Skip update if disabled
        
        for (const script of this.scripts) {
            if (typeof script.update === 'function') {
                script.update(deltaTime);
            }
        }
        if (this.mixer && !this.animateOnScroll) {
            //console.log('animating with mixer');
            
            this.mixer.update(deltaTime);  
        }
        if (this.animateOnScroll){
           // this.mixer.setTime(5);
            //console.log('currently playing frame',this.mixer.time);
        }
        //call simple update functions that get added externally
        for (const updateFunction of this.updateFunctions){
            updateFunction(deltaTime);
        }
    }

    /**
     * Hides the object3D and stops update calls
     */
    hide() {
        this.object3D.visible = false;
        this.enabled = false;
    }

    /**
     * Shows the object3D and resumes update calls
     */
    show() {
        this.object3D.visible = true;
        this.enabled = true;
    }
    //used for adding assigned object3D to a THREE.js scene
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

    enableDebugMode(){
        this.debugInspector = createInspector(this);
        setToColor(this.object3D,0xFFC0CB);//set to pink
    }

    disableDebugMode(){
        if (this.debugInspector != null){
            this.debugInspector.destroy();
        }
        setToColor(this.object3D,0x000000);
    }

    /** Model Loading   
     * @param {string} url - The URL of the GLTF model
     * @param {Object3D} parent - The parent object to add the model to
     * @param {function} onLoad - Callback function to execute when the model is loaded
     */
    loadModelToStory(url,parent, onLoad) {
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
            // Check if parent has addToStory method (is a Story instance)
            if (parent.addToStory && typeof parent.addToStory === 'function'){
                parent.addToStory(this);
            }
            // Check if parent is a THREE.Object3D
            else if (parent instanceof THREE.Object3D){ 
                parent.add(this.object3D);
            }
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

    /**
     * Returns an array of all available animation names
     * @returns {string[]} Array of animation names
     */
    getAnimationNames() {
        return Object.keys(this.animationActions);
    }

    /**
     * Gets the current frame number of the mixer's animation
     * @param {string} animName - Name of the animation to check (optional, uses first animation if not provided)
     * @param {number} fps - Frames per second of the animation (default: 30)
     * @returns {number} Current frame number
     */
    getCurrentFrame(animName = null, fps = 30) {
        if (!this.mixer) {
            console.warn('No mixer found on this GameObject');
            return 0;
        }
        
        // Use provided animation name or get the first available one
        const targetAnimName = animName || Object.keys(this.animationActions)[0];
        const action = this.animationActions[targetAnimName];
        
        if (!action) {
            console.warn(`Animation ${targetAnimName} not found`);
            return 0;
        }
        
        const currentTime = this.mixer.time;
        const currentFrame = Math.floor(currentTime * fps);
        
        return currentFrame;
    }

    /**
     * Gets the percentage completion of the currently playing animation
     * @param {string} animName - Name of the animation to check (optional, uses first animation if not provided)
     * @returns {number} Percentage completed (0-100)
     */
    getAnimationProgress(animName = null) {
        if (!this.mixer) {
            console.warn('No mixer found on this GameObject');
            return 0;
        }
        
        // Use provided animation name or get the first available one
        const targetAnimName = animName || Object.keys(this.animationActions)[0];
        const action = this.animationActions[targetAnimName];
        
        if (!action) {
            console.warn(`Animation ${targetAnimName} not found`);
            return 0;
        }
        
        const currentTime = this.mixer.time;
        const duration = action.getClip().duration;
        const progress = (currentTime / duration) ;
        
        // return Math.min(progress, 100); // Clamp to 100%
        return progress; // Clamp to 100%
    }

    disableFogMaterials(){
        //not sure if this will always work depending on how file is packaged
        for(const meshChild of this.object3D.children[0].children ){
                meshChild.material.fog=false;
        }
        
     }
     

     /**
      * @description links a 3dModel animation to the scroll position
      * @param {string} animName 
      * @param {selector String} triggerElem 
      */
     //Set up scroll animation
     SetScrollAnimate(animName='animation_0',triggerElem){
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
            markers:true,
            toggleActions: "play none none none",
            onUpdate: self => {
            console.log('moving');
            const clampedTime = Math.min(self.progress * animationDuration, animationDuration);
            this.mixer.setTime(clampedTime);
            },
            onLeave: () => {
                this.mixer.setTime(animationDuration-.01); // Keep at final frame //some strange bug, where maybe it was rounding but it was going just a little over the last frame and grabbing frame 1 when it looped around
            },
            onEnterBack: () => {
                // Resume scrubbing when scrolling back
            }
        }
        });
    
     }

     /**
      * @description Triggers animation when element enters viewport, completes animation by halfway point
      * @param {string} animName - Name of the animation to play
      * @param {string} triggerElem - CSS selector for the trigger element
      * @param {boolean} markers - Show ScrollTrigger markers for debugging (default: false)
      */
     PlayAnimationOnEnter(animName='animation_0', triggerElem, markers=false,animSpeedMult=1,callback=null){
        this.animateOnScroll = true; //disable update from firing for animation
        const action = this.animationActions[animName];
        if (!action) {
            console.warn(`Animation ${animName} not found!`);
            return;
        }
        
        const animationDuration = action.getClip().duration;
        action.play();
        this.mixer.setTime(0); //set initial time to zero
        
        let callbackFired = false; // Prevent multiple callback calls
        
        gsap.to({ time: 0 }, {
            time: animationDuration,
            ease: "none",
            scrollTrigger: {
                trigger: triggerElem,
                start: "top bottom", // starts when top of element hits bottom of viewport (enters view)
                end: "bottom center", // ends when center of element hits center of viewport (halfway through)
                scrub: true,
                markers: markers,
                toggleActions: "play none none none",
                onUpdate: self => {
                    const progress = self.progress * animationDuration*animSpeedMult;
                    const clampedTime = Math.min(progress, animationDuration);
                    this.mixer.setTime(clampedTime);
                    
                    // Fire callback when animation completes (progress >= 99%)
                    if(callback && !callbackFired && self.progress >= 0.99){
                        callbackFired = true;
                        callback();
                    }
                },
                onLeave: () => {
                    this.mixer.setTime(animationDuration-.01); // Keep at final frame
                },
                onEnterBack: () => {
                    callbackFired = false; // Reset callback flag when scrolling back
                }
            }
        });
     }

    dispose() {
       // console.log('disposing!!!!');
        this.cleanUpFlag = true;
        
    // Remove from parent or scene , this has been tested and works
        if (this.object3D.parent) {
            this.object3D.parent.remove(this.object3D);
        }

        // Traverse and dispose resources
        this.object3D.traverse(obj => {
            //console.log(obj.geometry);
            if (obj.geometry) {
                obj.geometry.dispose();
            }

            if (obj.material) {
                if (Array.isArray(obj.material)) {
                obj.material.forEach(mat => this.disposeMaterial(mat));
                } else {
                this.disposeMaterial(obj.material);
                }
            }
        });
    }

    disposeMaterial(material) {
    // Dispose textures
        for (const key in material) {
            const value = material[key];
            if (value && value.isTexture) {
                value.dispose();
            }
        }
        material.dispose();
    }

    axesHelper(size=10){
        this.object3D.add(new THREE.AxesHelper(size));
    }
}