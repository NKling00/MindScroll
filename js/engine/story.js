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
        this.clock = new THREE.Clock(); //each story needs its own clock for accurate deltaTime
        this.objects = []; //stores all object3D's in the scene to be referenced later
        this.gameObjects = []; //stores all gameObjects to be called in the update loop
        this.isVisible = true;
        this.debugIndex = -1; //used in my janky debug mode, will eventually remove
        this.deltaTime =0;
        this.helpers={};

        this.sceneLoaded = true; //TO DO: Wait for all objects to load and then report back

        this.mainScene = new THREE.Scene();
        this.renderer = null;
        this.renderTargetElement= targetElement;
        console.log( 'target Element is ' + this.renderTargetElement);
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
        this.setupRenderer(this.renderTargetElement); //basic render > assigns renderer to target HTML element
        this.setupObjects(); //instance objects here and add to scene using this.addToStory(object)
        this.setupAnimations(); //assign GSAP Animations
        this.setupStats(); //set up stats if enabled
        //this.setupHelpers(); //set up helpers
        // Now that everything is set up, start the rendering loop and begin!!
        this.render(); //start rendering loop, Starts the game loop
    }

   
    setupStats(){
        if (!this.enableStats)return;
        this.stats = new Stats();
        this.stats.showPanel(0);//0: fps, 1:ms, 2:mb
        document.body.appendChild(this.stats.dom);
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
        this.renderer.setSize(htmlElement.clientWidth, htmlElement.clientHeight);
        // this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.localClippingEnabled = true; //enable clipping planes for phaseClipping script
        if (htmlElement){
            htmlElement.appendChild(this.renderer.domElement); //add it to the dom
        }
        else{
            console.warn('No target element provided for renderer for story: '+ this.name);
        }
    }

    setupCamera(){
        this.camera = new THREE.PerspectiveCamera(75,this.renderTargetElement.clientWidth / this.renderTargetElement.clientHeight, 0.1,1000);
        this.camera.position.z = 5;
    }
   
    setupHelpers(){
        this.helpers.axesHelper = new THREE.AxesHelper(8); // 5 is the size, X:Red, Y:Green, Z:Blue
        this.addToStory(this.helpers.axesHelper);
        this.helpers.sceneGridHelper = new THREE.GridHelper(10, 10); // size and divisions
        this.helpers.sceneGridHelper.position.set(0,0,-.01);
        this.helpers.sceneGridHelper.rotation.x = Math.PI/2;
        this.addToStory(this.helpers.sceneGridHelper);
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
        this.deltaTime = this.clock.getDelta(); //get delta time for update using this story's own clock
        for (const obj of this.gameObjects) { //update all gameobjects by sending deltatime
            obj.update(this.deltaTime); 
        }
        
    }




    

    onWindowResize() {
        console.log('window resized');
        this.camera.aspect = this.renderTargetElement.clientWidth / this.renderTargetElement.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.renderTargetElement.clientWidth, this.renderTargetElement.clientHeight);
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


    /**
     * @description Converts a color string (CSS color name, hex, rgb, etc.) to a hexadecimal color code
     * @param {string} colorString - Color string (e.g., 'red', '#ff0000', 'rgb(255,0,0)', 'hsl(0,100%,50%)')
     * @returns {number} Hexadecimal color code (e.g., 0xff0000)
     */
    colorStringToHex(colorString) {
        // Create a temporary element to use browser's color parsing
        const tempElement = document.createElement('div');
        tempElement.style.color = colorString;
        document.body.appendChild(tempElement);
        
        // Get computed color (always returns rgb/rgba format)
        const computedColor = window.getComputedStyle(tempElement).color;
        document.body.removeChild(tempElement);
        
        // Parse rgb/rgba format
        const rgbMatch = computedColor.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (rgbMatch) {
            const r = parseInt(rgbMatch[1]);
            const g = parseInt(rgbMatch[2]);
            const b = parseInt(rgbMatch[3]);
            return (r << 16) | (g << 8) | b;
        }
        
        // If parsing fails, return white as default
        console.warn(`Failed to parse color string: ${colorString}`);
        return 0xffffff;
    }

}