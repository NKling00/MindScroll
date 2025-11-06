
export class scaleTransition {
    constructor(entity, params = {}) {
        this.entity = entity;
        this.axis = params.axis || 'y';
        this.direction = params.direction || 1;
        this.speed = params.speed || 1;
        
        this.originalScale = {
            x: this.entity.object3D.scale.x,
            y: this.entity.object3D.scale.y,
            z: this.entity.object3D.scale.z
        };
    }
    
    start() {
        // Set the selected axis to scale zero
        this.entity.object3D.scale[this.axis] = 0;
        
    }
    
    appear() {
        const targetScale = this.originalScale[this.axis] * this.direction;
        
        gsap.to(this.entity.object3D.scale, {
            [this.axis]: targetScale,
            duration: this.speed,
            ease: 'elastic.out(1, 0.5)'
        });
    }
}
