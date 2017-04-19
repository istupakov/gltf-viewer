import { mat4 } from 'gl-matrix';

export interface ViewNode {
    getViewMatrix(): mat4;
}

interface Orthographic {
    xmag: number;
    ymag: number;
    zfar: number;
    znear: number;

    extensions?: object;
    extras?: any;
}

interface Perspective {
    aspectRatio?: number;
    yfov: number;
    zfar: number;
    znear: number;

    extensions?: object;
    extras?: any;
}

export class Camera {
    private readonly orthographic?: Orthographic;
    private readonly perspective?: Perspective;
    private readonly type: 'perspective' | 'orthographic';
    readonly name?: string;
    readonly extensions?: object;
    readonly extras?: any;

    readonly node: ViewNode;
    projection: mat4;
    view: mat4;

    constructor(camera: any, node: ViewNode) {
        Object.assign(this, camera);
        this.node = node;
    }

    updateProjection(gl: WebGLRenderingContext) {
        let matrix = mat4.create();
        if (this.type == 'perspective') {
            let perspective = this.perspective!;
            let aspect = /*perspective.aspectRatio ||*/ gl.drawingBufferWidth / gl.drawingBufferHeight;
            mat4.perspective(matrix, perspective.yfov, aspect, perspective.znear, perspective.zfar);
        } else {
            let ortho = this.orthographic!;
            mat4.ortho(matrix, -ortho.xmag, ortho.xmag, -ortho.ymag, ortho.ymag, ortho.znear, ortho.zfar); // Hm... Need check this!
        }
        this.projection = matrix;
    }

    updateView() {
        this.view = this.node.getViewMatrix();
    }
}