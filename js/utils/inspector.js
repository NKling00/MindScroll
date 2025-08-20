import GUI from 'lil-gui';

export function createInspector(gameObject) {
  const gui = new GUI();

  for (const script of gameObject.scripts) {
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
