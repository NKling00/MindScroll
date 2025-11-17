import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

/**
 * @description Creates a lil-gui window that displays the scene hierarchy with collapsable tree items
 * @class HierarchyViewer
 */
export class HierarchyViewer {
    constructor(story) {
        this.story = story;
        this.gui = null;
        this.folders = new Map(); // Track folders by object UUID
        this.objectControllers = new Map(); // Track controllers for each object
        this.updateInterval = null;
        this.isEnabled = false;
        
        this.init();
    }

    /**
     * Initialize the hierarchy viewer GUI
     */
    init() {
        // Create main GUI panel
        this.gui = new GUI({ title: 'Scene Hierarchy', width: 300 });
        this.gui.domElement.style.position = 'fixed';
        this.gui.domElement.style.top = '10px';
        this.gui.domElement.style.right = '10px';
        this.gui.domElement.style.zIndex = '1000';
        
        // Add refresh button
        const controls = {
            refresh: () => this.refresh(),
            autoUpdate: true
        };
        
        this.gui.add(controls, 'refresh').name('🔄 Refresh');
        this.gui.add(controls, 'autoUpdate').name('Auto Update').onChange((value) => {
            if (value) {
                this.startAutoUpdate();
            } else {
                this.stopAutoUpdate();
            }
        });
        
        // Initial build
        this.refresh();
        
        // Start auto-update by default
        this.startAutoUpdate();
        this.isEnabled = true;
    }

    /**
     * Refresh the entire hierarchy tree
     */
    refresh() {
        // Clear existing folders
        this.clearAllFolders();
        
        // Build hierarchy from story's main scene
        if (this.story && this.story.mainScene) {
            this.buildHierarchy(this.story.mainScene, this.gui);
        }
    }

    /**
     * Clear all folders and controllers
     */
    clearAllFolders() {
        // Get all controllers and folders to remove
        const controllersToRemove = [...this.gui.controllers];
        const foldersToRemove = [...this.gui.folders];
        
        // Remove all controllers except the first two (refresh and autoUpdate)
        for (let i = controllersToRemove.length - 1; i >= 2; i--) {
            controllersToRemove[i].destroy();
        }
        
        // Remove all folders
        foldersToRemove.forEach(folder => {
            this.removeFolderRecursive(folder);
        });
        
        this.folders.clear();
        this.objectControllers.clear();
    }

    /**
     * Recursively remove a folder and its children
     */
    removeFolderRecursive(folder) {
        // Remove all child folders first
        const childFolders = [...folder.folders];
        childFolders.forEach(child => this.removeFolderRecursive(child));
        
        // Remove all controllers
        const controllers = [...folder.controllers];
        controllers.forEach(controller => controller.destroy());
        
        // Destroy the folder
        folder.destroy();
    }

    /**
     * Build hierarchy tree recursively
     * @param {THREE.Object3D} object3D - The Three.js object to display
     * @param {GUI|Folder} parentFolder - The parent GUI or folder
     */
    buildHierarchy(object3D, parentFolder) {
        // Skip if object is null or undefined
        if (!object3D) return;
        
        // Determine display name
        let displayName = object3D.name || object3D.type || 'Object3D';
        
        // Add GameObject indicator if this object has a corresponding GameObject
        const gameObject = this.findGameObjectByObject3D(object3D);
        if (gameObject) {
            displayName = `🎮 ${displayName}`;
        }
        
        // Add visibility indicator
        const visibilityIcon = object3D.visible ? '👁️' : '🚫';
        displayName = `${visibilityIcon} ${displayName}`;
        
        // Create folder for this object
        const folder = parentFolder.addFolder(displayName);
        this.folders.set(object3D.uuid, folder);
        
        // Add quick info as a single line (type and children count)
        const quickInfo = {
            info: `${object3D.type} | Children: ${object3D.children.length}`
        };
        folder.add(quickInfo, 'info').name('Info').disable();
        
        // Add visibility toggle
        const visibilityControl = {
            visible: object3D.visible
        };
        folder.add(visibilityControl, 'visible').name('Visible').onChange((value) => {
            object3D.visible = value;
        });
        
        // Add details folder (collapsed by default)
        if (gameObject || object3D.children.length === 0) {
            const detailsFolder = folder.addFolder('📋 Details');
            this.addObjectDetails(object3D, detailsFolder, gameObject);
            detailsFolder.close();
        }
        
        // Recursively add children
        if (object3D.children && object3D.children.length > 0) {
            object3D.children.forEach(child => {
                this.buildHierarchy(child, folder);
            });
        }
        
        // Collapse folders by default based on depth
        const depth = this.getObjectDepth(object3D);
        if (depth > 1) {
            folder.close();
        }
    }

    /**
     * Add detailed object information controllers to a folder
     */
    addObjectDetails(object3D, folder, gameObject) {
        const info = {
            uuid: object3D.uuid.substring(0, 8) + '...',
            position: `${object3D.position.x.toFixed(2)}, ${object3D.position.y.toFixed(2)}, ${object3D.position.z.toFixed(2)}`,
            rotation: `${object3D.rotation.x.toFixed(2)}, ${object3D.rotation.y.toFixed(2)}, ${object3D.rotation.z.toFixed(2)}`,
            scale: `${object3D.scale.x.toFixed(2)}, ${object3D.scale.y.toFixed(2)}, ${object3D.scale.z.toFixed(2)}`
        };
        
        // Add UUID
        folder.add(info, 'uuid').name('UUID').disable();
        
        // Add position info
        folder.add(info, 'position').name('Position').disable();
        
        // Add rotation info
        folder.add(info, 'rotation').name('Rotation').disable();
        
        // Add scale info
        folder.add(info, 'scale').name('Scale').disable();
        
        // Add GameObject info if available
        if (gameObject) {
            const goInfo = {
                name: gameObject.name || 'unnamed',
                enabled: gameObject.enabled,
                scripts: gameObject.scripts.length
            };
            
            folder.add(goInfo, 'name').name('GO Name').disable();
            folder.add(goInfo, 'enabled').name('GO Enabled').onChange((value) => {
                gameObject.enabled = value;
            });
            folder.add(goInfo, 'scripts').name('Scripts').disable();
            
            // Add script list if there are scripts
            if (gameObject.scripts.length > 0) {
                const scriptFolder = folder.addFolder('📜 Scripts');
                gameObject.scripts.forEach((script, index) => {
                    const scriptInfo = {
                        name: script.constructor.name
                    };
                    scriptFolder.add(scriptInfo, 'name').name(`${index + 1}`).disable();
                });
                scriptFolder.close();
            }
        }
    }

    /**
     * Find GameObject that wraps this Object3D
     */
    findGameObjectByObject3D(object3D) {
        if (!this.story || !this.story.gameObjects) return null;
        
        return this.story.gameObjects.find(go => go.object3D === object3D);
    }

    /**
     * Get the depth of an object in the scene tree
     */
    getObjectDepth(object3D) {
        let depth = 0;
        let current = object3D;
        
        while (current.parent) {
            depth++;
            current = current.parent;
        }
        
        return depth;
    }

    /**
     * Start auto-updating the hierarchy
     */
    startAutoUpdate() {
        if (this.updateInterval) return;
        
        // Update every 1 second
        this.updateInterval = setInterval(() => {
            this.refresh();
        }, 1000);
    }

    /**
     * Stop auto-updating the hierarchy
     */
    stopAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    /**
     * Show the hierarchy viewer
     */
    show() {
        if (this.gui) {
            this.gui.show();
            this.isEnabled = true;
        }
    }

    /**
     * Hide the hierarchy viewer
     */
    hide() {
        if (this.gui) {
            this.gui.hide();
            this.isEnabled = false;
        }
    }

    /**
     * Toggle visibility of the hierarchy viewer
     */
    toggle() {
        if (this.isEnabled) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * Destroy the hierarchy viewer and clean up
     */
    destroy() {
        this.stopAutoUpdate();
        
        if (this.gui) {
            this.gui.destroy();
            this.gui = null;
        }
        
        this.folders.clear();
        this.objectControllers.clear();
        this.isEnabled = false;
    }
}

/**
 * Helper function to create a hierarchy viewer for a story
 * @param {Story} story - The story instance to create a viewer for
 * @returns {HierarchyViewer} The created hierarchy viewer instance
 */
export function createHierarchyViewer(story) {
    return new HierarchyViewer(story);
}
