/**
 * @description Collision Manager - Handles collision detection between all registered colliders
 * Add this to your Story class to enable collision detection
 */
export class CollisionManager {
    constructor() {
        this.colliders = [];
        this.collisionPairs = new Map(); // Track collision states
    }

    /**
     * Register a collider for collision detection
     * @param {boxCollider} collider - The collider component to register
     */
    registerCollider(collider) {
        if (!this.colliders.includes(collider)) {
            this.colliders.push(collider);
        }
    }

    /**
     * Unregister a collider
     * @param {boxCollider} collider - The collider to remove
     */
    unregisterCollider(collider) {
        const index = this.colliders.indexOf(collider);
        if (index > -1) {
            this.colliders.splice(index, 1);
        }

        // Clean up collision pairs
        for (const [key, value] of this.collisionPairs.entries()) {
            if (value.a === collider || value.b === collider) {
                this.collisionPairs.delete(key);
            }
        }
    }

    /**
     * Check collisions between all registered colliders
     * Call this in your Story's update loop
     */
    update() {
        const currentCollisions = new Set();

        // Check all pairs
        for (let i = 0; i < this.colliders.length; i++) {
            for (let j = i + 1; j < this.colliders.length; j++) {
                const colliderA = this.colliders[i];
                const colliderB = this.colliders[j];

                // Skip if layers don't match (optional layer filtering)
                if (colliderA.params.layer !== colliderB.params.layer && 
                    colliderA.params.layer !== 'default' && 
                    colliderB.params.layer !== 'default') {
                    continue;
                }

                // Check intersection
                if (colliderA.intersects(colliderB)) {
                    const pairKey = this.getPairKey(colliderA, colliderB);
                    currentCollisions.add(pairKey);

                    // Check if this is a new collision
                    if (!this.collisionPairs.has(pairKey)) {
                        // Collision Enter
                        this.collisionPairs.set(pairKey, { a: colliderA, b: colliderB });
                        colliderA.handleCollisionEnter(colliderB);
                        colliderB.handleCollisionEnter(colliderA);
                    } else {
                        // Collision Stay
                        colliderA.handleCollisionStay(colliderB);
                        colliderB.handleCollisionStay(colliderA);
                    }
                }
            }
        }

        // Check for collision exits
        for (const [pairKey, pair] of this.collisionPairs.entries()) {
            if (!currentCollisions.has(pairKey)) {
                // Collision Exit
                pair.a.handleCollisionExit(pair.b);
                pair.b.handleCollisionExit(pair.a);
                this.collisionPairs.delete(pairKey);
            }
        }
    }

    /**
     * Generate unique key for collision pair
     */
    getPairKey(colliderA, colliderB) {
        const idA = colliderA.gameObject.object3D.uuid;
        const idB = colliderB.gameObject.object3D.uuid;
        return idA < idB ? `${idA}-${idB}` : `${idB}-${idA}`;
    }

    /**
     * Query all colliders in a specific area
     * @param {THREE.Box3} box - The bounding box to check
     * @returns {Array} Array of colliders in the area
     */
    queryArea(box) {
        return this.colliders.filter(collider => box.intersectsBox(collider.box));
    }

    /**
     * Find the closest collider to a point
     * @param {THREE.Vector3} point - The point to check from
     * @param {number} maxDistance - Maximum distance to check (optional)
     * @returns {Object|null} {collider, distance} or null
     */
    findClosest(point, maxDistance = Infinity) {
        let closest = null;
        let minDistance = maxDistance;

        for (const collider of this.colliders) {
            const center = collider.getCenter();
            const distance = point.distanceTo(center);
            
            if (distance < minDistance) {
                minDistance = distance;
                closest = { collider, distance };
            }
        }

        return closest;
    }

    /**
     * Clear all registered colliders
     */
    clear() {
        this.colliders = [];
        this.collisionPairs.clear();
    }
}
