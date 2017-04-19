import { loadModel, Model } from './gltf-loader'
import { Trackball } from './trackball'

const shadowStyle = `
    <style>
        :host {
            width: 400px;
            height: 300px;
            display: inline-block;
        }
    </style>`;

class GltfViewer extends HTMLElement {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    model: Model;
    requestID: number;
    trackball: Trackball;

    get src() {
        return this.getAttribute('src');
    }

    set src(value: string | null) {
        if (value) {
            this.setAttribute('src', value);
        } else {
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

        this.trackball = new Trackball();
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
            this.model = await loadModel(this.src);
            this.model.setActiveCamera(view => this.trackball.getViewMatrix(view));
            this.requestID = requestAnimationFrame(() => this.draw());
        } else {
            cancelAnimationFrame(this.requestID);
        }
    }

    static get observedAttributes() { return ['src', 'width', 'height']; }

    attributeChangedCallback(attr: string, oldValue: any, newValue: any) {
        console.log(`Change ${attr}: ${oldValue} -> ${newValue}`);
        if (attr == 'src') {
            this.update();
        } else if (attr == 'width') {
            this.canvas.width = newValue;
        } else if (attr == 'height') {
            this.canvas.height = newValue;
        }
    }
}

customElements.define('gltf-viewer', GltfViewer);