import * as THREE from 'three';
import {GameObject} from '/js/engine/gameObject.js';
import * as materials from '/js/assets/materials.js';
import balloonUp from '/js/assets/scripts/balloonUp.js';

export default function bubblePrefab (spawnVector3){
            const bubble =  new GameObject();
            bubble.name = 'bubble';
            const bubble3D = new THREE.OctahedronGeometry(1,1);

           
            const bubbleMat = materials.glass;
            
          
            bubble.object3D = new THREE.Mesh(bubble3D,bubbleMat);
    
            const bubbleFrame = new THREE.Mesh(bubble3D.clone(),materials.wireFrame(0xf0906a));
            bubbleFrame.scale.set(1.2,1.2,1.2);
            bubble.object3D.add(bubbleFrame);

            //bubble.object3D.position.set(100,-4.14,-10);
            bubble.object3D.position.copy(spawnVector3);
            bubble.object3D.scale.set(.4,.4,.4);
            

            bubble.addScript(balloonUp,{});            


            return bubble;
}