import { Component } from '../Component';
import { Vector3 } from '../../Math/Vector';

const LIB_VECTOR3 = Vector3;

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

  static init(Identity, Canvas) {
    Script.Identity = Identity;
    Script.Canvas = Canvas;
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

    eval(`${behaviour + file}this.reference = new ${this.name}();`);
    if (this.reference) { 
      this.initialized = true;
      this.reference.object = this.object;
      this.reference.Identity = Script.Identity;
      this.reference.Canvas = Script.Canvas;
    }
  }

  update(deltaTime) {
    if (!this.initialized) return;
    if (!this.reference) return;

    if (this.first) {
      this.reference.OnStart();
      this.first = false;
    } else this.reference.OnUpdate(deltaTime);
  }
}
