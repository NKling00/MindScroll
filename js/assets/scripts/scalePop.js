// import gsap from 'gsap';

export class scalePop {
  static parameters = {
    scalePercent: { type: 'number', default: 1.2 }, // scale multiplier (1.2 = 120% of original size)
    time: { type: 'number', default: 0.5 } // duration in seconds for the entire animation
  };

  constructor(gameObject, params) {
    this.gameObject = gameObject;
    this.scalePercent = params.scalePercent;
    this.time = params.time;
    
    // Store original scale
    this.originalScale = {
      x: this.gameObject.object3D.scale.x,
      y: this.gameObject.object3D.scale.y,
      z: this.gameObject.object3D.scale.z
    };
    
    // Track if animation is currently playing
    this.isAnimating = false;
  }

  /**
   * Trigger the pop animation
   * Scales up to scalePercent, then bounces back to original size
   */
  pop() {
    // Don't start new animation if one is already playing
    if (this.isAnimating) {
      return;
    }
    
    this.isAnimating = true;
    
    const targetScale = {
      x: this.originalScale.x * this.scalePercent,
      y: this.originalScale.y * this.scalePercent,
      z: this.originalScale.z * this.scalePercent
    };
    
    // Create timeline for the pop animation
    const timeline = gsap.timeline({
      onComplete: () => {
        this.isAnimating = false;
      }
    });
    
    // Scale up with elastic ease
    timeline.to(this.gameObject.object3D.scale, {
      x: targetScale.x,
      y: targetScale.y,
      z: targetScale.z,
      duration: this.time * 0.5, // Half the time to scale up
      ease: "power2.out" // Bouncy overshoot effect
    });
    
    // Scale back down with bounce
    timeline.to(this.gameObject.object3D.scale, {
      x: this.originalScale.x,
      y: this.originalScale.y,
      z: this.originalScale.z,
      duration: this.time * 2, // longer to scale down to account for bounce
      ease: "elastic.out(1, 0.3)" // Elastic bounce effect
    });
  }

  update(deltaTime) {
    // No per-frame updates needed, GSAP handles animation
  }

  start() {
    // Initial setup if needed
  }

  // Update original scale if needed (useful if scale changes outside this script)
  updateOriginalScale() {
    if (!this.isAnimating) {
      this.originalScale = {
        x: this.gameObject.object3D.scale.x,
        y: this.gameObject.object3D.scale.y,
        z: this.gameObject.object3D.scale.z
      };
    }
  }
}
