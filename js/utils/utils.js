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


 /**
     * @description Converts a color string (CSS color name, hex, rgb, etc.) to a hexadecimal color code
     * @param {string} colorString - Color string (e.g., 'red', '#ff0000', 'rgb(255,0,0)', 'hsl(0,100%,50%)')
     * @returns {number} Hexadecimal color code (e.g., 0xff0000)
     */
   export function colorStringToHex(colorString) {
        // Create a temporary element to use browser's color parsing
        const tempElement = document.createElement('div');
        tempElement.style.color = colorString;
        document.body.appendChild(tempElement);
        
        // Get computed color (always returns rgb/rgba format)
        const computedColor = window.getComputedStyle(tempElement).color;
        document.body.removeChild(tempElement);
        
        // Parse rgb/rgba format
        const rgbMatch = computedColor.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (rgbMatch) {
            const r = parseInt(rgbMatch[1]);
            const g = parseInt(rgbMatch[2]);
            const b = parseInt(rgbMatch[3]);
            return (r << 16) | (g << 8) | b;
        }
        
        // If parsing fails, return white as default
        console.warn(`Failed to parse color string: ${colorString}`);
        return 0xffffff;
    }
