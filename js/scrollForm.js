// scrollForm will be a system to:
// Set up and run the core of threejs,
// set up gsap animations for scroll triggers, 
// create and run updateLoops for each scene,
// target html elements to assign scene/renderer to the element

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'stats.js';

/**
 * ScrollForm is the central system to manage individual THREEJS scenes.It will be able to handle any necessary communications between scenes
 */

export class ScrollForm {
    constructor(targetElements,storyClasses) {

        this.mouse = new THREE.Vector2(); // scenes can access this mouse
        this.clock = new THREE.Clock();
       
        this.targetElements=targetElements;
        this.stories = [];

        //setup methods
        this.setupMouseMove(); // calculate mouse position

        this.initScenes(storyClasses);
    }

    initScenes(storyClasses) {
        //instantiate each scene
        for (var i =0;i<storyClasses.length;i++){
            console.log('for loop element:' + this.targetElements[i]);
            this.stories.push(new storyClasses[i](this,this.targetElements[i]));
        }
        this.laptopPopScene = document.querySelector('#laptopPopTHREE');
       // make this sticky scroll element with gsap
        // gsap.to(this.laptopPopScene,{
        //     scrollTrigger:{
        //         trigger:document.querySelector('#laptopPopContainer'),
        //         start:'top top', //center of element at center of viewport
        //         end:'bottom bottom', // Keep pinned until bottom of container reaches bottom of viewport
        //         pin:true,
        //         markers:true
        //     }
        // })

        ScrollTrigger.create({ //laptop pop working
            trigger:'#laptopPopContainer',
            start:'top top',
            end:'bottom bottom',
            pin:"#laptopPopTHREE",
            scrub:true,
            markers:false
        })

        

        this.chapter1Header = document.querySelector('#chapter1Header');
        this.chapter1Content = document.querySelector('#chapter1Content');
        
        ScrollTrigger.create({ //setup stick for chapter 1
            trigger:'#spacer1',
            start:'top top',
            end:'bottom bottom',
            pin:"#chapter1Container",
            scrub:true,
            markers:false
        });
        ScrollTrigger.create({ // setup stick for Chapter 2
            trigger:'#spacer2',
            start:'top top',
            end:'bottom bottom',
            pin:"#chapter2Container",
            scrub:true,
            markers:false
        })

        // Detect when leftmove1 enters the screen , this is to shift the laptop left and right
        ScrollTrigger.create({
            trigger: '#leftmove1',
            start: 'top top', // When top of element hits top of viewport
            end: 'bottom top', // When bottom of element hits top of viewport
            onEnter: () => {
                console.log('leftmove1 entered from top (scrolling down)');
                // Send signal to laptopPopScene
                if (this.stories[0] && this.stories[0].onLeftMove1Enter) {
                    this.stories[0].onLeftMove1Enter();
                }
            },
            onEnterBack: () => {
                console.log('leftmove1 entered from bottom (scrolling back up)');
                // Send signal when entering from bottom
                if (this.stories[0] && this.stories[0].onLeftMove1EnterBack) {
                    this.stories[0].onLeftMove1EnterBack();
                }
            },
            markers: true
        });

        // this.spacer1 = document.querySelector('#spacer1');
        // gsap.to(this.chapter1Header, {
        //     opacity: 1,
        //     duration: 1.5,
        //     scrollTrigger: {
        //         trigger: "#spacer1",
        //         start: "top top",  // Container top minus 50px hits viewport top
        //         toggleActions: "play none none reverse",
        //         pin:this.chapter1Header,
        //         markers: true
        //     }
        // });
     
        //  gsap.to(this.chapter1Content, {
        //     opacity: 1,
        //     duration: 1.5,
        //     scrollTrigger: {
        //         trigger: "#spacer1",
        //         start: "top top",  
        //         toggleActions: "play none none reverse",
        //         pin:this.chapter1Content,
        //         markers: false
        //     }
        // });

    }


    setupMouseMove() {
         window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
    }
    
    
}