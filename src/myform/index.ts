import { html } from 'lit-html';
import style from './myform.module.scss';
import createInputEl from '../util/create-input-el';
import worker from '../store/worker-inst';
import { selectKernel } from '../store/my-slice';

export default (state) => {
  const kernel = selectKernel(state);

  const size = kernel.length;
  const fields = [];
  const values = kernel.flat();
  for (let i = 0; i < kernel.length ** 2; i++) {
    fields.push(createInputEl('number', `c${i}`, values[i].toString(10)));
  }

  const onClick = (evt: MouseEvent) => {
    evt.preventDefault();

    const kernel = fields
      .map(field => Number.parseFloat(field.value))
      .reduce((chunks, _, i, arr) => {
        if (i % size === 0) chunks.push(arr.slice(i, i + size));
        return chunks;
      }, []);

    // send action to the worker
    worker.postMessage({ type: '**custom/onkernelsubmit', kernel });
  };

  return html`
    <form>
      <div class="${style.kernel}">${fields}</div>
      <button @click="${onClick}">Fire!</button>
    </form>
  `;
};
