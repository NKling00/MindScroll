import * as THREE from 'three';
import {GameObject} from '/js/engine/gameObject.js';
import Stats from 'stats.js';


/**
 * @description Base class for a story scene. 
 * //TODO: Add composer support to switch to
 * //TODO: Wait for all objects to load and then report back
 * This class is self contained and handles its own rendering loop. 
 * The only necessary things to supply is an app that provides a central clock and target Element to assign renderer to
 */

export class Story {
    constructor(app,targetElement) {
        this.app = app; //parent app, 
        this.clock = app.clock; //use the app clock
        this.objects = []; //stores all object3D's in the scene to be referenced later
        this.gameObjects = []; //stores all gameObjects to be called in the update loop
        this.isVisible = true;
        this.debugIndex = -1; //used in my janky debug mode, will eventually remove
        this.deltaTime =0;

        this.sceneLoaded = true; //TO DO: Wait for all objects to load and then report back

        this.mainScene = new THREE.Scene();
        this.renderer = null;
        this.targetElement= targetElement;
        console.log( 'target Element is ' + this.targetElement);
        this.enableStats = false;
        this.stats = null;
        this.name = null;
        
        this.init();
        window.addEventListener('resize', () => this.onWindowResize());
        this.setupDebugKeyboardControls();
    }

    init() {
        //THIS IS THE MAIN ORDER OF SET UP vvvvv
        this.setupCamera(); //set up a basic camera, can be overwritten if you want to use a different camera
        this.setupLighting(); //set up basic lighting
        this.setupRenderer(this.targetElement); //basic render > assigns renderer to target HTML element
        this.setupObjects(); //instance objects here and add to scene using this.addToStory(object)
        this.setupAnimations(); //assign GSAP Animations
        this.setupStats(); //set up stats if enabled

        // Now that everything is set up, start the rendering loop and begin!!
        this.render(); //start rendering loop, Starts the game loop
    }

   
    setupStats(){
        if (!this.enableStats)return;
        this.stats = new Stats();
        this.stats.showPanel(0);//0: fps, 1:ms, 2:mb
        document.body.appendChild(this.stats.dom);
    }

    setupCamera(){ //set up a basic camera, can be overwritten if you want to use a different camera
        this.camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight, 0.1,1000);
        this.camera.position.z = 5;
    }
    setupLighting(){
        //basic lighting, might need to adjust this basic setup later
        //basic threejs lighting setup here:
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.mainScene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        this.mainScene.add(directionalLight);
    }
    setupRenderer(htmlElement){
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        if (htmlElement){
            htmlElement.appendChild(this.renderer.domElement); //add it to the dom
        }
        else{
            console.warn('No target element provided for renderer for story: '+ this.name);
        }
    }

    setupCamera(){
        this.camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight, 0.1,1000);
        this.camera.position.z = 5;
    }
   

    setupObjects(){
        //instance objects here and add to scene using this.addToStory(object)
    }

    render(){
        requestAnimationFrame(()=>this.render()); //create a rendering loop
        if(this.enableStats){this.stats.begin();}//start fps stat tracking
        this.update(); //update game objects
        this.renderer.render(this.mainScene,this.camera); //render the scene
        if(this.enableStats){this.stats.end();} //fps stat tracking
    }

    /**
     * @description This method adds a gameobject to the update loop and will add its 3dObject to the scene.when adding a gameobject that has a 3dObject that is a child of another object that is already added to the scene it will cause a problem!!
     * @param {gameObject or THREE.Object3D} object 
     */
    addToStory(object) { 
        if (object instanceof GameObject) {
           // console.log('Adding GameObject to scene:', object);
            object.addToScene(this.mainScene);  // Add to scene(uses the method in GameObject)
            this.gameObjects.push(object); // Add to gameObjects for update loop
            this.objects.push(object.object3D); //add to objects for scene Control
            
        }
        else if(object instanceof THREE.Object3D) {
            this.mainScene.add(object); // Add to scene
            this.objects.push(object); //add to objects for scene Control
        }
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
    setName(name){
        this.name = name;
    }

 /**    
  * @description Update loop :calls update on all game objects
  * extra animation logic can go here
  */
    update() {
        if (!this.isVisible) return;
        this.deltaTime = this.clock.getDelta(); //get delta time for update
        for (const obj of this.gameObjects) { //update all gameobjects by sending deltatime
            obj.update(this.deltaTime); 
        }
        
    }




    

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

   
    //debug controls
     nextDebugObject(){ // jump to next object in the debug list. Will probably need to adjust this because of the issue of objects being removed off the list with garbage collection
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