import { Shader } from '../Shader';
import { Matrix4 } from '../../Math/Matrix';
import { Camera } from '../Components/Camera';
import { Vector3, Vector2 } from '../../Math/Vector';
import { Light } from '../Components/Light';

const pbrVertex = `
	attribute vec3 aVertexPosition;
	attribute vec3 aVertexNormal;
	attribute vec2 aTextureCoord;

  uniform mat4 uProjectionMatrix;
  uniform mat4 uCameraMatrix;

  varying highp vec2 vTextureCoord;
  varying highp vec3 vNormal;
  // VLIGHT

  highp vec3 light(highp vec3 pos) {
    return (pos - aVertexPosition);
  }

  highp vec3 lightView(highp vec3 pos, highp vec3 eyePos) {
    return (eyePos - pos);
  }

	void main(void) {
		gl_Position = uProjectionMatrix * uCameraMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aVertexNormal;

    // FLIGHT
	}
`;

const pbrFragment = `
  varying highp vec2 vTextureCoord;
  varying highp vec3 vNormal;
  // VLIGHT

  highp vec3 light(highp vec3 direction, highp vec3 color, highp float intensity) {
    return dot(normalize(vNormal), normalize(direction)) * color * intensity;
  }

  highp vec3 specular(highp vec3 direction, highp vec3 eyeDirection, highp vec3 color, highp float shininess) {
    highp vec3 halfVector = normalize(normalize(direction) + normalize(eyeDirection));
    return pow(dot(vNormal, halfVector), shininess) * color;
  }

  void main(void) {
    highp vec3 light = vec3(0.0, 0.0, 0.0) ;// FLIGHT0
    highp vec3 specular = vec3(0.0, 0.0, 0.0) ;// FLIGHT1
    gl_FragColor = vec4(vec3(1.0, 1.0, 1.0).xyz * light, 1.0);
	}
`;

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
function sanitize(string) {
  string = string + ' ';

  let current = false;
  let start, length = 0;
  for (let i = 0; i < string.length; i++) {
    if (string[i] === 'e')
      return '0.0';
    
    if (numbers.includes(string[i])) {
      if (current == false) {
        start = i;
        length = 1;
        current = true;
      } else {
        length++;
      }
    } else {
      if (string[i] != '.' && current == true) {
        string = string.substring(0, start) + 'float(' + string.substring(start, start + length) + ')' + string.substring(start + length);
        i = start + length + 6;
        current = false;
      } else {
        length++;
      }
    }
  }

  return string;
}

Shader.create('pbr', pbrVertex, pbrFragment, function(self, gl, program, data) {
  const lights = Light.getLights();

  // Create varyings
  let varyings = '';
  for (let i = 0; i < lights.length; i++) {
    varyings += `varying highp vec3 vLight${i};`;
    varyings += `varying highp vec3 vViewLight${i};`;
  }

  // Vertex functions
  let vFuncs = '';
  for (let i = 0; i < lights.length; i++) {
    const light = lights[i];
    const pos = light.object.getWorldPosition();
    const pos2 = Camera.getMainCamera().object.getComponent('Transform').position;
  
    vFuncs += `vLight${i} = light(vec3(${sanitize(pos.x)}, ${sanitize(pos.y)}, ${sanitize(pos.z)}));`;
    vFuncs += `vViewLight${i} = lightView(vec3(${sanitize(pos.x)}, ${sanitize(pos.y)}, ${sanitize(pos.z)}), vec3(${sanitize(pos2.x)}, ${sanitize(pos2.y)}, ${sanitize(pos2.z)}));`;
  }

  let fFuncs = '';
  for (let i = 0; i < lights.length; i++) {
    const light = lights[i];
    const pos = light.object.getWorldPosition();
    
    const color = light.color;
    const intensity = light.intensity;
    fFuncs += `+ light(vLight${i}, vec3(${sanitize(color.x)}, ${sanitize(color.y)}, ${sanitize(color.z)}), ${sanitize(intensity)})`;
    fFuncs += `+ specular(vLight${i}, vViewLight${i}, vec3(${sanitize(color.x)}, ${sanitize(color.y)}, ${sanitize(color.z)}), 200.0)`;
  }

  fFuncs += `;`
  
  let vertex = pbrVertex;
  vertex = vertex.replace('// VLIGHT', varyings);
  vertex = vertex.replace('// FLIGHT', vFuncs);
  self.vertex = vertex;
  
  let fragment = pbrFragment;
  fragment = fragment.replace('// VLIGHT', varyings);
  fragment = fragment.replace(';// FLIGHT0', fFuncs);
  self.fragment = fragment;
    
  self.compile(gl);

  const vertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
  const vertexNormal = gl.getAttribLocation(program, 'aVertexNormal');
  const textureCoord = gl.getAttribLocation(program, 'aTextureCoord');

  const projectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
  const cameraMatrix = gl.getUniformLocation(program, 'uCameraMatrix');

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

    if (indices.length > 0 ) {
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

  const camera = Camera.getMainCamera();
  const projection = Matrix4.projection(
    camera.fov,
    (Shader.canvas.dimensions.x - Shader.canvas.margin.x) /
      (Shader.canvas.dimensions.y - Shader.canvas.margin.y),
    camera.close,
    camera.far
  );
  gl.uniformMatrix4fv(projectionMatrix, false, projection);
  
  const cameraTransform = camera.object.getComponent('Transform');
  const cameraPosition = cameraTransform.position;
  const cameraRotation = cameraTransform.rotation;
  let cameraData = Matrix4.identity(1);
  cameraData = Matrix4.multiply(cameraData, Matrix4.rotation(-cameraRotation.x, new Vector3(1, 0, 0)))
  cameraData = Matrix4.multiply(cameraData, Matrix4.rotation(-cameraRotation.y, new Vector3(0, 1, 0)))
  cameraData = Matrix4.multiply(cameraData, Matrix4.rotation(-cameraRotation.z, new Vector3(0, 0, 1)))
  cameraData = Matrix4.multiply(cameraData, Matrix4.translation(new Vector3(-cameraPosition.x, -cameraPosition.y, -cameraPosition.z)));

  gl.uniformMatrix4fv(cameraMatrix, false, cameraData);

  gl.drawElements(gl.TRIANGLES, indicesData.length, gl.UNSIGNED_SHORT, 0);
});
