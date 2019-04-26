import { Shader } from '../Shader';
import { Matrix4 } from '../../Math/Matrix';

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

Shader.create('pbr', pbrVertex, pbrFragment, function(gl, program, data) {
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
  for (let i = 0; i < data.length; i += 1) {
    const { indices } = data[i];
    const { positions } = data[i];
    const { textureCoordinates } = data[i];
    const { vertexNormals } = data[i];

    const newIndicies = [];
    for (let j = 0; j < indices.length; j += 1) {
      newIndicies[j] = indices[j] + indexOffset;
    }

    indicesData = indicesData.concat(newIndicies);
    positionsData = positionsData.concat(positions);
    textureCoordinatesData = textureCoordinatesData.concat(textureCoordinates);
    vertexNormalsData = vertexNormalsData.concat(vertexNormals);

    indexOffset = newIndicies[newIndicies.length - 1] + 1;
  }

  const positionsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(positionsData),
    gl.STATIC_DRAW
  );

  const textureCoordinatesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordinatesBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(textureCoordinatesData),
    gl.STATIC_DRAW
  );

  const vertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(vertexNormalsData),
    gl.STATIC_DRAW
  );

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indicesData),
    gl.STATIC_DRAW
  );

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
      offset
    );
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
      offset
    );
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
      offset
    );
    gl.enableVertexAttribArray(vertexNormal);
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  gl.useProgram(program);

  const projection = Matrix4.projection(
    45,
    (Shader.canvas.dimensions.x - Shader.canvas.margin.x) /
      (Shader.canvas.dimensions.y - Shader.canvas.margin.y),
    0.1,
    100
  );
  gl.uniformMatrix4fv(projectionMatrix, false, projection);

  const modelViewData = Matrix4.identity(1);

  gl.uniformMatrix4fv(modelViewMatrix, false, modelViewData);

  gl.drawElements(gl.TRIANGLES, indicesData.length, gl.UNSIGNED_SHORT, 0);
});
