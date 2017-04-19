import { Indexer } from './../utils';

const enum BufferViewTarget { ARRAY_BUFFER = 34962, ELEMENT_ARRAY_BUFFER = 34963 }
export class BufferView {
    private readonly buffer: DataView;
    private readonly byteOffset: number;
    private readonly byteLength: number = 0;
    private readonly target?: BufferViewTarget;
    readonly name?: string;
    readonly extensions?: object;
    readonly extras?: any;

    webGLBuffer: WebGLBuffer | null = null;

    constructor(gltf: any, bufferDatas: Indexer<ArrayBuffer>) {
        Object.assign(this, gltf);
        this.buffer = new DataView(bufferDatas[gltf.buffer], this.byteOffset, this.byteLength);
    }

    create(gl: WebGLRenderingContext) {
        if (this.target && !this.webGLBuffer) {
            this.webGLBuffer = gl.createBuffer();
            gl.bindBuffer(this.target, this.webGLBuffer);
            gl.bufferData(this.target, this.buffer, gl.STATIC_DRAW);
        }
    }

    delete(gl: WebGLRenderingContext) {
        gl.deleteBuffer(this.webGLBuffer);
        this.webGLBuffer = null;
    }

    bind(gl: WebGLRenderingContext) {
        if (this.target) {
            if (!this.webGLBuffer)
                this.create(gl);
            gl.bindBuffer(this.target, this.webGLBuffer);
        }
    }

    getDate() {
        return this.buffer;
    }
}