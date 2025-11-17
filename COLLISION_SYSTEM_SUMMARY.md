# Collision Detection System - Complete Summary

## 🎯 What Was Added

I've implemented a complete collision detection system for your MindScroll project with **4 main components**:

### 1. **Box Collider** (`boxCollider.js`)
- AABB (Axis-Aligned Bounding Box) collision detection
- Best for: rectangular objects, buildings, walls, platforms
- Auto-calculates size from mesh or use custom size

### 2. **Sphere Collider** (`sphereCollider.js`)
- Circular/spherical collision detection
- Best for: balls, spheres, circular objects
- More efficient than box collider for round objects

### 3. **Collision Manager** (`collisionManager.js`)
- Central system that checks all colliders every frame
- Handles collision enter/stay/exit events
- Provides spatial queries (find objects in area, find closest, etc.)

### 4. **Bonus Components**
- **Raycaster** (`raycaster.js`) - For mouse picking and line-of-sight
- **Rigidbody** (`rigidbody.js`) - Simple physics (gravity, forces, bounce)

---

## 🚀 How to Use (3 Simple Steps)

### Step 1: Add Collision Manager to Your Scene

```javascript
import { CollisionManager } from '/js/engine/collisionManager.js';

export class MyScene extends Story {
    setupObjects() {
        // Initialize collision system
        this.collisionManager = new CollisionManager();
        
        // ... your objects ...
    }

    update() {
        super.update();
        this.collisionManager.update(); // Check collisions every frame
    }
}
```

### Step 2: Add Colliders to GameObjects

```javascript
import { boxCollider } from '/js/assets/scripts/boxCollider.js';

// Create object
const laptop = new GameObject();
laptop.loadModelToStory('models/laptop.glb', this, () => {
    laptop.var.story = this; // IMPORTANT: Link to story
    
    // Add collider
    laptop.addScript(boxCollider, {
        showDebug: true, // See collision box
        onCollisionEnter: (other) => {
            console.log('Hit:', other.name);
        }
    });
});
```

### Step 3: That's It! 🎉

The collision system will automatically:
- ✅ Detect when objects touch
- ✅ Call your callback functions
- ✅ Track collision states (enter/stay/exit)

---

## 📋 Quick Reference

### Box Collider Options

```javascript
gameObject.addScript(boxCollider, {
    size: { x: 2, y: 1, z: 1 },      // Custom size (or null for auto)
    offset: { x: 0, y: 0.5, z: 0 },   // Offset from center
    showDebug: true,                   // Show collision box
    isTrigger: false,                  // Detection only (no physics)
    layer: 'default',                  // Collision layer
    onCollisionEnter: (other) => {},   // When collision starts
    onCollisionStay: (other) => {},    // Every frame while colliding
    onCollisionExit: (other) => {}     // When collision ends
});
```

### Sphere Collider Options

```javascript
gameObject.addScript(sphereCollider, {
    radius: 1,                         // Sphere radius
    offset: { x: 0, y: 0, z: 0 },     // Offset from center
    showDebug: true,                   // Show collision sphere
    // ... same other options as box collider
});
```

---

## 🎮 Real-World Examples

### Example 1: Laptop Collision in Your Scene

```javascript
// In laptopPopScene.js
import { boxCollider } from '/js/assets/scripts/boxCollider.js';
import { CollisionManager } from '/js/engine/collisionManager.js';

export class laptopPopScene extends Story {
    setupObjects() {
        this.collisionManager = new CollisionManager();
        
        this.laptop = new GameObject();
        this.laptopLoad = () => {
            this.laptop.var.story = this;
            
            // Add collision
            this.laptop.addScript(boxCollider, {
                size: { x: 2, y: 1, z: 1.5 },
                onCollisionEnter: (other) => {
                    console.log('Laptop hit:', other.name);
                    this.laptop.popScript.pop(); // Trigger animation
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
```

### Example 2: Floating Objects Collision

```javascript
spawnFloatingObject(model, details) {
    const flObj = new GameObject();
    
    const flObjLoad = () => {
        flObj.var.story = this;
        
        // Add sphere collider for floating objects
        flObj.addScript(sphereCollider, {
            radius: 0.3,
            showDebug: false,
            onCollisionEnter: (other) => {
                flObj.popScript.pop(); // Pop animation on hit
            }
        });
    };
    
    flObj.loadModelToStory(model, this, flObjLoad);
    return flObj;
}
```

### Example 3: Trigger Zone (Invisible Area)

```javascript
// Create invisible trigger zone
const triggerZone = new GameObject(new THREE.Object3D());
triggerZone.name = 'StartZone';
triggerZone.var.story = this;

triggerZone.addScript(boxCollider, {
    size: { x: 5, y: 5, z: 5 },
    isTrigger: true,
    showDebug: true,
    onCollisionEnter: (other) => {
        console.log('Player entered start zone!');
        // Start game, play sound, etc.
    }
});

this.addToStory(triggerZone);
```

### Example 4: Mouse Picking

```javascript
import { setupMousePicking } from '/js/assets/scripts/raycaster.js';

// In your Story's setupObjects()
setupMousePicking(this, this.camera, (intersection) => {
    console.log('Clicked on:', intersection.object.name);
    console.log('Position:', intersection.point);
    
    // Find the GameObject
    const clickedObject = this.gameObjects.find(
        obj => obj.object3D === intersection.object
    );
    
    if (clickedObject && clickedObject.popScript) {
        clickedObject.popScript.pop();
    }
});
```

### Example 5: Simple Physics

```javascript
import { rigidbody } from '/js/assets/scripts/rigidbody.js';

const ball = new GameObject();
ball.var.story = this;

// Add physics
const rb = ball.addScript(rigidbody, {
    mass: 1,
    bounce: 0.8,
    useGravity: true
});

// Add collider with physics response
ball.addScript(sphereCollider, {
    radius: 0.5,
    onCollisionEnter: (other) => {
        rb.handleCollision(other); // Bounce off
    }
});

// Apply forces
rb.addImpulse(0, 10, 0); // Jump up
rb.addForce(5, 0, 0);    // Push right
```

---

## 🔧 Advanced Features

### Find Objects in Area

```javascript
const searchBox = new THREE.Box3(
    new THREE.Vector3(-5, -5, -5),
    new THREE.Vector3(5, 5, 5)
);

const nearby = this.collisionManager.queryArea(searchBox);
console.log('Found', nearby.length, 'objects');
```

### Find Closest Object

```javascript
const playerPos = player.object3D.position;
const closest = this.collisionManager.findClosest(playerPos, 10);

if (closest) {
    console.log('Closest:', closest.collider.gameObject.name);
    console.log('Distance:', closest.distance);
}
```

### Collision Layers

```javascript
// Player only collides with enemies
player.addScript(boxCollider, { layer: 'player' });
enemy.addScript(boxCollider, { layer: 'enemy' });

// Pickups collide with everything
pickup.addScript(boxCollider, { layer: 'default' });
```

---

## 📁 Files Created

```
js/
├── engine/
│   └── collisionManager.js          ← Main collision system
├── assets/
│   └── scripts/
│       ├── boxCollider.js           ← Box collision
│       ├── sphereCollider.js        ← Sphere collision
│       ├── raycaster.js             ← Mouse picking & raycasting
│       └── rigidbody.js             ← Simple physics
└── examples/
    └── collisionExample.js          ← Full examples

COLLISION_DETECTION_GUIDE.md         ← Detailed guide
COLLISION_SYSTEM_SUMMARY.md          ← This file
```

---

## ✅ Integration Checklist

To add collision detection to your existing scenes:

- [ ] Import `CollisionManager` in your Story class
- [ ] Initialize `this.collisionManager = new CollisionManager()` in `setupObjects()`
- [ ] Call `this.collisionManager.update()` in your `update()` method
- [ ] Import collider scripts (`boxCollider`, `sphereCollider`)
- [ ] Set `gameObject.var.story = this` before adding colliders
- [ ] Add colliders to GameObjects with `addScript()`
- [ ] Test with `showDebug: true` to visualize collision bounds

---

## 🎯 When to Use Each Type

| Use Case | Recommended Collider |
|----------|---------------------|
| Rectangular objects (laptop, boxes, walls) | `boxCollider` |
| Circular objects (balls, spheres) | `sphereCollider` |
| Invisible trigger zones | `boxCollider` with `isTrigger: true` |
| Mouse clicking on objects | `raycaster` + `setupMousePicking()` |
| Objects with gravity/physics | `rigidbody` + collider |
| Line-of-sight checks | `raycaster` |

---

## 🐛 Troubleshooting

**Collisions not working?**
1. Check `collisionManager.update()` is called in `update()`
2. Verify `gameObject.var.story = this` is set
3. Enable `showDebug: true` to see collision bounds

**Performance issues?**
1. Use layers to filter unnecessary checks
2. Use sphere colliders for round objects (faster)
3. Set `isTrigger: true` for detection-only areas

**Callbacks not firing?**
1. Ensure both objects have colliders
2. Check callback syntax: `onCollisionEnter: (other) => { ... }`
3. Verify collision manager is initialized

---

## 🚀 Next Steps

1. **Start Simple**: Add collision to one object with `showDebug: true`
2. **Test**: Move objects around and watch collision detection work
3. **Add Callbacks**: Implement game logic in collision callbacks
4. **Optimize**: Use layers and triggers for better performance
5. **Expand**: Add physics with `rigidbody` for dynamic objects

---

## 💡 Tips

- Always enable debug visualization when testing: `showDebug: true`
- Use `isTrigger: true` for zones that shouldn't block movement
- Sphere colliders are faster than box colliders for round objects
- Set collision layers to avoid unnecessary checks
- The collision system integrates seamlessly with your existing script architecture

---

**Need help?** Check `COLLISION_DETECTION_GUIDE.md` for detailed documentation or `js/examples/collisionExample.js` for complete working examples.

Happy coding! 🎮✨
