import { Component } from "../Component";

export class Camera extends Component {
	constructor(fov, close, far) {
		super();

		if (!Camera.main) Camera.main = this;

		this.fov = fov || 45;
		this.close = close || 0.1;
		this.far = far || 100;
	}

	update() {

	}

	static getMainCamera() {
		if (!Camera.main) return new Camera();
		return Camera.main;
	}

	static setMainCamera(camera) {
		Camera.main = camera;
	}
}