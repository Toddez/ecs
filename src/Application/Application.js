export class Application {
  /**
   * Creates a application
   * @author Toddez
   * @param {Number} ups desired ups
   */
  constructor(ups, fps) {
    // Set members
    this.updateTimeStep = 1 / ups;
    this.renderTimeStep = 1 / fps;

    this.updateTime = new Date().getTime() / 1000;
    this.renderTime = new Date().getTime() / 1000;

    this.startTime = new Date().getTime() / 1000;
    this.updates = 0;
    this.frames = 0;
  }

  getTime() {
    return new Date().getTime() / 1000 - this.startTime;
  }

  /**
   * Run application
   * @author Toddez
   */
  start() {
    if (this.onStart) this.onStart();

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  /**
   *
   * @author Toddez
   */
  tick() {
    const newTime = new Date().getTime() / 1000;
    const deltaUpdate = newTime - this.updateTime;
    const deltaRender = newTime - this.renderTime;

    if (deltaUpdate >= this.updateTimeStep)
      if (this.onUpdate) {
        this.onUpdate(deltaUpdate);
        this.updates += 1;
        this.updateTime = newTime;
      }

    if (deltaRender >= this.renderTimeStep)
      if (this.onRender) {
        this.onRender(deltaRender);
        this.frames += 1;
        this.renderTime = newTime;
      }

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}
