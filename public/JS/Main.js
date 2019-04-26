window.addEventListener('load', () => {

	const app = new Application(60, 60);
	const canvas = new Canvas('main', new Vector2(500, 500));
	const scene = new Scene();
	Shader.canvas = canvas;

	let lastRender = Date.now();
	let lastUpdate = Date.now();

	let deltaRender, deltaUpdate;
	
	let cube;

	app.onStart = () => {
		canvas.fullscreen(true);

		const pbr = new Shader('pbr', pbrVertex, pbrFragment, function (gl, program, data) {

			const vertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
			const vertexNormal = gl.getAttribLocation(program, 'aVertexNormal');
			const textureCoord = gl.getAttribLocation(program, 'aTextureCoord');

			const modelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix');
			const projectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');

			let indicesData = [];
			let positionsData = [];
			let textureCoordinatesData = [];
			let vertexNormalsData = [];

			let indexOffset = 0;
			for (let i = 0; i < data.length; i++) {
				const modelView = data[i].modelView;
				let indices = data[i].data.indices;
				let positions = data[i].data.positions;
				const textureCoordinates = data[i].data.textureCoordinates;
				const vertexNormals = data[i].data.vertexNormals;

				indices.map((v) => { return v + indexOffset; });
				positions.map((v, i) => { 
					return v;
					// Multiply by transformation stack model view
				});

				indicesData = indicesData.concat(indices);
				positionsData = positionsData.concat(positions);
				textureCoordinatesData = textureCoordinatesData.concat(textureCoordinates);
				vertexNormalsData = vertexNormalsData.concat(vertexNormals);

				indexOffset += indices.length;
			}

			const positionsBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionsData), gl.STATIC_DRAW);

			const textureCoordinatesBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordinatesBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinatesData), gl.STATIC_DRAW);

			const vertexNormalBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormalsData), gl.STATIC_DRAW);

			const indexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicesData), gl.STATIC_DRAW);

			{
				const numComponents = 3;
				const type = gl.FLOAT;
				const normalize = false;
				const stride = 0;
				const offset = 0;
				gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
				gl.vertexAttribPointer(
					vertexPosition,
					numComponents,
					type,
					normalize,
					stride,
					offset);
				gl.enableVertexAttribArray(vertexPosition);
			}

			{
				const numComponents = 2;
				const type = gl.FLOAT;
				const normalize = false;
				const stride = 0;
				const offset = 0;
				gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordinatesBuffer);
				gl.vertexAttribPointer(
					textureCoord,
					numComponents,
					type,
					normalize,
					stride,
					offset);
				gl.enableVertexAttribArray(textureCoord);
			}

			{
				const numComponents = 3;
				const type = gl.FLOAT;
				const normalize = false;
				const stride = 0;
				const offset = 0;
				gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
				gl.vertexAttribPointer(
					vertexNormal,
					numComponents,
					type,
					normalize,
					stride,
					offset);
				gl.enableVertexAttribArray(vertexNormal);
			}

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

			gl.useProgram(program);

			const projection = Matrix4.projection(45, (Shader.canvas.dimensions.x - Shader.canvas.margin.x) / (Shader.canvas.dimensions.y - Shader.canvas.margin.y), 0.1, 100);
			gl.uniformMatrix4fv(
				projectionMatrix,
				false,
				projection);
			
			const modelViewData = Matrix4.identity(1);

			gl.uniformMatrix4fv(
				modelViewMatrix,
				false,
				modelViewData
			);
			
			gl.drawElements(gl.TRIANGLES, indicesData.length, gl.UNSIGNED_SHORT, 0);
		});

		cube = new Cube(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(1, 1, 1));
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

		//cube.rotation.x += deltaTime * 7;
		//cube.rotation.y += deltaTime * 10;
		//cube.rotation.z += deltaTime * 3;
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
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
  vTextureCoord = aTextureCoord;

  highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
  highp vec3 directionalLightColor = vec3(1, 1, 1);
  highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
  highp vec4 transformedNormal = vec4(aVertexNormal, 1.0);
  highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
  vLighting = ambientLight + (directionalLightColor * directional);
}
`;
const pbrFragment = `
varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

void main(void) {;
  gl_FragColor = vec4(vec3(vTextureCoord.x, vTextureCoord.y, 1.0).xyz * vLighting, 1.0);
}
`;