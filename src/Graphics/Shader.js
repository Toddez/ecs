export class Shader {
  constructor(id, vertex, fragment, render) {
    this.id = id;
    this.vertex = vertex;
    this.fragment = fragment;
    this.render = render;
    this.compiled = false;
    this.data = [];
    this.program = null;
  }

  static init(canvas) {
    Shader.canvas = canvas;
    Shader.gl = canvas.gl;
  }

  static create(id, vertexSource, fragmentSource, onRender) {
    const shader = new Shader(id, vertexSource, fragmentSource, onRender);
    Shader.addShader(id, shader);
  }

  compile(gl) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, this.vertex);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error('Vertex shader error', gl.getShaderInfoLog(vertexShader));
      gl.deleteShader(vertexShader);
      console.log(this.vertex);
      
      return null;
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, this.fragment);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error(
        'Fragment shader error',
        gl.getShaderInfoLog(fragmentShader)
      );
      gl.deleteShader(fragmentShader);
      return null;
    }

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error(
        'Failed to init shader program',
        gl.getProgramInfoLog(shaderProgram)
      );
    }

    this.program = shaderProgram;
    this.compiled = true;
  }

  static addShader(id, shader) {
    if (!Shader.shaderStack) Shader.shaderStack = [];
    Shader.shaderStack.push(shader);
  }

  static getShader(id) {
    for (let i = 0; i < Shader.shaderStack.length; i += 1) {
      const shader = Shader.shaderStack[i];
      if (shader.id === id) return shader;
    }
  }

  static render() {
    const { gl } = Shader;

    gl.viewport(
      0,
      0,
      Shader.canvas.dimensions.x - Shader.canvas.margin.x,
      Shader.canvas.dimensions.y - Shader.canvas.margin.y
    );

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (const shader of Shader.shaderStack) {
      if (!shader.compiled) shader.compile(gl);

      if (shader.render) shader.render(shader, gl, shader.program, shader.data);
      else console.warn('No render method defined for shader');

      shader.data = [];
    }
  }
}
