import { html } from 'lit-html';
import { selectIsBusy } from '../store/my-slice';
import imageBefore from '../image-before';
import imageAfter from '../image-after';

export default (state) => {
  const isBusy = selectIsBusy(state);
  const before = imageBefore(state);

  return html`
    <p>view</p>
    ${before}
    ${isBusy ? 'Processing image, please wait' : imageAfter(state)}
  `
};
