import { html } from 'lit-html';
import { selectBeforeImageUrl } from '../store/my-slice';

export default (state) => {
  const url = selectBeforeImageUrl(state);
  if (!url) return;

  return html`<img src="${url}" alt="">`;
};
