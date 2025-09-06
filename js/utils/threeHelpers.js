
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


export function raycastToHitVertex(targets,camera,mouse= new THREE.Vector2(THREE.MathUtils.randFloatSpread(2),THREE.MathUtils.randFloatSpread(2))){
    //scene is the object array to check against :I think
    //mouse, will be a random screen position unless given the mouse
    //mouse.x = THREE.MathUtils.randFloatSpread(2); // range [-1, 1]
    //mouse.y = THREE.MathUtils.randFloatSpread(2); // range [-1, 1]

    //console.log(mouse.toArray());

    const raycaster = new THREE.Raycaster();
    // Cast ray from camera through that point
    raycaster.setFromCamera(mouse, camera);
    //console.log(targets);
    // Intersect with scene objects
    const raycastTargets = [];
    for(var i=0; i<targets.length;i++){
        if (targets[i].visible){
            raycastTargets.push(targets[i]);
        }
    }
    //console.log(raycastTargets);
    // targets.forEach(target => { //make sure only visible meshes are considered
    //     if(target.isMesh && target.visible){
    //         raycastTargets.push(obj);
    //     }
    // });
    const intersects = raycaster.intersectObjects(raycastTargets, true);
    

    if (intersects.length > 0) {
    const hit = intersects[0];
    const geometry = hit.object.geometry;

    if (geometry.isBufferGeometry) {
        const positionAttr = geometry.attributes.position;
        const vertices = [];

        // Convert local vertices to world positions
        for (let i = 0; i < positionAttr.count; i++) {
        const vertex = new THREE.Vector3().fromBufferAttribute(positionAttr, i);
        vertex.applyMatrix4(hit.object.matrixWorld);
        vertices.push(vertex);
        }

        // Find nearest vertex to hit point
        const hitPoint = hit.point;
        let nearestVertex = vertices[0];
        let minDist = hitPoint.distanceTo(nearestVertex);

        for (let i = 1; i < vertices.length; i++) {
        const dist = hitPoint.distanceTo(vertices[i]);
        if (dist < minDist) {
            minDist = dist;
            nearestVertex = vertices[i];
        }
        }

        //console.log('Nearest vertex world position:', nearestVertex);
        return (nearestVertex);
    }
    }
}