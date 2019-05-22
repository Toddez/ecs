import { Transform } from './Components/Transform';
import { Vector3 } from '../Math/Vector';
import { Identity } from './Identity';

export class Entity {
  constructor(position, rotation, scale, shader) {
    this.uniqueID = Identity.getUniqueID(this);
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

    this.shaderData = { positions: [], indices: [] };
  }

  update(deltaTime) {
    for (let i = 0; i < this.children.length; i += 1) {
      this.children[i].update(deltaTime);
    }

    for (let i = 0; i < this.components.length; i += 1) {
      this.components[i].update(deltaTime);
    }
  }

  addComponent(component) {
    component.object = this;
    if (this.getComponent(component.constructor.name) == null)
      this.components.push(component);
  }

  getComponent(componentType) {
    for (let i = 0; i < this.components.length; i += 1)
      if (
        (componentType instanceof Object &&
          this.components[i] instanceof componentType) ||
        this.components[i].constructor.name === componentType
      )
        return this.components[i];

    return null;
  }

  addEntity(entity) {
    this.children.push(entity);
    entity.parent = this;
  }

  getEntity(id) {
    if (id === this.uniqueID) return this;
    for (let i = 0; i < this.children.length; i += 1) {
      if (this.children[i].getEntity(id) != null)
        return this.children[i].getEntity(id);
    }
  }
}
