import { html } from 'lit-html';
import dropzone  from '../dropzone';
import result from '../result';
import style from './myview.module.scss';

export default (state) => html`
  <h2 class="${style.header}">Before</h2>
  <section class="${style.image}">
    ${dropzone(state)}
  </section>
  <h2 class="${style.header}">After</h2>
  <section class="${style.image}">
    ${result(state)}
  </section>
`;
