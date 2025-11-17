// scrollForm will be a system to:
// Set up and run the core of threejs,
// set up gsap animations for scroll triggers, 
// create and run updateLoops for each scene,
// target html elements to assign scene/renderer to the element
import {ScrollForm} from '/js/scrollForm.js';
import * as THREE from 'three';


/**
 * ScrollForm is the central system to manage individual THREEJS scenes.It will be able to handle any necessary communications between scenes
 */

export class mindScrollForm extends ScrollForm {
   
    setupScrollTriggers() {
        //instantiate each scene
        
        this.laptopScene = this.stories[1];
    
        ScrollTrigger.create({ //laptop pop working  
            trigger:'#laptopPopContainer',
            start:'top top',
            end:'bottom bottom',
            pin:"#laptopPopTHREE",
            scrub:true,
            markers:false
        })

        //STICKY SETUP

        //Sticky the pinned element for the length of it's parent container
        this.createStickyContainer('#chapter1Container','#spacer1');  //pinned element and then the spacer container
        this.createStickyContainer('#chapter2Container','#spacer2');
        this.createStickyContainer('#chapter3Container','#spacer3');

        // State management for laptop
        this.createLaptopStateMonitors(['#spacer1','#spacer2','#spacer3']);
        
    }

    //Pin Target element within container element for length of container
    //Useful to use a parent container to set a pixel height.
    //then a pinned child inside that container will stay on screen until user has scrolled past the container
    createStickyContainer(targetString,containerString){ 
         ScrollTrigger.create({ //setup stick for chapter 1
            trigger:containerString,
            start:'top top',
            end:'bottom bottom',
            pin:targetString,
            scrub:true,
            markers:false
        });
    }

    createLaptopStateMonitors(idList){ //setup scroll triggers to run the laptop scene
        for (let i = 0; i < idList.length; i++) {
            ScrollTrigger.create({
                trigger:idList[i],
                start:'top bottom', // when top hits bottom of viewport
                end:'bottom top', // when bottom hits top of viewport
                onUpdate:(self)=>{ //executes while within bounds
                    console.log(idList[i]+': ',self.progress);
                    if (self.progress <=.9){ //progress is how far we are through the element
                        this.laptopScene.monitorLaptopState(i); //send the scene what element the user is on
                    }
                    else{
                        
                    }
                },
                markers:false
            })
        }
    }
    
}