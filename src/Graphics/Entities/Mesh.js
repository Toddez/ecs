import { Entity } from '../ECS';
import { Shader } from '../Shader';
import {} from '../Shaders/PBR';

async function loadFile(path) {
  const result = await $.ajax({ url: '/file', type: 'POST', data: { path } });

  return result;
}

function parseObj(file) {
  const lines = file.split('\n');

  const { vertices, uvs, normals, indices } = lines.reduce(
    (obj, line) => {
      const spaceParse = line.split(' ');
      const type = spaceParse[0];
      spaceParse.shift();

      let isQuad;
      switch (type) {
        case 'v':
          obj.cVertices.push(
            parseFloat(spaceParse[0]),
            parseFloat(spaceParse[1]),
            parseFloat(spaceParse[2])
          );
          break;
        case 'vt':
          obj.cUvs.push(parseFloat(spaceParse[0]), parseFloat(spaceParse[1]));
          break;
        case 'vn':
          obj.cNormals.push(
            parseFloat(spaceParse[0]),
            parseFloat(spaceParse[1]),
            parseFloat(spaceParse[2])
          );
          break;
        case 'f':
          isQuad = false;

          for (let i = 0; i < spaceParse.length; i += 1) {
            if (i === 3 && !isQuad) {
              i = 2;
              isQuad = true;
            }

            if (spaceParse[i] in obj.aCache) {
              obj.indices.push(obj.aCache[spaceParse[i]]);
            } else if (isQuad === false || i === 3) {
              const ary = spaceParse[i].split('/');

              let ind = (parseInt(ary[0]) - 1) * 3;
              obj.vertices.push(
                obj.cVertices[ind],
                obj.cVertices[ind + 1],
                obj.cVertices[ind + 2]
              );

              if (ary[1] !== '') {
                ind = (parseInt(ary[1]) - 1) * 2;
                obj.uvs.push(obj.cUvs[ind], obj.cUvs[ind + 1]);
              }

              ind = (parseInt(ary[2]) - 1) * 3;
              obj.normals.push(
                obj.cNormals[ind],
                obj.cNormals[ind + 1],
                obj.cNormals[ind + 2]
              );

              obj.aCache[spaceParse[i]] = obj.index;
              obj.indices.push(obj.index);
              obj.index += 1;
            }

            if (i === 3 && isQuad) obj.indices.push(obj.aCache[spaceParse[0]]);
          }

          break;
        default:
          break;
      }

      return obj;
    },
    {
      vertices: [],
      uvs: [],
      normals: [],
      indices: [],
      cVertices: [],
      cUvs: [],
      cNormals: [],
      cIndices: [],
      aCache: [],
      index: 0,
    }
  );

  return { vertices, indices, uvs, normals };
}

export class Mesh extends Entity {
  constructor(position, rotation, scale, path) {
    super(position, rotation, scale, Shader.getShader('pbr'));

    this.setData(path);
  }

  async setData(path) {
    const file = await loadFile(path);
    const objData = parseObj(file);

    const { vertices } = objData;
    const { indices } = objData;
    const { uvs } = objData;
    const { normals } = objData;

    this.shaderData = {
      positions: vertices,
      indices,
      textureCoordinates: uvs,
      vertexNormals: normals,
    };
  }
}
