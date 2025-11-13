   import * as THREE from 'three';
   export function randomIntRange(min,max){
        return (Math.floor(Math.random() * (max - min + 1)) + min);
    }
    export function randomRange(min,max){
         return ((Math.random() * (max - min + 1)) + min);
    }
    
    export function mapMouseValue(value, min, max) {
     //mapping from -1 to 1
          // Clamp input to [-1, 1]
          value = Math.max(-1, Math.min(1, value));

          // Normalize from [-1, 1] to [0, 1]
          const normalized = (value + 1) / 2;

          // Map to [min, max]
          return min + normalized * (max - min);
     }

   
    export function clamp(value, min, max) {
     return Math.max(min, Math.min(value, max));
     }

/**
 * Automatically centers a mesh in its local space.
 * @param {THREE.Mesh} mesh - The mesh to center.
 */
export function centerMesh(mesh) {
    // Compute the bounding box of the mesh
    const boundingBox = new THREE.Box3().setFromObject(mesh);
    // Get the center of the bounding box
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    // Adjust the mesh's geometry so it is centered around its local origin
    mesh.geometry.translate(-center.x, -center.y, -center.z);

    // If the mesh was already positioned in the scene, its position might need
    // to be adjusted to stay in the same world spot, though often it's simpler
    // to apply this function immediately after loading and then position the mesh as needed.
}