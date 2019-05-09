import { Transform } from './Components/Transform';
import { Vector3 } from '../Math/Vector';
import { Identity } from './Identity';

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

  update() {
    for (let i = 0; i < this.children.length; i += 1) {
      this.children[i].update();
    }

    for (let i = 0; i < this.components.length; i += 1) {
      this.components[i].update();
    }
  }

  getEntity(id) {
    if (id === this.uniqueID) return this;
    for (let i = 0; i < this.children.length; i += 1) {
      if (this.children[i].getEntity(id) != null)
        return this.children[i].getEntity(id);
    }
  }
}
