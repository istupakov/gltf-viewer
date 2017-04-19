import { GltfContainer } from './gltf';
import { Shader } from './shader';

export class Program {
    private readonly attributes: string[] = [];
    private readonly fragmentShader: Shader;
    private readonly vertexShader: Shader;
    readonly name?: string;
    readonly extensions?: object;
    readonly extras?: any;

    private webGLProgram: WebGLProgram | null = null;

    constructor(program: any, model: GltfContainer) {
        Object.assign(this, program, {
            fragmentShader: model.shaders[program.fragmentShader],
            vertexShader: model.shaders[program.vertexShader]
        });
    }

    create(gl: WebGLRenderingContext) {
        if (this.webGLProgram)
            return;

        this.webGLProgram = gl.createProgram();
        gl.attachShader(this.webGLProgram, this.vertexShader.create(gl));
        gl.attachShader(this.webGLProgram, this.fragmentShader.create(gl));
        gl.linkProgram(this.webGLProgram);

        if (!gl.getProgramParameter(this.webGLProgram, gl.LINK_STATUS))
            throw `Can't link program. Error: ${gl.getProgramInfoLog(this.webGLProgram)}`;
    }

    delete(gl: WebGLRenderingContext) {
        gl.deleteProgram(this.webGLProgram);
        this.webGLProgram = null;
    }

    getAttribLocation(gl: WebGLRenderingContext, name: string) {
        return gl.getAttribLocation(this.webGLProgram, name);
    }

    getUniformLocation(gl: WebGLRenderingContext, name: string) {
        return gl.getUniformLocation(this.webGLProgram, name);
    }

    use(gl: WebGLRenderingContext) {
        gl.useProgram(this.webGLProgram);
    }
}