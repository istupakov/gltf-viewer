import { GltfContainer } from './gltf';
import { Node } from './node';
import { AccessorView } from './accessor'
import { mat4, quat, vec3 } from 'gl-matrix';

class Target {
    readonly id: string;
    readonly path: "translation" | "rotation" | "scale";
    readonly extensions?: object;
    readonly extras?: any;

    readonly node: Node;
    readonly default: number[];

    constructor(target: any, model: GltfContainer) {
        Object.assign(this, target);
        this.node = model.nodes[this.id];
        this.default = this.node[this.path]!;
    }

    setValue(value: quat | vec3 | undefined) {
        this.node[this.path] = <any>value || this.default;
    }
}

class Sampler {
    readonly input: AccessorView;
    readonly interpolation: "LINEAR" = "LINEAR";
    readonly output: AccessorView;
    readonly extensions?: object;
    readonly extras?: any;

    constructor(sampler: any, animation: any, model: GltfContainer) {
        Object.assign(this, sampler);
        this.input = model.accessors[animation.parameters[sampler.input]].getView();
        this.output = model.accessors[animation.parameters[sampler.output]].getView();
    }

    getValue(time: number) {
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
                    return quat.slerp(<any>a, <any>a, <any>b, t)
                } else {
                    return vec3.lerp(<any>a, a, b, t)
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
    readonly sampler: Sampler;
    readonly target: Target;
    readonly extensions?: object;
    readonly extras?: any;

    constructor(channel: any, animation: any, model: GltfContainer) {
        Object.assign(this, channel);
        this.target = new Target(channel.target, model);
        this.sampler = new Sampler(animation.samplers[channel.sampler], animation, model);
    }

    applyTime(time: number) {
        this.target.setValue(this.sampler.getValue(time));
    }
}

export class Animation {
    private readonly channels: Channel[];
    readonly name?: string;
    readonly extensions?: object;
    readonly extras?: any;

    constructor(animation: any, model: GltfContainer) {
        Object.assign(this, animation, { samplers: undefined, parameters: undefined });
        this.channels = (<any[]>animation.channels).map(channel => new Channel(channel, animation, model));
    }

    applyTime(time: number) {
        this.channels.forEach(channel => channel.applyTime(time));
    }
}