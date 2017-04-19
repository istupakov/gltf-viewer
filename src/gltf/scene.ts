import { GltfContainer } from './gltf';
import { Camera } from './camera';
import { Node } from './node';

export class Scene {
    private readonly nodes: Node[] = [];
    readonly name?: string;
    readonly extensions?: object;
    readonly extras?: any;

    readonly cameras: Camera[] = [];
    activeCamera: Camera;

    constructor(scene: any, model: GltfContainer) {
        Object.assign(this, scene, { nodes: (<string[]>scene.nodes || []).map(n => model.nodes[n]) });
        this.nodes.forEach(node => node.addCameras(this.cameras));
        this.activeCamera = this.cameras[0];
    }

    update() {
        this.nodes.forEach(node => node.update());
        this.activeCamera.updateView();
    }

    draw(gl: WebGLRenderingContext) {
        this.update();
        this.activeCamera.updateProjection(gl);
        this.nodes.forEach(node => node.draw(gl, this.activeCamera));
    }
}