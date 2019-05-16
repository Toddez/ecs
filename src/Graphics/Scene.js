import { Identity } from './Identity';
import { TransformStack } from './TransformStack';
import { Vector3 } from '../Math/Vector';
import { Matrix4 } from '../Math/Matrix';

export class Scene {
  constructor() {
    this.uniqueID = Identity.getUniqueID();
    this.transformStack = new TransformStack();
    this.children = [];
  }

  addEntity(entity) {
    this.children.push(entity);
    entity.parent = this;
  }

  getEntity(id) {
    if (this.uniqueID === id) return this;

    for (let i = 0; i < this.children.length; i += 1) {
      if (this.children[i].getEntity(id) != null)
        return this.children[i].getEntity(id);
    }

    return null;
  }

  update(deltaTime) {
    for (let i = 0; i < this.children.length; i += 1) {
      this.children[i].update(deltaTime);
    }
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
