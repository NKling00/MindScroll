import * as THREE from 'three';
export default class instanceSpawner {
  static parameters = { //these parameters do nothing on their own, but gameObject class reads them to use as defaults to pass the constructor
    object:{default:null},//needs to be a prefab(function that returns a new gameObject)
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
  }

  update(deltaTime) {
    this.timer += deltaTime;
    if(this.timer>= this.triggerTime){ //spawn object
        //console.log('SPAWNED');
        const newSpawn = this.object(this.spawnPoint);
        this.story.addToStory(newSpawn);
        this.timer = 0;
        
    }
  }
  start(){

  }
}