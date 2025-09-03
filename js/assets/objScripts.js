import { update } from "three/examples/jsm/libs/tween.module.js";
import {ObjectScript} from '/js/engine/objectScript.js';
import * as utils from '/js/utils/utils.js';
import * as THREE from 'three';

//SCRIPTS

export class RotateScript {
  static parameters = { //these parameters do nothing on their own, but gameObject class reads them to use as defaults to pass the constructor
    speed: { type: 'number', default: 1.0 },
    axis: { type: 'string', default: 'y' }
  };

  constructor(gameObject, params) {
    this.gameObject = gameObject;
    this.speed = params.speed;
    this.axis = params.axis;
  }

  update(deltaTime) {
    //this.gameObject.rotation[this.axis] += this.speed * deltaTime;
    if (this.axis === 'x') {
      this.gameObject.object3D.rotation.x += this.speed * deltaTime;
    } else if (this.axis === 'y') {
      this.gameObject.object3D.rotation.y += this.speed * deltaTime;
    } else if (this.axis === 'z') {
      this.gameObject.object3D.rotation.z += this.speed * deltaTime;
    }

  }
}


export class loopPassingScript {
  static parameters = { //these parameters do nothing on their own, but gameObject class reads them to use as defaults to pass the constructor
    speed: { type: 'number', default: 1.0 },
    axis: { type: 'string', default: 'x' },
    distance:{type:'number',default: 33},
    initialPoint:{type:'number',default:0}
  };

  constructor(gameObject, params) {
    this.gameObject = gameObject;
    this.speed = params.speed;
    this.axis = params.axis;
    this.distance = params.distance;
    this.initialPoint = params.initialPoint;
  }

  update(deltaTime) {
    //this.gameObject.rotation[this.axis] += this.speed * deltaTime;
    if (this.axis === 'x') {
      this.gameObject.object3D.position.x += this.speed * deltaTime;
    } else if (this.axis === 'y') {
      this.gameObject.object3D.position.y += this.speed * deltaTime;
    } else if (this.axis === 'z') {
      this.gameObject.object3D.position.z += this.speed * deltaTime;
    }

    if (this.distance <= this.initialPoint-this.gameObject.object3D.position.y)
    {
      console.log('hit jump  point');
    }

  }
}


export class lookAtMouse{
  static parameters={
    yRotation: {default:{max:.01,min:-1,step:.03}},  //min max for Object Rotation , step increases speed
    xRotation: {default:{max:.2,min:-.2,step:.03}},
    yBaseRot: {default:0}, //default rotation before adding anything
    xBaseRot: {default:.3},
    xTrackRange:{default:{max:.5,min:-.5}}, //How far the mouse will track on X
    yTrackRange:{default:{max:.5,min:-.5}}, //How far mouse will track on Y
    app:{default:null}
  }
  constructor(gameObject,params){
    this.gameObject = gameObject;
    this.yRotation = params.yRotation;
    this.xRotation = params.xRotation;
    this.yBaseRot = params.yBaseRot;
    this.xBaseRot = params.xBaseRot;
    this.xTrackRange = params.xTrackRange;
    this.yTrackRange = params.yTrackRange;
    this.app = params.app;
  }
  update(deltaTime){
    this.gameObject.object3D.rotation.y =THREE.MathUtils.lerp(this.gameObject.object3D.rotation.y ,utils.mapMouseValue(utils.clamp(this.app.mouse.x,this.yTrackRange.min,this.yTrackRange.max),this.yRotation.min,this.yRotation.max)+this.yBaseRot,this.yRotation.step);
    this.gameObject.object3D.rotation.x = THREE.MathUtils.lerp(this.gameObject.object3D.rotation.x ,utils.mapMouseValue(-utils.clamp(this.app.mouse.y,this.xTrackRange.min,this.xTrackRange.max),this.xRotation.min,this.xRotation.max)+this.xBaseRot,this.xRotation.step);
  }

}



export class HoverScript {
  static parameters = {
    amplitude: { type: 'number', default: 0.5 },
    frequency: { type: 'number', default: 1.0 }
  };

  constructor(gameObject, params) {
    this.gameObject = gameObject;
    this.amplitude = params.amplitude;
    this.frequency = params.frequency;
    this.startY = gameObject.object3D.position.y;
  }

  update(deltaTime) {
    const time = Date.now() * 0.001;

     this.gameObject.object3D.position.y = this.startY + Math.sin(time * this.frequency) * this.amplitude;
  }
}




//Animation Functions to be used in update step

export function fabricWave(geometry,originalPositions,intersectionPoints,options={radius:5,idle:true,strength:.6}) {
    const pos = geometry.attributes.position;
    
    const time = Date.now() * 0.001;
    let radius = options.radius || 5; //default radius
    let hoverPoint = null;

    if (intersectionPoints.length > 0) {
        hoverPoint = intersectionPoints[0].point;
    }

    for (let i = 0; i < pos.count; i++) { //for each vertex
      const ix = i * 3;
      const ox = originalPositions[ix];
      const oy = originalPositions[ix + 1];
      const oz = originalPositions[ix + 2];

      let newY = oy;
        if (!hoverPoint && options.idle) {
            hoverPoint = {x:-1.3,y:1.3,z:0}; //have some default point if not hovering
        }
      if (hoverPoint) {
        //console.log(hoverPoint);
        const dx = pos.getX(i) - hoverPoint.x;
        const dz = pos.getZ(i) - hoverPoint.z;
        const dist = Math.sqrt(dx * dx + dz * dz); //compute distance for this vert

        if (dist < radius) {
          //const strength = Math.cos((dist / radius) * Math.PI) * -.25;
          const strength = .6;
          //radius = Math.cos(time*1)*2.25;
          newY += Math.sin(time * 1 + dist * .5) * strength;
        }
      }
      // Smooth return to original height if not affected
      pos.setY(i, THREE.MathUtils.lerp(pos.getY(i), newY, 0.2));
    }
    pos.needsUpdate = true;
}


//doesnt work very well
export function applyVertexPress(geometry, initialPositions, intersections, strength = .8, radius = 2, falloff = 'linear') {
  const time = Date.now() * 0.001;
  const posAttr = geometry.attributes.position;
  const vertex = new THREE.Vector3();
  const intersection = intersections[0]?.point;

  if (!intersection){
    for (let i = 0; i < posAttr.count; i++) {
       posAttr.setX(i, THREE.MathUtils.lerp(posAttr.getX(i),initialPositions[(i*3)], 0.1));
      posAttr.setY(i, THREE.MathUtils.lerp(posAttr.getY(i),initialPositions[(i*3)+1], 0.02));
     posAttr.setZ(i, THREE.MathUtils.lerp(posAttr.getZ(i),initialPositions[(i*3)+2], 0.05));
      //posAttr.setXYZ(i, initialPositions[i * 3], initialPositions[i * 3 + 1], initialPositions[i * 3 + 2]);
    }
  }
  else{
    for (let i = 0; i < posAttr.count; i++) {
      vertex.fromArray(initialPositions, i * 3);
      const distance = vertex.distanceTo(intersection);

      if (distance < radius) {
        let influence = 0;

        if (falloff === 'linear') {
          influence = 1 - distance / radius;
          
        } else if (falloff === 'exponential') {
    
          influence = Math.exp((-distance) * 2 / radius);
          
        }
        else if (falloff === 'wave') {
          let varianceStrength = .8;
          let timeMultiplier = 2;
          let variance = Math.sin(time*timeMultiplier) * varianceStrength; //add some time based influence
          
          influence = Math.exp((-distance +variance) * 2 / radius);
        }

        const direction = new THREE.Vector3().subVectors(intersection, vertex).normalize();
        const displacement = direction.multiplyScalar(-strength * influence*Math.sin(time*1.5));

        // posAttr.setXYZ(
        //   i,
        //   vertex.x + displacement.x,
        //   vertex.y + displacement.y,
        //   vertex.z + displacement.z
        // );
        posAttr.setXYZ(i, vertex.x - displacement.x, vertex.y+ displacement.y , vertex.z - displacement.z);
      }
      else{
        // Reset to original position if outside influence radius
          posAttr.setXYZ(i, initialPositions[i * 3], initialPositions[i * 3 + 1], initialPositions[i * 3 + 2]);

      }
    }
  }

  

  posAttr.needsUpdate = true;
  geometry.computeVertexNormals();
}


