import { Component } from '../Component';

const behaviour = `
class Behaviour {
  OnStart() {}

  OnUpdate() {}
}
`;

async function loadFile(path) {
  const result = await $.ajax({ url: '/file', type: 'POST', data: { path } });

  return result;
}

export class Script extends Component {
  constructor(src) {
    super();

    this.initialized = false;
    this.first = true;

    const name = src.split('/')[src.split('/').length - 1].split('.')[0];
    this.name = name;

    this.getSourceCode(src);
  }

  async getSourceCode(path) {
    let file = await loadFile(path);

    file = file.replace(/(export)/g, '');
    for (let i = 0; i < file.length; i += 1) {
      if (file.substring(i, 6) === 'import') {
        for (let j = i; j < file.length; j += 1) {
          if (file[j] === '\n') {
            file = file.substring(j);
            i = 0;
            j = file.length;
          }
        }
      }
    }

    eval(`${behaviour + file}this.obj = new ${this.name}();`);
    this.obj.object = this.object;
    if (this.obj) this.initialized = true;
  }

  update(deltaTime) {
    if (!this.initialized) return;
    if (!this.obj) return;

    if (this.first) {
      this.obj.OnStart();
      this.first = false;
    } else this.obj.OnUpdate(deltaTime);
  }
}
