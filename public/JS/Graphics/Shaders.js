class Shader {
	constructor() {
		this.data = new Array();
	}

	render() {
		console.warn('Default shader has no render function defined, override render()');
	}

	static shaderStack = {};
	static addShader(id, shader) {
		Shader.shaderStack[id] = shader;
	}

	static getShader(id) {
		return Shader.shaderStack[id];
	}

	static render() {
		for (let i in Shader.shaderStack) { 
			Shader.shaderStack[i].render();
			Shader.shaderStack[i].data = new Array();
		}
	}
}

class DebugShader extends Shader {
	render() {
		
	}
}