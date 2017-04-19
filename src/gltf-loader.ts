import { mat4 } from 'gl-matrix';
import { Indexer, map, enumerate, first } from './utils';

import { BufferView } from './gltf/buffer-view';
import { Shader } from './gltf/shader';
import { Program } from './gltf/program';
import { Material } from './gltf/material';
import { Accessor } from './gltf/accessor';
import { Scene } from './gltf/scene';
import { Node } from './gltf/node';
import { Texture } from './gltf/texture';
import { Mesh } from './gltf/mesh';
import { Camera } from './gltf/camera';
import { Animation } from './gltf/animation';

interface IModel {
    draw(gl: WebGLRenderingContext, time: number): void;
    getScenes(): string[];
    getCameras(): string[];
    delete(gl: WebGLRenderingContext): void;
    setActiveCamera(getView: (view: mat4) => mat4): void;
}

const defaultMaterial: any = {
    "programs": {
        "program0": {
            "attributes": [
                "a_position"
            ],
            "fragmentShader": "fragmentShader0",
            "vertexShader": "vertexShader0"
        }
    },
    "shaders": {
        "vertexShader0": {
            "type": 35633,
            "uri": "data:text/plain;base64,cHJlY2lzaW9uIGhpZ2hwIGZsb2F0OwoKdW5pZm9ybSBtYXQ0IHVfbW9kZWxWaWV3TWF0cml4Owp1bmlmb3JtIG1hdDQgdV9wcm9qZWN0aW9uTWF0cml4OwoKYXR0cmlidXRlIHZlYzMgYV9wb3NpdGlvbjsKCnZvaWQgbWFpbih2b2lkKQp7CiAgICBnbF9Qb3NpdGlvbiA9IHVfcHJvamVjdGlvbk1hdHJpeCAqIHVfbW9kZWxWaWV3TWF0cml4ICogdmVjNChhX3Bvc2l0aW9uLDEuMCk7Cn0="
        },
        "fragmentShader0": {
            "type": 35632,
            "uri": "data:text/plain;base64,cHJlY2lzaW9uIGhpZ2hwIGZsb2F0OwoKdW5pZm9ybSB2ZWM0IHVfZW1pc3Npb247Cgp2b2lkIG1haW4odm9pZCkKewogICAgZ2xfRnJhZ0NvbG9yID0gdV9lbWlzc2lvbjsKfQ=="
        }
    },
    "techniques": {
        "technique0": {
            "attributes": {
                "a_position": "position"
            },
            "parameters": {
                "modelViewMatrix": {
                    "semantic": "MODELVIEW",
                    "type": 35676
                },
                "projectionMatrix": {
                    "semantic": "PROJECTION",
                    "type": 35676
                },
                "emission": {
                    "type": 35666,
                    "value": [
                        0.5,
                        0.5,
                        0.5,
                        1
                    ]
                },
                "position": {
                    "semantic": "POSITION",
                    "type": 35665
                }
            },
            "program": "program0",
            "states": {
                "enable": [
                    2884,
                    2929
                ]
            },
            "uniforms": {
                "u_modelViewMatrix": "modelViewMatrix",
                "u_projectionMatrix": "projectionMatrix",
                "u_emission": "emission"
            }
        }
    }
};

class Model {
    static defaultModel: Model;
    readonly buffers: Indexer<BufferView> = {};
    readonly shaders: Indexer<Shader> = {};
    readonly programs: Indexer<Program> = {};
    readonly materials: Indexer<Material> = {};
    readonly accessors: Indexer<Accessor> = {};
    readonly nodes: Indexer<Node> = {};
    readonly scenes: Indexer<Scene> = {};
    readonly textures: Indexer<Texture> = {};
    readonly meshes: Indexer<Mesh> = {};
    readonly animations: Indexer<Animation> = {};
    activeScene?: Scene;

    constructor(gltf: any, bufferDatas: Indexer<ArrayBuffer>, shaderSources: Indexer<string>, images: Indexer<HTMLImageElement>) {
        this.buffers = map(gltf.bufferViews, value => new BufferView(value, bufferDatas));
        this.accessors = map(gltf.accessors, value => new Accessor(value, this));

        this.shaders = map(gltf.shaders, (value, id) => new Shader(value, shaderSources[id]));
        this.programs = map(gltf.programs, value => new Program(value, this));

        this.textures = map(gltf.textures, (value: any) => new Texture(value, gltf.samplers[value.sampler], images[value.source]));

        this.nodes = map(gltf.nodes, value => new Node(value));

        this.materials = map(gltf.materials, (value: any) => {
            if (value.technique)
                return new Material(value, gltf.techniques[value.technique], Texture.textureCollection(this.textures), this);
            else
                return new Material(value, defaultMaterial.techniques['technique0'],
                    Texture.textureCollection(Model.defaultModel.textures), Model.defaultModel);
        });

        this.meshes = map(gltf.meshes, value => new Mesh(value, this));
        this.animations = map(gltf.animations, value => new Animation(value, this));

        for (let [id, node] of enumerate(this.nodes)) {
            node.init(this, gltf.cameras);
        }

        this.scenes = map(gltf.scenes, value => new Scene(value, this));
        this.activeScene = this.scenes[gltf.scene] || first(this.scenes);

        if (this.activeScene && !this.activeScene.activeCamera) {
            this.activeScene.activeCamera = this.createExternalCamera();
        }
    }

    createExternalCamera() {
        console.log(`Camera node don't defined. Create ext camera`);
        return new Camera(
            {
                "name": "External Camera",
                "perspective": {
                    "yfov": 0.660593,
                    "zfar": 1e100,
                    "znear": 0.01
                },
                "type": "perspective"
            }, { getViewMatrix: () => mat4.lookAt(mat4.create(), [50, 40, 80], [0, 0, 0], [0, 1, 0]) });
    }

    setActiveCamera(getView: (view: mat4) => mat4) {
        if (this.activeScene) {
            this.activeScene.update();
            let view = this.activeScene.activeCamera.view;
            this.activeScene.activeCamera = new Camera(this.activeScene.activeCamera,
                {
                    getViewMatrix: () => getView(mat4.clone(view))
                });
        }
    }

    getScenes() {
        return Object.keys(this.scenes);
    }

    getCameras() {
        return this.activeScene ? this.activeScene.cameras.map(c => c.name) : undefined;
    }

    draw(gl: WebGLRenderingContext, time: number) {
        if (this.activeScene) {
            for (let [id, animation] of enumerate(this.animations)) {
                animation.applyTime(time);
            }
            this.activeScene.draw(gl);
        }
    }

    delete(gl: WebGLRenderingContext) {
        for (let [id, obj] of enumerate(this.textures))
            obj.delete(gl);
        for (let [id, obj] of enumerate(this.programs))
            obj.delete(gl);
        for (let [id, obj] of enumerate(this.shaders))
            obj.delete(gl);
        for (let [id, obj] of enumerate(this.buffers))
            obj.delete(gl);
    }
}

async function loadImage(src: string) {
    return new Promise<HTMLImageElement>(resolve => {
        let image = new Image();
        image.src = src;
        image.onload = () => resolve(image);
    });
}

async function parseModel(gltf: any) {
    let bufferDatas: Indexer<ArrayBuffer> = {};
    for (let [id, buffer] of enumerate<any>(gltf.buffers)) {
        let response = await fetch(buffer.uri);
        bufferDatas[id] = await response.arrayBuffer();
        if (buffer.byteLength != bufferDatas[id].byteLength)
            throw `Wrong buffer size: ${id}`;
    }

    let shaderSources: Indexer<string> = {};
    for (let [id, shader] of enumerate<any>(gltf.shaders)) {
        let response = await fetch(shader.uri);
        shaderSources[id] = await response.text();
    }

    let images: Indexer<HTMLImageElement> = {};
    for (let [id, image] of enumerate<any>(gltf.images)) {
        images[id] = await loadImage(image.uri);
    }

    return new Model(gltf, bufferDatas, shaderSources, images);
}

export { IModel as Model };
export async function loadModel(uri: string) {
    let response = await fetch(uri);
    let gltf = await response.json();

    if (!Model.defaultModel)
        Model.defaultModel = await parseModel(defaultMaterial);

    return <IModel>await parseModel(gltf);
}