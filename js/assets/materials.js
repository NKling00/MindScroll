import * as THREE from 'three';

export const fresnelMaterial=(fcolor)=> {
    const mat = new THREE.MeshStandardMaterial({
        color: fcolor,
        
        });

        fresnelMaterial.onBeforeCompile = shader => {
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <output_fragment>',
                `
                float fresnel = pow(1.0 - dot(normalize(vNormal), normalize(vViewPosition)), 13.0);
                vec3 glow = vec3(0.5, 0.8, 1.0) * fresnel;
                vec3 finalColor = outgoingLight + glow;
                gl_FragColor = vec4(finalColor, 1.0);
                `
            );
            };
            return mat;

}


export const glass = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,

  metalness: 0,
  roughness: 0,
  transmission: .8,       // Enables real transparency
  thickness: 0.5,           // Simulates depth for refraction
  ior: 1.5,                 // Index of refraction (glass ~1.5)
  clearcoat: 0.0,           // Adds glossy layer
  clearcoatRoughness: 0.1,
  opacity: 5.0,
  transparent: true
});


export const wireFrame = (color=0xb7b1b1)=>{
    return new THREE.MeshBasicMaterial({
    color:color,
    wireframe:true,
    });
}