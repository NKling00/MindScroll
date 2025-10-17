import * as THREE from 'three';
// Make a copy of the mesh and give it a wireframe material
export default class wireCopy {
  static parameters = { //these parameters do nothing on their own, but gameObject class reads them to use as defaults to pass the constructor
    //example: speed:{ type: 'number', default: 1.0 },
    color:{ type: 'color', default: 0xb7b1b1 },
    scale:{ type: 'number', default: .95 },
  };

  constructor(gameObject, params) {
    this.gameObject = gameObject;
    //this.speed = params.speed;
    this.color = params.color;
    this.scale = params.scale;
    this.wireObj = null;
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
    console.log('wire');
    console.log(this.wireObj);
    this.wireObj.scale.set(scale,scale,scale);
    //discard wireObj materials 
    // this.wireObj.traverse((child)=>{ //go two layers deep to delete materials
    //   if(child.material){
    //     child.material.dispose();
    //   }
    //     if(child.children){
    //       child.children.forEach((child)=>{
    //         if(child.material){
    //           child.material.dispose();
    //           child.material = wireframeMaterial;
    //         }
    //       })
    //     }
    // })
    if(this.wireObj.material){
      this.wireObj.material.dispose();
      this.wireObj.material = wireframeMaterial;
    }
    this.gameObject.object3D.add(this.wireObj);
    
  }
}