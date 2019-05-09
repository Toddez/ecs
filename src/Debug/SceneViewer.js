import { Scene } from '../Graphics/Scene';
import { Entity } from '../Graphics/Entity';

export class SceneViewer {
  constructor(scene, width, height) {
    this.scene = scene;
    const element = document.createElement('div');
    element.id = 'sceneViewer';
    element.style.width = width;
    element.style.height = height;
    element.style.position = 'absolute';
    element.style.right = '0';
    element.style.marginLeft = '5px';
    element.style.overflowY = 'auto';
    document.body.append(element);

    document.querySelector('body').addEventListener('click', event => {
      event.preventDefault();

      if (event.target.class === 'entity') {
        const entity = scene.getEntity(parseInt(event.target.id.split('_')[1]));

        if (entity != null) this.selected = entity;
      }
    });

    this.element = element;
    this.current = null;
    this.selected = null;
  }

  clear() {
    this.current = null;
    this.element.innerHTML = '';
  }

  populate() {
    this.clear();
    this.add(this.scene);
  }

  add(entity) {
    const element = document.createElement('div');
    element.style.marginLeft = '10px';

    if (entity instanceof Scene) {
      element.innerHTML = `scene_${entity.uniqueID}`;
      element.id = `scene_${entity.uniqueID}`;
      element.class = 'scene';
    } else if (entity instanceof Entity) {
      element.innerHTML = `entity_${entity.uniqueID}`;
      element.id = `entity_${entity.uniqueID}`;
      element.class = 'entity';
    }

    if (this.current == null) this.element.append(element);
    else this.current.append(element);

    const old = this.current;
    this.current = element;

    for (let i = 0; i < entity.children.length; i += 1) {
      this.add(entity.children[i]);
    }

    this.current = old;
  }
}
