import { html } from 'lit-html';
import { selectImageUrl } from '../store/my-slice';

export default (state) => {
  const url = selectImageUrl(state);
  if (!url) return;

  return html`<img src="${url}" alt="">`;
};
