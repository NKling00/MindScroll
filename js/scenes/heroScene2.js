import { Story } from '/js/engine/story.js';
import {GameObject} from '/js/engine/gameObject.js';
import * as scripts from '/js/assets/objScripts.js';
import { cyberBrain } from '/js/assets/Objects';
import { add } from 'three/tsl';
import { createInspector } from '/js/utils/inspector';
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';
import * as THREE from 'three';
import * as utils from '/js/utils/utils.js';

import loopingTile from '/js/assets/scripts/loopingTile.js';

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
        
       this.landscape = new GameObject();
       this.landscape.loadModelToStory('models/Landscape2.glb',this,()=>{
            const wireframeMaterial = new THREE.MeshBasicMaterial({
                color:0xEE4B2B,
                wireframe:true,
                side: THREE.FrontSide
            })
            const scale = 2.5;
            this.landscape.setScale(scale,scale,scale);//4
            this.landscape.setPosition(-5,-2,-16);

            //this.landscape.setRotation(Math.PI/7,-.5,0);
            this.landscape.setRotation(Math.PI/7,-Math.PI/7,0);
            
            //this.landscape.disableFogMaterials();
            this.landscape.object3D.children[0].material.dispose();
            this.landscape.object3D.children[0].material = wireframeMaterial;
            console.log('landscape');
            console.log(this.landscape.object3D);
            console.log(this.landscape.object3D.children[0].material);
            this.landscape.addScript(loopingTile,{speed:2.3,story:this,originTile:true,tileSizeX:23.5*scale});
           
            //this.landscape.addScript(scripts.lookAtMouse,{app:this.app,yRotation:{max:this.landscape.object3D.rotation.y+.01,min:this.landscape.object3D.rotation.y-.01,step:.1},xRotation:{max:.1,min:-.1,step:.01}});
        });

       
       this.newObj = new GameObject();
        this.gui = null;
        //this.gui = new GUI();
        
        this.newObj.loadModelToStory('models/laptop01.glb',this,
            ()=>{
                this.newObj.setPosition(2,-1,0);
                this.newObj.setScale(.8,.8,.8);
                //this.newObj.setRotation(0,Math.PI/-12,0);
                // this.gui.add(this.newObj.object3D.rotation,'x',-180,180).onChange((value) => {
                // this.newObj.object3D.rotation.x = THREE.MathUtils.degToRad(value);});
                // this.gui.add(this.newObj.object3D.rotation,'y',-180,180).onChange((value) => {
                // this.newObj.object3D.rotation.y = THREE.MathUtils.degToRad(value);});
                // this.gui.add(this.newObj.object3D.rotation,'z',-180,180).onChange((value) => {
                // this.newObj.object3D.rotation.z = THREE.MathUtils.degToRad(value);});
                
              
                this.newObj.disableFogMaterials();
                
                this.newObj.SetScrollAnimate('animation_0','.hero-section');
                this.newObj.addScript(scripts.HoverScript,{amplitude:.2});
                //this.newObj.playAnimationOnce('animation_0',()=>{console.log('callback!')});
                
            });
      
        this.newObj.addScript(scripts.lookAtMouse,{app:this.app});
        
    }

    setupAnimations(){
        // Setup any GSAP animations or ScrollTriggers specific to this scene here
    }
    update(){
        super.update();
        //rotate toward mouse Pos
        
        // const yRotation ={max:.01,min:-1,step:.04}; // sets range rotation for the object
        // const xRotation ={max:.2,min:-.2,step:.03};

        // const yBaseRot = 0;  //base rotation added to object before adding rotation range from mouse
        // const xBaseRot = .3;

        // this.newObj.object3D.rotation.y = THREE.MathUtils.lerp(this.newObj.object3D.rotation.y,utils.mapMouseValue(utils.clamp(this.app.mouse.x,-.5,.5),yRotation.min,yRotation.max)+yBaseRot,yRotation.step);
        // this.newObj.object3D.rotation.x = THREE.MathUtils.lerp(this.newObj.object3D.rotation.x,utils.mapMouseValue(-utils.clamp(this.app.mouse.y,-.5,.5),xRotation.min,xRotation.max)+xBaseRot,xRotation.step);
        
    
    }
}