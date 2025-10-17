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

import * as materials from '/js/assets/materials.js';

export class heroScene2 extends Story{
    constructor(app){
        super(app);
        this.spawnTimer =0;
        this.animateUp;
        this.name = 'scene1';
        
    }

    createScene(){


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

        
        //Balloon Spawner
        // this.balloonSpawner = new GameObject();
        // this.balloonSpawner.var.currSpawnPoint = new THREE.Vector3();
        // this.balloonSpawner.addScript(instanceSpawner,{object:bubblePrefab,story:this,spawnPoint:this.balloonSpawner.var.currSpawnPoint});
        // this.addToStory(this.balloonSpawner);

       
        this.laptop = new GameObject();
        this.laptop.loadModelToStory('models/laptop01.glb',this,
            ()=>{
                this.laptop.setPosition(2,-3.5,1);
                this.laptop.setScale(.8,.8,.8);
                this.laptop.disableFogMaterials();
                
                this.laptop.SetScrollAnimate('animation_0','.hero-section');
                this.laptop.addScript(scripts.HoverScript,{amplitude:.2});
                //this.newObj.playAnimationOnce('animation_0',()=>{console.log('callback!')});
                //this.camera.add(this.laptop.object3D);

                // this.laptop.addScript(phaseClipping,{ speed: .80,direction:'up',loop:true });
                // const clipper = this.laptop.getComponent('phaseClipping');
                // if(clipper){
                //    clipper.startClipping();
                // }

                this.laptop.addScript(wireCopy,{color:0xb7b1b1,scale:1.05});
                // const wireObj = this.laptop.addScript(wireCopy,{color:0xb7b1b1,scale:1.05});
            });
        
        this.laptop.addScript(scripts.lookAtMouse,{app:this.app});
        
    }

    setupAnimations(){
        // Setup any GSAP animations or ScrollTriggers specific to this scene here
         // Animate the module title       
        //gsap.from(".moduleTitle", {opacity: 0, duration: 4, delay: 1,ease:'power2.inOut'});
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

         // Animate the "?""
        //gsap.from("#titleQ", {opacity: 0,duration: 4,delay: 1,ease: "power2.inOut"});

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
            // onLeave: () => {
            //     gsap.to(".moduleTitle", { opacity: 0, duration: 2 });
            //     }
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

        
        this.spawnTimer += this.deltaTime;

        if (this.spawnTimer >=  .2){  //throttle the raycast
            this.spawnTimer =0;
            const targets=[];
            this.gameObjects.forEach((obj)=>{
                targets.push(obj.object3D);
            });
            const nearestVert = helper.raycastToHitVertex(targets,this.camera,new THREE.Vector2(utils.randomRange(-1,1),utils.randomRange(-1,0))); //,this.app.mouse
            if (nearestVert != undefined){ // set the bubbles position to the returned nearest vert

            if (this.balloonSpawner ){
                this.balloonSpawner.var.currSpawnPoint.copy(nearestVert);
            }
            

            /*
            this.bubble.setPosition(nearestVert.x,nearestVert.y,nearestVert.z);
            this.bubble.object3D.position.copy(nearestVert);
           this.bubble.var.scale =  gsap.from( this.bubble.object3D.scale,{
                x:0,
                y:0,
                z:0,
                duration:5,
                ease:"elastic.out(.2,0.3)",
                
            });
            this.bubble.var.animateUp= gsap.to(this.bubble.object3D.position,{
                y:this.bubble.object3D.position.y + 20,
                duration:5,
                //ease:"elastic.out(.001,0.01)",
                ease:"power1.inOut",
               
            });
            this.bubble.var.animateRot= gsap.to(this.bubble.object3D.rotation,{
                y:this.bubble.object3D.rotation.y+10,
                duration:4,
                //ease:"elastic.out(.001,0.01)",
                ease:"power1.in",
               
            });
                */
            
           }
           // console.log(helper.raycastToHitVertex(this.app.scene.children,this.app.camera,this.app.mouse).z);
        }
        

        
    
    }
}