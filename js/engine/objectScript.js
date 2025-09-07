import * as THREE from 'three';
export class ObjectScript {
  static parameters = { //these parameters do nothing on their own, but gameObject class reads them to use as defaults to pass the constructor
    //example: speed:{ type: 'number', default: 1.0 },
    
  };

  constructor(gameObject, params) {
    this.gameObject = gameObject;
    //this.speed = params.speed;
  }

  update(deltaTime) {
    //update logic goes here
    //ex: this.gameObject.object3D.rotation.x += this.speed * deltaTime;
  }
  start(){

  }
}