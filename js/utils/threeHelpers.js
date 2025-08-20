
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