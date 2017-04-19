import { Indexer } from '../utils';

const enum TextureFormat { ALPHA = 6406, RGB = 6407, RGBA = 6408, LUMINANCE = 6409, LUMINANCE_ALPHA = 6410 };
const enum TextureTarget { TEXTURE_2D = 3553 };
const enum TextureType { UNSIGNED_BYTE = 5121, UNSIGNED_SHORT_5_6_5 = 33635, UNSIGNED_SHORT_4_4_4_4 = 32819, UNSIGNED_SHORT_5_5_5_1 = 32820 };

const enum SamplerMagnificationFilter { NEAREST = 9728, LINEAR = 9729 };
const enum SamplerMinificationFilter {
    NEAREST = 9728, LINEAR = 9729,
    NEAREST_MIPMAP_NEAREST = 9984, LINEAR_MIPMAP_NEAREST = 9985,
    NEAREST_MIPMAP_LINEAR = 9986, LINEAR_MIPMAP_LINEAR = 9987
};
const enum SamplerWrappingMode { CLAMP_TO_EDGE = 33071, MIRRORED_REPEAT = 33648, REPEAT = 10497 };

export type TextureFinder = (id: string) => [number, Texture];

export class Texture {
    private readonly format: TextureFormat = TextureFormat.RGBA;
    private readonly internalFormat: TextureFormat = TextureFormat.RGBA;
    private readonly sampler: string;
    private readonly source: HTMLImageElement | HTMLCanvasElement;
    private readonly target: TextureTarget = TextureTarget.TEXTURE_2D;
    private readonly type: TextureType = TextureType.UNSIGNED_BYTE;

    private readonly magFilter: SamplerMagnificationFilter = SamplerMagnificationFilter.LINEAR;
    private readonly minFilter: SamplerMinificationFilter = SamplerMinificationFilter.NEAREST_MIPMAP_LINEAR
    private readonly wrapS: SamplerWrappingMode = SamplerWrappingMode.REPEAT;
    private readonly wrapT: SamplerWrappingMode = SamplerWrappingMode.REPEAT;

    readonly name?: string;
    readonly extensions?: object;
    readonly extras?: any;

    private readonly useMipMap: boolean;
    private webGLTexture: WebGLTexture | null = null;

    constructor(texture: object, sampler: object, source: HTMLImageElement) {
        Object.assign(this, sampler, texture, { source })

        this.useMipMap = this.minFilter == SamplerMinificationFilter.NEAREST_MIPMAP_NEAREST
            || this.minFilter == SamplerMinificationFilter.NEAREST_MIPMAP_LINEAR
            || this.minFilter == SamplerMinificationFilter.LINEAR_MIPMAP_NEAREST
            || this.minFilter == SamplerMinificationFilter.LINEAR_MIPMAP_LINEAR;
        let repeat = this.wrapS == SamplerWrappingMode.REPEAT
            || this.wrapS == SamplerWrappingMode.MIRRORED_REPEAT
            || this.wrapT == SamplerWrappingMode.REPEAT
            || this.wrapT == SamplerWrappingMode.MIRRORED_REPEAT;

        if (this.useMipMap || repeat)
            this.source = Texture.resizeIfNeed(source);
    }

    static resizeIfNeed(image: HTMLImageElement) {
        let isPowerOfTwo = (x: number) => (x & (x - 1)) == 0;
        let nextHighestPowerOfTwo = (x: number) => {
            --x;
            for (let i = 1; i < 32; i <<= 1) {
                x = x | x >> i;
            }
            return x + 1;
        }

        if (isPowerOfTwo(image.width) && isPowerOfTwo(image.height))
            return image;

        let canvas = document.createElement("canvas");
        canvas.width = nextHighestPowerOfTwo(image.width);
        canvas.height = nextHighestPowerOfTwo(image.height);
        let ctx = canvas.getContext("2d")!;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        return canvas;
    }

    create(gl: WebGLRenderingContext) {
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
            gl.generateMipmap(gl.TEXTURE_2D)
        }
    }

    delete(gl: WebGLRenderingContext) {
        gl.deleteTexture(this.webGLTexture);
        this.webGLTexture = null;
    }

    bind(gl: WebGLRenderingContext, texture: number) {
        gl.activeTexture(texture);
        if (!this.webGLTexture)
            this.create(gl);
        gl.bindTexture(this.target, this.webGLTexture);
    }

    static textureCollection(textures: Indexer<Texture>): TextureFinder {
        let textureCount = 0;
        let textureNumbers: Indexer<number> = {};
        return (id: string) => {
            if (textureNumbers[id] === undefined) {
                textureNumbers[id] = textureCount++;
            }
            return [textureNumbers[id], textures[id]];
        };
    }
}