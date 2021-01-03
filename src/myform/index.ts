import { html } from 'lit-html';
import style from './myform.module.scss';
import chunk from '../util/array-chunk';
import worker from '../store/worker-inst';
import { createLoadKernelMsg, createScaleKernelMsg, selectKernel } from '../store/my-slice';

export default (state) => {
  const kernel = selectKernel(state);
  const size = kernel.length;
  const fields = [];
  const values = kernel.flat();

  // create number inputs for the kernel values
  for (let i = 0; i < kernel.length ** 2; i++) {
    const input = document.createElement('input');

    Object.assign(input, { type: 'number', name: `kv-${i}`, value: values[i].toString(10) });
    fields.push(input);
  }

  /**
   * Event handler for when the kernel size input value changes
   *
   * Sends the new kernel size to the worker which creates a new kernel
   * and applies it to the image.
   *
   * @param evt
   */
  const onChange = (evt: Event) => {
    // read value from the input field and parse it as an integer
    const value = (evt.target as HTMLInputElement).value;
    const size  = Number.parseInt(value, 10);
    const msg   = createScaleKernelMsg(size);

    // send message with the new kernel size to the worker
    worker.postMessage(msg);

    // update CSS variable so the grid corresponds with the new kernel size
    document
      .querySelector<HTMLDivElement>(`.${style.kernel}`)
      .style.setProperty('--kernel-size', value);
  };

  /**
   * Event handler for when kernel is submitted
   *
   * Sends the kernel to the worker which applies it to the image.
   *
   * @param evt
   */
  const onClick = (evt: MouseEvent) => {
    evt.preventDefault();

    // read kernel values from the inputs, parse them into floats and chunk them
    // by the size of the kernel so we end up with a matrix instead of a list
    const values = fields.map(field => Number.parseFloat(field.value));
    const kernel = chunk(size, values);
    const msg    = createLoadKernelMsg(kernel);

    // send message with the new kernel to the worker
    worker.postMessage(msg);
  };

  return html`
    <form>
      <div class="${style.kernel}">${fields}</div>
      <div><input type="number" min="3" max="25" step="2" value="${size}" @change="${onChange}"></div>
      <button @click="${onClick}">Fire!</button>
    </form>
  `;
};
