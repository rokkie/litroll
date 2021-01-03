import { html } from 'lit-html';
import style from './myform.module.scss';
import chunk from '../util/array-chunk';
import worker from '../store/worker-inst';
import { selectKernel } from '../store/my-slice';

export default (state) => {
  const kernel = selectKernel(state);
  const size = kernel.length;
  const fields = [];
  const values = kernel.flat();

  for (let i = 0; i < kernel.length ** 2; i++) {
    const input = document.createElement('input');

    Object.assign(input, { type: 'number', name: `kv-${i}`, value: values[i].toString(10) });
    fields.push(input);
  }

  const onChange = (evt: Event) => {
    const value = (evt.target as HTMLInputElement).value;
    const size = Number.parseInt(value, 10);

    worker.postMessage({ type: '**custom/onkernelchange', size });

    document
      .querySelector<HTMLDivElement>(`.${style.kernel}`)
      .style.setProperty('--kernel-size', value);
  };

  const onClick = (evt: MouseEvent) => {
    evt.preventDefault();

    const values = fields.map(field => Number.parseFloat(field.value));
    const kernel = chunk(size, values);

    // send action to the worker
    worker.postMessage({ type: '**custom/onkernelsubmit', kernel });
  };

  return html`
    <form>
      <div class="${style.kernel}">${fields}</div>
      <div><input type="number" min="3" max="25" step="2" value="${size}" @change="${onChange}"></div>
      <button @click="${onClick}">Fire!</button>
    </form>
  `;
};
