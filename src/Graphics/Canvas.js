import { Vector2 } from '../Math/Vector';

export class Canvas {
  /**
   * Creates a canvas
   * @author Toddez
   * @param {String} id
   * @param {Vector2} dimensions
   * @param {String} parent
   */
  constructor(id, dimensions, parent) {
    Canvas.canvases.push(this);

    // Set members
    this.id = id;
    this.dimensions = dimensions;
    this.parent = parent;
    this.margin = new Vector2(0, 0);

    // Initialize canvas
    this.createElements();

    this.setupWebGL();
    this.setup2d();

    this.setDimensions();

    Canvas.setupInput(this.canvasGl);
    Canvas.setupInput(this.canvas2d);
  }

  /**
   * Creates html element for this canvas
   * @author Toddez
   */
  createElements() {
    // Get parent element
    let parentElement = window.document.body;

    if (this.parent) parentElement = document.getElementById(this.parent);

    // Create and append canvas elements to parent element
    this.canvasGl = document.createElement('canvas');
    this.canvasGl.id = `${this.id}-gl`;
    this.canvasGl.style = 'position: absolute;';
    parentElement.append(this.canvasGl);

    this.canvas2d = document.createElement('canvas');
    this.canvas2d.id = `${this.id}-2d`;
    this.canvas2d.style = 'position: absolute;';
    parentElement.append(this.canvas2d);
  }

  /**
   * Setup WebGL
   * @author Toddez
   */
  setupWebGL() {
    // Grab WebGL context
    this.gl = this.canvasGl.getContext('webgl2', { antialias: true });
    const ext = this.gl.getExtension('EXT_color_buffer_float');
  }

  /**
   * Setup 2d
   * @author Toddez
   */
  setup2d() {
    // Grab 2d context
    this.context2d = this.canvas2d.getContext('2d');
  }

  /**
   * @author Toddez
   * @param {Color} color
   */
  setBackground(color) {
    this.background = color;
  }

  /**
   * Set size of canvas element, defaults to this.dimensions
   * @author Toddez
   * @param {Vector2} dimensions not necessary
   */
  setDimensions(dimensions) {
    if (dimensions) this.dimensions = dimensions;

    // Set width and height of elements
    this.canvasGl.width = this.dimensions.x - this.margin.x;
    this.canvasGl.height = this.dimensions.y - this.margin.y;

    this.canvas2d.width = this.dimensions.x - this.margin.x;
    this.canvas2d.height = this.dimensions.y - this.margin.y;
  }

  /**
   * Sets margin of canvas
   * @param {Vector2} margin
   */
  setMargin(margin) {
    this.margin = margin;
    this.setDimensions();
  }

  /**
   * Set canvas fullscreen
   * @author Toddez
   * @param {Boolean} isFullscreen
   */
  fullscreen(isFullscreen) {
    if (!this.isFullscreen) this.originalDimensions = this.dimensions;

    this.isFullscreen = isFullscreen;

    if (this.isFullscreen === true) {
      const { body } = document;
      const html = document.documentElement;

      const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.offsetHeight
      );

      this.dimensions = new Vector2(document.body.clientWidth, height);
    } else if (this.originalDimensions)
      this.dimensions = this.originalDimensions;

    this.setDimensions();
  }

  /**
   * Set all callbacks for input
   * @author Toddez
   */
  static setupInput(element) {
    // Mouse
    element.onmousemove = function(event) {
      const rect = element.getBoundingClientRect();
      Canvas.mousePos = new Vector2(
        event.clientX - rect.left,
        event.clientY - rect.top
      );

      if (Canvas.firstMouseMove) {
        Canvas.lastMousePos = Canvas.mousePos;
        Canvas.firstMouseMove = false;
      }
    };

    element.onmousedown = function() {
      Canvas.mouseDown = true;
    };

    element.onmouseup = function() {
      Canvas.mouseDown = false;
    };

    // Scroll
    element.addEventListener(
      'wheel',
      function(event) {
        Canvas.scrollTotal = new Vector2(
          Canvas.scrollTotal.x + event.deltaX,
          Canvas.scrollTotal.y + event.deltaY
        );
      },
      false
    );
  }

  /**
   * Set listeners for mouse events
   * @author Toddez
   */
  static setupMouse() {
    Canvas.mouseDown = false;
    Canvas.mousePos = new Vector2(0, 0);
    Canvas.lastMousePos = new Vector2(0, 0);
    Canvas.firstMouseMove = true;
  }

  /**
   * Set listener for scroll event
   * @author Toddez
   */
  static setupScroll() {
    Canvas.scrollTotal = new Vector2(0, 0);
    Canvas.lastScroll = new Vector2(0, 0);
  }

  /**
   * Set listener for key events
   * @author Toddez
   */
  static setupKeys() {
    Canvas.keys = {};

    window.addEventListener('keydown', event => {
      const key = Canvas.keys[event.which];
      if (key) {
        key.down = true;
        if (key.onDown) key.onDown();
      }
    });

    window.addEventListener('keyup', event => {
      const key = Canvas.keys[event.which];
      if (key) {
        key.down = false;
        if (key.onUp) key.onUp();
      }
    });
  }

  /**
   * Add listeners for specified keycode
   * @author Toddez
   * @param {Number} keycode
   * @param {Function} onDown
   * @param {Function} onUp
   */
  static registerKey(keycode, onDown, onUp) {
    Canvas.keys[keycode] = { down: false, onDown, onUp };
  }

  /**
   * Returns if specified key is down
   * @author Toddez
   * @param {Number} keycode
   * @returns {Boolean} isDown
   */
  static getKeyDown(keycode) {
    if (Canvas.keys[keycode]) return Canvas.keys[keycode].down;
    return false;
  }

  /**
   * Returns the delta mouse position
   * @author Toddez
   * @returns {Vector2} delta
   */
  static mouseDelta() {
    const delta = new Vector2(
      Canvas.mousePos.x - Canvas.lastMousePos.x,
      Canvas.mousePos.y - Canvas.lastMousePos.y
    );
    Canvas.lastMousePos = Canvas.mousePos;
    return delta;
  }

  /**
   * Returns the delta scroll
   * @author Toddez
   * @returns {Vector2} delta
   */
  static scrollDelta() {
    const delta = new Vector2(
      Canvas.scrollTotal.x - Canvas.lastScroll.x,
      Canvas.scrollTotal.y - Canvas.lastScroll.y
    );
    Canvas.lastScroll = Canvas.scrollTotal;
    return delta;
  }

  /**
   * On window reseize, update all canvases' dimensions if fullscreen
   * @author Toddez
   */
  static windowResizeCallback() {
    if (Canvas.canvases)
      for (let i = 0; i < Canvas.canvases.length; i += 1) {
        if (Canvas.canvases[i].isFullscreen)
          Canvas.canvases[i].fullscreen(true);
      }
  }
}

// Static variables
Canvas.canvases = [];

window.addEventListener('load', () => {
  // Set global callbacks
  window.addEventListener('resize', Canvas.windowResizeCallback);

  // Setup input
  Canvas.setupMouse();
  Canvas.setupKeys();
  Canvas.setupScroll();
});
