import { mat4 } from 'gl-matrix';

import { Indexer } from './../utils';
import { GltfContainer } from './gltf';
import { Camera } from './camera';
import { Mesh } from './mesh';

export class Node {
    private readonly camera?: string;
    private readonly children: string[] = [];
    private readonly matrix: number[] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    private readonly meshes: string[] = [];
    rotation?: number[];
    scale?: number[];
    translation?: number[];
    readonly name?: string;
    readonly extensions?: object;
    readonly extras?: any;

    private cameraObj?: Camera;
    private childrenObj: Node[];
    private meshesObj: Mesh[];

    local: mat4;
    model: mat4;

    constructor(node: any) {
        Object.assign(this, node);
    }

    init(model: GltfContainer, cameras: Indexer<any>) {
        if (this.camera) {
            this.cameraObj = new Camera(cameras[this.camera], this);
        }

        this.childrenObj = this.children.map(id => model.nodes[id]);
        this.meshesObj = this.meshes.map(id => model.meshes[id]);
    }

    addCameras(cameras: Camera[]) {
        if (this.cameraObj)
            cameras.push(this.cameraObj);
        this.childrenObj.forEach(node => node.addCameras(cameras));
    }

    getViewMatrix(): mat4 {
        return mat4.invert(mat4.create(), this.model)!;
    }

    update(parent?: Node) {
        if (this.translation || this.rotation || this.scale) {
            this.local = mat4.fromRotationTranslationScale(mat4.create(), <any>this.rotation || [0, 0, 0, 1],
                this.translation || [0, 0, 0], this.scale || [1, 1, 1]);
        } else if (this.matrix) {
            this.local = mat4.clone(<any>this.matrix);
        }

        this.model = parent ? mat4.multiply(mat4.create(), parent.model, this.local) : this.local;;
        this.childrenObj.forEach(node => node.update(this));
    }

    draw(gl: WebGLRenderingContext, camera: Camera) {
        this.childrenObj.forEach(node => node.draw(gl, camera));
        this.meshesObj.forEach(mesh => mesh.draw(gl, this, camera));
    }
}