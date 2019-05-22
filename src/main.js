import { Application } from './Application/Application';
import { Canvas } from './Graphics/Canvas';
import { Scene } from './Graphics/Scene';
import { Shader } from './Graphics/Shader';
import { Vector2, Vector3 } from './Math/Vector';
import { Mesh } from './Graphics/Entities/Mesh';
import { Cube } from './Graphics/Entities/Cube';
import { Entity } from './Graphics/Entity';
import { SceneViewer } from './Debug/SceneViewer';
import { ObjectViewer } from './Debug/ObjectViewer';
import { Script } from './Graphics/Components/Script';
import { Camera } from './Graphics/Components/Camera';
import { Light } from './Graphics/Components/Light';
import { Identity } from './Graphics/Identity';

window.addEventListener('load', () => {
  const app = new Application(60, 60);
  const canvas = new Canvas('main', new Vector2(500, 500));
  const scene = new Scene();
  Shader.init(canvas);
  Script.init(Identity, Canvas);

  canvas.setMargin(new Vector2(300, 0));
  const sceneViewer = new SceneViewer(scene, '300px', '50%');
  const objectViewer = new ObjectViewer('300px', '50%');

  let lastRender = Date.now();
  let lastUpdate = Date.now();

  let deltaRender;
  let deltaUpdate;

  app.onStart = () => {
    canvas.fullscreen(true);

    const camera = new Entity(new Vector3(0, 1, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0), Shader.getShader('pbr'));
    camera.addComponent(new Camera());
    camera.addComponent(new Script('Scripts/CamMovement.js'));
    scene.addEntity(camera);

    scene.addEntity(new Cube(
      new Vector3(0, -2, 0),
      new Vector3(0, 0, 0),
      new Vector3(5, 1, 5)
    ));

    const cube = new Cube(
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3(1, 1, 1)
    );
    cube.addComponent(new Script('Scripts/RotateYaw.js'));
    scene.addEntity(cube);

    const light = new Entity(
      new Vector3(5, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3(1, 1, 1)
    );
    light.addComponent(new Light(new Vector3(0, 1, 0), 1));
    cube.addEntity(light);

    const light2 = new Entity(
      new Vector3(-5, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3(1, 1, 1)
    );
    light2.addComponent(new Light(new Vector3(1, 0, 0), 1));
    cube.addEntity(light2);
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

    scene.update(deltaTime);

    sceneViewer.populate();
    objectViewer.populate(sceneViewer.selected);

    deltaUpdate = Date.now() - lastUpdate;
  };

  app.start();
});
