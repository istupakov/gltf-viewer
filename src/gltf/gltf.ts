import { Indexer } from './../utils';

import { BufferView } from './buffer-view';
import { Shader } from './shader';
import { Program } from './program';
import { Material } from './material';
import { Accessor } from './accessor';
import { Scene } from './scene';
import { Node } from './node';
import { Texture } from './texture';
import { Mesh } from './mesh';
import { Animation } from './animation';

export interface GltfContainer {
    readonly buffers: Indexer<BufferView>;
    readonly shaders: Indexer<Shader>;
    readonly programs: Indexer<Program>;
    readonly materials: Indexer<Material>;
    readonly accessors: Indexer<Accessor>;
    readonly nodes: Indexer<Node>;
    readonly scenes: Indexer<Scene>;
    readonly textures: Indexer<Texture>;
    readonly meshes: Indexer<Mesh>;
    readonly animations: Indexer<Animation>;
}
