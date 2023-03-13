import { html } from 'lit-html';
import image from '../image/index.mjs';
import style from './result.module.scss';
import { selectErrorMsg, selectIsBusy, selectUrlDest } from '../store/my-slice.mjs';

export default (state) => {
  const isBusy = selectIsBusy(state);
  const errorMsg = selectErrorMsg(state);
  const url = selectUrlDest(state);

  if (isBusy) return loading();
  if (errorMsg) return error(errorMsg);
  if (url) return image(url);

  return '';
};

const loading = () => html`
  <div class="${style.result}">
    <p>Processing image, please wait</p>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M6,2l0.01,6L10,12l-3.99,4.01L6,22h12v-6l-4-4l4-3.99V2H6z M16,16.5V20H8v-3.5l4-4L16,16.5z"/>
    </svg>
  </div>
`;

const error = (message: string) => html`
  <div class="${style.result}">
    <p>${message}</p>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>
  </div>
`;
