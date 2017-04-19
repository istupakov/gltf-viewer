import { mat4, mat3 } from 'gl-matrix';

import { Indexer, map, enumerate } from './../utils';
import { GltfContainer } from './gltf';
import { Program } from './program';
import { Texture, TextureFinder } from './texture';
import { Node } from './node';
import { Accessor } from './accessor';

type ParameterValue = number | boolean | string | number[] | boolean[] | string[];
const enum ParameterType {
    BYTE = 5120, UNSIGNED_BYTE = 5121, SHORT = 5122, UNSIGNED_SHORT = 5123, INT = 5124, UNSIGNED_INT = 5125, FLOAT = 5126,
    FLOAT_VEC2 = 35664, FLOAT_VEC3 = 35665, FLOAT_VEC4 = 35666,
    INT_VEC2 = 35667, INT_VEC3 = 35668, INT_VEC4 = 35669,
    BOOL = 35670, BOOL_VEC2 = 35671, BOOL_VEC3 = 35672, BOOL_VEC4 = 35673,
    FLOAT_MAT2 = 35674, FLOAT_MAT3 = 35675, FLOAT_MAT4 = 35676,
    SAMPLER_2D = 35678
}

class Parameter {
    readonly count?: number;
    readonly node?: Node;
    readonly type: ParameterType;
    readonly semantic?: string;
    readonly value?: ParameterValue;
    readonly extensions?: object;
    readonly extras?: any;

    readonly texture?: Texture;
    location: WebGLUniformLocation | number | null = null;

    constructor(parameter: object) {
        Object.assign(this, parameter);
    }

    static create(id: string, material: any, technique: any, nodes: Indexer<Node>, textures: TextureFinder) {
        let par = technique.parameters[id];
        let node = nodes[par.node];
        let value = material.values[id] || par.value;
        if (typeof value === 'string') {
            let [textureNumber, texture] = textures(value);
            return new Parameter({ ...par, value: textureNumber, node, texture });
        }
        return new Parameter({ ...par, value, node });
    }
}

interface States {
    enable: number[];
    functions?: any;
    extensions?: object;
    extras?: any;
}

export interface RenderState {
    local: mat4;
    model: mat4;
    view: mat4;
    projection: mat4;
}

export class Material {
    private readonly attributes: Indexer<Parameter>;
    private readonly program: Program;
    private readonly uniforms: Indexer<Parameter>;
    private readonly states: States;
    readonly name?: string;
    readonly extensions?: object;
    readonly extras?: any;

    private prepared: boolean = false;

    constructor(material: any, technique: any, textures: TextureFinder, model: GltfContainer) {
        Object.assign(this, technique, material, {
            program: model.programs[technique.program],
            parameters: undefined, values: undefined,
            attributes: map(technique.attributes, (name: string) =>
                Parameter.create(name, material, technique, model.nodes, textures)),
            uniforms: map(technique.uniforms, (name: string) =>
                Parameter.create(name, material, technique, model.nodes, textures))
        });
    }

    private setUniform(gl: WebGLRenderingContext, parameter: Parameter, renderState: RenderState) {
        if (parameter.location === null)
            return;

        let value: any = parameter.value;
        if (value === undefined) {
            if (parameter.semantic === undefined)
                return;

            value = this.createUniform(gl, parameter.semantic, parameter.node ?
                { ...renderState, local: parameter.node.local, model: parameter.node.model } : renderState);
            //console.log(`Uniform '${parameter.name}' with semantic ${parameter.semantic}. Value: `, value);
        }

        switch (parameter.type) {
            case gl.FLOAT:
                gl.uniform1f(parameter.location, value);
                break;
            case gl.FLOAT_VEC2:
                gl.uniform2fv(parameter.location, value);
                break;
            case gl.FLOAT_VEC3:
                gl.uniform3fv(parameter.location, value);
                break;
            case gl.FLOAT_VEC4:
                gl.uniform4fv(parameter.location, value);
                break;

            case gl.FLOAT_MAT2:
                gl.uniformMatrix2fv(parameter.location, false, value);
                break;
            case gl.FLOAT_MAT3:
                gl.uniformMatrix3fv(parameter.location, false, value);
                break;
            case gl.FLOAT_MAT4:
                gl.uniformMatrix4fv(parameter.location, false, value);
                break;

            case gl.SAMPLER_2D:
                gl.uniform1i(parameter.location, value);
                break;
            default:
                console.warn(`Need set uniform of type ${parameter.type}.`, parameter);
        }
    }

    private createUniform(gl: WebGLRenderingContext, semantic: string, renderState: RenderState) {
        let res = mat4.create();

        switch (semantic) {
            case 'LOCAL':
                return renderState.local;
            case 'MODEL':
                return renderState.model;
            case 'VIEW':
                return renderState.view;
            case 'PROJECTION':
                return renderState.projection;

            case 'MODELVIEW':
                return mat4.multiply(res, renderState.view, renderState.model);
            case 'MODELVIEWPROJECTION':
                return mat4.multiply(res, renderState.projection, mat4.multiply(res, renderState.view, renderState.model));
            case 'MODELINVERSE':
                return mat4.invert(res, renderState.model);
            case 'VIEWINVERSE':
                return mat4.invert(res, renderState.view);
            case 'PROJECTIONINVERSE':
                return mat4.invert(res, renderState.projection);
            case 'MODELVIEWINVERSE':
                return mat4.invert(res, mat4.multiply(res, renderState.view, renderState.model));
            case 'MODELVIEWPROJECTIONINVERSE':
                return mat4.invert(res, mat4.multiply(res, renderState.projection, mat4.multiply(res, renderState.view, renderState.model)));

            case 'MODELINVERSETRANSPOSE':
                return mat3.normalFromMat4(mat3.create(), renderState.model);
            case 'MODELVIEWINVERSETRANSPOSE':
                return mat3.normalFromMat4(mat3.create(), mat4.multiply(res, renderState.view, renderState.model));

            case 'VIEWPORT':
                return [...gl.getParameter(gl.VIEWPORT)];
            case 'JOINTMATRIX':
            default:
                console.warn(`'Need uniform with semantic: ${semantic}`);
                return res;
        }
    }

    private prepare(gl: WebGLRenderingContext) {
        this.program.create(gl);

        for (let [name, parameter] of enumerate(this.attributes)) {
            parameter.location = this.program.getAttribLocation(gl, name);
        }

        for (let [name, parameter] of enumerate(this.uniforms)) {
            parameter.location = this.program.getUniformLocation(gl, name);
        }

        this.prepared = true;
    }

    begin(gl: WebGLRenderingContext, getAttribute: (semantic: string) => Accessor, renderState: RenderState) {
        if (!this.prepared)
            this.prepare(gl);

        this.program.use(gl);
        for (let [name, parameter] of enumerate(this.attributes)) {
            if (parameter.location != -1) {
                getAttribute(parameter.semantic!).bind(gl, <number>parameter.location);
                gl.enableVertexAttribArray(<number>parameter.location);
            }
        }

        for (let [name, parameter] of enumerate(this.uniforms)) {
            if (parameter.location !== null) {
                this.setUniform(gl, parameter, renderState);
                if (parameter.texture !== undefined) {
                    parameter.texture.bind(gl, gl.TEXTURE0 + <number>parameter.value);
                }
            }
        }

        if (this.states) {
            for (let cap of this.states.enable || []) {
                gl.enable(cap);
            }
        }
    }

    end(gl: WebGLRenderingContext) {
        if (this.states) {
            for (let cap of this.states.enable || []) {
                gl.disable(cap);
            }
        }

        for (let [name, parameter] of enumerate(this.attributes)) {
            if (parameter.location != -1) {
                gl.disableVertexAttribArray(<number>parameter.location);
            }
        }
    }
}