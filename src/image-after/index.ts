import { html } from 'lit-html';
import { selectAfterImageUrl } from '../store/my-slice';

export default (state) => {
  const url = selectAfterImageUrl(state);
  if (!url) return;

  return html`<img src="${url}" alt="">`;
};
