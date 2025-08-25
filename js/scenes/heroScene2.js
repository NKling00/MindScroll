import { Story } from '/js/engine/story.js';
import {GameObject} from '/js/engine/gameObject.js';
import { cyberBrain } from '/js/assets/Objects';

export class heroScene2 extends Story{
    constructor(app){
        super(app);
        
    }

    createScene(){
        //instance objects here and add to scene using this.addToStory(object)
        //example:
        // this.mountain = createMountainRange(20,20,20);
        // this.addToStory(this.mountain);
        this.object = new GameObject(cyberBrain());
        this.object.setPosition(-2,0,0);
       // this.addToStory(this.object);
        this.newObj = new GameObject();
        this.newObj.loadModel('models/laptop01.glb',()=>{console.log('laptop loaded')});
        this.addToStory(this.newObj);
        
    }

    setupAnimations(){
        // Setup any GSAP animations or ScrollTriggers specific to this scene here
    }
}