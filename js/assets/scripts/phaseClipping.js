import * as THREE from 'three';

export default class phaseClipping {
  static parameters = {
    speed: { type: 'number', default: 1.0 }, // Speed of clipping plane movement
    heightPercentage: { type: 'number', default: 1.0 }, // Height percentage (0.0 to 1.0)
    autoStart: { type: 'boolean', default: false }, // Whether to start clipping automatically
    direction: { type: 'string', default: 'down' }, // 'down' or 'up' - direction of clipping
    loop: { type: 'boolean', default: false }, // Whether to loop the clipping animation
  };

  constructor(gameObject, params) {
    this.gameObject = gameObject;
    this.speed = params.speed;
    this.heightPercentage = params.heightPercentage;
    this.autoStart = params.autoStart;
    this.direction = params.direction;
    this.loop = params.loop;
    
    // Clipping plane setup
    this.clippingPlane = new THREE.Plane();
    this.clippingPlanes = [this.clippingPlane];
    
    // Get object bounds
    this.boundingBox = new THREE.Box3();
    this.objectHeight = 0;
    this.objectTop = 0;
    this.objectBottom = 0;
    
    // Animation state
    this.isClipping = false;
    this.currentHeight = 1.0; // Start at 100% (fully visible)
    this.targetHeight = 1.0;
    
    this.setupClipping();
  }

  setupClipping() {
    // Calculate bounding box and dimensions
    
    this.updateBounds();
    
    // Set initial clipping plane position
    this.updateClippingPlane();
    
    // Apply clipping planes to the object's material
    this.applyClippingToMaterial();
  }

  updateBounds() {
    this.boundingBox.setFromObject(this.gameObject.object3D);
    this.objectHeight = this.boundingBox.max.y - this.boundingBox.min.y;
    this.objectTop = this.boundingBox.max.y;
    this.objectBottom = this.boundingBox.min.y;
  }

  applyClippingToMaterial() {
    // Apply clipping planes to all materials in the object
    this.gameObject.object3D.traverse((child) => {
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(material => {
            material.clippingPlanes = this.clippingPlanes;
            material.clipShadows = true;
          });
        } else {
          child.material.clippingPlanes = this.clippingPlanes;
          child.material.clipShadows = true;
        }
      }
    });
  }

  updateClippingPlane() {
    // Calculate the Y position based on height percentage
    const targetY = this.objectBottom + (this.objectHeight * this.currentHeight);
    
    // Set clipping plane normal and position
    if (this.direction === 'down') {
      // Clipping from top down (normal points up, plane moves down)
      this.clippingPlane.setFromNormalAndCoplanarPoint(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, targetY, 0)
      );
    } else {
      // Clipping from bottom up (normal points down, plane moves up)
      this.clippingPlane.setFromNormalAndCoplanarPoint(
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(0, targetY, 0)
      );
    }
  }

  // Public methods to control clipping
  startClipping(targetPercentage = 0.0) {
    this.isClipping = true;
    this.targetHeight = Math.max(0.0, Math.min(1.0, targetPercentage));
  }

  stopClipping() {
    this.isClipping = false;
  }

  setHeightPercentage(percentage) {
    this.heightPercentage = Math.max(0.0, Math.min(1.0, percentage));
    this.currentHeight = this.heightPercentage;
    this.updateClippingPlane();
  }

  // Reset to fully visible
  reset() {
    this.currentHeight = 1.0;
    this.targetHeight = 1.0;
    this.isClipping = false;
    this.updateClippingPlane();
  }

  // Make object fully disappear
  hide() {
    this.startClipping(0.0);
  }

  // Make object fully appear
  show() {
    this.startClipping(1.0);
  }

  update(deltaTime) {
    // Update bounds in case object has moved or scaled
    this.updateBounds();

    // Animate clipping if active
    if (this.isClipping) {
      const difference = this.targetHeight - this.currentHeight;
      if (Math.abs(difference) > 0.001) {
        // Move towards target height
        const movement = this.speed * deltaTime;
        if (difference > 0) {
          this.currentHeight = Math.min(this.targetHeight, this.currentHeight + movement);
        } else {
          this.currentHeight = Math.max(this.targetHeight, this.currentHeight - movement);
        }
        
        this.updateClippingPlane();
      } else {
        // reset and flip direction
        if(this.loop){
          this.reset();
          this.direction = this.direction === 'down' ? 'up' : 'down';
          this.startClipping();
        }
        else{
          this.startClipping(this.targetHeight);

          //Reached target, stop clipping animation
          this.currentHeight = this.targetHeight;
          this.isClipping = false;
        }
        this.updateClippingPlane();
      }
    }
  }

  start() {
    // Auto-start clipping if enabled
    if (this.autoStart) {
      this.startClipping(0.0); // Start hiding the object
    } else {
      // Set initial height percentage
      this.setHeightPercentage(this.heightPercentage);
    }
  }

  // Cleanup method
  dispose() {
    // Remove clipping planes from materials
    this.gameObject.object3D.traverse((child) => {
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(material => {
            material.clippingPlanes = [];
          });
        } else {
          child.material.clippingPlanes = [];
        }
      }
    });
  }
}
