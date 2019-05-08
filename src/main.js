import { Transform } from './Graphics/Components/Transform';
import { Application } from './Application/Application';
import { Canvas } from './Graphics/Canvas';
import { Scene } from './Graphics/ECS';
import { Shader } from './Graphics/Shader';
import { Vector2, Vector3 } from './Math/Vector';
import { Mesh } from './Graphics/Entities/Mesh';
import { Cube } from './Graphics/Entities/Cube';
import { SceneViewer } from './Debug/SceneViewer';
import { ObjectViewer } from './Debug/ObjectViewer';

window.addEventListener('load', () => {
  const app = new Application(60, 60);
  const canvas = new Canvas('main', new Vector2(500, 500));
  const scene = new Scene();
  Shader.init(canvas);

  canvas.setMargin(new Vector2(300, 0));
  const sceneViewer = new SceneViewer(scene, '300px', '50%');
  const objectViewer = new ObjectViewer('300px', '50%');

  let lastRender = Date.now();
  let lastUpdate = Date.now();

  let deltaRender;
  let deltaUpdate;

  let cube;

  app.onStart = () => {
    canvas.fullscreen(true);

    cube = new Cube(
      new Vector3(0, 0, -5),
      new Vector3(0, 0, 0),
      new Vector3(1, 1, 1)
    );

    scene.children.push(cube);

    cube.children.push(
      new Cube(
        new Vector3(0, 0, -5),
        new Vector3(0, 0, 45),
        new Vector3(1, 1, 1)
      )
    );

    cube.children.push(
      new Cube(
        new Vector3(0, 2, -5),
        new Vector3(0, 45, 0),
        new Vector3(1, 0.2, 1)
      )
    );

    scene.children.push(
      new Mesh(
        new Vector3(0, -6, -9),
        new Vector3(0, 25, 0),
        new Vector3(0.5, 0.5, 0.5),
        'Obj/male.obj'
      )
    );
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

    cube.rotation.x += deltaTime * 10;
    cube.rotation.y += deltaTime * 30;
    cube.rotation.z += deltaTime * 50;

    sceneViewer.populate();
    objectViewer.populate(sceneViewer.selected);

    deltaUpdate = Date.now() - lastUpdate;
  };

  app.start();
});
