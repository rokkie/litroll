import { html } from 'lit-html';
import myform from '../myform';
import myview from '../myview';

export default (state) => html`
  <header class="header">Header</header>
  <main class="main">
    <section>${myform(state)}</section>  
    <section>${myview(state)}</section>  
  </main>
  <footer class="footer">Footer Content</footer>
`;
