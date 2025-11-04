

//EXAMPLE SCENE FILE
import * as THREE from 'three';
import { Story } from '/js/engine/story.js';
import {GameObject} from '/js/engine/gameObject.js';
import { createInspector } from '/js/utils/inspector.js';

//Imports for 3d Assets

//Imports for scripts

export class newStory extends Story{
    setupObjects(){
     //Example Box Geometry
    this.exampleBox= new THREE.BoxGeometry(1,1,1);
    this.exampleMat= new THREE.MeshStandardMaterial({color:0xff0000});
    this.exampleMesh = new THREE.Mesh(this.exampleBox,this.exampleMat);
    this.exampleObj = new GameObject(this.exampleMesh);
    this.exampleObj.setRotation(0,Math.PI/4,0);
    this.exampleObj.addAxesHelper(1.5);
    this.addToStory(this.exampleObj);  

    this.axesHelper = new THREE.AxesHelper(5); // 5 is the size, X:Red, Y:Green, Z:Blue

    //this.addToStory(this.axesHelper);
    this.sceneGridHelper = new THREE.GridHelper(10, 10); // size and divisions
    this.sceneGridHelper.rotation.x = Math.PI/2;
    this.addToStory(this.sceneGridHelper);

    this.setupHelpers();

    }
}