import * as THREE from 'three';
import { GameObject } from '/js/engine/gameObject.js';
// Make a copy of the mesh and give it a wireframe material
export default class wireCopy {
  static parameters = { //these parameters do nothing on their own, but gameObject class reads them to use as defaults to pass the constructor
    //example: speed:{ type: 'number', default: 1.0 },
    color:{ type: 'color', default:0x1cf151 },
    scale:{ type: 'number', default: .95 },
    story:{ type: 'object', default: null },
  };

  constructor(gameObject, params) {
    this.gameObject = gameObject;
    //this.speed = params.speed;
    this.color = params.color;
    this.scale = params.scale;
    this.story = params.story;
    this.wireObj = null;
    this.wireGameObj = null;
  }

  update(deltaTime) {
    //update logic goes here
    //ex: this.gameObject.object3D.rotation.x += this.speed * deltaTime;
  }
  start(){
    //create a copy of the object3D then scale it down by .95 and make that a wireframe using a color variable
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color:this.color,
      wireframe:true,
      side: THREE.FrontSide
    })
    const scale = this.scale;
    this.wireObj = this.gameObject.object3D.clone(); 
    this.wireObj.scale.set(scale,scale,scale);
    //discard wireObj materials 
    this.wireObj.traverse((child)=>{ //go two layers deep to delete materials
      if(child.material){
        child.material.dispose();
      }
        if(child.children){
          child.children.forEach((child)=>{
            if(child.material){
              child.material.dispose();
              child.material = wireframeMaterial;
            }
          })
        }
    })
    // if(this.wireObj.material){
    //   this.wireObj.material.dispose();
    //   this.wireObj.material = wireframeMaterial;
    // }
    


    this.gameObject.object3D.add(this.wireObj);
    this.wireObj.position.set(0, 0, 0);
    this.wireGameObj = new GameObject(this.wireObj);
    
    // Copy animation mixer and actions from parent if they exist
    if (this.gameObject.mixer) {
      this.wireGameObj.mixer = new THREE.AnimationMixer(this.wireObj);
      this.wireGameObj.animationActions = {};
      
      // Copy all animation actions from parent
      for (const animName in this.gameObject.animationActions) {
        const parentAction = this.gameObject.animationActions[animName];
        const clip = parentAction.getClip();
        const action = this.wireGameObj.mixer.clipAction(clip);
        this.wireGameObj.animationActions[animName] = action;
      }
    }
    
    // Register wireGameObj with story's update loop without adding to scene
    // (wireObj is already in scene as child of parent gameObject)
    if (this.story) {
      this.story.gameObjects.push(this.wireGameObj);
    }
  }
}