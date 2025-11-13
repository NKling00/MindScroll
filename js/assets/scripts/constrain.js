import * as THREE from 'three';

export class constrain {
  static parameters = {
    targetGameObject: { type: 'object', default: null },
    constrainPosition: { type: 'boolean', default: false },
    constrainRotation: { type: 'boolean', default: false },
    constrainScale: { type: 'boolean', default: false },
    positionOffset: { type: 'object', default: { x: 0, y: 0, z: 0 } },
    rotationOffset: { type: 'object', default: { x: 0, y: 0, z: 0 } },
    scaleOffset: { type: 'object', default: { x: 1, y: 1, z: 1 } }
  };

  constructor(gameObject, params) {
    this.gameObject = gameObject;
    this.targetGameObject = params.targetGameObject;
    this.constrainPosition = params.constrainPosition;
    this.constrainRotation = params.constrainRotation;
    this.constrainScale = params.constrainScale;
    
    // Store initial offsets (will be calculated in start())
    this.positionOffset = new THREE.Vector3();
    this.rotationOffset = new THREE.Euler();
    this.scaleOffset = new THREE.Vector3(1, 1, 1);
    
    // Flag to track if offsets have been initialized
    this.initialized = false;
  }

  start() {
    if (!this.targetGameObject) {
      console.warn('constrain script: No target GameObject provided');
      return;
    }
    
    // Calculate initial offsets relative to target
    if (this.constrainPosition) {
      this.positionOffset.copy(this.gameObject.object3D.position).sub(this.targetGameObject.object3D.position);
    }
    
    if (this.constrainRotation) {
      this.rotationOffset.set(
        this.gameObject.object3D.rotation.x - this.targetGameObject.object3D.rotation.x,
        this.gameObject.object3D.rotation.y - this.targetGameObject.object3D.rotation.y,
        this.gameObject.object3D.rotation.z - this.targetGameObject.object3D.rotation.z
      );
    }
    
    if (this.constrainScale) {
      this.scaleOffset.set(
        this.gameObject.object3D.scale.x / this.targetGameObject.object3D.scale.x,
        this.gameObject.object3D.scale.y / this.targetGameObject.object3D.scale.y,
        this.gameObject.object3D.scale.z / this.targetGameObject.object3D.scale.z
      );
    }
    
    this.initialized = true;
  }

  update(deltaTime) {
    if (!this.initialized || !this.targetGameObject) return;
    
    const target = this.targetGameObject.object3D;
    const obj = this.gameObject.object3D;
    
    // Apply position constraint
    if (this.constrainPosition) {
      obj.position.copy(target.position).add(this.positionOffset);
    }
    
    // Apply rotation constraint
    if (this.constrainRotation) {
      obj.rotation.set(
        target.rotation.x + this.rotationOffset.x,
        target.rotation.y + this.rotationOffset.y,
        target.rotation.z + this.rotationOffset.z
      );
    }
    
    // Apply scale constraint
    if (this.constrainScale) {
      obj.scale.set(
        target.scale.x * this.scaleOffset.x,
        target.scale.y * this.scaleOffset.y,
        target.scale.z * this.scaleOffset.z
      );
    }
  }

  /**
   * Update the position offset manually
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   */
  setPositionOffset(x, y, z) {
    this.positionOffset.set(x, y, z);
  }

  /**
   * Update the rotation offset manually
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   */
  setRotationOffset(x, y, z) {
    this.rotationOffset.set(x, y, z);
  }

  /**
   * Update the scale offset manually
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   */
  setScaleOffset(x, y, z) {
    this.scaleOffset.set(x, y, z);
  }

  /**
   * Change the target GameObject
   * @param {GameObject} newTarget 
   */
  setTarget(newTarget) {
    this.targetGameObject = newTarget;
    this.initialized = false;
    this.start(); // Recalculate offsets
  }
}
