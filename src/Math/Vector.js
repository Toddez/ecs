import { Matrix4 } from "./Matrix";

export class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static mulM3(v, m) {
    const x = m[0] * v.x + m[1] * v.y;
    const y = m[3] * v.x + m[4] * v.y;
    return new Vector2(x, y);
  }
}

export class Vector3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static cross(a, b) {    
    return new Vector3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
  }
}

export class Vector4 {
  constructor(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  static add(v1, v2) {
    return new Vector2(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z, v1.w + v2.w);
  }

  static sub(v1, v2) {
    return new Vector2(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z, v1.w - v2.w);
  }

  static mul(v1, v2) {
    return new Vector2(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z, v1.w * v2.w);
  }

  static div(v1, v2) {
    return new Vector2(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z, v1.w / v2.w);
  }
}
