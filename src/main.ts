import { render } from 'lit-html';
import app from './app';
import store from './store';

document.addEventListener('DOMContentLoaded', evt => {
  const main = (evt.target as Document).querySelector('#main');
  const onStateChange = () => render(app(store.getState()), main);

  store.subscribe(onStateChange);
  onStateChange(); // initial render
}, { once: true });
