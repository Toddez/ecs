import { pseudoRandomBytes } from 'crypto';
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

  let lastRender = Date.now();
  let lastUpdate = Date.now();

  let deltaRender;
  let deltaUpdate;

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
    for (let i = 0; i < 300; i += 1) {
      const newC = new Cube(
        new Vector3(0, 2 * Math.pow(0.995, i + 1), 0),
        new Vector3(5, 3, 5),
        new Vector3(0.995, 0.995, 0.995)
      );
      last.children.push(newC);
      last = newC;
    }
  };

  app.onRender = () => {
    lastRender = Date.now();

    scene.render();

    let vertices = 0;
    const pbr = Shader.getShader('pbr');
    for (let i = 0; i < pbr.data.length; i += 1) {
      vertices += pbr.data[i].positions.length / 3;
    }

    const triangles = vertices / 3;

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
    canvas.context2d.fillText(`vertices: ${vertices.toString()}`, 10, 30);
    canvas.context2d.fillText(`triangles: ${triangles.toString()}`, 10, 50);
    canvas.context2d.fillText(
      `render time: ${deltaRender.toString()}ms`,
      10,
      70
    );
    canvas.context2d.fillText(
      `update time: ${deltaUpdate.toString()}ms`,
      10,
      90
    );
  };

  app.onUpdate = deltaTime => {
    lastUpdate = Date.now();

    parent.rotation.x += deltaTime * 2;
    parent.rotation.y += deltaTime * 10;
    parent.rotation.z += deltaTime * 5;

    deltaUpdate = Date.now() - lastUpdate;
  };

  app.start();
});
