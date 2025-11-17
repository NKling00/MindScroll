
export class moveTo {
  static parameters = {
    targetPosition: { type: 'vector3', default: { x: 0, y: 0, z: 0 } },
    targetScale: { type: 'vector3', default: { x: 1, y: 1, z: 1 } },
    targetRotation: { type: 'vector3', default: { x: 0, y: 0, z: 0 } }, // in radians
    duration: { type: 'number', default: 1.0 }, // duration in seconds
    ease: { type: 'string', default: 'power3.out' }, // GSAP easing function
    delay: { type: 'number', default: 0 }, // delay before animation starts
    autoStart: { type: 'boolean', default: false }, // automatically start on creation
    onComplete: { type: 'function', default: null } // callback when animation completes
  };

  constructor(gameObject, params) {
    this.gameObject = gameObject;
    
    this.targetPosition = {
      x: params.targetPosition.x,
      y: params.targetPosition.y,
      z: params.targetPosition.z
    };
    
    this.targetScale = {
      x: params.targetScale.x,
      y: params.targetScale.y,
      z: params.targetScale.z
    };
    
    this.targetRotation = {
      x: params.targetRotation.x,
      y: params.targetRotation.y,
      z: params.targetRotation.z
    };
    
    this.duration = params.duration;
    this.ease = params.ease;
    this.delay = params.delay;
    this.autoStart = params.autoStart;
    this.onComplete = params.onComplete;
    
    this.isAnimating = false;
    this.timeline = null;
    
    if (this.autoStart) {
      this.move();
    }
  }

  /**
   * Start the animation to move to target position, scale, and rotation
   * @param {Object} options - Optional override parameters
   */
  move(options = {}) {
    if (this.isAnimating) {
      console.warn('moveTo: Animation already in progress');
      return;
    }
    
    // Allow overriding parameters on the fly
    const targetPos = options.targetPosition || this.targetPosition;
    const targetScale = options.targetScale || this.targetScale;
    const targetRot = options.targetRotation || this.targetRotation;
    const duration = options.duration !== undefined ? options.duration : this.duration;
    const ease = options.ease || this.ease;
    const delay = options.delay !== undefined ? options.delay : this.delay;
    const onComplete = options.onComplete || this.onComplete;
    
    this.isAnimating = true;
    
    // Create timeline for synchronized animations
    this.timeline = gsap.timeline({
      delay: delay,
      onComplete: () => {
        this.isAnimating = false;
        this.timeline = null;
        
        // Call the completion callback if provided
        if (onComplete && typeof onComplete === 'function') {
          onComplete();
        }
      }
    });
    
    // Animate position
    this.timeline.to(this.gameObject.object3D.position, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration: duration,
      ease: ease
    }, 0); // Start at time 0
    
    // Animate scale
    this.timeline.to(this.gameObject.object3D.scale, {
      x: targetScale.x,
      y: targetScale.y,
      z: targetScale.z,
      duration: duration,
      ease: ease
    }, 0); // Start at time 0
    
    // Animate rotation
    this.timeline.to(this.gameObject.object3D.rotation, {
      x: targetRot.x,
      y: targetRot.y,
      z: targetRot.z,
      duration: duration,
      ease: ease
    }, 0); // Start at time 0
  }

  /**
   * Update target values without starting animation
   */
  setTarget(position, scale, rotation) {
    if (position) {
      this.targetPosition = { ...this.targetPosition, ...position };
    }
    if (scale) {
      this.targetScale = { ...this.targetScale, ...scale };
    }
    if (rotation) {
      this.targetRotation = { ...this.targetRotation, ...rotation };
    }
  }

  /**
   * Stop the current animation
   */
  stop() {
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
      this.isAnimating = false;
    }
  }

  /**
   * Pause the current animation
   */
  pause() {
    if (this.timeline) {
      this.timeline.pause();
    }
  }

  /**
   * Resume the paused animation
   */
  resume() {
    if (this.timeline) {
      this.timeline.resume();
    }
  }

  update(deltaTime) {
    // No per-frame updates needed, GSAP handles animation
  }

  start() {
    // Initial setup if needed
  }

  // Cleanup
  destroy() {
    this.stop();
  }
}
