import { Application } from './Application/Application';
import { Canvas } from './Graphics/Canvas';
import { Scene } from './Graphics/ECS';
import { Shader } from './Graphics/Shader';
import { Vector2, Vector3 } from './Math/Vector';
import { Cube } from './Graphics/Entities/Cube';

window.addEventListener('load', () => {
  const app = new Application(60, 60);
  const canvas = new Canvas('main', new Vector2(500, 500));
  const scene = new Scene();
  Shader.init(canvas);

  let parent;

  app.onStart = () => {
    canvas.fullscreen(true);

    parent = new Cube(
      new Vector3(0, 0, -1),
      new Vector3(0, 0, 0),
      new Vector3(0.01, 0.01, 0.01)
    );
    scene.children.push(parent);

    let last = parent;
    for (let i = 0; i < 100; i += 1) {
      const newC = new Cube(
        new Vector3(0, 2 * Math.pow(0.999, i + 1), 0),
        new Vector3(Math.sin(i / 10) * 10, Math.cos(i / 10) * 10, 0),
        new Vector3(0.999, 0.999, 0.999)
      );
      last.children.push(newC);
      last = newC;
    }
  };

  app.onRender = deltaTime => {
    parent.rotation.x += deltaTime * 2;
    parent.rotation.y += deltaTime * 10;
    parent.rotation.z += deltaTime * 5;

    scene.render();
    Shader.render();
  };

  app.onUpdate = () => {};

  app.start();
});
