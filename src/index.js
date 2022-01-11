import { MainLoop } from './mainLoop.js';
import { Keyboard } from './keyboard.js';

const mainLoop = new MainLoop();

const keyW = new Keyboard('KeyW');

const main = () => {
  console.log('hello world');
  mainLoop.setOpLoop(() => {
    if (keyW.isPressed()) {
      console.log('KeyW is pressed');
    }
  });
  mainLoop.start();
};

main();
