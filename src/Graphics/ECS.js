import { Matrix4 } from '../Math/Matrix';
import { Vector3 } from '../Math/Vector';
import { Transform } from './Components/Transform';

class Identity {
  static getUniqueID() {
    if (!Identity.currentID) Identity.currentID = 0;
    return (Identity.currentID += 1);
  }
}
export class Entity {
  constructor(position, rotation, scale, shader) {
    this.uniqueID = Identity.getUniqueID();
    this.components = [];
    this.children = [];

    this.components.push(
      new Transform(
        position || new Vector3(0, 0, 0),
        rotation || new Vector3(0, 0, 0),
        scale || new Vector3(1, 1, 1)
      )
    );

    this.position = position || new Vector3(0, 0, 0);
    this.rotation = rotation || new Vector3(0, 0, 0);
    this.scale = scale || new Vector3(1, 1, 1);

    this.shader = shader;

    this.shaderData = { positions: [0], indices: [0] };
  }

  getEntity(id) {
    if (id === this.uniqueID) return this;
    for (let i = 0; i < this.children.length; i += 1) {
      if (this.children[i].getEntity(id) != null)
        return this.children[i].getEntity(id);
    }
  }
}

export class Component {
  constructor() {
    this.uniqueID = Identity.getUniqueID();
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
    this.uniqueID = Identity.getUniqueID();
    this.transformStack = new TransformStack();
    this.children = [];
  }

  getEntity(id) {
    for (let i = 0; i < this.children.length; i += 1) {
      if (this.children[i].getEntity(id) != null)
        return this.children[i].getEntity(id);
    }

    return null;
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

    if (current.shader) {
      const matrix = this.transformStack.eval();

      const newPositions = [];
      for (let i = 0; i < current.shaderData.positions.length; i += 1) {
        let value = 0;
        if (i % 3 === 0) {
          value = Matrix4.multiplyVector(
            matrix,
            new Vector3(
              current.shaderData.positions[i],
              current.shaderData.positions[i + 1],
              current.shaderData.positions[i + 2]
            )
          ).x;
        } else if (i % 3 === 1) {
          value = Matrix4.multiplyVector(
            matrix,
            new Vector3(
              current.shaderData.positions[i - 1],
              current.shaderData.positions[i],
              current.shaderData.positions[i + 1]
            )
          ).y;
        } else {
          value = Matrix4.multiplyVector(
            matrix,
            new Vector3(
              current.shaderData.positions[i - 2],
              current.shaderData.positions[i - 1],
              current.shaderData.positions[i]
            )
          ).z;
        }

        newPositions.push(value);
      }

      let data = {};
      data = Object.assign(data, current.shaderData);
      data.positions = newPositions;

      current.shader.data.push(data);
    } else {
      console.warn('No shader defined for entity');
    }
    for (let i = 0; i < current.children.length; i += 1)
      this.recursive(current.children[i]);

    this.transformStack.pop(5);
  }
}
