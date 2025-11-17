import * as THREE from 'three';
import { ObjectScript } from '/js/engine/objectScript.js';

/**
 * @description Simple rigidbody component for basic physics
 * Works with boxCollider/sphereCollider for collision response
 */
export class rigidbody extends ObjectScript {
    static parameters = {
        mass: { default: 1 }, // Mass of the object
        gravity: { default: -9.81 }, // Gravity force (Y-axis)
        useGravity: { default: true }, // Enable/disable gravity
        drag: { default: 0.1 }, // Air resistance (0-1)
        isKinematic: { default: false }, // If true, not affected by forces
        bounce: { default: 0.5 }, // Bounciness (0-1)
        friction: { default: 0.3 } // Friction coefficient (0-1)
    };

    start() {
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = new THREE.Vector3(0, 0, 0);
        this.forces = new THREE.Vector3(0, 0, 0);
        
        // Get collider if it exists
        this.collider = this.gameObject.getComponent('boxCollider') || 
                       this.gameObject.getComponent('sphereCollider');
        
        if (!this.collider) {
            console.warn('Rigidbody works best with a collider component');
        }
    }

    update(deltaTime) {
        if (this.params.isKinematic) return;
        
        // Apply gravity
        if (this.params.useGravity) {
            this.addForce(0, this.params.gravity * this.params.mass, 0);
        }
        
        // Calculate acceleration (F = ma, so a = F/m)
        this.acceleration.copy(this.forces).divideScalar(this.params.mass);
        
        // Update velocity
        this.velocity.add(this.acceleration.clone().multiplyScalar(deltaTime));
        
        // Apply drag
        this.velocity.multiplyScalar(1 - this.params.drag * deltaTime);
        
        // Update position
        const movement = this.velocity.clone().multiplyScalar(deltaTime);
        this.gameObject.object3D.position.add(movement);
        
        // Reset forces for next frame
        this.forces.set(0, 0, 0);
    }

    /**
     * Add a force to the rigidbody
     * @param {number} x - Force X component
     * @param {number} y - Force Y component
     * @param {number} z - Force Z component
     */
    addForce(x, y, z) {
        this.forces.add(new THREE.Vector3(x, y, z));
    }

    /**
     * Add an impulse (instant velocity change)
     * @param {number} x - Impulse X component
     * @param {number} y - Impulse Y component
     * @param {number} z - Impulse Z component
     */
    addImpulse(x, y, z) {
        this.velocity.add(new THREE.Vector3(x, y, z));
    }

    /**
     * Set velocity directly
     * @param {number} x - Velocity X component
     * @param {number} y - Velocity Y component
     * @param {number} z - Velocity Z component
     */
    setVelocity(x, y, z) {
        this.velocity.set(x, y, z);
    }

    /**
     * Get current velocity
     * @returns {THREE.Vector3} Current velocity
     */
    getVelocity() {
        return this.velocity.clone();
    }

    /**
     * Get current speed (magnitude of velocity)
     * @returns {number} Speed
     */
    getSpeed() {
        return this.velocity.length();
    }

    /**
     * Stop all movement
     */
    stop() {
        this.velocity.set(0, 0, 0);
        this.acceleration.set(0, 0, 0);
        this.forces.set(0, 0, 0);
    }

    /**
     * Handle collision response (call this from collision callbacks)
     * @param {GameObject} other - The other object we collided with
     */
    handleCollision(other) {
        const otherRigidbody = other.getComponent('rigidbody');
        
        if (!this.collider) return;
        
        // Simple collision response - bounce back
        const thisCenter = this.collider.getCenter();
        const otherCenter = other.getComponent('boxCollider')?.getCenter() || 
                           other.getComponent('sphereCollider')?.getCenter();
        
        if (!otherCenter) return;
        
        // Calculate collision normal
        const normal = new THREE.Vector3()
            .subVectors(thisCenter, otherCenter)
            .normalize();
        
        // Reflect velocity
        const dotProduct = this.velocity.dot(normal);
        if (dotProduct < 0) { // Only bounce if moving towards the object
            const reflection = normal.multiplyScalar(2 * dotProduct);
            this.velocity.sub(reflection);
            this.velocity.multiplyScalar(this.params.bounce);
        }
        
        // Apply friction
        this.velocity.multiplyScalar(1 - this.params.friction);
    }

    /**
     * Check if rigidbody is grounded (touching something below)
     * @returns {boolean} True if grounded
     */
    isGrounded() {
        if (!this.collider || !this.gameObject.var.story?.collisionManager) {
            return false;
        }
        
        // Cast a small ray downward
        const center = this.collider.getCenter();
        const testPoint = center.clone();
        testPoint.y -= 0.1; // Small offset below
        
        // Check if any collider contains this point
        const colliders = this.gameObject.var.story.collisionManager.colliders;
        for (const collider of colliders) {
            if (collider !== this.collider && collider.containsPoint(testPoint)) {
                return true;
            }
        }
        
        return false;
    }
}

/**
 * Example usage with collision callbacks:
 * 
 * const obj = new GameObject();
 * obj.var.story = this;
 * 
 * // Add rigidbody
 * const rb = obj.addScript(rigidbody, {
 *     mass: 2,
 *     bounce: 0.7,
 *     useGravity: true
 * });
 * 
 * // Add collider with collision response
 * obj.addScript(boxCollider, {
 *     onCollisionEnter: (other) => {
 *         rb.handleCollision(other);
 *     }
 * });
 * 
 * // Apply forces
 * rb.addForce(10, 0, 0); // Push right
 * rb.addImpulse(0, 5, 0); // Jump
 */
