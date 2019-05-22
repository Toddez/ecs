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
    this.perfTime = new Date().getTime() / 1000;

    this.updates = 0;
    this.frames = 0;
    this.fps = fps;
    this.ups = ups;
  }

  getTime() {
    return new Date().getTime() / 1000 - this.startTime;
  }

  getPerformance() {
    return { fps: this.fps, ups: this.ups };
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
    let deltaUpdate = newTime - this.updateTime;
    let deltaRender = newTime - this.renderTime;

    if (newTime - this.perfTime >= 1) {
      this.fps = this.frames / (newTime - this.perfTime);
      this.ups = this.updates / (newTime - this.perfTime);
      
      this.frames = 0;
      this.updates = 0;
      this.perfTime = newTime;
    }

    while (deltaUpdate >= this.updateTimeStep) {
      if (this.onUpdate) this.onUpdate(Math.min(this.updateTimeStep, deltaUpdate));

      this.updates += 1;
      this.updateTime += this.updateTimeStep;

      deltaUpdate -= this.updateTimeStep;
    }

    while (deltaRender >= this.renderTimeStep) {
      if (this.onRender) this.onRender(Math.min(this.renderTimeStep, deltaRender));

      this.frames += 1;
      this.renderTime += this.renderTimeStep;
      
      deltaRender -= this.renderTimeStep;
    }

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}
