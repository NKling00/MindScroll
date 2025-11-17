# Collision Detection System Guide

## Overview

This collision detection system integrates seamlessly with your existing MindScroll game engine architecture. It uses a component-based approach with collider scripts that attach to GameObjects.

## Features

- ✅ **Box Collider** - AABB (Axis-Aligned Bounding Box) collision detection
- ✅ **Sphere Collider** - Circular collision detection for spherical objects
- ✅ **Collision Callbacks** - onCollisionEnter, onCollisionStay, onCollisionExit
- ✅ **Trigger Zones** - Detection-only areas without physics
- ✅ **Layer Filtering** - Organize colliders into layers
- ✅ **Debug Visualization** - See collision bounds in real-time
- ✅ **Spatial Queries** - Find colliders in areas or by distance

---

## Quick Start

### 1. Setup Collision Manager in Your Story

```javascript
import { Story } from '/js/engine/story.js';
import { CollisionManager } from '/js/engine/collisionManager.js';

export class MyScene extends Story {
    setupObjects() {
        // Initialize collision manager
        this.collisionManager = new CollisionManager();
        
        // ... create your objects
    }

    update() {
        super.update(); // Call parent update
        
        // Update collision detection every frame
        if (this.collisionManager) {
            this.collisionManager.update();
        }
    }
}
```

### 2. Add Colliders to GameObjects

```javascript
import { boxCollider } from '/js/assets/scripts/boxCollider.js';
import { sphereCollider } from '/js/assets/scripts/sphereCollider.js';

// Create a GameObject
const myObject = new GameObject();
myObject.loadModelToStory('models/myModel.glb', this, () => {
    // IMPORTANT: Set story reference so collider can register
    myObject.var.story = this;
    
    // Add box collider with auto-size
    myObject.addScript(boxCollider, {
        showDebug: true,
        onCollisionEnter: (other) => {
            console.log('Collision with:', other.name);
        }
    });
});
```

---

## Box Collider

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `size` | `{x, y, z}` | `null` | Custom size or `null` for auto-calculate |
| `offset` | `{x, y, z}` | `{0,0,0}` | Offset from object center |
| `isTrigger` | `boolean` | `false` | Detection only (no physics) |
| `showDebug` | `boolean` | `false` | Show collision box visualization |
| `layer` | `string` | `'default'` | Collision layer name |
| `onCollisionEnter` | `function` | `null` | Called when collision starts |
| `onCollisionStay` | `function` | `null` | Called every frame while colliding |
| `onCollisionExit` | `function` | `null` | Called when collision ends |

### Example Usage

```javascript
// Auto-sized box collider
laptop.var.story = this;
laptop.addScript(boxCollider, {
    showDebug: true,
    onCollisionEnter: (other) => {
        console.log('Laptop hit:', other.name);
        laptop.popScript.pop(); // Trigger animation
    }
});

// Custom-sized box collider
triggerZone.var.story = this;
triggerZone.addScript(boxCollider, {
    size: { x: 5, y: 3, z: 5 },
    offset: { x: 0, y: 1, z: 0 },
    isTrigger: true,
    onCollisionEnter: (other) => {
        console.log('Player entered zone!');
    }
});
```

---

## Sphere Collider

### Parameters

Same as Box Collider, except:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `radius` | `number` | `1` | Radius of collision sphere |

### Example Usage

```javascript
// Sphere collider for circular objects
musicNote.var.story = this;
musicNote.addScript(sphereCollider, {
    radius: 0.5,
    showDebug: true,
    onCollisionEnter: (other) => {
        console.log('Music note hit!');
    }
});
```

---

## Integration with Your Laptop Scene

Here's how to add collision detection to your existing `laptopPopScene`:

```javascript
import { boxCollider } from '/js/assets/scripts/boxCollider.js';
import { sphereCollider } from '/js/assets/scripts/sphereCollider.js';
import { CollisionManager } from '/js/engine/collisionManager.js';

export class laptopPopScene extends Story {
    setupObjects() {
        // Initialize collision manager
        this.collisionManager = new CollisionManager();
        
        // ... existing laptop setup code ...
        
        this.laptop = new GameObject(); 
        this.laptopLoad = () => {
            // ... existing setup ...
            
            // Add collision to laptop
            this.laptop.var.story = this;
            this.laptop.addScript(boxCollider, {
                size: { x: 2, y: 1, z: 1.5 },
                showDebug: false,
                onCollisionEnter: (other) => {
                    console.log('Laptop collided with:', other.name);
                    this.laptop.popScript.pop();
                }
            });
        };
        this.laptop.loadModelToStory('models/laptop01.glb', this, this.laptopLoad);
    }
    
    spawnFloatingObject(model, details) {
        const flObj = new GameObject();
        // ... existing setup ...
        
        const flObjLoad = () => {
            // ... existing setup ...
            
            // Add collision to floating object
            flObj.var.story = this;
            flObj.addScript(sphereCollider, {
                radius: 0.3,
                layer: 'floatingObjects',
                onCollisionEnter: (other) => {
                    console.log('Floating object hit:', other.name);
                    flObj.popScript.pop();
                }
            });
        };
        
        // ... rest of code ...
    }
    
    update() {
        super.update();
        
        // Update collision detection
        if (this.collisionManager) {
            this.collisionManager.update();
        }
    }
}
```

---

## Advanced Features

### 1. Collision Layers

Use layers to filter which objects can collide:

```javascript
// Player collider
player.addScript(boxCollider, {
    layer: 'player'
});

// Enemy collider
enemy.addScript(boxCollider, {
    layer: 'enemy'
});

// Pickup collider (collides with everything)
pickup.addScript(boxCollider, {
    layer: 'default' // Default layer collides with all
});
```

### 2. Query Colliders in Area

```javascript
// Find all colliders in a specific area
const searchBox = new THREE.Box3(
    new THREE.Vector3(-5, -5, -5),
    new THREE.Vector3(5, 5, 5)
);

const collidersInArea = this.collisionManager.queryArea(searchBox);
console.log('Found', collidersInArea.length, 'colliders');
```

### 3. Find Closest Collider

```javascript
// Find closest collider to a position
const playerPos = player.object3D.position;
const closest = this.collisionManager.findClosest(playerPos, 10); // Within 10 units

if (closest) {
    console.log('Closest:', closest.collider.gameObject.name);
    console.log('Distance:', closest.distance);
}
```

### 4. Manual Collision Checks

```javascript
// Get collider component
const collider = gameObject.getComponent('boxCollider');

// Check if point is inside
const point = new THREE.Vector3(0, 0, 0);
if (collider.containsPoint(point)) {
    console.log('Point is inside collider!');
}

// Get collider info
const center = collider.getCenter();
const size = collider.getSize();
```

---

## Performance Tips

1. **Use Sphere Colliders for circular objects** - They're faster than box colliders
2. **Use Layers** - Reduce unnecessary collision checks
3. **Disable colliders when not needed** - Set `gameObject.enabled = false`
4. **Use Trigger Zones** - Set `isTrigger: true` for detection-only areas
5. **Limit collision checks** - Only enable collision manager when needed

---

## Troubleshooting

### Collisions not detecting?

1. ✅ Check that `collisionManager.update()` is called in your Story's `update()` method
2. ✅ Verify `gameObject.var.story = this` is set before adding collider
3. ✅ Ensure collision manager is initialized: `this.collisionManager = new CollisionManager()`
4. ✅ Enable debug visualization: `showDebug: true`

### Debug helper not showing?

- Box3Helper needs to be added to the scene. Check that `createDebugHelper()` is being called.

### Callbacks not firing?

- Make sure callbacks are functions: `onCollisionEnter: (other) => { ... }`
- Check that both objects have colliders attached

---

## Complete Example

See `/js/examples/collisionExample.js` for a complete working example with:
- Basic box collision
- Sphere collision
- Collision callbacks
- Trigger zones
- Spatial queries

---

## Files Created

- `/js/assets/scripts/boxCollider.js` - Box collision component
- `/js/assets/scripts/sphereCollider.js` - Sphere collision component
- `/js/engine/collisionManager.js` - Collision detection manager
- `/js/examples/collisionExample.js` - Usage examples

---

## Next Steps

1. Add `CollisionManager` to your Story classes
2. Add colliders to your GameObjects
3. Implement collision callbacks for your game logic
4. Test with debug visualization enabled
5. Optimize with layers and triggers

Happy coding! 🎮
