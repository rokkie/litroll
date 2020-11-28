import { html } from 'lit-html';
import createInputEl from '../util/create-input-el';
import worker from '../store/worker-inst';
import { selectMyValue, mychange } from '../store/my-slice';

export default (state) => {
  const current = selectMyValue(state);
  const input = createInputEl('text', 'myval', current);

  const onClick = (evt: MouseEvent) => {
    evt.preventDefault();

    // send action to the worker
    const action = mychange({ newVal: input.value });
    worker.postMessage(action);
  };

  return html`
    <form>
      ${input}
      <button @click="${onClick}">Fire!</button>
    </form>
  `;
};
