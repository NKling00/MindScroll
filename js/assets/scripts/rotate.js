
export class rotate {
  static parameters = { //these parameters do nothing on their own, but gameObject class reads them to use as defaults to pass the constructor
    //example: speed:{ type: 'number', default: 1.0 },
    speed: { type: 'number', default: 1.0 },
    axis: { type: 'string', default: 'y' }
  };

  constructor(gameObject, params) {
    this.gameObject = gameObject;
    this.speed = params.speed;
    this.axis = params.axis;
  }

  update(deltaTime) {
   if (this.axis === 'x') {
      this.gameObject.object3D.rotation.x += this.speed * deltaTime;
    } else if (this.axis === 'y') {
      this.gameObject.object3D.rotation.y += this.speed * deltaTime;
    } else if (this.axis === 'z') {
      this.gameObject.object3D.rotation.z += this.speed * deltaTime;
    }
  }
  start(){

  }
}