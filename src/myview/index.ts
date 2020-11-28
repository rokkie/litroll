import { html } from 'lit-html';
import { selectMyValue } from '../store/my-slice';
import image from '../image';

export default (state) => html`
  <p>view</p>
  <p>${selectMyValue(state)}</p>
  ${image(state)}
`;
