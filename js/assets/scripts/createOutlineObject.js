import * as THREE from 'three';

export class createOutlineObject {
  static parameters = {
    color: { type: 'color', default: 0x000000 },
    thickness: { type: 'number', default: 1.05 },
    opacity: { type: 'number', default: 1.0 }
  };

  constructor(gameObject, params) {
    this.gameObject = gameObject;
    this.color = params.color;
    this.thickness = params.thickness;
    this.opacity = params.opacity;
    this.outlineObject = null;
    
  }

  start() {
    // Don't create outline immediately - wait for model to load
  }

  createOutline() {
    const outlineMaterial = new THREE.MeshBasicMaterial({
      color: this.color,
      side: THREE.BackSide, // Only render backfaces
       transparent: this.opacity < 1.0,
      opacity: this.opacity
    });

    // Clone the entire object3D hierarchy
    this.outlineObject = this.gameObject.object3D.clone();
    this.outlineObject.position.set(0,0,0);
    //this.outlineObject.scale.multiplyScalar(this.thickness);
    // Apply outline material to all meshes in the cloned object
    this.outlineObject.traverse((child) => {
      if (child.isMesh) {
        child.material = outlineMaterial;
        // Scale each mesh slightly larger from its own center
         child.scale.multiplyScalar(this.thickness);
      }
    });

    // Add outline as a child so it follows the parent object
    this.gameObject.object3D.add(this.outlineObject);
    // console.log('outlineObject',this.outlineObject);
    this.outlineObject.visible = true;
  }

  /**
   * Update the outline color
   * @param {number} color - Hex color value
   */
  setColor(color) {
    this.color = color;
    if (this.outlineObject) {
      this.outlineObject.traverse((child) => {
        if (child.isMesh) {
          child.material.color.setHex(color);
        }
      });
    }
  }

  /**
   * Update the outline thickness
   * @param {number} thickness - Scale multiplier (e.g., 1.05 for 5% larger)
   */
  setThickness(thickness) {
    if (this.outlineObject) {
      const scaleFactor = thickness / this.thickness;
      this.outlineObject.traverse((child) => {
        if (child.isMesh) {
          child.scale.multiplyScalar(scaleFactor);
        }
      });
      this.thickness = thickness;
    }
  }

  /**
   * Show or hide the outline
   * @param {boolean} visible
   */
  setVisible(visible) {
    if (this.outlineObject) {
      this.outlineObject.visible = visible;
    }
  }

  update(deltaTime) {
    // No update logic needed, outline follows parent automatically
  }
}
