import { Component } from '../Component';

export class Transform extends Component {
  constructor(position, rotation, scale) {
    super();

    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }

  update() {
    this.position.x %= 360;
    this.position.y %= 360;
    this.position.z %= 360;

    this.rotation.x %= 360;
    this.rotation.y %= 360;
    this.rotation.z %= 360;

    this.scale.x %= 360;
    this.scale.y %= 360;
    this.scale.z %= 360;
  }
}
