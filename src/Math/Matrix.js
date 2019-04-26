import { Vector3 } from './Vector';

export class Matrix4 {
  static identity(v) {
    if (!v) return Matrix4.identity(1);
    return [v, 0, 0, 0, 0, v, 0, 0, 0, 0, v, 0, 0, 0, 0, v];
  }

  static translation(v) {
    const result = Matrix4.identity(1);

    result[0 + 3 * 4] = v.x;
    result[1 + 3 * 4] = v.y;
    result[2 + 3 * 4] = v.z;

    return result;
  }

  static rotation(angle, axis) {
    const result = Matrix4.identity(1);

    const r = angle * (Math.PI / 180);
    const c = Math.cos(r);
    const s = Math.sin(r);
    const mc = 1 - c;

    const { x } = axis;
    const { y } = axis;
    const { z } = axis;

    result[0 + 0 * 4] = x * mc + c;
    result[1 + 0 * 4] = y * x * mc + z * s;
    result[2 + 0 * 4] = y * z * mc - y * s;

    result[0 + 1 * 4] = x * y * mc - z * s;
    result[1 + 1 * 4] = y * mc + c;
    result[2 + 1 * 4] = y * z * mc + x * s;

    result[0 + 2 * 4] = x * z * mc + y * s;
    result[1 + 2 * 4] = y * z * mc - x * s;
    result[2 + 2 * 4] = z * mc + c;

    return result;
  }

  static scaling(v) {
    const result = Matrix4.identity(1);

    result[0 + 0 * 4] = v.x;
    result[1 + 1 * 4] = v.y;
    result[2 + 2 * 4] = v.z;

    return result;
  }

  static multiply(a, b) {
    const m = new Array(16);

    for (let r = 0; r < 4; r += 1) {
      for (let c = 0; c < 4; c += 1) {
        m[r + c * 4] = 0;

        for (let i = 0; i < 4; i += 1) {
          m[r + c * 4] += a[r + i * 4] * b[i + c * 4];
        }
      }
    }

    return m;
  }

  static multiplyVector(m, v) {
    return new Vector3(
      m[0 + 0 * 4].x * v.x +
        m[1 + 0 * 4].x * v.y +
        m[2 + 0 * 4].x * v.z +
        m[3 + 0 * 4].x,
      m[0 + 1 * 4].y * v.x +
        m[1 + 1 * 4].y * v.y +
        m[2 + 1 * 4].y * v.z +
        m[3 + 1 * 4].y,
      m[0 + 2 * 4].z * v.x +
        m[1 + 2 * 4].z * v.y +
        m[2 + 2 * 4].z * v.z +
        m[3 + 2 * 4].z
    );
  }

  static projection(fov, ar, zMin, zMax) {
    const ang = Math.tan((fov * 0.5 * Math.PI) / 180);
    return [
      0.5 / ang,
      0,
      0,
      0,
      0,
      (0.5 * ar) / ang,
      0,
      0,
      0,
      0,
      -(zMax + zMin) / (zMax - zMin),
      -1,
      0,
      0,
      (-2 * zMax * zMin) / (zMax - zMin),
      0,
    ];
  }
}
