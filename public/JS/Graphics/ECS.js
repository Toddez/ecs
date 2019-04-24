class Entity {
	constructor(position, rotation, scale) {
		this.shader = undefined;

		this.children = new Array();
		this.shaderData = { positions: [0], indices: [0] };
		this.position = position ? position : new Vector3(0, 0, 0);
		this.rotation = rotation ? rotation : new Vector3(0, 0, 0);
		this.scale = scale ? scale : new Vector3(1, 1, 1);
	}

	setShader(id) {
		this.shader = Shader.getShader(id);
	}
}

class Cube extends Entity {
	constructor(position, rotation, scale) {
		super(position, rotation, scale);

		const positions = [-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0];

		const indices = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23];

		const textureCoordinates = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];

		const vertexNormals = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0];

		this.shaderData = { positions, indices, textureCoordinates, vertexNormals };
	}
}

class TransformStack {
	constructor() {
		this.matrices = new Array();
	}

	push(m) {
		if (!m)
			return;

		this.matrices.push(m);
	}

	pop(n) {
		if (!n)
			n = 1;

		for (let i = 0; i < n; i++) {
			this.matrices.pop();
		}
	}

	eval() {
		let value = Matrix4.identity();

		for (let i = 0; i < this.matrices.length; i++) {
			value = Matrix4.multiply(value, this.matrices[i]);
		}

		return value;
	}
}

class Scene {
	constructor() {
		this.transformStack = new TransformStack();
		this.children = new Array();
	}

	update() {

	}

	render() {
		for (let i = 0; i < this.children.length; i++)
			this.recursive(this.children[i]);
	}

	recursive(current) {
		this.transformStack.push(Matrix4.scaling(current.scale));
		this.transformStack.push(Matrix4.rotation(current.rotation));
		this.transformStack.push(Matrix4.translation(current.position));

		if (current.shader)
			current.shader.data.push({ data: current.shaderData, modelView: this.transformStack.eval() });
		else
			console.warn('No shader defined for entity: ', current);

		for (let i = 0; i < current.children.length; i++)
			this.recursive(current.children[i]);

		this.transformStack.pop(3);
	}
}