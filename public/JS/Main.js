window.addEventListener('load', () => {

	const app = new Application(60, 60);
	const canvas = new Canvas('main', new Vector2(500, 500));
	const scene = new Scene();
	Shader.canvas = canvas;

	let lastRender = Date.now();
	let lastUpdate = Date.now();

	let deltaRender, deltaUpdate;

	app.onStart = () => {
		canvas.fullscreen(true);

		const pbr = new Shader('pbr', pbrVertex, pbrFragment, function (gl, program, data) {

			const vertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
			const vertexNormal = gl.getAttribLocation(program, 'aVertexNormal');
			const textureCoord = gl.getAttribLocation(program, 'aTextureCoord');
			const modelViewMatrix = gl.getAttribLocation(program, 'uModelViewMatrix');
		  
			const projectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');

			let modelViewData = [];
			let indicesData = [];
			let positionsData = [];
			let textureCoordinatesData = [];
			let vertexNormalsData = [];

			let indexOffset = 0;
			for (let i = 0; i < data.length; i++) {
				const modelView = data[i].modelView;
				let indices = data[i].data.indices;
				const positions = data[i].data.positions;
				const textureCoordinates = data[i].data.textureCoordinates;
				const vertexNormals = data[i].data.vertexNormals;

				indices.map((v) => { return v + indexOffset; });

				modelViewData = modelViewData.concat(modelView);
				indicesData = indicesData.concat(indices);
				positionsData = positionsData.concat(positions);
				textureCoordinatesData = textureCoordinatesData.concat(textureCoordinates);
				vertexNormalsData = vertexNormalsData.concat(vertexNormalsData);

				indexOffset += indices.length;				
			}

			const modelViewBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, modelViewBuffer);
			gl.bufferData()
		});

		let cube = new Cube(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(1, 1, 1));
		scene.children.push(cube);
	};

	app.onRender = (deltaTime) => {
		lastRender = Date.now();

		scene.render();
		Shader.render();

		canvas.context2d.clearRect(0, 0, canvas.dimensions.x - canvas.margin.x, canvas.dimensions.y - canvas.margin.y);
		canvas.context2d.font = "25px Arial";
		canvas.context2d.fillStyle = '#fff';

		deltaRender = Date.now() - lastRender;
		canvas.context2d.fillText('render time: ' + deltaRender.toString() + 'ms', 10, 30);
		canvas.context2d.fillText('update time: ' + deltaUpdate.toString() + 'ms', 10, 50);
	};

	app.onUpdate = (deltaTime) => {
		lastUpdate = Date.now();
		deltaUpdate = Date.now() - lastUpdate;
	};

	app.start();
});

class Cube extends Entity {
	constructor(position, rotation, scale) {
		super(position, rotation, scale, Shader.getShader('pbr'));

		const positions = [-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0];

		const indices = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23];

		const textureCoordinates = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];

		const vertexNormals = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0];

		this.shaderData = { positions, indices, textureCoordinates, vertexNormals };
	}
}

const pbrVertex = `
	void main() {

	}
`;
const pbrFragment = `
	void main() {

	}
`;