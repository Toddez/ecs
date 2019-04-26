import { Matrix4 } from '../Math/Matrix';
import { Vector3 } from '../Math/Vector';

export class Entity {
  constructor(position, rotation, scale, shader) {
    this.children = [];

    this.position = position || new Vector3(0, 0, 0);
    this.rotation = rotation || new Vector3(0, 0, 0);
    this.scale = scale || new Vector3(1, 1, 1);

    this.shader = shader;
    this.shaderData = { positions: [0], indices: [0] };
  }
}

class TransformStack {
  constructor() {
    this.matrices = [];
  }

  push(m) {
    if (!m) return;

    this.matrices.push(m);
  }

  pop(n) {
    const count = n || 1;
    for (let i = 0; i < count; i += 1) {
      this.matrices.pop();
    }
  }

  eval() {
    let value = Matrix4.identity();

    for (let i = 0; i < this.matrices.length; i += 1) {
      value = Matrix4.multiply(value, this.matrices[i]);
    }

    return value;
  }
}

export class Scene {
  constructor() {
    this.transformStack = new TransformStack();
    this.children = [];
  }

  render() {
    this.transformStack = new TransformStack();
    for (let i = 0; i < this.children.length; i += 1)
      this.recursive(this.children[i]);
  }

  recursive(current) {
    this.transformStack.push(Matrix4.translation(current.position));
    this.transformStack.push(
      Matrix4.rotation(current.rotation.x, new Vector3(1, 0, 0))
    );
    this.transformStack.push(
      Matrix4.rotation(current.rotation.y, new Vector3(0, 1, 0))
    );
    this.transformStack.push(
      Matrix4.rotation(current.rotation.z, new Vector3(0, 0, 1))
    );
    this.transformStack.push(Matrix4.scaling(current.scale));

    if (current.shader)
      current.shader.data.push({
        data: current.shaderData,
        modelView: this.transformStack.eval(),
      });
    else console.warn('No shader defined for entity');

    for (let i = 0; i < current.children.length; i += 1)
      this.recursive(current.children[i]);

    this.transformStack.pop(3);
  }
}
