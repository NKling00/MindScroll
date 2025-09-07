import * as THREE from 'three';
export default class instanceSpawner {
  static parameters = { //these parameters do nothing on their own, but gameObject class reads them to use as defaults to pass the constructor
    object:{default:null},
    spawnPoint:{default:null}, //this needs to be a reference to a variable that will change somewhere else
    triggerTime:{type:'number',default:1.9},
    story:{default:null}
  };

  constructor(gameObject, params) {
    this.gameObject = gameObject;
    this.object = params.object;
    this.spawnPoint =params.spawnPoint;
    this.triggerTime = params.triggerTime;
    this.story = params.story;
    this.timer = 0;
    //this.speed = params.speed;
  }

  update(deltaTime) {
    this.timer += deltaTime;
    if(this.timer>= this.triggerTime){ //spawn object
        console.log('SPAWNED');
        const newSpawn = this.object(this.spawnPoint);
        this.story.addToStory(newSpawn);
        this.timer = 0;
        
    }
    //update logic goes here
    //ex: this.gameObject.object3D.rotation.x += this.speed * deltaTime;
  }
  start(){

  }
}