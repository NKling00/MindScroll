import * as THREE from 'three';
import { ObjectScript } from '/js/engine/objectScript.js';

/**
 * @description Raycaster component for mouse picking and line-of-sight detection
 * Useful for clicking on objects, shooting rays, etc.
 */
export class raycaster extends ObjectScript {
    static parameters = {
        direction: { default: { x: 0, y: 0, z: -1 } }, // Ray direction
        maxDistance: { default: Infinity }, // Maximum ray distance
        showDebug: { default: false }, // Show ray visualization
        layers: { default: null }, // Specific layers to raycast against
        onHit: { default: null }, // Callback when ray hits something
        continuous: { default: false } // Continuously raycast in update loop
    };

    start() {
        this.raycaster = new THREE.Raycaster();
        this.raycaster.far = this.params.maxDistance;
        
        // Set ray direction
        this.direction = new THREE.Vector3(
            this.params.direction.x,
            this.params.direction.y,
            this.params.direction.z
        ).normalize();
        
        // Debug visualization
        this.debugArrow = null;
        if (this.params.showDebug) {
            this.createDebugArrow();
        }
        
        // Setup layers if specified
        if (this.params.layers) {
            this.raycaster.layers.set(this.params.layers);
        }
    }

    update(deltaTime) {
        if (this.params.continuous) {
            this.cast();
        }
        
        // Update debug arrow
        if (this.debugArrow) {
            this.updateDebugArrow();
        }
    }

    /**
     * Cast a ray from the GameObject's position
     * @param {Array} objectsToTest - Array of THREE.Object3D to test against
     * @returns {Array} Array of intersections
     */
    cast(objectsToTest = null) {
        const origin = this.gameObject.object3D.position;
        
        // Get world direction
        const worldDirection = this.direction.clone();
        worldDirection.applyQuaternion(this.gameObject.object3D.quaternion);
        
        this.raycaster.set(origin, worldDirection);
        
        // Use story objects if no specific objects provided
        if (!objectsToTest && this.gameObject.var.story) {
            objectsToTest = this.gameObject.var.story.objects;
        }
        
        if (!objectsToTest) {
            console.warn('No objects to raycast against');
            return [];
        }
        
        const intersects = this.raycaster.intersectObjects(objectsToTest, true);
        
        // Fire callback if hit something
        if (intersects.length > 0 && this.params.onHit) {
            this.params.onHit(intersects);
        }
        
        return intersects;
    }

    /**
     * Cast ray from screen coordinates (for mouse picking)
     * @param {number} x - Normalized x coordinate (-1 to 1)
     * @param {number} y - Normalized y coordinate (-1 to 1)
     * @param {THREE.Camera} camera - Camera to cast from
     * @param {Array} objectsToTest - Objects to test against
     * @returns {Array} Array of intersections
     */
    castFromScreen(x, y, camera, objectsToTest = null) {
        this.raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
        
        if (!objectsToTest && this.gameObject.var.story) {
            objectsToTest = this.gameObject.var.story.objects;
        }
        
        const intersects = this.raycaster.intersectObjects(objectsToTest, true);
        
        if (intersects.length > 0 && this.params.onHit) {
            this.params.onHit(intersects);
        }
        
        return intersects;
    }

    /**
     * Check if ray hits a specific object
     * @param {THREE.Object3D} object - Object to check
     * @returns {boolean} True if ray hits the object
     */
    hitsObject(object) {
        const intersects = this.cast([object]);
        return intersects.length > 0;
    }

    /**
     * Get the first object hit by the ray
     * @param {Array} objectsToTest - Objects to test against
     * @returns {Object|null} First intersection or null
     */
    getFirstHit(objectsToTest = null) {
        const intersects = this.cast(objectsToTest);
        return intersects.length > 0 ? intersects[0] : null;
    }

    /**
     * Set the ray direction
     * @param {number} x - X component
     * @param {number} y - Y component
     * @param {number} z - Z component
     */
    setDirection(x, y, z) {
        this.direction.set(x, y, z).normalize();
    }

    createDebugArrow() {
        const origin = new THREE.Vector3(0, 0, 0);
        const length = Math.min(this.params.maxDistance, 10);
        const color = 0xff0000;
        
        this.debugArrow = new THREE.ArrowHelper(
            this.direction,
            origin,
            length,
            color
        );
        this.gameObject.object3D.add(this.debugArrow);
    }

    updateDebugArrow() {
        if (!this.debugArrow) return;
        
        // Update arrow direction
        const worldDirection = this.direction.clone();
        worldDirection.applyQuaternion(this.gameObject.object3D.quaternion);
        this.debugArrow.setDirection(worldDirection);
    }

    dispose() {
        if (this.debugArrow) {
            this.gameObject.object3D.remove(this.debugArrow);
            this.debugArrow.dispose();
        }
    }
}

/**
 * Helper function for mouse picking
 * Call this from your Story class
 */
export function setupMousePicking(story, camera, onObjectClick) {
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    
    story.renderTargetElement.addEventListener('click', (event) => {
        // Calculate mouse position in normalized device coordinates
        const rect = story.renderTargetElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Cast ray
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(story.objects, true);
        
        if (intersects.length > 0) {
            onObjectClick(intersects[0]);
        }
    });
    
    return { mouse, raycaster };
}
