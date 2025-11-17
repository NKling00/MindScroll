/**
 * COLLISION DETECTION USAGE EXAMPLES
 * 
 * This file demonstrates how to use the collision detection system
 * in your MindScroll project.
 */

import { Story } from '/js/engine/story.js';
import { GameObject } from '/js/engine/gameObject.js';
import { CollisionManager } from '/js/engine/collisionManager.js';
import { boxCollider } from '/js/assets/scripts/boxCollider.js';
import { sphereCollider } from '/js/assets/scripts/sphereCollider.js';
import * as THREE from 'three';

export class CollisionExampleScene extends Story {
    
    setupObjects() {
        // 1. Initialize collision manager in your scene
        this.collisionManager = new CollisionManager();
        
        // Store reference so colliders can access it
        this.gameObjects.forEach(obj => {
            obj.var.story = this;
        });

        // Example 1: Basic Box Collision
        this.createBoxCollisionExample();
        
        // Example 2: Sphere Collision
        this.createSphereCollisionExample();
        
        // Example 3: Collision with Callbacks
        this.createCallbackExample();
        
        // Example 4: Trigger Zone (no physics, just detection)
        this.createTriggerZoneExample();
    }

    // Override update to include collision detection
    update() {
        super.update(); // Call parent update first
        
        // Update collision detection every frame
        if (this.collisionManager) {
            this.collisionManager.update();
        }
    }

    // EXAMPLE 1: Basic Box Collision
    createBoxCollisionExample() {
        // Create two objects with box colliders
        const cube1 = new GameObject(new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ color: 0xff0000 })
        ));
        cube1.setPosition(-2, 0, 0);
        cube1.var.story = this;
        
        // Add box collider with auto-size
        cube1.addScript(boxCollider, {
            showDebug: true, // Show collision box
            onCollisionEnter: (other) => {
                console.log('Cube1 collided with:', other.name);
                // Change color on collision
                cube1.object3D.material.color.setHex(0x00ff00);
            },
            onCollisionExit: (other) => {
                // Reset color
                cube1.object3D.material.color.setHex(0xff0000);
            }
        });
        
        this.addToStory(cube1);

        const cube2 = new GameObject(new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ color: 0x0000ff })
        ));
        cube2.setPosition(2, 0, 0);
        cube2.var.story = this;
        cube2.addScript(boxCollider, { showDebug: true });
        
        this.addToStory(cube2);
    }

    // EXAMPLE 2: Sphere Collision
    createSphereCollisionExample() {
        const sphere = new GameObject(new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 32, 32),
            new THREE.MeshStandardMaterial({ color: 0xffff00 })
        ));
        sphere.setPosition(0, 2, 0);
        sphere.var.story = this;
        
        // Add sphere collider
        sphere.addScript(sphereCollider, {
            radius: 0.5,
            showDebug: true,
            onCollisionEnter: (other) => {
                console.log('Sphere hit:', other.name);
            }
        });
        
        this.addToStory(sphere);
    }

    // EXAMPLE 3: Using Collision Callbacks
    createCallbackExample() {
        const player = new GameObject(new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 1, 0.5),
            new THREE.MeshStandardMaterial({ color: 0x00ffff })
        ));
        player.name = 'Player';
        player.setPosition(0, 0, 2);
        player.var.story = this;
        player.var.health = 100;
        
        player.addScript(boxCollider, {
            showDebug: true,
            onCollisionEnter: (other) => {
                if (other.name === 'Enemy') {
                    player.var.health -= 10;
                    console.log('Player hit! Health:', player.var.health);
                }
            },
            onCollisionStay: (other) => {
                // Continuous damage while touching
                if (other.name === 'Enemy') {
                    player.var.health -= 0.1;
                }
            }
        });
        
        this.addToStory(player);
    }

    // EXAMPLE 4: Trigger Zone (Detection Only)
    createTriggerZoneExample() {
        // Create an invisible trigger zone
        const triggerZone = new GameObject(new THREE.Object3D());
        triggerZone.name = 'TriggerZone';
        triggerZone.setPosition(0, 0, -2);
        triggerZone.var.story = this;
        
        triggerZone.addScript(boxCollider, {
            size: { x: 3, y: 3, z: 3 }, // Custom size
            isTrigger: true,
            showDebug: true,
            onCollisionEnter: (other) => {
                console.log(`${other.name} entered trigger zone!`);
                // Trigger an event, play sound, etc.
            },
            onCollisionExit: (other) => {
                console.log(`${other.name} left trigger zone!`);
            }
        });
        
        this.addToStory(triggerZone);
    }

    // EXAMPLE 5: Query Colliders in Area
    checkAreaForColliders() {
        const searchBox = new THREE.Box3(
            new THREE.Vector3(-1, -1, -1),
            new THREE.Vector3(1, 1, 1)
        );
        
        const collidersInArea = this.collisionManager.queryArea(searchBox);
        console.log('Found colliders:', collidersInArea.length);
    }

    // EXAMPLE 6: Find Closest Collider
    findClosestEnemy(playerPosition) {
        const closest = this.collisionManager.findClosest(playerPosition, 10);
        if (closest) {
            console.log('Closest collider:', closest.collider.gameObject.name);
            console.log('Distance:', closest.distance);
        }
    }
}

/**
 * USAGE IN YOUR EXISTING SCENES:
 * 
 * 1. Add to Story class (in story.js):
 *    - Import CollisionManager
 *    - Initialize in constructor: this.collisionManager = new CollisionManager();
 *    - Call in update: this.collisionManager.update();
 * 
 * 2. Add to GameObjects:
 *    - Import boxCollider or sphereCollider
 *    - Add script: gameObject.addScript(boxCollider, { options });
 *    - Set gameObject.var.story = this; (so collider can register)
 * 
 * 3. For your laptop scene example:
 */

// Example: Add collision to laptop
function addCollisionToLaptop(laptop, story) {
    laptop.var.story = story;
    
    laptop.addScript(boxCollider, {
        size: { x: 2, y: 1, z: 1.5 },
        showDebug: false,
        onCollisionEnter: (other) => {
            console.log('Laptop collided with:', other.name);
            // Trigger laptop pop animation
            if (laptop.popScript) {
                laptop.popScript.pop();
            }
        }
    });
}

// Example: Add collision to floating objects
function addCollisionToFloatingObject(floatingObj, story) {
    floatingObj.var.story = story;
    
    floatingObj.addScript(sphereCollider, {
        radius: 0.3,
        showDebug: false,
        layer: 'floatingObjects', // Use layers to filter collisions
        onCollisionEnter: (other) => {
            console.log('Floating object hit:', other.name);
        }
    });
}
