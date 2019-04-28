import { Application } from './Application/Application';
import { Canvas } from './Graphics/Canvas';
import { Scene } from './Graphics/ECS';
import { Shader } from './Graphics/Shader';
import { Vector2, Vector3 } from './Math/Vector';
import { Mesh } from './Graphics/Entities/Mesh';

window.addEventListener('load', () => {
  const app = new Application(60, 60);
  const canvas = new Canvas('main', new Vector2(500, 500));
  const scene = new Scene();
  Shader.init(canvas);

  let lastRender = Date.now();
  let lastUpdate = Date.now();

  let deltaRender;
  let deltaUpdate;

  let mesh;

  app.onStart = () => {
    canvas.fullscreen(true);

    mesh = new Mesh(
      new Vector3(0, -1, -3),
      new Vector3(0, 0, 0),
      new Vector3(0.1, 0.1, 0.1),
      'Obj/male.obj'
    );
    scene.children.push(mesh);

    const mesh2 = new Mesh(
      new Vector3(2, -1, -3),
      new Vector3(0, 0, 0),
      new Vector3(0.1, 0.1, 0.1),
      'Obj/male.obj'
    );
    scene.children.push(mesh2);
  };

  app.onRender = () => {
    lastRender = Date.now();

    scene.render();

    let vertices = 0;
    const pbr = Shader.getShader('pbr');
    for (let i = 0; i < pbr.data.length; i += 1) {
      vertices += pbr.data[i].positions.length / 3;
    }

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
    canvas.context2d.fillText(
      `fps: ${parseInt(app.getPerformance().fps)}`,
      10,
      70
    );
    canvas.context2d.fillText(
      `render time: ${deltaRender.toString()}ms`,
      10,
      90
    );
    canvas.context2d.fillText(
      `ups: ${parseInt(app.getPerformance().ups)}`,
      10,
      130
    );
    canvas.context2d.fillText(
      `update time: ${deltaUpdate.toString()}ms`,
      10,
      150
    );
  };

  app.onUpdate = deltaTime => {
    lastUpdate = Date.now();

    mesh.rotation.y += deltaTime * 10;

    deltaUpdate = Date.now() - lastUpdate;
  };

  app.start();
});
