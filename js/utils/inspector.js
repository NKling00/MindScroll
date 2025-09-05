import GUI from 'lil-gui';

export function createInspector(gameObject) {
  const gui = new GUI();

  const nameSection = gui.addFolder(gameObject.name);

  const entityFolder = gui.addFolder('Entity');
    const positionFolder = entityFolder.addFolder('Position');positionFolder.collapsed = true;
    positionFolder.add(gameObject.object3D.position, 'x', -10, 10).name('Position X');
    positionFolder.add(gameObject.object3D.position, 'y', -10, 10).name('Position Y');
    positionFolder.add(gameObject.object3D.position, 'z', -10, 10).name('Position Z');
    const rotationFolder = entityFolder.addFolder('Rotation');rotationFolder.collapsed = true;
    rotationFolder.add(gameObject.object3D.rotation, 'x',0, Math.PI * 2).name('Rotation X');
    rotationFolder.add(gameObject.object3D.rotation, 'y', 0, Math.PI * 2).name('Rotation Y');
    rotationFolder.add(gameObject.object3D.rotation, 'z', 0, Math.PI * 2).name('Rotation Z');

    const scaleFolder = entityFolder.addFolder('Scale');scaleFolder.collapsed = true;
    scaleFolder.add(gameObject.object3D.scale, 'x', 0.1, 5).name('Scale X');
    scaleFolder.add(gameObject.object3D.scale, 'y', 0.1, 5).name('Scale Y');
    scaleFolder.add(gameObject.object3D.scale, 'z', 0.1, 5).name('Scale Z')

  for (const script of gameObject.scripts) { //show script variables
    const scriptClass = script.constructor;
    const paramsMeta = scriptClass.parameters;

    if (!paramsMeta) continue;

    const folder = gui.addFolder(scriptClass.name);

    for (const key in paramsMeta) {
      const meta = paramsMeta[key];
      const value = script[key];

      switch (meta.type) {
        case 'number':
          folder.add(script, key, meta.min ?? 0, meta.max ?? 10).step(meta.step ?? 0.1);
          break;
        case 'boolean':
          folder.add(script, key);
          break;
        case 'string':
          folder.add(script, key);
          break;
        // Add more types as needed
      }
    }
  }

  return gui;
}
