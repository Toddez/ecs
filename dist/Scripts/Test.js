import { Behaviour } from './Behaviour';

export class Test extends Behaviour {
  OnStart() {
    this.transform = this.object.getComponent('Transform');
    this.transform.scale.x *= 2;
  }

  OnUpdate(deltaTime) {
    this.transform.rotation.x += deltaTime * 5;
    this.transform.rotation.y += deltaTime * 8;
    this.transform.rotation.z -= deltaTime * 10;
  }
}
