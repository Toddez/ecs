import { Component } from '../ECS';

export class Transform extends Component {
  constructor(position, rotation, scale) {
    super();

    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }
}
