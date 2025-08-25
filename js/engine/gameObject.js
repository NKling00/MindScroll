export class GameObject {
    constructor(object3D) {
        this.object3D = object3D || new THREE.Object3D();

        this.scripts =[];
        this.enabled = true;

    }

    addScript(ScriptClass, params = {}) {
        // Get default parameters from the script class
        const defaults = ScriptClass.parameters || {};
        const finalParams = {};

        // Merge user params with defaults
        for (const key in defaults) {
        finalParams[key] = params[key] ?? defaults[key].default; //either get the user value or check the class declaration for a default
        }

        // Create and store the script instance
        const scriptInstance = new ScriptClass(this, finalParams); //final params passes the user params + defaults combined together
        this.scripts.push(scriptInstance);

        // call lifecycle hook
        if (typeof scriptInstance.start === 'function') {
            scriptInstance.start();
        }

        return scriptInstance;
    }

    update(deltaTime) {
        for (const script of this.scripts) {
            if (typeof script.update === 'function') {
                script.update(deltaTime);
            }
        }
    }

    addToScene(scene) {
        scene.add(this.object3D);
    }

    setPosition(x, y, z) {
        this.object3D.position.set(x, y, z);
    }

    setRotation(x, y, z) {
        this.object3D.rotation.set(x, y, z);
    }

    setScale(x, y, z) {
        this.object3D.scale.set(x, y, z);
    }

}