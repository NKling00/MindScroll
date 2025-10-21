import { Story } from '/js/engine/story.js';
import {GameObject} from '/js/engine/gameObject.js';
import * as scripts from '/js/assets/objScripts.js';
import { cyberBrain } from '/js/assets/Objects';
import { add } from 'three/tsl';
import { createInspector } from '/js/utils/inspector';
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';
import lottie from "lottie-web"
import * as THREE from 'three';
import * as utils from '/js/utils/utils.js';
import * as helper from '/js/utils/threeHelpers.js';

import loopingTile from '/js/assets/scripts/loopingTile.js';
import move from '/js/assets/scripts/move.js';
import instanceSpawner from '/js/assets/scripts/instanceSpawner.js';
import bubblePrefab from '/js/assets/prefab/bubblePrefab.js';
import phaseClipping from '/js/assets/scripts/phaseClipping.js';
import wireCopy from '/js/assets/scripts/wireCopy.js';
import syncAnimation from '/js/assets/scripts/syncAnimation.js';

import * as materials from '/js/assets/materials.js';

export class titleStory extends Story{
    constructor(app){
        super(app);
        this.spawnTimer =0;
        this.animateUp;
        this.name = 'titleStory';
        
    }

    createScene(){// Create any objects or meshes specific to this scene here
        //animate the camera to scroll
        this.animateCameraY();
       
        //landscape Mesh
        this.landscape = new GameObject();
        this.landscape.loadModelToStory('models/Landscape2.glb',this,()=>{
            const wireframeMaterial = new THREE.MeshBasicMaterial({
                color:0xb7b1b1,
                wireframe:true,
                side: THREE.FrontSide
            })
            const scale = 2.5;
            this.landscape.setScale(scale,scale,scale);//4
            this.landscape.setPosition(-5,-2,-16);
            this.landscape.setRotation(Math.PI/7,-Math.PI/7,0);
            
            this.landscape.object3D.children[0].material.dispose();
            this.landscape.object3D.children[0].material = wireframeMaterial;
            this.landscape.addScript(loopingTile,{speed:2.3,story:this,originTile:true,tileSizeX:23.5*scale});
        });
        
    }

    setupAnimations(){// Setup any GSAP animations or ScrollTriggers specific to this scene here
         // Animate the module title       
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
            markers:true,
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

    animateCameraY(){
        //Animate camera to scroll
        const tween = gsap.to(this.camera.position, {
        y: -5,
        scrollTrigger:{
            trigger:'.hero-section',
            start:'top top',
            end:'bottom bottom',
            scrub:2,
            //markers:true,
            // onUpdate:()=>{console.log(this.camera.position.y)},
            }
        });

        // gsap.to(this.camera.rotation,{
        //     x:.3,
        //     scrollTrigger:{
        //     trigger:'.hero-section',
        //     start:'top top',
        //     end:'bottom bottom',
        //     scrub:2,
        //     }
        // })
    }


    update(){
        super.update();

    
    }
}