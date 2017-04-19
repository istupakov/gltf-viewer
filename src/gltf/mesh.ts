import { Indexer, map, first } from '../utils';
import { GltfContainer } from './gltf';
import { Accessor } from './accessor';
import { Material, RenderState } from './material';
import { Camera } from './camera';
import { Node } from './node';


const enum PrimitiveMode { POINTS = 0, LINES = 1, LINE_LOOP = 2, LINE_STRIP = 3, TRIANGLES = 4, TRIANGLE_STRIP = 5, TRIANGLE_FAN = 6 }
class Primitive {
    readonly attributes: Indexer<Accessor>;
    readonly indices?: Accessor;
    readonly material: Material;
    readonly mode: PrimitiveMode = PrimitiveMode.TRIANGLES;
    readonly extensions?: object;
    readonly extras?: any;

    constructor(primitive: any, model: GltfContainer) {
        Object.assign(this, primitive, {
            indices: model.accessors[primitive.indices],
            material: model.materials[primitive.material],
            attributes: map(primitive.attributes, (id: string) => model.accessors[id])
        });
    }

    draw(gl: WebGLRenderingContext, renderState: RenderState) {
        this.material.begin(gl, semantic => this.attributes[semantic], renderState);
        if (this.indices) {
            this.indices.drawIndices(gl, this.mode);
        } else {
            gl.drawArrays(this.mode, 0, first(this.attributes)!.getCount());
        }
        this.material.end(gl);
    }
}

export class Mesh {
    private readonly primitives: Primitive[];
    readonly name?: string;
    readonly extensions?: object;
    readonly extras?: any;

    constructor(mesh: any, model: GltfContainer) {
        Object.assign(this, mesh, { primitives: (<any[]>mesh.primitives).map(p => new Primitive(p, model)) });
    }

    draw(gl: WebGLRenderingContext, node: Node, camera: Camera) {
        let state = {
            local: node.local,
            model: node.model,
            view: camera.view,
            projection: camera.projection
        };

        for (let primitive of this.primitives) {
            primitive.draw(gl, state);
        }
    }
}