const enum ShaderType { FRAGMENT_SHADER = 35632, VERTEX_SHADER = 35633 }

export class Shader {
    private readonly type: ShaderType;
    readonly name?: string;
    readonly extensions?: object;
    readonly extras?: any;

    private readonly source: string;
    private webGLShader: WebGLShader | null = null;

    constructor(shader: object, source: string) {
        Object.assign(this, shader, { uri: undefined });
        this.source = source;
    }

    create(gl: WebGLRenderingContext) {
        if (!this.webGLShader) {
            this.webGLShader = gl.createShader(this.type);
            gl.shaderSource(this.webGLShader, this.source);
            gl.compileShader(this.webGLShader);

            if (!gl.getShaderParameter(this.webGLShader, gl.COMPILE_STATUS))
                throw `Can't compile shader. Error: ${gl.getShaderInfoLog(this.webGLShader)}`;
        }
        return this.webGLShader;
    }

    delete(gl: WebGLRenderingContext) {
        gl.deleteShader(this.webGLShader);
        this.webGLShader = null;
    }
}