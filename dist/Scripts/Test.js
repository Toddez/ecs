class Test extends Behaviour {
  OnStart() {
    this.transform = this.object.getComponent('Transform');
  }

  OnUpdate(deltaTime) {
    this.transform.rotation.y -= deltaTime * 5;
  }
}
