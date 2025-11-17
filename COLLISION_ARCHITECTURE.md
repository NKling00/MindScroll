# Collision Detection System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Your Story                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │            CollisionManager                            │ │
│  │  • Tracks all colliders                                │ │
│  │  • Checks collisions every frame                       │ │
│  │  • Fires collision events                              │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│         ┌─────────────────┼─────────────────┐               │
│         │                 │                 │               │
│    ┌────▼────┐       ┌────▼────┐      ┌────▼────┐         │
│    │GameObject│       │GameObject│      │GameObject│         │
│    │  (Laptop)│       │ (Music  │      │ (Brain) │         │
│    │          │       │  Note)  │      │         │         │
│    │ ┌──────┐ │       │ ┌──────┐│      │ ┌──────┐│         │
│    │ │ Box  │ │       │ │Sphere││      │ │Sphere││         │
│    │ │Collid││       │ │Collid││      │ │Collid││         │
│    │ └──────┘ │       │ └──────┘│      │ └──────┘│         │
│    └──────────┘       └─────────┘      └─────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
GameObject (Your laptop, music note, etc.)
    │
    ├─── object3D (THREE.Object3D)
    │       └─── Mesh, position, rotation, etc.
    │
    └─── scripts[] (Array of components)
            ├─── boxCollider or sphereCollider
            │       ├─── box/sphere (THREE.Box3 or THREE.Sphere)
            │       ├─── Collision callbacks
            │       └─── Auto-registers with CollisionManager
            │
            ├─── rigidbody (optional)
            │       ├─── velocity, forces
            │       └─── Physics simulation
            │
            └─── Your other scripts (rotate, scalePop, etc.)
```

## Data Flow

### 1. Initialization Phase

```
Story.setupObjects()
    │
    ├─── Create CollisionManager
    │       this.collisionManager = new CollisionManager()
    │
    └─── Create GameObjects
            │
            ├─── Set story reference
            │       gameObject.var.story = this
            │
            └─── Add collider script
                    gameObject.addScript(boxCollider, {...})
                        │
                        └─── Collider registers with CollisionManager
                                collisionManager.registerCollider(this)
```

### 2. Update Loop (Every Frame)

```
Story.update()
    │
    ├─── super.update()
    │       └─── Updates all GameObjects
    │               └─── Updates all scripts (including colliders)
    │                       └─── Collider updates its position
    │
    └─── collisionManager.update()
            │
            ├─── Check all collider pairs
            │       for each collider A
            │           for each collider B
            │               if A.intersects(B)
            │                   └─── Handle collision
            │
            └─── Fire collision events
                    ├─── onCollisionEnter (first frame of collision)
                    ├─── onCollisionStay (every frame while colliding)
                    └─── onCollisionExit (when collision ends)
```

### 3. Collision Detection Flow

```
Frame N:
    Object A position: (0, 0, 0)
    Object B position: (5, 0, 0)
    Status: Not colliding

Frame N+1:
    Object A position: (2, 0, 0)
    Object B position: (3, 0, 0)
    Status: COLLISION DETECTED!
    │
    ├─── CollisionManager detects intersection
    │       A.box.intersectsBox(B.box) → true
    │
    ├─── Check if new collision
    │       Not in collisionPairs → NEW!
    │
    └─── Fire callbacks
            ├─── A.handleCollisionEnter(B)
            │       └─── A.params.onCollisionEnter(B.gameObject)
            │               └─── YOUR CODE RUNS HERE!
            │
            └─── B.handleCollisionEnter(A)
                    └─── B.params.onCollisionEnter(A.gameObject)

Frame N+2:
    Still colliding
    │
    └─── Fire onCollisionStay callbacks

Frame N+3:
    No longer colliding
    │
    └─── Fire onCollisionExit callbacks
```

## Integration with Your Existing System

### Your Current Architecture

```
Story
    ├─── setupObjects()
    ├─── setupAnimations()
    ├─── update()
    └─── gameObjects[]
            └─── GameObject
                    ├─── object3D
                    └─── scripts[]
                            ├─── HoverScript
                            ├─── rotate
                            ├─── scalePop
                            └─── ... your scripts
```

### After Adding Collision System

```
Story
    ├─── collisionManager ← NEW!
    ├─── setupObjects()
    │       └─── Initialize collisionManager
    ├─── setupAnimations()
    ├─── update()
    │       ├─── super.update()
    │       └─── collisionManager.update() ← NEW!
    └─── gameObjects[]
            └─── GameObject
                    ├─── var.story ← NEW! (reference to Story)
                    ├─── object3D
                    └─── scripts[]
                            ├─── HoverScript
                            ├─── rotate
                            ├─── scalePop
                            ├─── boxCollider ← NEW!
                            ├─── sphereCollider ← NEW!
                            └─── rigidbody ← NEW! (optional)
```

## Example: Laptop Collision Flow

```
1. Setup (in laptopPopScene.setupObjects())
   ┌──────────────────────────────────────────┐
   │ this.collisionManager = new              │
   │     CollisionManager()                   │
   └──────────────────────────────────────────┘
                    │
                    ▼
   ┌──────────────────────────────────────────┐
   │ this.laptop = new GameObject()           │
   │ this.laptop.var.story = this             │
   │ this.laptop.addScript(boxCollider, {     │
   │     onCollisionEnter: (other) => {       │
   │         this.laptop.popScript.pop()      │
   │     }                                    │
   │ })                                       │
   └──────────────────────────────────────────┘
                    │
                    ▼
   ┌──────────────────────────────────────────┐
   │ Collider auto-registers with             │
   │ CollisionManager                         │
   └──────────────────────────────────────────┘

2. Every Frame (in update())
   ┌──────────────────────────────────────────┐
   │ Story.update()                           │
   └──────────────────────────────────────────┘
                    │
                    ▼
   ┌──────────────────────────────────────────┐
   │ super.update()                           │
   │   └─ laptop.update()                     │
   │       └─ boxCollider.update()            │
   │           └─ Update collision box pos    │
   └──────────────────────────────────────────┘
                    │
                    ▼
   ┌──────────────────────────────────────────┐
   │ collisionManager.update()                │
   │   └─ Check all collisions                │
   └──────────────────────────────────────────┘
                    │
                    ▼
   ┌──────────────────────────────────────────┐
   │ If collision detected:                   │
   │   laptop.popScript.pop() ← YOUR CODE!    │
   └──────────────────────────────────────────┘
```

## Collision Detection Methods

### Box vs Box

```
┌─────────┐              ┌─────────┐
│    A    │              │    B    │
│         │  intersects? │         │
│    ●────┼──────────────┼───●     │
└────┼────┘              └───┼─────┘
     │                       │
   min/max              min/max
     │                       │
     └───── Check overlap ───┘
            on all axes
```

### Sphere vs Sphere

```
    ●─────────●
   /  Sphere  \         ●─────────●
  /     A      \       /  Sphere  \
 ●              ●     ●      B     ●
  \            /       \          /
   \          /         \        /
    ●────────●           ●──────●
        │                   │
        └─── distance < ────┘
             r1 + r2?
```

### Box vs Sphere

```
┌──────────────┐
│     Box      │
│      A       │
│              │     ●─────────●
│              │    /  Sphere  \
│              │   ●      B     ●
└──────────────┘    \          /
                     ●────────●
                          │
                    Check if sphere
                    intersects box
```

## Performance Considerations

### Collision Checks Per Frame

```
With N objects:
    Checks = N × (N-1) / 2

Examples:
    10 objects  = 45 checks
    20 objects  = 190 checks
    50 objects  = 1,225 checks
    100 objects = 4,950 checks
```

### Optimization Strategies

```
1. Use Layers
   ┌─────────────┐     ┌─────────────┐
   │   Player    │     │   Enemy     │
   │ layer: A    │     │ layer: B    │
   └─────────────┘     └─────────────┘
         │                   │
         └─── Only check ────┘
              if layers match

2. Use Sphere Colliders
   Box:    6 face checks
   Sphere: 1 distance check ← FASTER!

3. Use Triggers
   isTrigger: true
   └─── Detection only, skip physics

4. Spatial Partitioning (future enhancement)
   Divide world into grid
   Only check objects in same cell
```

## Memory Layout

```
CollisionManager
    ├─── colliders: Array
    │       ├─── [0] laptop.boxCollider
    │       ├─── [1] musicNote.sphereCollider
    │       └─── [2] brain.sphereCollider
    │
    └─── collisionPairs: Map
            ├─── "uuid1-uuid2" → { a: collider1, b: collider2 }
            ├─── "uuid3-uuid4" → { a: collider3, b: collider4 }
            └─── ...

Each Collider
    ├─── gameObject: Reference to GameObject
    ├─── box/sphere: THREE.Box3 or THREE.Sphere
    ├─── params: { callbacks, settings }
    └─── collidingWith: Set of current collisions
```

## Callback Execution Order

```
Frame 1: Objects start colliding
    1. collisionManager.update()
    2. Detect intersection
    3. Create collision pair
    4. colliderA.handleCollisionEnter(colliderB)
        └─── params.onCollisionEnter(gameObjectB)
    5. colliderB.handleCollisionEnter(colliderA)
        └─── params.onCollisionEnter(gameObjectA)

Frame 2-N: Objects still colliding
    1. collisionManager.update()
    2. Detect intersection (still true)
    3. Pair already exists
    4. colliderA.handleCollisionStay(colliderB)
    5. colliderB.handleCollisionStay(colliderA)

Frame N+1: Objects separate
    1. collisionManager.update()
    2. No intersection detected
    3. Remove collision pair
    4. colliderA.handleCollisionExit(colliderB)
    5. colliderB.handleCollisionExit(colliderA)
```

## Thread Safety

```
Single-threaded (JavaScript)
    │
    ├─── All collision checks happen in main thread
    ├─── No race conditions
    └─── Callbacks execute immediately

Update Order:
    1. GameObject updates (positions change)
    2. Collider updates (collision bounds update)
    3. CollisionManager checks (detect collisions)
    4. Callbacks fire (your code runs)
```

## Summary

The collision detection system:
- ✅ Integrates seamlessly with your existing GameObject/Script architecture
- ✅ Automatically tracks all colliders
- ✅ Checks collisions every frame
- ✅ Fires callbacks at the right time
- ✅ Minimal performance impact
- ✅ Easy to use and extend

Just add `CollisionManager` to your Story, attach collider scripts to GameObjects, and handle collisions in callbacks!
