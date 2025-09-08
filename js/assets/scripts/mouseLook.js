import * as THREE from 'three';
export default class mouseLook {
    static parameters={
        yRotation: {default:{max:.01,min:-1,step:.03}},  //min max for Object Rotation , step increases speed
        xRotation: {default:{max:.2,min:-.2,step:.03}},
        yBaseRot: {default:0}, //default rotation before adding anything
        xBaseRot: {default:.3},
        xTrackRange:{default:{max:.5,min:-.5}}, //How far the mouse will track on X
        yTrackRange:{default:{max:.5,min:-.5}}, //How far mouse will track on Y
        app:{default:null}
    }
    constructor(gameObject,params){
        this.gameObject = gameObject;
        this.yRotation = params.yRotation;
        this.xRotation = params.xRotation;
        this.yBaseRot = params.yBaseRot;
        this.xBaseRot = params.xBaseRot;
        this.xTrackRange = params.xTrackRange;
        this.yTrackRange = params.yTrackRange;
        this.app = params.app;
    }
    update(deltaTime){
        this.gameObject.object3D.rotation.y =THREE.MathUtils.lerp(this.gameObject.object3D.rotation.y ,utils.mapMouseValue(utils.clamp(this.app.mouse.x,this.yTrackRange.min,this.yTrackRange.max),this.yRotation.min,this.yRotation.max)+this.yBaseRot,this.yRotation.step);
        this.gameObject.object3D.rotation.x = THREE.MathUtils.lerp(this.gameObject.object3D.rotation.x ,utils.mapMouseValue(-utils.clamp(this.app.mouse.y,this.xTrackRange.min,this.xTrackRange.max),this.xRotation.min,this.xRotation.max)+this.xBaseRot,this.xRotation.step);
    }

}