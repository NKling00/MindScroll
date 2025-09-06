import { Story } from '/js/engine/story.js';
import {GameObject} from '/js/engine/gameObject.js';
import * as scripts from '/js/assets/objScripts.js';
import { cyberBrain } from '/js/assets/Objects';
import { add } from 'three/tsl';
import { createInspector } from '/js/utils/inspector';
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';
import * as THREE from 'three';
import * as utils from '/js/utils/utils.js';
import * as helper from '/js/utils/threeHelpers.js';

import loopingTile from '/js/assets/scripts/loopingTile.js';
import move from '/js/assets/scripts/move.js';

import { fresnelMaterial,glassMaterial } from '/js/assets/materials.js';

export class heroScene2 extends Story{
    constructor(app){
        super(app);
        this.spawnTimer =0;
        this.animateUp;
        this.name = 'scene1';
    }

    createScene(){
       
        this.object = new GameObject(cyberBrain());
        this.object.setPosition(-2,0,0);

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
            this.animatelandscapeY();
        });

        
       
        // this.laptop = new GameObject();
        // this.laptop.loadModelToStory('models/laptop01.glb',this,
        //     ()=>{
        //         this.laptop.setPosition(2,-1,0);
        //         this.laptop.setScale(.8,.8,.8);
        //         this.laptop.disableFogMaterials();
                
        //         this.laptop.SetScrollAnimate('animation_0','.hero-section');
        //         this.laptop.addScript(scripts.HoverScript,{amplitude:.2});
        //         //this.newObj.playAnimationOnce('animation_0',()=>{console.log('callback!')});
                
        //     });
      
        // this.laptop.addScript(scripts.lookAtMouse,{app:this.app});
        
        
        this.bubble =  new GameObject();
        this.bubble.name = 'bubble';
        const bubble3D = new THREE.SphereGeometry(1,30,30);
        //const bubbleMat = fresnelMaterial(0xec39dd);
        const bubbleMat = glassMaterial;
        //const bubbleMat = new THREE.MeshLambertMaterial({color:0xe64118}); //
      
        this.bubble.object3D = new THREE.Mesh(bubble3D,bubbleMat);
        this.bubble.object3D.position.set(100,-4.14,-10);
        this.bubble.object3D.scale.set(1,1,1);
        //this.bubble.addScript(move,{ySpeed:1.5});

        this.addToStory(this.bubble);
        

        // this.led = new GameObject();
        // this.led.object3D = new THREE.PointLight(0xe05024,100,0);
        // this.led.name = 'light';
        // this.addToStory(this.led);
        // this.ledHelper = new THREE.PointLightHelper(this.led.object3D,1);
        // this.app.scene.add(this.ledHelper);
    }

    setupAnimations(){
        // Setup any GSAP animations or ScrollTriggers specific to this scene here

        // this.scrollTween = gsap.to(this.landscape.object3D.position, {
        // y: 100,
        // duration:2,
        // onUpdate: () => console.log(this.landscape.object3D.position.y)
        // });

        console.log('HERE!');
    }

    animatelandscapeY(){
        const tween = gsap.to(this.app.camera.position, {
        y: -20,
        scrollTrigger:{
            trigger:'.hero-section',
            start:'top top',
            end:'bottom 130%',
            scrub:2,
            markers:true,

            onUpdate:()=>{console.log(this.app.camera.position.y)},
            
        }
        });
    }


    update(){
        super.update();

        
        this.spawnTimer += this.deltaTime;
        //console.log(this.spawnTimer);
        if (this.spawnTimer >=  4){
            this.spawnTimer =0;
            this.bubble.object3D.position.x=1000;
            if (this.bubble.var.animateUp)this.bubble.var.animateUp.kill();
            if (this.bubble.var.scale)this.bubble.var.scale.kill();
           
           const targets=[];
            this.gameObjects.forEach((obj)=>{
                targets.push(obj.object3D);
            });
           const nearestVert = helper.raycastToHitVertex(targets,this.app.camera,this.app.mouse); //,this.app.mouse
           if (nearestVert != undefined){
            this.bubble.setPosition(nearestVert.x,nearestVert.y,nearestVert.z);
            this.bubble.object3D.position.copy(nearestVert);
           this.bubble.var.scale =  gsap.from( this.bubble.object3D.scale,{
                x:0,
                y:0,
                z:0,
                duration:5,
                ease:"elastic.out(1,0.3)",
                
            });
            this.bubble.var.animateUp= gsap.to(this.bubble.object3D.position,{
                y:this.bubble.object3D.position.y + 20,
                duration:5,
                //ease:"elastic.out(.001,0.01)",
                ease:"power1.inOut",
               
            });

            
           }
           // console.log(helper.raycastToHitVertex(this.app.scene.children,this.app.camera,this.app.mouse).z);
        }
        

        
    
    }
}