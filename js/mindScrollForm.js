// scrollForm will be a system to:
// Set up and run the core of threejs,
// set up gsap animations for scroll triggers, 
// create and run updateLoops for each scene,
// target html elements to assign scene/renderer to the element
import {ScrollForm} from '/js/scrollForm.js';
import * as THREE from 'three';
import lottie from "lottie-web"

/**
 * ScrollForm is the central system to manage individual THREEJS scenes.It will be able to handle any necessary communications between scenes
 */

export class mindScrollForm extends ScrollForm {
   
    setupScrollTriggers() {
        //instantiate each scene
        
        this.laptopScene = this.stories[1];
        
        this.setupButtonFunctions();

        //Title STICKY SETUP
        this.titleSetup(); //this uses old methods, could be cleaned up at some point but fine for now.

        //Laptop STICKY SETUP
        this.createStickyPassthroughContainer('#laptopPopTHREE','#laptopPopContainer'); // container height is set to auto with chapter divs inside so its automatically height of contents

        //Sticky the pinned element for the length of it's parent container
        this.createStickyContainer('#chapter1Container','#spacer1');  //pinned element and then the spacer container
        this.createStickyContainer('#chapter2Container','#spacer2');
        this.createStickyContainer('#chapter3Container','#spacer3');
        this.createStickyContainer('#chapter4Container','#spacer4');

        // State management for laptop
        this.createLaptopStateMonitors(['#spacer1','#spacer2','#spacer3','#spacer4']);
        
    }

    //Pin Target element within container element for length of container
    //Useful to use a parent container to set a pixel height.
    //then a pinned child inside that container will stay on screen until user has scrolled past the container
    createStickyContainer(pinTarget,containerTarget,markersBool=false){ 
         ScrollTrigger.create({ 
            trigger:containerTarget,
            start:'top top',
            end:'bottom bottom',
            pin:pinTarget,
            scrub:true,
            markers:markersBool
        });
    }
    createStickyPassthroughContainer(pinTarget,containerTarget,markersBool=false){ 
         ScrollTrigger.create({ 
            trigger:containerTarget,
            start:'top top',
            end:'bottom bottom',
            pin:pinTarget,
            scrub:true,
            markers:markersBool,
            onToggle(self) {
                //alert('hi');
                // when active (pinned), disable pointer events
                console.log(self);
                    self.spacer.style.pointerEvents = 'none';
                    self.pin.style.pointerEvents = 'none';
                
            }});
    };

    createLaptopStateMonitors(idList){ //setup scroll triggers to run the laptop scene
        for (let i = 0; i < idList.length; i++) {
            ScrollTrigger.create({
                trigger:idList[i],
                start:'top bottom', // when top hits bottom of viewport
                end:'bottom top', // when bottom hits top of viewport
                onUpdate:(self)=>{ //executes while within bounds
                    // console.log(idList[i]+': ',self.progress);
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
    titleSetup(){
        
     const moduleTitle = document.getElementById('moduleTitle');
        const parentContainer = document.getElementsByClassName('hero-section');
        moduleTitle.style.opacity = 0;
        ScrollTrigger.create({
            trigger: moduleTitle,
            start: " top+=150 top ", //when the top +150 hits the top of the element
            endTrigger: parentContainer[0],
            end: "bottom bottom", // ends when bottom of element hit bottom of parent element
            //markers:true,
            pin: true,
            pinSpacing: true, // adds space after the pinned element           
            onEnter: ()=>{
                gsap.to(moduleTitle,{opacity:1,duration:5,delay:1,ease:'power1:inOut'});
            },  
            onUpdate: self => {
                if (self.progress > 0.6) {
                    gsap.to(moduleTitle, {opacity: 0,duration: 1.5,ease: "power1.out"});
                }
                else {
                    gsap.to(moduleTitle, {opacity: 1,duration: 5,ease: "power1.out"});
                }
            }

            // onLeave: () => {
            //     gsap.to(".moduleTitle", { opacity: 0, duration: 2 });
            //     }

        });
        gsap.from('#titleQ',{y:-150,duration: 2,delay:1.5,ease: "power2.Out"});

        const questionMark = document.getElementById('titleQ');
        questionMark.style.opacity = 0;
        ScrollTrigger.create({
            trigger: '#titleQ',
            start: " top top ", //when the top +150 hits the top of the element
            endTrigger: parentContainer[0],
            end: "bottom-=50% bottom ", // ends when bottom of element hit bottom of parent element
            markers:false,
            pin: true,
            pinSpacing: true, // adds space after the pinned element           
             
            onUpdate: self => {
                if (self.progress > 0.6) {
                    gsap.to('#titleQ', {opacity: 0,duration:2,ease: "power1.out"});
                }
                else {
                    gsap.to('#titleQ', {opacity: 1,duration:4,delay:1,ease: "power1.out"});
                }
            }
        });
        
        const lottieBrainAnim = lottie.loadAnimation({
            container: document.getElementById('lottieBrain'),
            renderer:'svg',
            loop:true,
            autoplay:true,
            path:'media/AI_Brain.json'
        })

        const lottieElem = document.getElementById('lottieBrain');
         ScrollTrigger.create({
            trigger: lottieElem,
            start: " top+=150 top ", //when the top +150 hits the top of the element
            endTrigger: parentContainer[0],
            end: "bottom bottom", // ends when bottom of element hit bottom of parent element
            //markers:true,
            pin: true,
            pinSpacing: false, // adds space after the pinned element           
            
            onUpdate: self => {
                if (self.progress > 0.6) {
                    gsap.to(lottieElem, {opacity: 0,duration: 1.5,ease: "power1.out"});
                }
                else {
                    gsap.to(lottieElem, {opacity: 1,duration: 5,ease: "power1.out"});
                }
            }
        });
    
    }
    setupButtonFunctions(){
        const nextImageButton = document.querySelector('#nextImageBtn');
        nextImageButton.addEventListener('click', () => {
            this.laptopScene.nextImageClick();
        });
        
        const audioGenButton = document.querySelector('#audioGenBtn');
        audioGenButton.addEventListener('click', () => {
            this.laptopScene.playAudioClick();
        });
    }
}