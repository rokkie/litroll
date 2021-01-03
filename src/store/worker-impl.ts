import store from './index';
import { loadimg, loadkernel, scalekernel } from './my-slice';

// install event handler from incoming messages from the UI thread
self.addEventListener('message', (evt: MessageEvent) => {
  // ignore messages that don't have a `type`
  if (!evt.data.type) return;

  if (evt.data.type.startsWith('**custom/')) {

    switch (evt.data.type) {
      case '**custom/onimagedrop': {
        const action = loadimg(evt.data.img);

        store.dispatch(action);
        break;
      }

      case '**custom/onkernelsubmit': {
        const action = loadkernel(evt.data.kernel);

        store.dispatch(action);
        break;
      }

      case '**custom/onkernelchange': {
        const action = scalekernel(evt.data.size);

        store.dispatch(action);
        break;
      }

      default:
        break;
    }

  } else {
    store.dispatch(evt.data);
  }
});

// send state updates to UI thread
store.subscribe(() => {
  const state = store.getState();
  self.postMessage(state);
});

// send initial state to the UI thread
self.postMessage(store.getState());
