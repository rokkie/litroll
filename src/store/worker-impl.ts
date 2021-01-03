import store from './index';
import { loadimg, loadkernel, scalekernel } from './my-slice';

// install event handler from incoming messages from the UI thread
self.addEventListener('message', (evt: MessageEvent) => {
  // ignore messages that don't have a `type`
  if (!evt.data.type) return;

  // lay-mans double dispatch
  // We can't send the async thunks from the UI thread because they return a function
  // which we can't send via `postMessage`. If we execute these resulting functions to obtain
  // a serializable action the async work will be performed on the UI thread which is what
  // we are trying to prevent in the first place. So instead we send messages with a `type`
  // that corresponds to the thunk we want to dispatch.
  switch (evt.data.type) {
    case loadimg.typePrefix: {
      store.dispatch(loadimg(evt.data.img));
      break;
    }

    case loadkernel.typePrefix: {
      store.dispatch(loadkernel(evt.data.kernel));
      break;
    }

    case scalekernel.typePrefix: {
      store.dispatch(scalekernel(evt.data.size));
      break;
    }

    // allow ordinary actions to be sent to the worker from the UI thread
    // and have them dispatched as store actions
    default:
      store.dispatch(evt.data);
      break;
  }
});

// send state updates to UI thread
store.subscribe(() => {
  const state = store.getState();
  self.postMessage(state);
});

// send initial state to the UI thread
self.postMessage(store.getState());
