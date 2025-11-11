import * as THREE from 'three';
export class ObjectScript {
  static parameters = { //these parameters do nothing on their own, but gameObject class reads them to use as defaults to pass the constructor
    //example: speed:{ type: 'number', default: 1.0 },
    objects:{ type: 'array', default: [] },
    time:{ type: 'number', default: 1.0 },
    
  };

  constructor(gameObject, params) {
    this.gameObject = gameObject;
    this.objects = params.objects; //2dArray of Objects to cycle through
    this.time = params.time; //How long for each item for popping to the next one
    this.objectIndex = 0;
    this.listIndex = 0;
    this.timeOut = null;
    this.currentShowingObject =null;
  }

  update(deltaTime) {
    //update logic goes here

  }
  start(){
    this.currentShowingObject = this.objects[this.listIndex][this.objectIndex];
    
    showNextObject();
    setTimeout(showNextObject,this.time);
  }

  startCycle(){
    this.currentShowingObject = this.objects[this.listIndex][this.objectIndex]; //start at zero
    this.currentShowingObject.showPop();
    setTimeout(showNextObject,this.time);
  }

  showNextObject(){
    this.currentShowingObject.hidePop();
    this.objectIndex++;
    if(this.objectIndex >= this.objects[this.listIndex].length){ //loop back around
      this.objectIndex = 0;
    }
    this.currentShowingObject = this.objects[this.listIndex][this.objectIndex];
    this.currentShowingObject.showPop();
    this.timeOut = setTimeout(showNextObject,this.time);
  }
  nextList(){
    this.listIndex++;//next list
    if (this.listIndex >= this.listIndex.length){ //loop back around
      this.listIndex = 0;
    }
    this.objectIndex = 0; //start from the beginning of the objects in the list
    clearTimeout(this.timeOut); // clear the current timeout
    showNextObject();
  }
  backList(){
    this.listIndex--;//previous list
    if (this.listIndex < 0){ //loop back around
      this.listIndex = this.listIndex.length-1;
    }
    this.objectIndex = 0; //start from the beginning of the objects in the list
    clearTimeout(this.timeOut); // clear the current timeout
    showNextObject();
  }
  goToList(ind){
    this.listIndex = ind;
    this.objectIndex = 0; //start from the beginning of the objects in the list
    clearTimeout(this.timeOut); // clear the current timeout
    showNextObject();
  }
}