import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
export class GameObject {
    constructor(object3D) {
        this.object3D = object3D || new THREE.Object3D();

        this.scripts =[];
        this.enabled = true;
        this.mixer = null; // For animations
        this.animationActions = {};

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


    loadModel(url, onLoad) {
        const loader = new GLTFLoader();
        loader.load(url, (gltf) => {
            this.object3D = (gltf.scene);
            const animations = gltf.animations;
            console.log(`Found animations: ${animations.length}`);
            console.log(animations);
            //setup animations if they exist
            if (animations.length > 0){
                this.mixer = new THREE.AnimationMixer(this.object3D);
                
                animations.forEach((clip) => { //store each animation clip as its name in an object to call later
                    const action = this.mixer.clipAction(clip);
                    this.animationActions[clip.name] = action;
                    console.log(`Loaded animation: ${clip.name}`); 

                    //TO DO LEFT OFF HERE //animations variable has actually found the animation. still not playing though
                });
                
                // Optionally play a default animation if idle exists
                this.animationActions['animation_0']?.play();

            }
            if (onLoad) onLoad();
        });
    }

    playAnimation(animName) {
        console.log('Attempting to play animation:', animName);
        if (this.mixer && this.animationActions[animName]) {
            console.log(`Playing animation: ${animName}`);
            this.animationActions[animName].reset().play();
        }
        if (!this.animationActions[animName]) {
            console.warn(`Animation ${animName} not found!`);
        }
    }

}