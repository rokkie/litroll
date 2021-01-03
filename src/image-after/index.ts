import { html } from 'lit-html';
import { selectUrlDest } from '../store/my-slice';

export default (state) => {
  const url = selectUrlDest(state);
  if (!url) return;

  return html`<img src="${url}" alt="">`;
};
