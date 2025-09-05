
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
//Simple quick model loader
export function quickModelLoad(url, scene, onLoad = null) {
    const loader = new GLTFLoader();

    loader.load(
        url,
        (gltf) => {
            console.log('finished uploading');
            const model = gltf.scene;
            console.log(model);
            console.log(scene);
            scene.add(model);
            /*
            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
    */
           // scene.add(model);
            if (onLoad) onLoad(model);
        },
        ()=>{
            console.log('uploading file');
        },
        (error) => {
            console.error('An error occurred while loading the GLB model:', error);
            //if (onError) onError(error);
        }
    );
}

//doesnt work how I want it to yet
export function drawDebugLine(start, end, scene, color = 0xff0000) {
  const material = new THREE.LineBasicMaterial({ color });
  const points = [start, end];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  scene.add(line);
  return line;
}


export function setToColor(object,color){  //Set all meshes within a game object to the same basic color material , color is a color number 0x00000 not a string
    object.traverse((child) => { //set color to red
            if (child.isMesh && child.material) {
            // If the material is an array (e.g., multi-material), handle each one
            if (Array.isArray(child.material)) {
                child.material.forEach((mat) => {
                if (mat.color) mat.color.set(color); // red
                });
            } else {
                if (child.material.color) child.material.color.set(color); // red
            }
            }
        });
}