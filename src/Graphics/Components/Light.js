import { Vector3 } from "../../Math/Vector";
import { Component } from "../Component";

export class Light extends Component {
	constructor(color, intensity) {
		super();

		this.color = color || new Vector3(1, 1, 1);
		this.intensity = intensity || 1;

		if (!Light.sources) Light.sources = [];
		Light.sources.push(this);
	}

	update() {}

	static getLights() {
		if (!Light.sources) return [];
		return Light.sources;
	}
}