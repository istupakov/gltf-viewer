import { GltfContainer } from './gltf';
import { BufferView } from './buffer-view';

const enum ComponentType { BYTE = 5120, UNSIGNED_BYTE = 5121, SHORT = 5122, UNSIGNED_SHORT = 5123, FLOAT = 5126 }
type AccessorType = 'SCALAR' | 'VEC2' | 'VEC3' | 'VEC4' | 'MAT2' | 'MAT3' | 'MAT4';

function getComponentCount(type: AccessorType) {
    switch (type) {
        case 'SCALAR':
            return 1;
        case 'VEC2':
            return 2;
        case 'VEC3':
            return 3;
        case 'VEC4':
        case 'MAT2':
            return 4;
        case 'MAT3':
            return 9;
        case 'MAT4':
            return 16;
        default:
            throw `Unknown accessor type: ${type}`;
    }
}

export interface AccessorView {
    readonly length: number;
    readonly componentCount: number;
    get(index: number, component?: number): number;
}

export class Accessor {
    private readonly bufferView: BufferView;
    private readonly byteOffset: number;
    private readonly byteStride: number = 0;
    private readonly componentType: ComponentType;
    private readonly count: number;
    private readonly type: AccessorType;
    private readonly max?: number[];
    private readonly min?: number[];
    readonly name?: string;
    readonly extensions?: object;
    readonly extras?: any;

    private readonly componentCount: number;

    constructor(accessor: any, model: GltfContainer) {
        Object.assign(this, accessor);
        this.bufferView = model.buffers[accessor.bufferView];
        this.componentCount = getComponentCount(this.type);
    }

    bind(gl: WebGLRenderingContext, location?: number) {
        this.bufferView.bind(gl);
        if (location !== undefined) {
            gl.vertexAttribPointer(location, this.componentCount, this.componentType, false, this.byteStride, this.byteOffset);
        }
    }

    drawIndices(gl: WebGLRenderingContext, primitiveMode: number) {
        this.bufferView.bind(gl);
        gl.drawElements(primitiveMode, this.count, this.componentType, this.byteOffset);
    }

    getView(): AccessorView {
        const dataView = this.bufferView.getDate();
        let componentSize: number = 0;
        let getter: (offset: number, littleEndian?: boolean) => number;

        switch (this.componentType) {
            case ComponentType.BYTE:
                componentSize = 1;
                getter = dataView.getInt8;
            case ComponentType.UNSIGNED_BYTE:
                componentSize = 1;
                getter = dataView.getUint8;
            case ComponentType.SHORT:
                componentSize = 2;
                getter = dataView.getInt16;
            case ComponentType.UNSIGNED_SHORT:
                componentSize = 2;
                getter = dataView.getUint16;
            case ComponentType.FLOAT:
                componentSize = 4;
                getter = dataView.getFloat32;
        }

        const stride = this.byteStride || componentSize * this.componentCount;

        return {
            length: this.count,
            componentCount: this.componentCount,
            get: (index, component) => getter.call(dataView, this.byteOffset + index * stride + (component || 0) * componentSize, true)
        };
    }

    getCount() {
        return this.count;
    }
}