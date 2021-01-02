import { html } from 'lit-html';
import { selectIsBusy } from '../store/my-slice';
import image from '../image';

export default (state) => {
  const isBusy = selectIsBusy(state);

  return html`
    <p>view</p>
    ${isBusy ? 'Processing image, please wait' : image(state)}
  `
};
