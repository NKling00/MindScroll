import * as THREE from 'three';
import { ObjectScript } from '/js/engine/objectScript.js';

/**
 * @description Sphere collider component for circular collision detection
 * More efficient than box collider for spherical objects
 */
export class sphereCollider extends ObjectScript {
    constructor(gameObject, params) {
        super(gameObject, params);
        this.params = params;
    }

    static parameters = {
        radius: { default: 1 }, // Radius of the sphere
        offset: { default: { x: 0, y: 0, z: 0 } }, // Offset from object center
        isTrigger: { default: false }, // If true, only detects overlaps
        showDebug: { default: false }, // Show collision sphere visualization
        layer: { default: 'default' }, // Collision layer
        onCollisionEnter: { default: null },
        onCollisionStay: { default: null },
        onCollisionExit: { default: null }
    };

    start() {
        // Create bounding sphere
        this.sphere = new THREE.Sphere();
        this.helper = null;
        this.collidingWith = new Set();
        
        // Set radius (auto-calculate if needed)
        if (this.params.radius === 'auto') {
            this.calculateAutoRadius();
        } else {
            this.sphere.radius = this.params.radius;
        }

        // Create debug visualization
        if (this.params.showDebug) {
            this.createDebugHelper();
        }

        // Register with collision manager
        if (this.gameObject.var.story && this.gameObject.var.story.collisionManager) {
            this.gameObject.var.story.collisionManager.registerCollider(this);
        }
    }

    calculateAutoRadius() {
        // Calculate bounding sphere from object
        const box = new THREE.Box3().setFromObject(this.gameObject.object3D);
        box.getBoundingSphere(this.sphere);
    }

    update(deltaTime) {
        // Update sphere center position
        const pos = this.gameObject.object3D.position;
        this.sphere.center.set(
            pos.x + this.params.offset.x,
            pos.y + this.params.offset.y,
            pos.z + this.params.offset.z
        );

        // Update debug helper
        if (this.helper) {
            this.helper.position.copy(this.sphere.center);
        }
    }

    /**
     * Check intersection with another sphere collider
     */
    intersectsSphere(otherCollider) {
        return this.sphere.intersectsSphere(otherCollider.sphere);
    }

    /**
     * Check intersection with a box collider
     */
    intersectsBox(boxCollider) {
        return boxCollider.box.intersectsSphere(this.sphere);
    }

    /**
     * Generic intersects method that works with both types
     */
    intersects(otherCollider) {
        if (otherCollider.sphere) {
            return this.intersectsSphere(otherCollider);
        } else if (otherCollider.box) {
            return this.intersectsBox(otherCollider);
        }
        return false;
    }

    /**
     * Check if a point is inside this collider
     */
    containsPoint(point) {
        return this.sphere.containsPoint(point);
    }

    /**
     * Get the center of the collision sphere
     */
    getCenter() {
        return this.sphere.center.clone();
    }

    /**
     * Get distance to another collider
     */
    distanceTo(otherCollider) {
        return this.sphere.center.distanceTo(otherCollider.getCenter());
    }

    // Collision callbacks (same as boxCollider)
    handleCollisionEnter(otherCollider) {
        this.collidingWith.add(otherCollider);
        if (this.params.onCollisionEnter) {
            this.params.onCollisionEnter(otherCollider.gameObject);
        }
    }

    handleCollisionStay(otherCollider) {
        if (this.params.onCollisionStay) {
            this.params.onCollisionStay(otherCollider.gameObject);
        }
    }

    handleCollisionExit(otherCollider) {
        this.collidingWith.delete(otherCollider);
        if (this.params.onCollisionExit) {
            this.params.onCollisionExit(otherCollider.gameObject);
        }
    }

    createDebugHelper() {
        const geometry = new THREE.SphereGeometry(this.sphere.radius, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        this.helper = new THREE.Mesh(geometry, material);
        this.gameObject.object3D.add(this.helper);
    }

    dispose() {
        if (this.helper) {
            this.gameObject.object3D.remove(this.helper);
            this.helper.geometry.dispose();
            this.helper.material.dispose();
        }
        
        if (this.gameObject.var.story && this.gameObject.var.story.collisionManager) {
            this.gameObject.var.story.collisionManager.unregisterCollider(this);
        }
    }
}
