import { Identity } from './Identity';

export class Component {
  constructor() {
    this.uniqueID = Identity.getUniqueID();
  }

  update(deltaTime) {
    console.log(
      `Update not implemented for ${
        this.constructor.name
      } deltaTime: ${deltaTime}`
    );
  }
}
