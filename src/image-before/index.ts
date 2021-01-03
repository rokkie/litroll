import { html } from 'lit-html';
import { selectUrlOrig } from '../store/my-slice';

export default (state) => {
  const url = selectUrlOrig(state);
  if (!url) return;

  return html`<img src="${url}" alt="">`;
};
