import { render } from 'lit-html';
import hello from './hello-world';

document.addEventListener('DOMContentLoaded', evt => {
  const main = (evt.target as Document).querySelector('#main');

  render(hello(), main);
}, { once: true });
