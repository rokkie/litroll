import store from './index';

// dispatch messages sent from the UI thread as actions to the store
self.addEventListener('message', (evt: MessageEvent) => {
  if (!evt.data.type) return;
  store.dispatch(evt.data);
});

// send state updates to UI thread
store.subscribe(() => {
  const state = store.getState();
  self.postMessage(state);
});

// send initial state to the UI thread
self.postMessage(store.getState());
