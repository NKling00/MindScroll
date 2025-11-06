import * as THREE from 'three';
import {GameObject} from '/js/engine/gameObject.js';
export class spawnRing {
  static parameters = { //these parameters do nothing on their own, but gameObject class reads them to use as defaults to pass the constructor
    rotspeed:{ type: 'number', default: 1.0 },
    scale:{type:'number',default:2.5},
    scaleY:{type:'number',default:4},
    color:{type:'color',default:0xffffff},
    segments:{type:'number',default:8},
    
    
  };

  constructor(gameObject, params) {
    this.gameObject = gameObject;
    this.rotSpeed = params.speed;
    this.scale = params.scale;
    this.scaleY = params.scaleY;
    this.color = params.color;
    this.segments = params.segments;
    this.spawnRing();
  }

  update(deltaTime) {
    //update logic goes here
    //ex: this.gameObject.object3D.rotation.x += this.speed * deltaTime;
    this.form.rotation.y += this.rotSpeed * deltaTime;
  }
  start(){

  }

  spawnRing(){ //return the formRing gameobject

    this.form = new THREE.Mesh(
      //create a wireframe material in bright green
      new THREE.WireframeGeometry(new THREE.ConeGeometry(1, 1, 16, 1,false,0,Math.PI*2)),
      new THREE.LineBasicMaterial(
          {
            color: this.color,       // Red color
            linewidth: 5,          // Width in world units
            transparent: true,     // Enable transparency
            opacity: 0.5,          // 50% transparent
            blending: THREE.AdditiveBlending
          })

    );
    this.form.scale.set(this.scale,this.scaleY,this.scale);
    this.form.rotation.set(Math.PI,0,0); //set 180 upside down
    this.form.position.set(0,-2,0);
    this.formGameObject = new GameObject(this.form);
    this.gameObject.object3D.add(this.form);
    return this.formGameObject;
  }
}