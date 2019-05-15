import { Component } from '../Graphics/Component';

export class ObjectViewer {
  constructor(width, height) {
    const element = document.createElement('div');
    element.id = 'objectViewer';
    element.style.width = width;
    element.style.height = height;
    element.style.position = 'absolute';
    element.style.right = '0';
    element.style.bottom = '0';
    element.style.marginLeft = '5px';
    element.style.overflowY = 'auto';
    document.body.append(element);

    this.current = null;
    this.element = element;
  }

  clear() {
    this.current = null;
    this.element.innerHTML = '';
  }

  populate(entity) {
    this.clear();
    if (entity != null) {
      if (entity.components.length > 0) {
        this.limit = 50;
        this.add(entity.components);
      }
    }
  }

  add(entity) {
    this.limit -= 1;
    if (this.limit <= 0) {
      return;
    }

    if (entity != null) {
      const keys = Object.keys(entity);
      const values = Object.values(entity);

      for (let i = 0; i < keys.length; i += 1) {
        const old = this.current;

        const key =
          values[i] instanceof Component
            ? `component_${values[i].uniqueID}`
            : keys[i];
        const value =
          Object.keys(values[i]).length > 0 &&
          values[i].constructor.name !== 'String'
            ? values[i].constructor.name
            : values[i];

        if (this.current == null) this.addElement(this.element, key, value);
        else this.addElement(this.current, key, value);

        if (
          values[i].constructor.name !== 'String' &&
          Object.keys(values[i]).length > 0
        )
          this.add(values[i]);
        this.current = old;
      }
    }
  }

  addElement(parent, key, value) {
    const element = document.createElement('div');
    element.style.marginLeft = '10px';
    element.innerHTML = `${key}: ${value}`;

    this.current = element;

    parent.append(element);
  }
}
