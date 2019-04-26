class Entity {
	constructor(position, rotation, scale, shader) {
		this.children = new Array();

		this.position = position ? position : new Vector3(0, 0, 0);
		this.rotation = rotation ? rotation : new Vector3(0, 0, 0);
		this.scale = scale ? scale : new Vector3(1, 1, 1);

		this.shader = shader;
		this.shaderData = { positions: [0], indices: [0] };
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
			console.warn('No shader defined for entity');

		for (let i = 0; i < current.children.length; i++)
			this.recursive(current.children[i]);

		this.transformStack.pop(3);
	}
}