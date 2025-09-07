import * as THREE from 'three';
export default class balloonUp {
  static parameters = { //these parameters do nothing on their own, but gameObject class reads them to use as defaults to pass the constructor
    object:{default:null},
    
  };

  constructor(gameObject, params) {
    this.gameObject = gameObject;
    this.object = params.object;
    this.destroyed = false;
    
  }

  update(deltaTime) {
    if (this.gameObject.object3D.position.y >= 15 && !this.destroyed){ //when we reach the top destroy
        this.gameObject.dispose();
        this.destroyed =true;
    }
  }
  start(){ //assign gsap functions at start
    gsap.from( this.gameObject.object3D.scale,{
    x:0,
    y:0,
    z:0,
    duration:5,
    ease:"elastic.out(.2,0.3)",
    });

    gsap.to(this.gameObject.object3D.position,{
    y:this.gameObject.object3D.position.y + 20,
    duration:8,
    ease:"power1.inOut",
    });

    gsap.to(this.gameObject.object3D.rotation,{
    y:this.gameObject.object3D.rotation.y+10,
    duration:9,
    ease:"power1.in",
    });


  }
}