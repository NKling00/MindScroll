import{quickModelLoad} from '/js/utils/threeHelpers.js';
import {createMountainRange} from '/js/utils/Objects.js';

import * as THREE from 'three';

export class Scene2 {
    constructor(app) {
        this.app = app;
        this.objects = [];
        this.isVisible = false;
        
        this.init();
    }

    init() {
        this.createScene();
        this.setupAnimations();
    }

    createScene() {

        this.mountain = createMountainRange(20,20,20);
        this.app.scene.add(this.mountain);
        this.objects.push(this.mountain);

        gsap.from(this.mountain.position,{y: -15, duration: 25,delay:0, ease: "elastic.out(0.5,0.3)"}); //animate mountain into scene


        // Create 3D objects for hero scene
        const geometry = new THREE.BoxGeometry(1,1,1);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0xFF0000,
            transparent: true,
            opacity: 0.8
        });
        
        /*
        const loader = new GTFLLoader();
        loader.load('../models/brain1.glb',function(gltf){
            scene.add(gltf.scene);
        });
        const brain  = new THREE.
        */

        this.sphere = new THREE.Mesh(geometry, material);
        this.sphere.position.set(0, 0, 0);
        //this.app.scene.add(this.sphere);
        this.objects.push(this.sphere);

        const includeObj =(model)=>{
            console.log('added model');
            this.objects.push(model);
            this.hide();
        }
        //quickModelLoad('models/brainModel1High.glb',this.app.scene,includeObj);

        // Add particle system
        this.createParticles();
    }

    createParticles() {
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 20;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0x00ff88,
            size: 0.05,
            transparent: true,
            opacity: 0.6
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.app.scene.add(this.particles);
        this.objects.push(this.particles);
    }

    setupAnimations() {
        // Rotation animation
        gsap.to(this.sphere.rotation, {
            x: Math.PI * 2,
            y: Math.PI * 2,
            duration: 10,
            repeat: -1,
            ease: "none"
        });

        // Scroll-triggered animations
        this.app.animationManager.createScrollAnimation({
            target: this.sphere.scale,
            trigger: ".content-section",
            start: "top top",
            end: "bottom top",
            scrub: 3,
            ease: "",
            animation: {
                x: 5,
                y: 5,
                z: 5
            }
        });

        // Particle animation
        gsap.to(this.particles.rotation, {
            y: Math.PI * 2,
            duration: 20,
            repeat: -1,
            ease: "none"
        });
    }

    show() {
        this.isVisible = true;
        this.objects.forEach(obj => {
            obj.visible = true;
        });
    }

    hide() {
        this.isVisible = false;
        this.objects.forEach(obj => {
            obj.visible = false;
        });
    }

    update() {
        if (!this.isVisible) return;
        
        // Update scene-specific animations
        const time = Date.now() * 0.001;
        
        if (this.particles) {
            this.particles.rotation.y = time * 0.1;
        }
    }
}