import { Application } from './Application/Application';
import { Canvas } from './Graphics/Canvas';
import { Scene } from './Graphics/ECS';
import { Shader } from './Graphics/Shaders';
import { Vector2, Vector3 } from './Math/Vector';
import { Cube } from './Graphics/Entities/Cube';

window.addEventListener('load', () => {
  const app = new Application(60, 60);
  const canvas = new Canvas('main', new Vector2(500, 500));
  const scene = new Scene();
  Shader.canvas = canvas;

  let lastRender = Date.now();
  let lastUpdate = Date.now();

  let deltaRender;
  let deltaUpdate;

  let cube;

  app.onStart = () => {
    canvas.fullscreen(true);

    cube = new Cube(
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3(1, 1, 1)
    );
    scene.children.push(cube);
  };

  app.onRender = () => {
    lastRender = Date.now();

    scene.render();
    Shader.render();

    canvas.context2d.clearRect(
      0,
      0,
      canvas.dimensions.x - canvas.margin.x,
      canvas.dimensions.y - canvas.margin.y
    );
    canvas.context2d.font = '25px Arial';
    canvas.context2d.fillStyle = '#fff';

    deltaRender = Date.now() - lastRender;
    canvas.context2d.fillText(
      `render time: ${deltaRender.toString()}ms`,
      10,
      30
    );
    canvas.context2d.fillText(
      `update time: ${deltaUpdate.toString()}ms`,
      10,
      50
    );

    // cube.rotation.x += deltaTime * 7;
    // cube.rotation.y += deltaTime * 10;
    // cube.rotation.z += deltaTime * 3;
  };

  app.onUpdate = () => {
    lastUpdate = Date.now();
    deltaUpdate = Date.now() - lastUpdate;
  };

  app.start();
});
