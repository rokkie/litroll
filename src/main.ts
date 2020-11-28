import { render } from 'lit-html';
import worker from './store/worker-inst';
import app from './app';

const main = document.querySelector('#main');

// re-render app when state changes
worker.addEventListener('message', (evt: MessageEvent) => render(app(evt.data), main));
