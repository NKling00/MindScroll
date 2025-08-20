//this is where we are going to define the objects that will go into scenes
import * as THREE from 'three';
import {GameObject} from '/js/utils/gameObject.js';
import * as scripts from '/js/utils/objScripts.js';


import {createNoise2D } from 'simplex-noise';



import brainColorImage from '/textures/Brain_Color.png';

//define sphere brain
const brainGeo = new THREE.SphereGeometry(1.0,100,100);
    
        //setup textures
        const textureLoader = new THREE.TextureLoader();
        const brainColor = textureLoader.load('textures/Brain_Color.png');
        //const brainColor = textureLoader.load(brainColorImage);
        brainColor.wrapS = THREE.RepeatWrapping;
        brainColor.wrapT = THREE.RepeatWrapping;
        brainColor.repeat.set(2,1.5);
        const brainNormal = textureLoader.load('textures/Brain_Normal.png');
         brainNormal.wrapS = THREE.RepeatWrapping;
        brainNormal.wrapT = THREE.RepeatWrapping;
        brainNormal.repeat.set(2,1.5);
        const brainAO = textureLoader.load('textures/Brain_AO.png');brainAO.wrapS=THREE.RepeatWrapping;brainAO.wrapT=THREE.RepeatWrapping;brainAO.repeat.set(2,1.5);
        const brainRough = textureLoader.load('textures/Brain_Rough.png');brainRough.wrapS=THREE.RepeatWrapping;brainRough.wrapT=THREE.RepeatWrapping;brainRough.repeat.set(2,1.5);
        const brainHeight= textureLoader.load('textures/Brain_Height.png');brainHeight.wrapS=THREE.RepeatWrapping;brainHeight.wrapT=THREE.RepeatWrapping;brainHeight.repeat.set(2,1.5);
        const brainMat = new THREE.MeshStandardMaterial({map:brainColor,normalMap: brainNormal,aoMap:brainAO,roughnessMap:brainRough,roughness:.4,metalnessMap:brainRough,displacementMap:brainHeight,displacementScale:0.1});
         brainMat.normalScale.set(1.6,1.6);
        


export const sphereBrain = new THREE.Mesh(brainGeo,brainMat);
        sphereBrain.position.x = 2.8;
        sphereBrain.scale.x = 1.1;
        sphereBrain.scale.z = .9;
        sphereBrain.rotation.z = -.3;



export  const createFabric =()=>{
        const fabricGeo = new THREE.PlaneGeometry(40,40,30,30);
        fabricGeo.rotateX(-Math.PI /2.5);
        fabricGeo.rotateZ(-Math.PI/90 );
        const fabricMat = new THREE.MeshBasicMaterial({
                color: 0x9D9EA0,
                wireframe:true
        });
        const fabricMesh = new THREE.Mesh(fabricGeo,fabricMat);
        fabricMesh.position.y=-1.5;
        
        return {fabricMesh,fabricGeo};
}


export const createParticleField =(count=1000,material)=>{  //general use particleField
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3); // x, y, z for each particle
        
        for (let i = 0; i < count; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 20; // x
                positions[i * 3 + 1] = Math.random() * 10; // y
                positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
        }
        //         for (let i = 0; i < count * 3; i++) {
        //     positions[i] = (Math.random() - 0.5) * 20;
        // }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return new THREE.Points(geometry,material);
}


export const YellowParticles =()=>{
        const material = new THREE.PointsMaterial({
                    color: 0xf5b114,
                    size: 0.06,
                    transparent: true,
                    opacity: 0.6
                });
       return createParticleField(1000,material);
}


export function createMountainRange(width, height, segments) {
  const geometry = new THREE.PlaneGeometry(width, height, segments, segments);
  const noise2D = createNoise2D();

  const scale = 0.1; // Controls frequency of noise
  const amplitude = 10; // Controls height of mountains

  for (let i = 0; i < geometry.attributes.position.count; i++) {
    const x = geometry.attributes.position.getX(i);
    const y = geometry.attributes.position.getY(i);
    const z = noise2D(x * scale, y * scale) * amplitude;
    geometry.attributes.position.setZ(i, z);
  }

  geometry.computeVertexNormals(); // Important for lighting

  const material = new THREE.MeshStandardMaterial({ color: 0x556b2f, wireframe: true });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2; 
  mesh.rotation.y = -Math.PI / .5; 
  mesh.scale.set(.85,.85, .75); // Adjust scale if needed
  mesh.position.z= -10; 
  return mesh;
}
