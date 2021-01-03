import { html } from 'lit-html';
import style from './dropzone.module.scss';
import worker from '../store/worker-inst';

export default () => html`
  <div class="${style.dropzone}" @dragenter="${onDragEnter}" @dragover="${onDragOver}" @drop="${onDrop}">
    drop stuff
  </div>
`;

/**
 * Event handler for when a file is dropped
 *
 * Sends a message to the worker that loads to image.
 *
 * @param evt The event
 */
const onDrop = async (evt: DragEvent) => {
  // prevent file from being opened
  evt.preventDefault();

  // check if the file is an image
  if (!evt.dataTransfer.files[0].type.match(/^image\//)) return;

  // create action from image bytes
  const img = evt.dataTransfer.files[0];

  // send action to worker
  worker.postMessage({ type: '**custom/onimagedrop', img });
};

const onDragEnter = (evt: DragEvent) => {
  evt.preventDefault();
};

/**
 * Event handler for when dragged file is over the drop zone
 *
 * Prevents file from being opened.
 *
 * @param evt
 */
const onDragOver = (evt: DragEvent) => {
  evt.preventDefault();
};
