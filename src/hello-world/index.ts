import { html } from 'lit-html';
import { hello, world } from './hello-world.module.scss';

export default () => html`
<h1 class="${hello}">Hello World</h1>
<p class="${world}">Foo bar baz</p>
`;
