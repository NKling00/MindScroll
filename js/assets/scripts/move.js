export default class move {
  static parameters = { //these parameters do nothing on their own, but gameObject class reads them to use as defaults to pass the constructor
    //example: { type: 'number', default: 1.0 },
    xSpeed: {type:'number',default:0.0},
    ySpeed: {type:'number',default:0.0},
    zSpeed:{type:'number',default:0.0},
  };

  constructor(gameObject, params) {
    this.gameObject = gameObject;
    this.self = this.gameObject.object3D;
    this.xSpeed = params.xSpeed;
    this.ySpeed = params.ySpeed;
    this.zSpeed = params.zSpeed;
    //this.example = params.example;
  }

  update(deltaTime) {
    //update logic goes here
    //ex: this.gameObject.object3D.rotation.x += this.speed * deltaTime;
    this.self.position.x += this.xSpeed *deltaTime;
    this.self.position.y += this.ySpeed *deltaTime;
    this.self.position.z += this.zSpeed *deltaTime;
    //console.log(this.self.position.toArray());
  }
  start(){

  }
}