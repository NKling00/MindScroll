

import * as THREE from 'three';
import { Story } from '/js/engine/story.js';
import {GameObject} from '/js/engine/gameObject.js';
import { createInspector } from '/js/utils/inspector.js';
import * as scripts from '/js/assets/objScripts.js';
import phaseClipping from '/js/assets/scripts/phaseClipping.js';
import wireCopy from '/js/assets/scripts/wireCopy.js';
import syncAnimation from '/js/assets/scripts/syncAnimation.js';
import {rotate} from '/js/assets/scripts/rotate.js';
import {scalePop} from '/js/assets/scripts/scalePop.js';
import {moveTo} from '/js/assets/scripts/moveTo.js';
import {spawnRing} from '/js/assets/scripts/spawnRing.js';
import {scaleTransition} from '/js/assets/scripts/scaleTransition.js';
import {createVideoTexture} from '/js/utils/videoTexture.js';
import {cyberBrain,sphereBrain} from '/js/assets/Objects.js';

//Imports for 3d Assets

//Imports for scripts

export class laptopPopScene extends Story{
    setupObjects(){

        this.videoMaterial = createVideoTexture(document.getElementById('sphereVideo'));
        this.musicNoteSpawned =false;
        this.laptop = new GameObject(); 


        this.laptopLoad = ()=>{

            //find material in this model and assign it the video material
            this.laptop.object3D.traverse((child)=>{
                if (child.isMesh && child.name =='Screen' )child.material = this.videoMaterial;
            });
            
            this.laptop.currentScreenPosition = 0; //used to track left or right screen position, starts on  the right
            this.laptop.movePositions = [{x:1,y:-.5,z:0},{x:-1.2,y:.5,z:0}]; //two sides of the screen
            this.laptop.rotationPositions = [{x:Math.PI/9,y:Math.PI/-4,z:0},{x:Math.PI/9,y:Math.PI/4,z:0}];
            
            this.laptop.setPosition(this.laptop.movePositions[0].x,this.laptop.movePositions[0].y,this.laptop.movePositions[0].z);
            this.laptop.setScale(.8,.8,.8); //initial positioning
            this.laptop.setRotation(this.laptop.rotationPositions[0].x,this.laptop.rotationPositions[0].y,this.laptop.rotationPositions[0].z);//initial rotation
    
            const animNames = this.laptop.getAnimationNames();
            console.log('Available animations:', animNames);
            // Play animation when content section enters view, completes by halfway point
            this.laptop.PlayAnimationOnEnter(animNames[0],'#laptopPopTHREE', false,.6,()=>{ 
                if (!this.musicNoteSpawned){
                   setTimeout(()=> this.spawnMusicNote(),200);
                    this.musicNoteSpawned = true;
                    this.laptop.popScript.pop();
                }
            });
           
          //Add Behavior Scripts
            this.laptop.addScript(scripts.HoverScript,{amplitude:.6});
            //this.laptop.addScript(scripts.lookAtMouse,{app:this.app});
            this.laptop.popScript = this.laptop.addScript(scalePop,{scalePercent:1.2,time:.3});
            this.laptop.moveScript = this.laptop.addScript(moveTo,{targetPosition:{x:-1.2,y:.5,z:0},targetRotation:{x:Math.PI/9,y:Math.PI/4,z:0},duration:2});
            
            this.laptop.moveToPos = (index)=>{
                this.laptop.currentScreenPosition = index;
                this.laptop.moveScript.move({targetPosition:{x:this.laptop.movePositions[index].x,y:this.laptop.movePositions[index].y,z:this.laptop.movePositions[index].z},targetRotation:{x:this.laptop.rotationPositions[index].x,y:this.laptop.rotationPositions[index].y,z:this.laptop.rotationPositions[index].z}});
            };
            
            //go through the laptops materials and increase specular on all materials
            this.laptop.object3D.traverse((child)=>{
                if (child.isMesh){
                    console.log(child.material);
                    child.material.roughness = .6;    
                }
            });
            
            console.log('loaded');
        };
        this.laptop.loadModelToStory('models/laptop01.glb',this,this.laptopLoad);

        let lapLight = new THREE.PointLight(this.colorStringToHex('#fca0ffff'),12);
        lapLight.position.set(2.4,0,4);
        this.mainScene.add(lapLight);

        let lapLight2 = new THREE.PointLight(this.colorStringToHex('#08129bff'),12);
        lapLight2.position.set(-2,0,2);
        this.mainScene.add(lapLight2);
            
        // add helper object to light
        // const helper = new THREE.PointLightHelper(lapLight, 2);
        // this.mainScene.add(helper);
        
        
        //lapLight.position.copy(this.laptop.object3D.position);      
        


        
        
        
        
    }


    spawnCyberBrain(){
        this.cyberBrain = new GameObject(sphereBrain);
        this.addToStory(this.cyberBrain);

        console.log(this.cyberBrain.object3D);
        console.log('here');    
        this.cyberBrain.setPosition(.5,1,.5);
        this.cyberBrain.setScale(.5,.6,-.7); //initial positioning
        this.cyberBrain.setScale(.75,.75,-1); //initial positioning

        
        const wireComponent = this.cyberBrain.addScript(wireCopy,{scale:1.08, story:this,opacity:.2,color:this.colorStringToHex('#fd3939d7')});
        const wireObj =  wireComponent.wireGameObj;
        
         wireObj.addScript(phaseClipping,{speed:.6,direction:'down',loop:true,downPauseTime:1000});
        const clipper2 = wireObj.getComponent('phaseClipping');
        if(clipper2){
            clipper2.startClipping();
        }
       
        this.cyberBrain.popScript=this.cyberBrain.addScript(scalePop,{scalePercent:1.2,time:.3});   
        this.cyberBrain.addScript(rotate,{speed:.5,axis:'y'});
        this.cyberBrain.addScript(scripts.HoverScript,{amplitude:.6});

        this.cyberBrain.popScript.pop();
        
        
    }

    spawnMusicNote(){
         this.spawnCyberBrain();
        
         this.musicNote = new GameObject();
   
        this.noteLoad = ()=>{
            this.musicNote.setScale(.3,.3,.3); //initial positioning
            this.musicNote.setPosition(1,.5,.5);
            // Play animation when content section enters view, completes by halfway point
            //this.musicNote.PlayAnimationOnEnter('animation_0','#laptopPopTHREE', false,.6);
          //Add Behavior Scripts
            this.musicNote.addScript(scripts.HoverScript,{amplitude:.6});
            this.musicNote.addScript(rotate,{speed:1.5,axis:'y'});
            
            console.log('loaded');

             this.musicNote.addScript(phaseClipping,{ speed: .30,direction:'down',loop:false });
                const clipper = this.musicNote.getComponent('phaseClipping');
                if(clipper) setTimeout(()=>{clipper.startClipping();},1000);
                //Create a wire copy, add a phase clip to it
                //to do make a script that creates a wire copy and adds a phase clip to it
                 const wireComponent = this.musicNote.addScript(wireCopy,{scale:1.01, story:this});
                 const wireObj =  wireComponent.wireGameObj;
                 console.log(wireObj);
                 wireObj.addScript(phaseClipping,{speed:.6,direction:'down',loop:true,downPauseTime:1000});
                const clipper2 = wireObj.getComponent('phaseClipping');
                if(clipper2){
                    clipper2.startClipping();
                }
                wireObj.addScript(syncAnimation,{targetGameObject:this.musicNote});

                console.log(this.musicNote.object3D);
                //add pop script
                this.musicNote.popScript = this.musicNote.addScript(scalePop,{scalePercent:1.2,time:.3});
                this.musicNote.popScript.pop();

                //add grenlight and spawn ring
                this.greenlight = new THREE.PointLight(0xAAFF00, 4);
                this.greenlight.position.set(1,.5,.5);
                this.greenlight.lookAt(this.musicNote.object3D.position);
                this.musicNote.object3D.add(this.greenlight);

                //spawn ring
                this.musicNote.addScript(spawnRing,{scale:5.5,scaleY:2,color:this.colorStringToHex('#c8ff5a64'),segments:16});
                this.ring = this.musicNote.getComponent('spawnRing').spawnRing();
               
                
        };
        
        //this.musicNote.loadModelToStory('models/musicNote1a.glb',this,this.noteLoad);

    }

    // Called when leftmove1 div enters the screen
    onLeftMove1Enter() {
        console.log('laptopPopScene received leftmove1 signal');
        
        // Example: Trigger laptop pop animation
        if (this.laptop && this.laptop.popScript) {
            this.laptop.popScript.pop();

            // this.laptop.moveScript.move();
            if (this.laptop.currentScreenPosition == 0){
                this.laptop.moveToPos(1);
                this.musicNote.hide();
            }
        }
        
        // Add any other actions you want to happen when leftmove1 enters
        // For example: start an animation, change camera position, etc.
    }

    // Called when entering leftmove1 from the bottom (scrolling back up)
    onLeftMove1EnterBack() {
        console.log('laptopPopScene: entered leftmove1 from bottom');
        
        // Move laptop back to original position
        if (this.laptop && this.laptop.moveToPos) {
            if (this.laptop.currentScreenPosition == 1){
                this.laptop.moveToPos(0);
                this.musicNote.show();
            }
        }
        
        // Add any other actions you want when scrolling back up
    }
}