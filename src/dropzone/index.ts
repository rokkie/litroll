import { html } from 'lit-html';
import style from './dropzone.module.scss';
import worker from '../store/worker-inst';
import { createLoadImgMsg } from '../store/my-slice';

export default () => html`
  <div class="${style.dropzone}" @dragover="${onDragOver}" @drop="${onDrop}">
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

  // create message from the image in the event data
  const msg = createLoadImgMsg(evt.dataTransfer.files[0]);

  // send message to the worker
  worker.postMessage(msg);
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
