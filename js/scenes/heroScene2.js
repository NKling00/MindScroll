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
        this.addToStory(this.object);
        
    }

    setupAnimations(){
        // Setup any GSAP animations or ScrollTriggers specific to this scene here
    }
}