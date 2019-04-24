class Shader {
	constructor() {
		this.flush();
	}

	flush() {
		this.positions = [];
		this.indices = [];
	}
	
	render() {
		console.warn('Default shader has no render function defined, override render()');
	}

	static NULL = -1;
	static shaderStack = [];

	static addShader(shader) {
		Shader.shaderStack.push(shader);
	}

	static render() {
		for (let i = 0; i < Shader.shaderStack.length; i++) {
			Shader.shaderStack[i].render();
			Shader.shaderStack[i].flush();
		}
	}
}

class DebugShader extends Shader {
	flush() {
		super.flush();

		this.textureCoordinates = [];
		this.vertexNormals = [];
	}

	render() {

	}
}