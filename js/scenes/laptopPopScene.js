

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
import {cyclePop} from '/js/assets/scripts/cyclePop.js';
import {createOutlineObject} from '/js/assets/scripts/createOutlineObject.js';
import {centerMesh} from '/js/utils/utils.js';
import {constrain} from '/js/assets/scripts/constrain.js';

//Imports for 3d Assets

//Imports for scripts

export class laptopPopScene extends Story{
    setupObjects(){

        this.videoMaterial = createVideoTexture(document.getElementById('sphereVideo'));
        this.popDisplayStarted = false;
        
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
            //console.log('Available animations:', animNames);
            // Play animation when content section enters view, completes by halfway point
            const popObjects = this.createFloatingObjects(); //generates all objects into 2d array
            this.laptop.cyclePop = this.laptop.addScript(cyclePop,{objects:popObjects,time:4});
            
            this.laptop.PlayAnimationOnEnter(animNames[0],'#laptopPopTHREE', false,.6,()=>{  //function callback on completion
              
                if (!this.popDisplayStarted){
                this.laptop.cyclePop.startCycle();
                this.popDisplayNotStarted = true;
                }
            });
            //add update function to handle revealing and hiding display objects
            this.laptop.updateFunctions.push(()=>{
                const prog = this.laptop.getAnimationProgress(animNames[0])
                if( prog >= .48){
                    // console.log('more than half way',this.laptop.getAnimationProgress(animNames[0]))
                    if (!this.popDisplayStarted){
                        this.laptop.cyclePop.startCycle();
                        this.popDisplayStarted = true;
                    }
                    
                }
                else if (prog < .47){
                    if (this.popDisplayStarted){
                        this.laptop.cyclePop.stopCycle();
                        this.popDisplayStarted = false;
                    }
                }
            });

          //Add Behavior Scripts
            this.laptop.addScript(scripts.HoverScript,{amplitude:.3});
           // this.laptop.addScript(scripts.lookAtMouse,{app:this.app});
            this.laptop.popScript = this.laptop.addScript(scalePop,{scalePercent:1.2,time:.3});
            this.laptop.moveScript = this.laptop.addScript(moveTo,{targetPosition:{x:-1.2,y:.5,z:0},targetRotation:{x:Math.PI/9,y:Math.PI/4,z:0},duration:1.5});
            
            this.laptop.moveToPos = (index,onComplete=undefined)=>{
                this.laptop.currentScreenPosition = index;
                this.laptop.moveScript.move({targetPosition:{x:this.laptop.movePositions[index].x,y:this.laptop.movePositions[index].y,z:this.laptop.movePositions[index].z},targetRotation:{x:this.laptop.rotationPositions[index].x,y:this.laptop.rotationPositions[index].y,z:this.laptop.rotationPositions[index].z},onComplete:onComplete});
            };
            
            //go through the laptops materials and increase specular on all materials
            this.laptop.object3D.traverse((child)=>{
                if (child.isMesh){
                    // console.log(child.material);
                    child.material.roughness = .6;    
                }
            });
            
            // console.log('loaded');
        };
        this.laptop.loadModelToStory('models/laptop01.glb',this,this.laptopLoad);

        let lapLight = new THREE.PointLight(this.colorStringToHex('#fca0ffff'),12);
        lapLight.position.set(2.4,0,4);
        this.mainScene.add(lapLight);

        let lapLight2 = new THREE.PointLight(this.colorStringToHex('#08129bff'),12);
        lapLight2.position.set(-2,0,2);
        this.mainScene.add(lapLight2);
        
    }

    createFloatingObjects(){
        //pass in reference to laptop to get its child spawn position
        const musicNoteDetails = {
        scale:[.3,.3,.3],
        position:[0,1.8,.5],
        // rotation:[0,0,0],
        wireScale:1.02,
        wireOpacity:.9,
        outlineThickness:1.02,
        wireColor:'#2569fcd7',
        lightColor:'#15efffd7',
        rotateSpeed:1.5,
        ring:true
        }
        const brain2Details = {
        scale:[.3,.3,.3],
        position:[0,1.8,.5],
        // rotation:[0,0,0],
        wireScale:1.05,
        wireOpacity:.4,
        outlineThickness:3.3,
        wireColor:'#ff86d7d7',
        lightColor:'#a87bfdff',
        rotateSpeed:.5,
        ring:false
        }
        const musicNote1 = this.spawnFloatingObject('models/musicNote1a.glb',musicNoteDetails);
        const musicNote2 = this.spawnFloatingObject('models/musicNote2a.glb',musicNoteDetails);
        // const musicNote3 = this.spawnFloatingObject('models/musicNote2a.glb',musicNoteDetails);
        
        // const photo1 = this.createFloatingPhoto('textures/fireflyDog.png',musicNoteDetails);
        // const photo2 = this.createFloatingPhoto('textures/fireflyDog.png',musicNoteDetails);
        // const photo3 = this.createFloatingPhoto('textures/fireflyDog.png',musicNoteDetails);

        const brain1 = this.spawnFloatingObject('models/brainModel1High.glb',musicNoteDetails);
        const brain2 = this.spawnFloatingObject(sphereBrain,brain2Details);

        const floatingObjectsList =[[brain2],[musicNote1,musicNote2],[brain1],[musicNote1,musicNote2]];
        //const floatingObjectsList =[[musicNote1,musicNote2,musicNote3], [photo1,photo2,photo3]];
        return floatingObjectsList; //returns list of hidden floating objects for the laptop to cycle through
    
    }
    //generate floating photos
    createFloatingPhoto(texture,details){
        const thisTexture = new THREE.TextureLoader().load(texture);
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(1,1), new THREE.MeshBasicMaterial({map:thisTexture}));
        const planeObj = new GameObject(plane);
        planeObj.setScale(details.scale[0],details.scale[1],details.scale[2]); //initial positioning
        planeObj.setPosition(details.position[0],details.position[1],details.position[2]);
        if (details.rotation != undefined){
            planeObj.setRotation(details.rotation[0],details.rotation[1],details.rotation[2]);
        }
        planeObj.addScript(scripts.HoverScript,{amplitude:.6});
        planeObj.addScript(rotate,{speed:1.5,axis:'y'});
        const wireComponent = planeObj.addScript(wireCopy,{scale:details.wireScale, story:this,opacity:.2,color:this.colorStringToHex(details.wireColor)});
        const wireObj =  wireComponent.wireGameObj;
        wireObj.addScript(phaseClipping,{speed:.6,direction:'down',loop:true,downPauseTime:1000});
        const wireClipping = wireObj.getComponent('phaseClipping');
        if(wireClipping){
            wireClipping.startClipping();
        }
        planeObj.popScript = planeObj.addScript(scalePop,{scalePercent:1.2,time:.3});
        planeObj.showPop = ()=>{ //show and pop
            planeObj.show();
            planeObj.popScript.pop();
        };
        planeObj.hidePop = ()=>{
            planeObj.popScript.hide();
        };
        const light = new THREE.PointLight(this.colorStringToHex(details.lightColor), 4);
        light.position.set(1,.5,.5);
        light.lookAt(planeObj.object3D.position);
        planeObj.object3D.add(light);
        planeObj.hide();
        return planeObj;
    }
    
    //spawn a floating object
    spawnFloatingObject(model,details){
        const flObj = new GameObject();
        //add popscript and its instance property functions initially
          const popScript = flObj.addScript(scalePop,{scalePercent:1.2,time:.3});
            flObj.showPop = ()=>{ //show and pop
                // console.log('showing pop');
                flObj.show();
                popScript.pop();
            };
            flObj.hidePop = ()=>{
                // console.log('hiding pop');
                flObj.hide();
            };
        const flObjLoad = ()=>{
            //flObj.setScale(details.scale[0],details.scale[1],details.scale[2]); //initial positioning
            //set scaling
            flObj.object3D.traverse((child)=>{
                if(child.isMesh){
                    // centerMesh(child);
                    child.geometry.center();
                    child.scale.multiplyScalar(details.scale[0]);
                }
            });
            if(flObj.object3D.isMesh){
                flObj.object3D.scale.multiplyScalar(details.scale[0]);
            }


             flObj.object3D.position.copy(this.laptop.object3D.position);
             flObj.object3D.position.add(new THREE.Vector3(details.position[0],details.position[1],details.position[2]));
            const constrainScript=flObj.addScript(constrain,{targetGameObject:this.laptop,constrainPosition:true,constrainRotation:false,constrainScale:false})
            constrainScript.constrain();
            // flObj.setPosition(details.position[0],details.position[1],details.position[2]);
            if (details.rotation != undefined){
                flObj.setRotation(details.rotation[0],details.rotation[1],details.rotation[2]);
            }
            // flObj.addScript(scripts.HoverScript,{amplitude:.6});
            flObj.addScript(rotate,{speed:details.rotateSpeed,axis:'y'});
           // flObj.setRotation(Math.PI/9,Math.PI/4,Math.PI/9);
            // const clipper = flObj.addScript(phaseClipping,{speed:.30,direction:'down',loop:false});
            // clipper.startClipping();
            const wireComponent = flObj.addScript(wireCopy,{scale:details.wireScale, story:this,opacity:details.wireOpacity,color:this.colorStringToHex(details.wireColor)});
            const wireObj =  wireComponent.wireGameObj;
            wireObj.addScript(phaseClipping,{speed:.6,direction:'down',loop:true,downPauseTime:1000});
            const wireClipping = wireObj.getComponent('phaseClipping');
            if(wireClipping){
                wireClipping.startClipping();
            }
            //wireObj.addScript(syncAnimation,{targetGameObject:flObj});
          
            const light = new THREE.PointLight(this.colorStringToHex(details.lightColor), 4);
            light.position.set(1,.5,.5);
            light.lookAt(flObj.object3D.position);
            flObj.object3D.add(light);
            flObj.hide();

            
            
            // Create outline after model is loaded
            const outline = flObj.addScript(createOutlineObject,{color:this.colorStringToHex('#ff26c9ff'),thickness:details.outlineThickness,opacity:.5});
            outline.createOutline();

            if (details.ring){
             flObj.addScript(spawnRing,{scale:1.0,scaleY:1.3,color:this.colorStringToHex('#5aa7ff64'),segments:16});
                const ring = flObj.getComponent('spawnRing').spawnRing();
            }
            // flObj.addAxesHelper(20);
        }

        // const floatContainer = new GameObject(new THREE.Object3D());
        // this.laptop.object3D.add(floatContainer.object3D);
        
        //check if model is a string
        if (typeof model === 'string'){
            
            flObj.loadModelToStory(model,this,flObjLoad);
            // console.log(flObj);
        }
        else if (model instanceof THREE.Object3D){
            // console.log('---------------THREE OBJECT');
            // flObj.object3D.add(model); // Add as child instead of replacing
            flObj.object3D = model;
            this.addToStory(flObj); // Add to scene and update loop     
            flObjLoad();
            console.log(flObj);
        }
        return flObj;
    }

    //Handle laptop changing states from mindScrollForm
    monitorLaptopState(viewState){ //state: 0 left, 1 right
        // console.log('CHANGE STATE');
        //TODO: Issue- if gsap is moving it to a new position and then it gets called to move again, im not sure if it will overwrite or ignore. Could be the cause of the issue. Will need to cancel current movement call.
        //  console.log('viewState = ',viewState, 'currentScreenPosition = ',this.laptop.currentScreenPosition);
        if (viewState == 0){
            if (this.laptop.currentScreenPosition != 0){
                // console.log('changing to pos 0');
                this.laptop.moveToPos(0);
                this.laptop.cyclePop.goToList(0);
            }
        }
        else if (viewState == 1){
            if (this.laptop.currentScreenPosition != 1){
                // console.log('changing to pos 1');
                this.laptop.moveToPos(1);
                this.laptop.cyclePop.goToList(1);
                
            }
        }
        else if (viewState == 2){
            if (this.laptop.currentScreenPosition != 0){ // if not positioned left
                // console.log('changing to pos 2');
                this.laptop.moveToPos(0); //left side
                this.laptop.cyclePop.goToList(2);
            }
        }
        else if (viewState == 3){
            if (this.laptop.currentScreenPosition != 1){
                // console.log('changing to pos 1');
                this.laptop.moveToPos(1);
                this.laptop.cyclePop.goToList(3);
            }
        }
    }


}

    