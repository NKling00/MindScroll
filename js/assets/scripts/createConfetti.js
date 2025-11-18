// Confetti behavior script for Three.js gameObjects
// Attach this to a gameObject. Call this.burst() to launch a confetti effect

import * as THREE from 'three';
import {colorStringToHex} from '/js/utils/utils.js'

export class createConfetti {

    static parameters ={
        count :{type:'int', default:300},
        size :{type:'number' ,default : 0.08},
        maxLife:{type:'number',default: 1.5},
        gravity:{type:'number',default: -9.8 *0.7}
    };


    constructor(gameObject, params) {
        this.gameObject = gameObject;
        this.scene = gameObject.scene;

        this.count = params.count;
        this.size = params.size;
        this.maxLife = params.maxLife;
        this.gravity = params.gravity;

        this.material = null;
        this._initParticles();
    }

    _initParticles() {
        const count = this.count;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const color = new THREE.Color();

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            positions[i3 + 0] = 0;
            positions[i3 + 1] = 0;
            positions[i3 + 2] = 0;

            velocities[i3 + 0] = 0;
            velocities[i3 + 1] = 0;
            velocities[i3 + 2] = 0;

            color.setHSL(Math.random(), 0.7, 0.6);
            colors[i3 + 0] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        this.material = new THREE.PointsMaterial({
            size: this.size,
            transparent: true,
            opacity: 1,
            depthWrite: false
        });

        const points = new THREE.Points(geometry, this.material);
        points.visible = false;

        // parent to the gameObject so it's positioned relative to it
        this.gameObject.object3D.add(points);

        this.confetti = {
            mesh: points,
            geometry,
            life: 0
        };
    }

    update(deltaTime) {
        const confetti = this.confetti;
        if (!confetti || !confetti.mesh.visible) return;

        const geometry = confetti.geometry;
        const positions = geometry.attributes.position.array;
        const velocities = geometry.attributes.velocity.array;

        confetti.life += deltaTime;

        for (let i = 0; i < positions.length; i += 3) {
            velocities[i + 1] += this.gravity * deltaTime;
            positions[i + 0] += velocities[i + 0] * deltaTime;
            positions[i + 1] += velocities[i + 1] * deltaTime;
            positions[i + 2] += velocities[i + 2] * deltaTime;
        }

        geometry.attributes.position.needsUpdate = true;

        const t = confetti.life / this.maxLife;
        confetti.mesh.material.opacity = Math.max(1 - t, 0);

        if (confetti.life > this.maxLife) {
            confetti.mesh.visible = false;
        }
    }

    burst(params = {}) {
        const confetti = this.confetti;
        if (!confetti) return;

        // console.log(colorStringToHex(params.color));
        // confetti.mesh.material.color = params.color;

        const geometry = confetti.geometry;
        const positions = geometry.attributes.position.array;
        const velocities = geometry.attributes.velocity.array;

        const spread = params.spread || 2;
        const upPower = params.upPower || 4;

        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 0] = 0; // relative to parent object
            positions[i + 1] = 0;
            positions[i + 2] = 0;

            velocities[i + 0] = (Math.random() - 0.5) * spread;
            velocities[i + 1] = Math.random() * upPower + upPower * 0.5;
            velocities[i + 2] = (Math.random() - 0.5) * spread;
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.velocity.needsUpdate = true;

        confetti.mesh.visible = true;
        confetti.mesh.material.opacity = 1;
        confetti.life = 0;
    }
}
