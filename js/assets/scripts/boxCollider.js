import * as THREE from 'three';
import { ObjectScript } from '/js/engine/objectScript.js';

/**
 * @description Box collider component for collision detection
 * Automatically creates and updates a bounding box for the GameObject
 */
export class boxCollider extends ObjectScript {
    constructor(gameObject, params) {
        super(gameObject, params);
        this.params = params;
    }

    static parameters = {
        size: { default: null }, // Custom size {x, y, z} or null for auto
        offset: { default: { x: 0, y: 0, z: 0 } }, // Offset from object center
        isTrigger: { default: false }, // If true, only detects overlaps without physics
        showDebug: { default: false }, // Show collision box visualization
        layer: { default: 'default' }, // Collision layer for filtering
        onCollisionEnter: { default: null }, // Callback when collision starts
        onCollisionStay: { default: null }, // Callback while colliding
        onCollisionExit: { default: null } // Callback when collision ends
    };

    start() {
        // Create bounding box
        this.box = new THREE.Box3();
        this.helper = null;
        this.collidingWith = new Set(); // Track current collisions
        
        // Calculate initial size
        if (this.params.size) {
            this.customSize = new THREE.Vector3(
                this.params.size.x,
                this.params.size.y,
                this.params.size.z
            );
        } else {
            // Auto-calculate from mesh
            this.customSize = null;
            this.calculateAutoSize();
        }

        // Create debug visualization if enabled
        if (this.params.showDebug) {
            this.createDebugHelper();
        }

        // Register with collision manager (if it exists)
        if (this.gameObject.var.story && this.gameObject.var.story.collisionManager) {
            this.gameObject.var.story.collisionManager.registerCollider(this);
        }
    }

    calculateAutoSize() {
        // Calculate bounding box from the object's geometry
        this.box.setFromObject(this.gameObject.object3D);
    }

    update(deltaTime) {
        // Update bounding box position
        if (this.customSize) {
            const pos = this.gameObject.object3D.position;
            const offset = this.params.offset;
            const halfSize = this.customSize.clone().multiplyScalar(0.5);
            
            this.box.min.set(
                pos.x + offset.x - halfSize.x,
                pos.y + offset.y - halfSize.y,
                pos.z + offset.z - halfSize.z
            );
            this.box.max.set(
                pos.x + offset.x + halfSize.x,
                pos.y + offset.y + halfSize.y,
                pos.z + offset.z + halfSize.z
            );
        } else {
            // Auto-update from object
            this.box.setFromObject(this.gameObject.object3D);
            
            // Apply offset
            if (this.params.offset.x !== 0 || this.params.offset.y !== 0 || this.params.offset.z !== 0) {
                const offsetVec = new THREE.Vector3(
                    this.params.offset.x,
                    this.params.offset.y,
                    this.params.offset.z
                );
                this.box.translate(offsetVec);
            }
        }

        // Update debug helper
        if (this.helper) {
            this.helper.box.copy(this.box);
        }
    }

    /**
     * Check if this collider intersects with another collider
     * @param {boxCollider} otherCollider - The other collider to check against
     * @returns {boolean} True if colliding
     */
    intersects(otherCollider) {
        return this.box.intersectsBox(otherCollider.box);
    }

    /**
     * Check if a point is inside this collider
     * @param {THREE.Vector3} point - The point to check
     * @returns {boolean} True if point is inside
     */
    containsPoint(point) {
        return this.box.containsPoint(point);
    }

    /**
     * Get the center of the collision box
     * @returns {THREE.Vector3} Center position
     */
    getCenter() {
        return this.box.getCenter(new THREE.Vector3());
    }

    /**
     * Get the size of the collision box
     * @returns {THREE.Vector3} Size
     */
    getSize() {
        return this.box.getSize(new THREE.Vector3());
    }

    /**
     * Called by collision manager when collision detected
     */
    handleCollisionEnter(otherCollider) {
        this.collidingWith.add(otherCollider);
        if (this.params.onCollisionEnter) {
            this.params.onCollisionEnter(otherCollider.gameObject);
        }
    }

    /**
     * Called by collision manager while collision persists
     */
    handleCollisionStay(otherCollider) {
        if (this.params.onCollisionStay) {
            this.params.onCollisionStay(otherCollider.gameObject);
        }
    }

    /**
     * Called by collision manager when collision ends
     */
    handleCollisionExit(otherCollider) {
        this.collidingWith.delete(otherCollider);
        if (this.params.onCollisionExit) {
            this.params.onCollisionExit(otherCollider.gameObject);
        }
    }

    createDebugHelper() {
        this.helper = new THREE.Box3Helper(this.box, 0x00ff00);
        this.gameObject.object3D.add(this.helper);
    }

    dispose() {
        if (this.helper) {
            this.gameObject.object3D.remove(this.helper);
            this.helper.dispose();
        }
        
        // Unregister from collision manager
        if (this.gameObject.var.story && this.gameObject.var.story.collisionManager) {
            this.gameObject.var.story.collisionManager.unregisterCollider(this);
        }
    }
}
