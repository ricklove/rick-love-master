/* eslint-disable lines-between-class-members */
/* eslint-disable max-classes-per-file */
import { hashCode } from '../utils';
import { WebGlSystem } from './webgl';

export const createShaderFactory = ({ gl, ext }: WebGlSystem) => {
    function compileShader(type: number, source: string, keywords?: null | string[]) {
        source = addKeywords(source, keywords);

        const shader = gl.createShader(type);
        if (!shader) { throw new Error(`shader could not be created`); }

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.trace(gl.getShaderInfoLog(shader));
        }

        return shader;
    };

    function addKeywords(source: string, keywords?: null | string[]) {
        if (!keywords) return source;

        let keywordsString = ``;
        keywords.forEach(keyword => {
            keywordsString += `#define ${keyword}\n`;
        });
        return keywordsString + source;
    }

    function createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        const program = gl.createProgram();
        if (!program) { throw new Error(`program could not be created`); }

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
            console.trace(gl.getProgramInfoLog(program));

        return program;
    }

    function getUniforms(program: WebGLProgram): { [name: string]: WebGLUniformLocation } {
        const uniforms = {} as { [name: string]: WebGLUniformLocation };
        const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const uniformName = gl.getActiveUniform(program, i)?.name!;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            uniforms[uniformName] = gl.getUniformLocation(program, uniformName)!;
        }
        return uniforms;
    }

    return {
        gl,
        ext,
        compileShader,
        createProgram,
        getUniforms,
    };
};

export type ShaderFactory = ReturnType<typeof createShaderFactory>;
export type ShaderUniforms = ReturnType<ShaderFactory['getUniforms']>;

export class ShaderMaterial {
    vertexShader: WebGLShader;
    fragmentShaderSource: string;
    programs: WebGLProgram[];
    activeProgram: null | WebGLProgram;
    uniforms: ShaderUniforms;

    constructor(private factory: ShaderFactory, vertexShader: WebGLShader, fragmentShaderSource: string) {
        this.vertexShader = vertexShader;
        this.fragmentShaderSource = fragmentShaderSource;
        this.programs = [];
        this.activeProgram = null;
        this.uniforms = {};
    }

    setKeywords(keywords: string[]) {
        let hash = 0;
        for (let i = 0; i < keywords.length; i++)
            hash += hashCode(keywords[i]);

        let program = this.programs[hash];
        if (program == null) {
            const fragmentShader = this.factory.compileShader(this.factory.gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
            program = this.factory.createProgram(this.vertexShader, fragmentShader);
            this.programs[hash] = program;
        }

        if (program === this.activeProgram) return;

        this.uniforms = this.factory.getUniforms(program);
        this.activeProgram = program;
    }

    bind() {
        this.factory.gl.useProgram(this.activeProgram);
    }
}

export class ShaderProgram {
    uniforms: ShaderUniforms;
    program: WebGLProgram;

    constructor(private factory: ShaderFactory, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        this.uniforms = {};
        this.program = this.factory.createProgram(vertexShader, fragmentShader);
        this.uniforms = this.factory.getUniforms(this.program);
    }

    bind() {
        this.factory.gl.useProgram(this.program);
    }
}
