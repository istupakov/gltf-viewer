(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("gl-matrix"));
	else if(typeof define === 'function' && define.amd)
		define(["gl-matrix"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("gl-matrix")) : factory(root["gl-matrix"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function map(obj, f) {
    return Object.keys(obj || {}).reduce((newObj, key) => {
        newObj[key] = f(obj[key], key);
        return newObj;
    }, {});
}
exports.map = map;
function* enumerate(obj) {
    for (let key of Object.keys(obj || {})) {
        yield [key, obj[key]];
    }
}
exports.enumerate = enumerate;
function first(obj) {
    return obj[Object.keys(obj)[0]];
}
exports.first = first;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const gl_matrix_1 = __webpack_require__(0);
class Camera {
    constructor(camera, node) {
        Object.assign(this, camera);
        this.node = node;
    }
    updateProjection(gl) {
        let matrix = gl_matrix_1.mat4.create();
        if (this.type == 'perspective') {
            let perspective = this.perspective;
            let aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
            gl_matrix_1.mat4.perspective(matrix, perspective.yfov, aspect, perspective.znear, perspective.zfar);
        }
        else {
            let ortho = this.orthographic;
            gl_matrix_1.mat4.ortho(matrix, -ortho.xmag, ortho.xmag, -ortho.ymag, ortho.ymag, ortho.znear, ortho.zfar); // Hm... Need check this!
        }
        this.projection = matrix;
    }
    updateView() {
        this.view = this.node.getViewMatrix();
    }
}
exports.Camera = Camera;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const gl_matrix_1 = __webpack_require__(0);
const utils_1 = __webpack_require__(1);
const buffer_view_1 = __webpack_require__(8);
const shader_1 = __webpack_require__(14);
const program_1 = __webpack_require__(12);
const material_1 = __webpack_require__(9);
const accessor_1 = __webpack_require__(6);
const scene_1 = __webpack_require__(13);
const node_1 = __webpack_require__(11);
const texture_1 = __webpack_require__(15);
const mesh_1 = __webpack_require__(10);
const camera_1 = __webpack_require__(2);
const animation_1 = __webpack_require__(7);
const defaultMaterial = {
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
    constructor(gltf, bufferDatas, shaderSources, images) {
        this.buffers = {};
        this.shaders = {};
        this.programs = {};
        this.materials = {};
        this.accessors = {};
        this.nodes = {};
        this.scenes = {};
        this.textures = {};
        this.meshes = {};
        this.animations = {};
        this.buffers = utils_1.map(gltf.bufferViews, value => new buffer_view_1.BufferView(value, bufferDatas));
        this.accessors = utils_1.map(gltf.accessors, value => new accessor_1.Accessor(value, this));
        this.shaders = utils_1.map(gltf.shaders, (value, id) => new shader_1.Shader(value, shaderSources[id]));
        this.programs = utils_1.map(gltf.programs, value => new program_1.Program(value, this));
        this.textures = utils_1.map(gltf.textures, (value) => new texture_1.Texture(value, gltf.samplers[value.sampler], images[value.source]));
        this.nodes = utils_1.map(gltf.nodes, value => new node_1.Node(value));
        this.materials = utils_1.map(gltf.materials, (value) => {
            if (value.technique)
                return new material_1.Material(value, gltf.techniques[value.technique], texture_1.Texture.textureCollection(this.textures), this);
            else
                return new material_1.Material(value, defaultMaterial.techniques['technique0'], texture_1.Texture.textureCollection(Model.defaultModel.textures), Model.defaultModel);
        });
        this.meshes = utils_1.map(gltf.meshes, value => new mesh_1.Mesh(value, this));
        this.animations = utils_1.map(gltf.animations, value => new animation_1.Animation(value, this));
        for (let [id, node] of utils_1.enumerate(this.nodes)) {
            node.init(this, gltf.cameras);
        }
        this.scenes = utils_1.map(gltf.scenes, value => new scene_1.Scene(value, this));
        this.activeScene = this.scenes[gltf.scene] || utils_1.first(this.scenes);
        if (this.activeScene && !this.activeScene.activeCamera) {
            this.activeScene.activeCamera = this.createExternalCamera();
        }
    }
    createExternalCamera() {
        console.log(`Camera node don't defined. Create ext camera`);
        return new camera_1.Camera({
            "name": "External Camera",
            "perspective": {
                "yfov": 0.660593,
                "zfar": 1e100,
                "znear": 0.01
            },
            "type": "perspective"
        }, { getViewMatrix: () => gl_matrix_1.mat4.lookAt(gl_matrix_1.mat4.create(), [50, 40, 80], [0, 0, 0], [0, 1, 0]) });
    }
    setActiveCamera(getView) {
        if (this.activeScene) {
            this.activeScene.update();
            let view = this.activeScene.activeCamera.view;
            this.activeScene.activeCamera = new camera_1.Camera(this.activeScene.activeCamera, {
                getViewMatrix: () => getView(gl_matrix_1.mat4.clone(view))
            });
        }
    }
    getScenes() {
        return Object.keys(this.scenes);
    }
    getCameras() {
        return this.activeScene ? this.activeScene.cameras.map(c => c.name) : undefined;
    }
    draw(gl, time) {
        if (this.activeScene) {
            for (let [id, animation] of utils_1.enumerate(this.animations)) {
                animation.applyTime(time);
            }
            this.activeScene.draw(gl);
        }
    }
    delete(gl) {
        for (let [id, obj] of utils_1.enumerate(this.textures))
            obj.delete(gl);
        for (let [id, obj] of utils_1.enumerate(this.programs))
            obj.delete(gl);
        for (let [id, obj] of utils_1.enumerate(this.shaders))
            obj.delete(gl);
        for (let [id, obj] of utils_1.enumerate(this.buffers))
            obj.delete(gl);
    }
}
async function loadImage(src) {
    return new Promise(resolve => {
        let image = new Image();
        image.src = src;
        image.onload = () => resolve(image);
    });
}
async function parseModel(gltf) {
    let bufferDatas = {};
    for (let [id, buffer] of utils_1.enumerate(gltf.buffers)) {
        let response = await fetch(buffer.uri);
        bufferDatas[id] = await response.arrayBuffer();
        if (buffer.byteLength != bufferDatas[id].byteLength)
            throw `Wrong buffer size: ${id}`;
    }
    let shaderSources = {};
    for (let [id, shader] of utils_1.enumerate(gltf.shaders)) {
        let response = await fetch(shader.uri);
        shaderSources[id] = await response.text();
    }
    let images = {};
    for (let [id, image] of utils_1.enumerate(gltf.images)) {
        images[id] = await loadImage(image.uri);
    }
    return new Model(gltf, bufferDatas, shaderSources, images);
}
async function loadModel(uri) {
    let response = await fetch(uri);
    let gltf = await response.json();
    if (!Model.defaultModel)
        Model.defaultModel = await parseModel(defaultMaterial);
    return await parseModel(gltf);
}
exports.loadModel = loadModel;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const gl_matrix_1 = __webpack_require__(0);
class Trackball {
    constructor() {
        this.capture = false;
        this.scale = 1;
        this.rotation = gl_matrix_1.quat.create();
    }
    attach(canvas) {
        this.element = canvas;
        canvas.addEventListener('mousedown', this);
        canvas.addEventListener('wheel', this);
        document.addEventListener('mousemove', this);
        document.addEventListener('mouseup', this);
    }
    detach(canvas) {
        canvas.removeEventListener('mousedown', this);
        canvas.removeEventListener('wheel', this);
        document.removeEventListener('mousemove', this);
        document.removeEventListener('mouseup', this);
    }
    rotate(position) {
        let rot = gl_matrix_1.quat.rotationTo(gl_matrix_1.quat.create(), this.previousPositon, position);
        gl_matrix_1.quat.mul(this.rotation, rot, this.rotation);
    }
    handleEvent(event) {
        if (event instanceof MouseEvent) {
            let target = event.target;
            if (event.type == 'mousedown') {
                this.capture = true;
                this.lastX = event.offsetX;
                this.lastY = event.offsetY;
                this.previousPositon = this.projectToTrackball();
            }
            else if (event.type == 'mouseup') {
                this.capture = false;
                //console.log('rotation: ', this.rotation);
            }
            else if (event.type == 'mousemove' && this.capture) {
                this.lastX += event.movementX;
                this.lastY += event.movementY;
                let position = this.projectToTrackball();
                this.rotate(position);
                this.previousPositon = position;
            }
        }
        if (event instanceof WheelEvent) {
            //console.log(event);
            event.stopPropagation();
            this.scale *= event.deltaY > 0 ? 1.1 : 1 / 1.1;
        }
    }
    projectToTrackball() {
        // Scale so bounds map to [-1,-1] - [+1,+1]
        let x = 2 * this.lastX / this.element.clientWidth - 1;
        let y = 1 - 2 * this.lastY / this.element.clientHeight;
        let z2 = 1 - x * x - y * y;
        let z = z2 > 0 ? Math.sqrt(z2) : 0;
        return gl_matrix_1.vec3.normalize(gl_matrix_1.vec3.create(), [x, y, z]);
    }
    getViewMatrix(view) {
        let mat = view; //mat4.lookAt(mat4.create(), [1500, 1400, 1800], [0, 0, 0], [0, 1, 0]);;
        let scaleMatrix = gl_matrix_1.mat4.fromScaling(gl_matrix_1.mat4.create(), [this.scale, this.scale, this.scale]);
        let rotateMatrix = gl_matrix_1.mat4.fromQuat(gl_matrix_1.mat4.create(), this.rotation);
        return gl_matrix_1.mat4.mul(mat, mat, gl_matrix_1.mat4.mul(scaleMatrix, scaleMatrix, rotateMatrix));
    }
}
exports.Trackball = Trackball;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const gltf_loader_1 = __webpack_require__(3);
const trackball_1 = __webpack_require__(4);
const shadowStyle = `
    <style>
        :host {
            width: 400px;
            height: 300px;
            display: inline-block;
        }
    </style>`;
class GltfViewer extends HTMLElement {
    get src() {
        return this.getAttribute('src');
    }
    set src(value) {
        if (value) {
            this.setAttribute('src', value);
        }
        else {
            this.removeAttribute('src');
        }
    }
    constructor() {
        super();
        let shadow = this.attachShadow({ mode: 'open' });
        this.canvas = document.createElement('canvas');
        shadow.innerHTML = shadowStyle;
        shadow.appendChild(this.canvas);
        let context = this.canvas.getContext("webgl", { antialias: true })
            || this.canvas.getContext("experimental-webgl", { antialias: true });
        if (!context) {
            throw 'Unable to initialize WebGL. Your browser may not support it.';
        }
        this.gl = context;
        this.trackball = new trackball_1.Trackball();
        this.trackball.attach(this);
    }
    resize() {
        let displayWidth = this.clientWidth;
        let displayHeight = this.clientHeight;
        if (this.canvas.width != displayWidth || this.canvas.height != displayHeight) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
        }
    }
    draw() {
        this.resize();
        this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
        this.model.draw(this.gl, Date.now() / 1000);
        this.requestID = requestAnimationFrame(() => this.draw());
    }
    async update() {
        console.log(`update: src = ${this.src}`);
        if (this.src) {
            this.model = await gltf_loader_1.loadModel(this.src);
            this.model.setActiveCamera(view => this.trackball.getViewMatrix(view));
            this.requestID = requestAnimationFrame(() => this.draw());
        }
        else {
            cancelAnimationFrame(this.requestID);
        }
    }
    static get observedAttributes() { return ['src', 'width', 'height']; }
    attributeChangedCallback(attr, oldValue, newValue) {
        console.log(`Change ${attr}: ${oldValue} -> ${newValue}`);
        if (attr == 'src') {
            this.update();
        }
        else if (attr == 'width') {
            this.canvas.width = newValue;
        }
        else if (attr == 'height') {
            this.canvas.height = newValue;
        }
    }
}
customElements.define('gltf-viewer', GltfViewer);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getComponentCount(type) {
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
class Accessor {
    constructor(accessor, model) {
        this.byteStride = 0;
        Object.assign(this, accessor);
        this.bufferView = model.buffers[accessor.bufferView];
        this.componentCount = getComponentCount(this.type);
    }
    bind(gl, location) {
        this.bufferView.bind(gl);
        if (location !== undefined) {
            gl.vertexAttribPointer(location, this.componentCount, this.componentType, false, this.byteStride, this.byteOffset);
        }
    }
    drawIndices(gl, primitiveMode) {
        this.bufferView.bind(gl);
        gl.drawElements(primitiveMode, this.count, this.componentType, this.byteOffset);
    }
    getView() {
        const dataView = this.bufferView.getDate();
        let componentSize = 0;
        let getter;
        switch (this.componentType) {
            case 5120 /* BYTE */:
                componentSize = 1;
                getter = dataView.getInt8;
            case 5121 /* UNSIGNED_BYTE */:
                componentSize = 1;
                getter = dataView.getUint8;
            case 5122 /* SHORT */:
                componentSize = 2;
                getter = dataView.getInt16;
            case 5123 /* UNSIGNED_SHORT */:
                componentSize = 2;
                getter = dataView.getUint16;
            case 5126 /* FLOAT */:
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
exports.Accessor = Accessor;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const gl_matrix_1 = __webpack_require__(0);
class Target {
    constructor(target, model) {
        Object.assign(this, target);
        this.node = model.nodes[this.id];
        this.default = this.node[this.path];
    }
    setValue(value) {
        this.node[this.path] = value || this.default;
    }
}
class Sampler {
    constructor(sampler, animation, model) {
        this.interpolation = "LINEAR";
        Object.assign(this, sampler);
        this.input = model.accessors[animation.parameters[sampler.input]].getView();
        this.output = model.accessors[animation.parameters[sampler.output]].getView();
    }
    getValue(time) {
        //console.log(this.input);
        //console.log(`time: ${time}, t0: ${this.input.get(0)}, t1: ${this.input.get(this.input.length - 1)}, t: ${time % this.input.get(this.input.length - 1)}`);
        time %= this.input.get(this.input.length - 1);
        for (let i = 0; i < this.input.length - 1; ++i) {
            if (time >= this.input.get(i) && time <= this.input.get(i + 1)) {
                const t = (time - this.input.get(i)) / (this.input.get(i + 1) - this.input.get(i));
                const a = [...Array(this.output.componentCount)].map((_, j) => this.output.get(i, j));
                const b = [...Array(this.output.componentCount)].map((_, j) => this.output.get(i + 1, j));
                //const a = new Array(this.output.componentCount).fill(0).map((v, j) => this.output.get(i, j));
                //const b = new Array(this.output.componentCount).fill(0).map((v, j) => this.output.get(i + 1, j));
                //console.log(`a: ${a}, b: ${b}, t: ${t}`);
                if (this.output.componentCount == 4) {
                    return gl_matrix_1.quat.slerp(a, a, b, t);
                }
                else {
                    return gl_matrix_1.vec3.lerp(a, a, b, t);
                }
                // for (let j = 0; j < this.output.componentCount; ++j)
                //     res.push(this.output.get(i, j) * (1 - t) + this.output.get(i + 1, j) * t);
                // return res;
            }
        }
        return undefined;
    }
}
class Channel {
    constructor(channel, animation, model) {
        Object.assign(this, channel);
        this.target = new Target(channel.target, model);
        this.sampler = new Sampler(animation.samplers[channel.sampler], animation, model);
    }
    applyTime(time) {
        this.target.setValue(this.sampler.getValue(time));
    }
}
class Animation {
    constructor(animation, model) {
        Object.assign(this, animation, { samplers: undefined, parameters: undefined });
        this.channels = animation.channels.map(channel => new Channel(channel, animation, model));
    }
    applyTime(time) {
        this.channels.forEach(channel => channel.applyTime(time));
    }
}
exports.Animation = Animation;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class BufferView {
    constructor(gltf, bufferDatas) {
        this.byteLength = 0;
        this.webGLBuffer = null;
        Object.assign(this, gltf);
        this.buffer = new DataView(bufferDatas[gltf.buffer], this.byteOffset, this.byteLength);
    }
    create(gl) {
        if (this.target && !this.webGLBuffer) {
            this.webGLBuffer = gl.createBuffer();
            gl.bindBuffer(this.target, this.webGLBuffer);
            gl.bufferData(this.target, this.buffer, gl.STATIC_DRAW);
        }
    }
    delete(gl) {
        gl.deleteBuffer(this.webGLBuffer);
        this.webGLBuffer = null;
    }
    bind(gl) {
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
exports.BufferView = BufferView;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const gl_matrix_1 = __webpack_require__(0);
const utils_1 = __webpack_require__(1);
class Parameter {
    constructor(parameter) {
        this.location = null;
        Object.assign(this, parameter);
    }
    static create(id, material, technique, nodes, textures) {
        let par = technique.parameters[id];
        let node = nodes[par.node];
        let value = material.values[id] || par.value;
        if (typeof value === 'string') {
            let [textureNumber, texture] = textures(value);
            return new Parameter(Object.assign({}, par, { value: textureNumber, node, texture }));
        }
        return new Parameter(Object.assign({}, par, { value, node }));
    }
}
class Material {
    constructor(material, technique, textures, model) {
        this.prepared = false;
        Object.assign(this, technique, material, {
            program: model.programs[technique.program],
            parameters: undefined, values: undefined,
            attributes: utils_1.map(technique.attributes, (name) => Parameter.create(name, material, technique, model.nodes, textures)),
            uniforms: utils_1.map(technique.uniforms, (name) => Parameter.create(name, material, technique, model.nodes, textures))
        });
    }
    setUniform(gl, parameter, renderState) {
        if (parameter.location === null)
            return;
        let value = parameter.value;
        if (value === undefined) {
            if (parameter.semantic === undefined)
                return;
            value = this.createUniform(gl, parameter.semantic, parameter.node ? Object.assign({}, renderState, { local: parameter.node.local, model: parameter.node.model }) : renderState);
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
    createUniform(gl, semantic, renderState) {
        let res = gl_matrix_1.mat4.create();
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
                return gl_matrix_1.mat4.multiply(res, renderState.view, renderState.model);
            case 'MODELVIEWPROJECTION':
                return gl_matrix_1.mat4.multiply(res, renderState.projection, gl_matrix_1.mat4.multiply(res, renderState.view, renderState.model));
            case 'MODELINVERSE':
                return gl_matrix_1.mat4.invert(res, renderState.model);
            case 'VIEWINVERSE':
                return gl_matrix_1.mat4.invert(res, renderState.view);
            case 'PROJECTIONINVERSE':
                return gl_matrix_1.mat4.invert(res, renderState.projection);
            case 'MODELVIEWINVERSE':
                return gl_matrix_1.mat4.invert(res, gl_matrix_1.mat4.multiply(res, renderState.view, renderState.model));
            case 'MODELVIEWPROJECTIONINVERSE':
                return gl_matrix_1.mat4.invert(res, gl_matrix_1.mat4.multiply(res, renderState.projection, gl_matrix_1.mat4.multiply(res, renderState.view, renderState.model)));
            case 'MODELINVERSETRANSPOSE':
                return gl_matrix_1.mat3.normalFromMat4(gl_matrix_1.mat3.create(), renderState.model);
            case 'MODELVIEWINVERSETRANSPOSE':
                return gl_matrix_1.mat3.normalFromMat4(gl_matrix_1.mat3.create(), gl_matrix_1.mat4.multiply(res, renderState.view, renderState.model));
            case 'VIEWPORT':
                return [...gl.getParameter(gl.VIEWPORT)];
            case 'JOINTMATRIX':
            default:
                console.warn(`'Need uniform with semantic: ${semantic}`);
                return res;
        }
    }
    prepare(gl) {
        this.program.create(gl);
        for (let [name, parameter] of utils_1.enumerate(this.attributes)) {
            parameter.location = this.program.getAttribLocation(gl, name);
        }
        for (let [name, parameter] of utils_1.enumerate(this.uniforms)) {
            parameter.location = this.program.getUniformLocation(gl, name);
        }
        this.prepared = true;
    }
    begin(gl, getAttribute, renderState) {
        if (!this.prepared)
            this.prepare(gl);
        this.program.use(gl);
        for (let [name, parameter] of utils_1.enumerate(this.attributes)) {
            if (parameter.location != -1) {
                getAttribute(parameter.semantic).bind(gl, parameter.location);
                gl.enableVertexAttribArray(parameter.location);
            }
        }
        for (let [name, parameter] of utils_1.enumerate(this.uniforms)) {
            if (parameter.location !== null) {
                this.setUniform(gl, parameter, renderState);
                if (parameter.texture !== undefined) {
                    parameter.texture.bind(gl, gl.TEXTURE0 + parameter.value);
                }
            }
        }
        if (this.states) {
            for (let cap of this.states.enable || []) {
                gl.enable(cap);
            }
        }
    }
    end(gl) {
        if (this.states) {
            for (let cap of this.states.enable || []) {
                gl.disable(cap);
            }
        }
        for (let [name, parameter] of utils_1.enumerate(this.attributes)) {
            if (parameter.location != -1) {
                gl.disableVertexAttribArray(parameter.location);
            }
        }
    }
}
exports.Material = Material;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __webpack_require__(1);
class Primitive {
    constructor(primitive, model) {
        this.mode = 4 /* TRIANGLES */;
        Object.assign(this, primitive, {
            indices: model.accessors[primitive.indices],
            material: model.materials[primitive.material],
            attributes: utils_1.map(primitive.attributes, (id) => model.accessors[id])
        });
    }
    draw(gl, renderState) {
        this.material.begin(gl, semantic => this.attributes[semantic], renderState);
        if (this.indices) {
            this.indices.drawIndices(gl, this.mode);
        }
        else {
            gl.drawArrays(this.mode, 0, utils_1.first(this.attributes).getCount());
        }
        this.material.end(gl);
    }
}
class Mesh {
    constructor(mesh, model) {
        Object.assign(this, mesh, { primitives: mesh.primitives.map(p => new Primitive(p, model)) });
    }
    draw(gl, node, camera) {
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
exports.Mesh = Mesh;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const gl_matrix_1 = __webpack_require__(0);
const camera_1 = __webpack_require__(2);
class Node {
    constructor(node) {
        this.children = [];
        this.matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        this.meshes = [];
        Object.assign(this, node);
    }
    init(model, cameras) {
        if (this.camera) {
            this.cameraObj = new camera_1.Camera(cameras[this.camera], this);
        }
        this.childrenObj = this.children.map(id => model.nodes[id]);
        this.meshesObj = this.meshes.map(id => model.meshes[id]);
    }
    addCameras(cameras) {
        if (this.cameraObj)
            cameras.push(this.cameraObj);
        this.childrenObj.forEach(node => node.addCameras(cameras));
    }
    getViewMatrix() {
        return gl_matrix_1.mat4.invert(gl_matrix_1.mat4.create(), this.model);
    }
    update(parent) {
        if (this.translation || this.rotation || this.scale) {
            this.local = gl_matrix_1.mat4.fromRotationTranslationScale(gl_matrix_1.mat4.create(), this.rotation || [0, 0, 0, 1], this.translation || [0, 0, 0], this.scale || [1, 1, 1]);
        }
        else if (this.matrix) {
            this.local = gl_matrix_1.mat4.clone(this.matrix);
        }
        this.model = parent ? gl_matrix_1.mat4.multiply(gl_matrix_1.mat4.create(), parent.model, this.local) : this.local;
        ;
        this.childrenObj.forEach(node => node.update(this));
    }
    draw(gl, camera) {
        this.childrenObj.forEach(node => node.draw(gl, camera));
        this.meshesObj.forEach(mesh => mesh.draw(gl, this, camera));
    }
}
exports.Node = Node;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Program {
    constructor(program, model) {
        this.attributes = [];
        this.webGLProgram = null;
        Object.assign(this, program, {
            fragmentShader: model.shaders[program.fragmentShader],
            vertexShader: model.shaders[program.vertexShader]
        });
    }
    create(gl) {
        if (this.webGLProgram)
            return;
        this.webGLProgram = gl.createProgram();
        gl.attachShader(this.webGLProgram, this.vertexShader.create(gl));
        gl.attachShader(this.webGLProgram, this.fragmentShader.create(gl));
        gl.linkProgram(this.webGLProgram);
        if (!gl.getProgramParameter(this.webGLProgram, gl.LINK_STATUS))
            throw `Can't link program. Error: ${gl.getProgramInfoLog(this.webGLProgram)}`;
    }
    delete(gl) {
        gl.deleteProgram(this.webGLProgram);
        this.webGLProgram = null;
    }
    getAttribLocation(gl, name) {
        return gl.getAttribLocation(this.webGLProgram, name);
    }
    getUniformLocation(gl, name) {
        return gl.getUniformLocation(this.webGLProgram, name);
    }
    use(gl) {
        gl.useProgram(this.webGLProgram);
    }
}
exports.Program = Program;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Scene {
    constructor(scene, model) {
        this.nodes = [];
        this.cameras = [];
        Object.assign(this, scene, { nodes: (scene.nodes || []).map(n => model.nodes[n]) });
        this.nodes.forEach(node => node.addCameras(this.cameras));
        this.activeCamera = this.cameras[0];
    }
    update() {
        this.nodes.forEach(node => node.update());
        this.activeCamera.updateView();
    }
    draw(gl) {
        this.update();
        this.activeCamera.updateProjection(gl);
        this.nodes.forEach(node => node.draw(gl, this.activeCamera));
    }
}
exports.Scene = Scene;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Shader {
    constructor(shader, source) {
        this.webGLShader = null;
        Object.assign(this, shader, { uri: undefined });
        this.source = source;
    }
    create(gl) {
        if (!this.webGLShader) {
            this.webGLShader = gl.createShader(this.type);
            gl.shaderSource(this.webGLShader, this.source);
            gl.compileShader(this.webGLShader);
            if (!gl.getShaderParameter(this.webGLShader, gl.COMPILE_STATUS))
                throw `Can't compile shader. Error: ${gl.getShaderInfoLog(this.webGLShader)}`;
        }
        return this.webGLShader;
    }
    delete(gl) {
        gl.deleteShader(this.webGLShader);
        this.webGLShader = null;
    }
}
exports.Shader = Shader;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
;
;
;
;
;
;
class Texture {
    constructor(texture, sampler, source) {
        this.format = 6408 /* RGBA */;
        this.internalFormat = 6408 /* RGBA */;
        this.target = 3553 /* TEXTURE_2D */;
        this.type = 5121 /* UNSIGNED_BYTE */;
        this.magFilter = 9729 /* LINEAR */;
        this.minFilter = 9986 /* NEAREST_MIPMAP_LINEAR */;
        this.wrapS = 10497 /* REPEAT */;
        this.wrapT = 10497 /* REPEAT */;
        this.webGLTexture = null;
        Object.assign(this, sampler, texture, { source });
        this.useMipMap = this.minFilter == 9984 /* NEAREST_MIPMAP_NEAREST */
            || this.minFilter == 9986 /* NEAREST_MIPMAP_LINEAR */
            || this.minFilter == 9985 /* LINEAR_MIPMAP_NEAREST */
            || this.minFilter == 9987 /* LINEAR_MIPMAP_LINEAR */;
        let repeat = this.wrapS == 10497 /* REPEAT */
            || this.wrapS == 33648 /* MIRRORED_REPEAT */
            || this.wrapT == 10497 /* REPEAT */
            || this.wrapT == 33648 /* MIRRORED_REPEAT */;
        if (this.useMipMap || repeat)
            this.source = Texture.resizeIfNeed(source);
    }
    static resizeIfNeed(image) {
        let isPowerOfTwo = (x) => (x & (x - 1)) == 0;
        let nextHighestPowerOfTwo = (x) => {
            --x;
            for (let i = 1; i < 32; i <<= 1) {
                x = x | x >> i;
            }
            return x + 1;
        };
        if (isPowerOfTwo(image.width) && isPowerOfTwo(image.height))
            return image;
        let canvas = document.createElement("canvas");
        canvas.width = nextHighestPowerOfTwo(image.width);
        canvas.height = nextHighestPowerOfTwo(image.height);
        let ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        return canvas;
    }
    create(gl) {
        if (this.webGLTexture)
            return;
        this.webGLTexture = gl.createTexture();
        gl.bindTexture(this.target, this.webGLTexture);
        gl.texParameteri(this.target, gl.TEXTURE_MAG_FILTER, this.magFilter);
        gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, this.minFilter);
        gl.texParameteri(this.target, gl.TEXTURE_WRAP_S, this.wrapS);
        gl.texParameteri(this.target, gl.TEXTURE_WRAP_T, this.wrapT);
        gl.texImage2D(this.target, 0, this.internalFormat, this.format, this.type, this.source);
        if (this.useMipMap) {
            gl.generateMipmap(gl.TEXTURE_2D);
        }
    }
    delete(gl) {
        gl.deleteTexture(this.webGLTexture);
        this.webGLTexture = null;
    }
    bind(gl, texture) {
        gl.activeTexture(texture);
        if (!this.webGLTexture)
            this.create(gl);
        gl.bindTexture(this.target, this.webGLTexture);
    }
    static textureCollection(textures) {
        let textureCount = 0;
        let textureNumbers = {};
        return (id) => {
            if (textureNumbers[id] === undefined) {
                textureNumbers[id] = textureCount++;
            }
            return [textureNumbers[id], textures[id]];
        };
    }
}
exports.Texture = Texture;


/***/ })
/******/ ]);
});