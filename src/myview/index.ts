import { html } from 'lit-html';
import { selectMyValue } from '../store/my-slice';

export default (state) => html`
  <p>view</p>
  <p>${selectMyValue(state)}</p>
`;
