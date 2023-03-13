import { render } from 'lit-html';
import worker from './store/worker-inst.mjs';
import app from './app/index.mjs';

const main = document.querySelector<HTMLDivElement>('#main');

// re-render app when state changes
worker.addEventListener('message', (evt: MessageEvent) => render(app(evt.data), main));
