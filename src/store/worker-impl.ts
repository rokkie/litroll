import store from './index';
import { loadimg } from './my-slice';

// dispatch messages sent from the UI thread as actions to the store
self.addEventListener('message', (evt: MessageEvent) => {
  if (!evt.data.type) return;

  if (evt.data.type.startsWith('**custom/')) {

    switch (evt.data.type) {
      case '**custom/onimagedrop': {
        const action = loadimg(evt.data.img);

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
