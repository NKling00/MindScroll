/**
 * COLLISION DETECTION - QUICK START TEMPLATE
 * 
 * Copy and paste this code into your scene to get started with collision detection.
 * Modify as needed for your specific use case.
 */

import { Story } from '/js/engine/story.js';
import { GameObject } from '/js/engine/gameObject.js';
import { CollisionManager } from '/js/engine/collisionManager.js';
import { boxCollider } from '/js/assets/scripts/boxCollider.js';
import { sphereCollider } from '/js/assets/scripts/sphereCollider.js';
import * as THREE from 'three';

export class MyCollisionScene extends Story {
    
    setupObjects() {
        // ========================================
        // STEP 1: Initialize Collision Manager
        // ========================================
        this.collisionManager = new CollisionManager();
        
        // ========================================
        // STEP 2: Create Objects with Colliders
        // ========================================
        
        // Example: Box Collider (for rectangular objects)
        this.createBoxExample();
        
        // Example: Sphere Collider (for round objects)
        this.createSphereExample();
        
        // Example: Trigger Zone (invisible detection area)
        this.createTriggerZone();
    }
    
    // ========================================
    // STEP 3: Update Collision Manager
    // ========================================
    update() {
        super.update(); // Always call parent first
        
        // Check collisions every frame
        if (this.collisionManager) {
            this.collisionManager.update();
        }
    }
    
    // ========================================
    // EXAMPLE 1: Box Collider
    // ========================================
    createBoxExample() {
        // Create a cube
        const cube = new GameObject(new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ color: 0xff0000 })
        ));
        cube.name = 'RedCube';
        cube.setPosition(0, 0, 0);
        
        // IMPORTANT: Link to story so collider can register
        cube.var.story = this;
        
        // Add box collider
        cube.addScript(boxCollider, {
            // size: { x: 1, y: 1, z: 1 },  // Optional: custom size (or null for auto)
            showDebug: true,                 // Show collision box (green wireframe)
            onCollisionEnter: (other) => {
                console.log('Cube hit:', other.name);
                // Add your collision logic here
                // Example: Change color, play sound, trigger animation, etc.
                cube.object3D.material.color.setHex(0x00ff00);
            },
            onCollisionExit: (other) => {
                console.log('Cube separated from:', other.name);
                // Reset color
                cube.object3D.material.color.setHex(0xff0000);
            }
        });
        
        this.addToStory(cube);
    }
    
    // ========================================
    // EXAMPLE 2: Sphere Collider
    // ========================================
    createSphereExample() {
        // Create a sphere
        const sphere = new GameObject(new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 32, 32),
            new THREE.MeshStandardMaterial({ color: 0x0000ff })
        ));
        sphere.name = 'BlueSphere';
        sphere.setPosition(2, 0, 0);
        
        // Link to story
        sphere.var.story = this;
        
        // Add sphere collider
        sphere.addScript(sphereCollider, {
            radius: 0.5,                     // Sphere radius
            showDebug: true,                 // Show collision sphere
            onCollisionEnter: (other) => {
                console.log('Sphere hit:', other.name);
                sphere.object3D.material.color.setHex(0xffff00);
            },
            onCollisionExit: (other) => {
                sphere.object3D.material.color.setHex(0x0000ff);
            }
        });
        
        this.addToStory(sphere);
    }
    
    // ========================================
    // EXAMPLE 3: Trigger Zone (Invisible)
    // ========================================
    createTriggerZone() {
        // Create an empty object (no visible mesh)
        const triggerZone = new GameObject(new THREE.Object3D());
        triggerZone.name = 'TriggerZone';
        triggerZone.setPosition(0, 0, -3);
        
        // Link to story
        triggerZone.var.story = this;
        
        // Add box collider as trigger
        triggerZone.addScript(boxCollider, {
            size: { x: 3, y: 3, z: 3 },      // Custom size
            isTrigger: true,                 // Detection only (no physics)
            showDebug: true,                 // Show for debugging
            onCollisionEnter: (other) => {
                console.log(`${other.name} entered trigger zone!`);
                // Trigger events: start game, play sound, spawn enemies, etc.
            },
            onCollisionExit: (other) => {
                console.log(`${other.name} left trigger zone!`);
            }
        });
        
        this.addToStory(triggerZone);
    }
}

// ========================================
// TEMPLATE: Add to Existing GameObject
// ========================================

/**
 * Use this template to add collision to your existing GameObjects
 * (like laptop, music notes, etc.)
 */
function addCollisionToExistingObject(gameObject, story) {
    // Link to story
    gameObject.var.story = story;
    
    // Add collider
    gameObject.addScript(boxCollider, {
        // Choose your settings:
        size: null,                      // null = auto-size, or { x: 2, y: 1, z: 1 }
        offset: { x: 0, y: 0, z: 0 },   // Offset from center
        showDebug: false,                // Set to true for testing
        isTrigger: false,                // true = detection only
        layer: 'default',                // Use layers to filter collisions
        
        // Add your collision logic:
        onCollisionEnter: (other) => {
            console.log('Collision with:', other.name);
            
            // Example actions:
            // - Trigger animation: gameObject.popScript.pop()
            // - Play sound: playSound('collision.mp3')
            // - Change state: gameObject.var.isHit = true
            // - Spawn effects: spawnParticles(gameObject.position)
        },
        
        onCollisionStay: (other) => {
            // Called every frame while colliding
            // Example: continuous damage, push force, etc.
        },
        
        onCollisionExit: (other) => {
            // Called when collision ends
            // Example: reset state, stop effects, etc.
        }
    });
}

// ========================================
// TEMPLATE: Add to Your Laptop Scene
// ========================================

/**
 * Example: Integrate into your laptopPopScene
 */
/*
import { CollisionManager } from '/js/engine/collisionManager.js';
import { boxCollider } from '/js/assets/scripts/boxCollider.js';

export class laptopPopScene extends Story {
    setupObjects() {
        // Initialize collision manager
        this.collisionManager = new CollisionManager();
        
        // ... your existing laptop setup ...
        
        this.laptop = new GameObject();
        this.laptopLoad = () => {
            // ... existing setup code ...
            
            // Add collision
            this.laptop.var.story = this;
            this.laptop.addScript(boxCollider, {
                size: { x: 2, y: 1, z: 1.5 },
                showDebug: false,
                onCollisionEnter: (other) => {
                    console.log('Laptop hit:', other.name);
                    this.laptop.popScript.pop();
                }
            });
        };
        this.laptop.loadModelToStory('models/laptop01.glb', this, this.laptopLoad);
    }
    
    update() {
        super.update();
        this.collisionManager.update();
    }
}
*/

// ========================================
// CHECKLIST
// ========================================

/**
 * ✅ Import CollisionManager and collider scripts
 * ✅ Initialize: this.collisionManager = new CollisionManager()
 * ✅ Set: gameObject.var.story = this
 * ✅ Add collider: gameObject.addScript(boxCollider, {...})
 * ✅ Update: this.collisionManager.update() in update()
 * ✅ Test with showDebug: true
 * ✅ Implement collision callbacks
 */

// ========================================
// COMMON USE CASES
// ========================================

/**
 * 1. Player hitting enemies
 *    - Add boxCollider to player and enemies
 *    - In onCollisionEnter: reduce health, play hit animation
 * 
 * 2. Collecting items
 *    - Add sphereCollider to player and items
 *    - In onCollisionEnter: remove item, add to inventory
 * 
 * 3. Trigger zones
 *    - Add boxCollider with isTrigger: true
 *    - In onCollisionEnter: start cutscene, spawn enemies
 * 
 * 4. Interactive objects
 *    - Add collider to clickable objects
 *    - In onCollisionEnter: highlight, show tooltip
 * 
 * 5. Boundaries/walls
 *    - Add boxCollider to walls
 *    - In onCollisionEnter: stop movement, bounce back
 */

// ========================================
// DEBUGGING TIPS
// ========================================

/**
 * 1. Enable debug visualization:
 *    showDebug: true
 * 
 * 2. Log collision events:
 *    onCollisionEnter: (other) => {
 *        console.log('Collision:', this.gameObject.name, '←→', other.name);
 *    }
 * 
 * 3. Check collision manager:
 *    console.log('Registered colliders:', this.collisionManager.colliders.length);
 * 
 * 4. Verify story reference:
 *    console.log('Story ref:', gameObject.var.story);
 * 
 * 5. Test with simple objects first (cubes/spheres)
 *    Then add to complex models
 */

export default MyCollisionScene;
