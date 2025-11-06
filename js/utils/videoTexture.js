import * as THREE from 'three';

/**
 * Creates a video texture and returns a THREE.MeshBasicMaterial with the video texture
 * @param {HTMLVideoElement} videoElement 
 * @returns 
 */
export function createVideoTexture(videoElement){
    
    //videoElement.src = src; //should have the src on the html element
    videoElement.addEventListener('loadeddata', () => {
        videoElement.play();
    });
    videoElement.play(); //for some reason it doesnt work without this
    const texture = new THREE.VideoTexture(videoElement);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat; //needs to be RGBA for webm
    texture.colorSpace = THREE.SRGBColorSpace;
    
    const THREEVideoTexture = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                transparent: true,
                toneMapped: false
            });

    return THREEVideoTexture;
}