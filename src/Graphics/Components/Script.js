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
    
    const name = src.split('/')[src.split('/').length - 1].split('.')[0];  
    this.name = name;

    this.src = src;
    this.getSourceCode(src);
  }

  async getSourceCode(path) {
    const file = await loadFile(path);
    this.sauce = file;
    this.initialized = true;

    let obj;
    eval(behaviour + file + `obj = new ${this.name}()`);

    this.obj = obj;

    console.log(obj);
    
  }

  update() {
    if (this.initialized) {

    }
  }
}
