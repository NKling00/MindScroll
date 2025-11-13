import * as THREE from 'three';
export class cyclePop {
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
    // this.currentShowingObject = this.objects[this.listIndex][this.objectIndex];
    
    ///this.showNextObject();
    //setTimeout(this.showNextObject,this.time);
  }

  startCycle(){
    this.currentShowingObject = this.objects[this.listIndex][this.objectIndex]; //start at zero\
    console.log('objectIndex',this.objectIndex);
    console.log('listIndex',this.listIndex);
    console.log('startCycle currentShowingObject',this.currentShowingObject);
    this.currentShowingObject.showPop();
    this.timeOut = setTimeout(() => this.showNextObject(), this.time); 
  }
  stopCycle(){
    clearTimeout(this.timeOut);
    this.currentShowingObject.hidePop();
  }

  showNextObject(){
    console.log('show Next object Called');
    console.log('currentShowingObject',this.currentShowingObject);
    console.log('objectIndex',this.objectIndex);
    console.log('listIndex',this.listIndex);
    this.currentShowingObject.hidePop();
    this.objectIndex++;
    if(this.objectIndex >= this.objects[this.listIndex].length){ //loop back around
      this.objectIndex = 0;
    }
    this.currentShowingObject = this.objects[this.listIndex][this.objectIndex];
    this.currentShowingObject.showPop();
    //TODO: move currentShowingObject to a point based off of the laptop
    this.timeOut = setTimeout(() => this.showNextObject(), this.time);
  }
  nextList(){
    this.listIndex++;//next list
    if (this.listIndex >= this.objects.length){ //loop back around
      this.listIndex = 0;
    }
    this.objectIndex = 0; //start from the beginning of the objects in the list
    clearTimeout(this.timeOut); // clear the current timeout
    this.showNextObject();
  }
  backList(){
    this.listIndex--;//previous list
    if (this.listIndex < 0){ //loop back around
      this.listIndex = this.listIndex.length-1;
    }
    this.objectIndex = 0; //start from the beginning of the objects in the list
    clearTimeout(this.timeOut); // clear the current timeout
    this.showNextObject();
  }
  goToList(ind){
    this.listIndex = ind;
    this.objectIndex = 0; //start from the beginning of the objects in the list
    clearTimeout(this.timeOut); // clear the current timeout
    this.showNextObject();
  }
}