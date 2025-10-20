import * as THREE from 'three';

export default class syncAnimation {
  static parameters = {
    targetGameObject: { type: 'object', default: null }, // The GameObject to sync animation with
  };

  constructor(gameObject, params) {
    this.gameObject = gameObject;
    this.targetGameObject = params.targetGameObject;
  }

  update(deltaTime) {
    // Sync animation mixer time if both objects have mixers
    if (this.gameObject.mixer && this.targetGameObject && this.targetGameObject.mixer) {
      // Use setTime to sync the animation position
      this.gameObject.mixer.setTime(this.targetGameObject.mixer.time);
    }
  }

  start() {
    // Verify that both objects have animation mixers
    if (!this.gameObject.mixer) {
      console.warn('syncAnimation: This GameObject does not have an animation mixer');
      return;
    }
    if (!this.targetGameObject || !this.targetGameObject.mixer) {
      console.warn('syncAnimation: Target GameObject does not have an animation mixer');
      return;
    }
    
    // Disable auto-update for this mixer since we're syncing manually
    this.gameObject.animateOnScroll = true;
    
    // Play all animations that exist on this object
    for (const animName in this.gameObject.animationActions) {
      const action = this.gameObject.animationActions[animName];
      if (action) {
        action.play();
        console.log(`syncAnimation: Started animation '${animName}'`);
      }
    }
  }
}
