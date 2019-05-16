import { Matrix4 } from '../Math/Matrix';

export class TransformStack {
  constructor() {
    this.matrices = [];
    this.start = 0;
    this.value = null;
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

    this.start = 0;
  }

  eval() {
    if (this.start === 0) this.value = Matrix4.identity();
    for (let i = this.start; i < this.matrices.length; i += 1) {
      this.value = Matrix4.multiply(this.value, this.matrices[i]);
    }

    this.start = this.matrices.length;

    return this.value;
  }
}
