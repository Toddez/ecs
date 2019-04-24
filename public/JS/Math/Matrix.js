class Matrix4 {
	static identity(v) {
		if (!v)
			v = 1;

		return [v, 0, 0, 0,
			0, v, 0, 0,
			0, 0, v, 0,
			0, 0, 0, v];
	}

	static translation(v) {
		return [16];
	}

	static rotation(v) {
		return [16];
	}

	static scaling(v) {
		return [16];
	}

	static multiply(a, b) {
		let m = new Array(16);
		for (let r = 0; r < 4; ++r) {
			for (let c = 0; c < 4; ++c) {
				m[r + c * 4] = 0;

				for (let i = 0; i < 4; ++i) {
					m[r + c * 4] += a[r + i * 4] * b[i + c * 4];
				}
			}
		}

		return m;
	}

	static projection(fov, ar, zMin, zMax) {
		var ang = Math.tan((fov * .5) * Math.PI / 180);
		return [
			0.5 / ang, 0, 0, 0,
			0, 0.5 * ar / ang, 0, 0,
			0, 0, -(zMax + zMin) / (zMax - zMin), -1,
			0, 0, (-2 * zMax * zMin) / (zMax - zMin), 0
		];
	}
}