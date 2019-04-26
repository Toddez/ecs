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

  let cube;
  let cube2;

  app.onStart = () => {
    canvas.fullscreen(true);

    cube = new Cube(
      new Vector3(0, 0, -5),
      new Vector3(0, 0, 0),
      new Vector3(1, 1, 1)
    );
    scene.children.push(cube);

    cube2 = new Cube(
      new Vector3(0, 2, 0),
      new Vector3(0, 0, 0),
      new Vector3(0.2, 2, 0.2)
    );
    cube.children.push(cube2);
  };

  app.onRender = deltaTime => {
    cube.rotation.x += deltaTime * 2;
    cube.rotation.y += deltaTime * 10;
    cube.rotation.z += deltaTime * 5;

    cube2.rotation.y += deltaTime * 50;

    scene.render();
    Shader.render();
  };

  app.onUpdate = () => {};

  app.start();
});
