import { update } from "three/examples/jsm/libs/tween.module.js";
import {ObjectScript} from '/js/engine/objectScript.js';
import * as utils from '/js/utils/utils.js';
import * as THREE from 'three';
import { GameObject } from "/js/engine/gameObject.js";
import { drawDebugLine } from "/js/utils/threeHelpers";
import * as scripts from '/js/assets/objScripts.js';

export default class loopingTile {
  static parameters = { //these parameters do nothing on their own, but gameObject class reads them to use as defaults to pass the constructor
    speed: { type: 'number', default: 1.0 },
    axis: { type: 'string', default: 'x' },
    tileSizeX:{type:'number',default:95.5},
    story:{default:null},
    originTile:{default:false},
    initialPosition:{default:new THREE.Vector3()}

  };

  constructor(gameObject, params) {
    this.gameObject = gameObject;
    this.speed = params.speed;
    this.axis = params.axis;
    this.story = params.story;
    this.originTile = params.originTile;
    this.tileSizeX = params.tileSizeX;

    this.initialPosition = params.initialPosition;
  }

  update(deltaTime) {
    //this.gameObject.rotation[this.axis] += this.speed * deltaTime;
    const self = this.gameObject.object3D;
    if (this.axis === 'x') {
      this.gameObject.object3D.translateX(this.speed*deltaTime);
    //   this.gameObject.object3D.position.x += this.speed * deltaTime;
    } else if (this.axis === 'y') {
        //this.gameObject.object3D.translateY(this.speed*deltaTime);
    } else if (this.axis === 'z') {
     //this.gameObject.object3D.translateY(this.speed*deltaTime);
    }

    
   const distanceTravelled = self.position.distanceTo(this.initialPosition);

   if( distanceTravelled>(this.tileSizeX) && self.position.x>this.initialPosition.x ){
      
        self.position.copy(this.initialPosition); //return to initialPosition center Position
        self.translateX(this.tileSizeX*-1); //slide 1 tile up (could multiply this by the number of extra tiles in the set)
    }
   
  }

  start(){
    if(this.originTile){
        this.initialPosX = this.gameObject.object3D.position.x; //get initial pos

        this.initialPosition = this.gameObject.object3D.position.clone();
        console.log('ini'+this.initialPosition.toArray());

        //generate tiles
        const clone = new GameObject(this.gameObject.object3D.clone());
        clone.object3D.translateX(this.tileSizeX *-1);
        console.log('clone');
        if(this.story){
            this.story.addToStory(clone);
            console.log ('added the clone!!!!');
        }
        clone.addScript(loopingTile,{axis:'x',speed:this.speed,initialPosition:this.initialPosition,tileSizeX:this.tileSizeX});
      
    } 

     
    }

}