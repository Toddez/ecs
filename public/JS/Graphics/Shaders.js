class Shader {
	constructor(id, vertex, fragment, render) {
		this.render = render;
		this.vertex = vertex;
		this.fragment = fragment;

		const gl = Shader.canvas.gl;

		// Create shader program
		const vertexShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertexShader, vertex);
		gl.compileShader(vertexShader);

		if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
			console.error('Vertex shader error', gl.getShaderInfoLog(vertexShader));
			gl.deleteShader(vertexShader);
			return null;
		}

		const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragmentShader, fragment);
		gl.compileShader(fragmentShader);

		if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
			console.error('Fragment shader error', gl.getShaderInfoLog(fragmentShader));
			gl.deleteShader(fragmentShader);
			return null;
		}

		const shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);

		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			console.error('Failed to init shader program', gl.getProgramInfoLog(shaderProgram));
		}

		this.program = shaderProgram;

		this.data = new Array();
		Shader.addShader(id, this);
	}

	static shaderStack = {};
	static addShader(id, shader) {
		Shader.shaderStack[id] = shader;
	}

	static getShader(id) {
		return Shader.shaderStack[id];
	}

	static render() {
		const gl = Shader.canvas.gl;

		gl.viewport(0, 0, Shader.canvas.dimensions.x - Shader.canvas.margin.x, Shader.canvas.dimensions.y - Shader.canvas.margin.y);

		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		for (let i in Shader.shaderStack) {
			let shader = Shader.shaderStack[i];
			
			if (shader.render) {

				gl.useProgram(shader.program);

				shader.render(shader.data);
			} else {
				console.warn('No render method defined for shader');
			}

			shader.data = new Array();
		}
	}
}