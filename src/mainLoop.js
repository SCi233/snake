const LOOP_STATUS = {
  RUNNING: 0,
  PAUSED: 1,
  STOPPED: 2,
}

export class MainLoop {
  loopStatus = LOOP_STATUS.PAUSED;

  onLoop;

  constructor () {}

  setOpLoop (onUpdate) {
    this.onLoop = onUpdate;
  }

  loop () {
    this.onLoop && this.onLoop();
    window.requestAnimationFrame(this.loop.bind(this));
  }

  start () {
    if (this.loopStatus === LOOP_STATUS.PAUSED) {
      this.loopStatus = LOOP_STATUS.RUNNING;

      this.loop();
    }
  }

  pause () {
    if (this.loopStatus === LOOP_STATUS.RUNNING) {
      this.loopStatus = LOOP_STATUS.PAUSED;
    }
  }

  stop () {
    if (this.loopStatus !== LOOP_STATUS.STOPPED) {
      this.loopStatus = LOOP_STATUS.STOPPED;
    }
  }
}
