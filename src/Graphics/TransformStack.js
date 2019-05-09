import { Matrix4 } from '../Math/Matrix';

export class TransformStack {
  constructor() {
    this.matrices = [];
  }

  push(m) {
    if (!m) return;
    this.matrices.push(m);
  }

  pop(n) {
    const count = n || 1;
    for (let i = 0; i < count; i += 1) {
      this.matrices.pop();
    }
  }

  eval() {
    let value = Matrix4.identity();
    for (let i = 0; i < this.matrices.length; i += 1) {
      value = Matrix4.multiply(value, this.matrices[i]);
    }

    return value;
  }
}
